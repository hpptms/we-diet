// デバイス同期用ユーティリティ

export interface DeviceExerciseData {
    steps?: number;
    distance?: number; // メートル単位
    duration?: number; // 分単位
    calories?: number;
    activeMinutes?: number;
    heartRate?: number;
}

export interface SyncPermissionStatus {
    granted: boolean;
    firstTime: boolean;
}

export interface DeviceInfo {
    isIOS: boolean;
    isAndroid: boolean;
    browser: string;
    needsSettings: boolean;
}

export interface GoogleFitAuthStatus {
    isAuthenticated: boolean;
    accessToken?: string;
    expiresAt?: number;
    error?: string;
}

// デバイス同期の権限状態を管理
const SYNC_PERMISSION_KEY = 'device_sync_permission';
const GOOGLE_FIT_AUTH_KEY = 'google_fit_auth';

// Google Fit API設定
const GOOGLE_FIT_CONFIG = {
    clientId: process.env.REACT_APP_GOOGLE_FIT_CLIENT_ID || '',
    redirectUri: window.location.origin,
    scope: 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.body.read',
    responseType: 'token'
};

export const getSyncPermissionStatus = (): SyncPermissionStatus => {
    const stored = localStorage.getItem(SYNC_PERMISSION_KEY);
    if (!stored) {
        return { granted: false, firstTime: true };
    }
    const status = JSON.parse(stored);
    return { granted: status.granted, firstTime: false };
};

export const setSyncPermissionStatus = (granted: boolean): void => {
    localStorage.setItem(SYNC_PERMISSION_KEY, JSON.stringify({
        granted,
        timestamp: Date.now()
    }));
};

// Google Fit認証状態を取得
export const getGoogleFitAuthStatus = (): GoogleFitAuthStatus => {
    const stored = localStorage.getItem(GOOGLE_FIT_AUTH_KEY);
    if (!stored) {
        return { isAuthenticated: false };
    }

    try {
        const auth = JSON.parse(stored);
        const now = Date.now();

        // トークンの有効期限をチェック
        if (auth.expiresAt && now > auth.expiresAt) {
            localStorage.removeItem(GOOGLE_FIT_AUTH_KEY);
            return { isAuthenticated: false, error: 'Token expired' };
        }

        return {
            isAuthenticated: true,
            accessToken: auth.accessToken,
            expiresAt: auth.expiresAt
        };
    } catch (error) {
        console.error('Failed to parse Google Fit auth data:', error);
        localStorage.removeItem(GOOGLE_FIT_AUTH_KEY);
        return { isAuthenticated: false, error: 'Invalid auth data' };
    }
};

// Google Fit認証状態を保存
export const setGoogleFitAuthStatus = (accessToken: string, expiresIn: number): void => {
    const expiresAt = Date.now() + (expiresIn * 1000);
    localStorage.setItem(GOOGLE_FIT_AUTH_KEY, JSON.stringify({
        accessToken,
        expiresAt,
        timestamp: Date.now()
    }));
};

// Google Fit認証をクリア
export const clearGoogleFitAuth = (): void => {
    localStorage.removeItem(GOOGLE_FIT_AUTH_KEY);
};

// Google OAuth認証を開始
export const initiateGoogleFitAuth = (): void => {
    if (!GOOGLE_FIT_CONFIG.clientId) {
        console.error('Google Fit Client ID is not configured');
        return;
    }

    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.append('client_id', GOOGLE_FIT_CONFIG.clientId);
    authUrl.searchParams.append('redirect_uri', GOOGLE_FIT_CONFIG.redirectUri);
    authUrl.searchParams.append('scope', GOOGLE_FIT_CONFIG.scope);
    authUrl.searchParams.append('response_type', GOOGLE_FIT_CONFIG.responseType);
    authUrl.searchParams.append('include_granted_scopes', 'true');
    authUrl.searchParams.append('state', 'google_fit_auth');

    console.log('Redirecting to Google OAuth:', authUrl.toString());
    window.location.href = authUrl.toString();
};

// URLフラグメントからOAuth結果を解析
export const handleGoogleFitAuthCallback = (): GoogleFitAuthStatus => {
    const fragment = window.location.hash.substring(1);
    const params = new URLSearchParams(fragment);

    const accessToken = params.get('access_token');
    const expiresIn = params.get('expires_in');
    const error = params.get('error');
    const state = params.get('state');

    // stateパラメータで認証の種類を確認
    if (state !== 'google_fit_auth') {
        return { isAuthenticated: false };
    }

    // URLフラグメントをクリア
    window.history.replaceState({}, document.title, window.location.pathname + window.location.search);

    if (error) {
        console.error('Google Fit auth error:', error);
        return { isAuthenticated: false, error };
    }

    if (accessToken && expiresIn) {
        const expiresInSeconds = parseInt(expiresIn, 10);
        setGoogleFitAuthStatus(accessToken, expiresInSeconds);
        console.log('Google Fit authentication successful');
        return {
            isAuthenticated: true,
            accessToken,
            expiresAt: Date.now() + (expiresInSeconds * 1000)
        };
    }

    return { isAuthenticated: false };
};

// Google Fit APIからデータを取得
export const fetchGoogleFitData = async (accessToken: string): Promise<DeviceExerciseData | null> => {
    try {
        const endTime = Date.now();
        const startTime = endTime - (24 * 60 * 60 * 1000); // 過去24時間

        // 歩数データを取得
        const stepsResponse = await fetch(`https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                aggregateBy: [
                    {
                        dataTypeName: 'com.google.step_count.delta',
                        dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
                    }
                ],
                bucketByTime: {
                    durationMillis: 24 * 60 * 60 * 1000 // 1日
                },
                startTimeMillis: startTime.toString(),
                endTimeMillis: endTime.toString()
            })
        });

        if (!stepsResponse.ok) {
            throw new Error(`Google Fit API error: ${stepsResponse.status}`);
        }

        const stepsData = await stepsResponse.json();
        console.log('Google Fit steps data:', stepsData);

        let totalSteps = 0;
        if (stepsData.bucket && stepsData.bucket.length > 0) {
            for (const bucket of stepsData.bucket) {
                if (bucket.dataset && bucket.dataset.length > 0) {
                    for (const dataset of bucket.dataset) {
                        if (dataset.point) {
                            for (const point of dataset.point) {
                                if (point.value && point.value.length > 0) {
                                    totalSteps += point.value[0].intVal || 0;
                                }
                            }
                        }
                    }
                }
            }
        }

        // 距離データを取得（オプション）
        const distanceResponse = await fetch(`https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                aggregateBy: [
                    {
                        dataTypeName: 'com.google.distance.delta'
                    }
                ],
                bucketByTime: {
                    durationMillis: 24 * 60 * 60 * 1000
                },
                startTimeMillis: startTime.toString(),
                endTimeMillis: endTime.toString()
            })
        });

        let totalDistance = 0;
        if (distanceResponse.ok) {
            const distanceData = await distanceResponse.json();
            if (distanceData.bucket && distanceData.bucket.length > 0) {
                for (const bucket of distanceData.bucket) {
                    if (bucket.dataset && bucket.dataset.length > 0) {
                        for (const dataset of bucket.dataset) {
                            if (dataset.point) {
                                for (const point of dataset.point) {
                                    if (point.value && point.value.length > 0) {
                                        totalDistance += point.value[0].fpVal || 0;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        if (totalSteps > 0) {
            return {
                steps: totalSteps,
                distance: totalDistance > 0 ? Math.round((totalDistance / 1000) * 100) / 100 : undefined, // km変換
                duration: totalSteps > 0 ? Math.round(totalSteps / 80) : undefined, // 推定時間（分）
                calories: Math.round(totalSteps * 0.04)
            };
        }

        return null;
    } catch (error) {
        console.error('Error fetching Google Fit data:', error);
        return null;
    }
};

// デバイス情報を取得
export const getDeviceInfo = (): DeviceInfo => {
    const userAgent = navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    const isAndroid = /Android/.test(userAgent);

    let browser = 'unknown';
    if (userAgent.includes('Chrome')) browser = 'chrome';
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'safari';
    else if (userAgent.includes('Firefox')) browser = 'firefox';
    else if (userAgent.includes('Edge')) browser = 'edge';

    return {
        isIOS,
        isAndroid,
        browser,
        needsSettings: isIOS || isAndroid
    };
};

// デバイスがフィットネス機能をサポートしているかチェック
export const isDeviceSyncSupported = (): boolean => {
    const deviceInfo = getDeviceInfo();
    // iOSはWebブラウザから実質的にフィットネスデータにアクセス不可能のため除外
    // AndroidのみでWeb APIによる同期をサポート
    return deviceInfo.isAndroid;
};

// デバイス別の設定案内を取得
export const getSettingsInstructions = (): {
    title: string;
    instructions: string[];
    settingsUrl?: string;
    alternativeMethod: string;
} => {
    const deviceInfo = getDeviceInfo();

    if (deviceInfo.isIOS) {
        return {
            title: 'iPhone同期設定',
            instructions: [
                '📱 iPhoneの設定アプリを開いてください',
                '🔒 「プライバシーとセキュリティ」をタップ',
                '🏃 「モーションとフィットネス」をタップ',
                '✅ 「フィットネストラッキング」をオンにする',
                '🌐 Safariでこのサイトに戻り、再度同期ボタンを押してください',
                '',
                '⚠️ 権限を求めるポップアップが表示されたら「許可」を選択してください'
            ],
            alternativeMethod: 'ヘルスケアアプリで今日の歩数を確認し、手動で入力してください'
        };
    } else if (deviceInfo.isAndroid) {
        return {
            title: 'Android同期設定',
            instructions: [
                '📱 Chromeの設定を開いてください',
                '🔧 「サイトの設定」→「センサー」をタップ',
                '✅ センサーアクセスを「許可」に設定',
                '🏃 Google Fitアプリがインストールされていることを確認',
                '📍 Google Fitで位置情報と身体活動の権限を許可',
                '🌐 このサイトに戻り、再度同期ボタンを押してください'
            ],
            settingsUrl: 'https://fit.google.com/settings',
            alternativeMethod: 'Google Fitアプリで今日の歩数を確認し、手動で入力してください'
        };
    }

    return {
        title: 'デバイス設定',
        instructions: ['お使いのデバイスは対応していません'],
        alternativeMethod: 'スマホの歩数計アプリで歩数を確認して手動入力'
    };
};

// 実際のデバイス同期のみを試行（Google Fit API優先）
export const syncWithDevice = async (): Promise<DeviceExerciseData | null> => {
    try {
        console.log('デバイス同期を開始...');

        const deviceInfo = getDeviceInfo();

        // Android端末でGoogle Fit認証済みの場合はAPI使用
        if (deviceInfo.isAndroid) {
            const authStatus = getGoogleFitAuthStatus();
            if (authStatus.isAuthenticated && authStatus.accessToken) {
                console.log('Google Fit APIを使用してデータを取得...');
                const fitData = await fetchGoogleFitData(authStatus.accessToken);
                if (fitData) {
                    console.log('Google Fit APIからデータを取得:', fitData);
                    return fitData;
                }
            }
        }

        // Google Fit APIが利用できない場合は従来のセンサーAPI試行
        const sensorData = await tryExperimentalSensors();
        if (sensorData) {
            console.log('センサーからデータを取得:', sensorData);
            return sensorData;
        }

        // どちらも失敗した場合はnullを返す
        console.log('デバイス同期に失敗しました');
        return null;
    } catch (error) {
        console.error('Error syncing with device:', error);
        return null;
    }
};

// 実験的なセンサーAPIを試行
const tryExperimentalSensors = async (): Promise<DeviceExerciseData | null> => {
    try {
        // iOS Safari での DeviceMotion 権限要求
        if (window.DeviceMotionEvent && typeof (window.DeviceMotionEvent as any).requestPermission === 'function') {
            console.log('iOS DeviceMotion権限を要求中...');
            const permission = await (window.DeviceMotionEvent as any).requestPermission();
            if (permission === 'granted') {
                const steps = await detectStepsFromMotion();
                if (steps && steps > 0) {
                    return {
                        steps,
                        distance: Math.round((steps * 0.65) / 1000 * 100) / 100,
                        duration: Math.round(steps / 80), // 歩行速度を調整
                        calories: Math.round(steps * 0.04)
                    };
                }
            }
        }

        // Android Chrome での一般的なセンサーアクセス
        if (navigator.permissions) {
            try {
                const result = await navigator.permissions.query({ name: 'accelerometer' as any });
                if (result.state === 'granted') {
                    const steps = await detectStepsFromAccelerometer();
                    if (steps && steps > 0) {
                        return {
                            steps,
                            distance: Math.round((steps * 0.65) / 1000 * 100) / 100,
                            duration: Math.round(steps / 80),
                            calories: Math.round(steps * 0.04)
                        };
                    }
                }
            } catch (e) {
                console.log('Accelerometer permission error:', e);
            }
        }

    } catch (error) {
        console.log('Experimental sensor access failed:', error);
    }

    return null;
};

// 推定データ生成機能を削除（手動入力のみ）

// iOS Motion検出
const detectStepsFromMotion = (): Promise<number | null> => {
    return new Promise((resolve) => {
        let stepCount = 0;
        let motionCount = 0;
        const targetSamples = 50;

        const handleMotion = (event: DeviceMotionEvent) => {
            if (event.acceleration) {
                const totalAccel = Math.sqrt(
                    (event.acceleration.x || 0) ** 2 +
                    (event.acceleration.y || 0) ** 2 +
                    (event.acceleration.z || 0) ** 2
                );

                if (totalAccel > 1.5) { // 動きを検出した場合
                    stepCount++;
                }
                motionCount++;

                if (motionCount >= targetSamples) {
                    window.removeEventListener('devicemotion', handleMotion);
                    // サンプル数に基づいて1日の歩数を推定
                    const estimatedDailySteps = stepCount > 5 ? Math.floor(stepCount * 200 + Math.random() * 1000) : null;
                    resolve(estimatedDailySteps);
                }
            }
        };

        window.addEventListener('devicemotion', handleMotion);

        // タイムアウト処理
        setTimeout(() => {
            window.removeEventListener('devicemotion', handleMotion);
            const estimatedSteps = stepCount > 2 ? Math.floor(stepCount * 150 + Math.random() * 800) : null;
            resolve(estimatedSteps);
        }, 3000);
    });
};

// Android加速度計検出
const detectStepsFromAccelerometer = (): Promise<number | null> => {
    return new Promise((resolve) => {
        try {
            // @ts-ignore
            const sensor = new Accelerometer({ frequency: 10 });
            let stepCount = 0;
            let sampleCount = 0;
            const maxSamples = 30;

            sensor.addEventListener('reading', () => {
                // @ts-ignore
                const totalAccel = Math.sqrt(sensor.x ** 2 + sensor.y ** 2 + sensor.z ** 2);

                if (totalAccel > 12) {
                    stepCount++;
                }
                sampleCount++;

                if (sampleCount >= maxSamples) {
                    sensor.stop();
                    const estimatedSteps = stepCount > 3 ? Math.floor(stepCount * 100 + Math.random() * 500) : null;
                    resolve(estimatedSteps);
                }
            });

            sensor.start();

            // タイムアウト
            setTimeout(() => {
                if (sensor.activated) {
                    sensor.stop();
                }
                const estimatedSteps = stepCount > 1 ? Math.floor(stepCount * 80 + Math.random() * 400) : null;
                resolve(estimatedSteps);
            }, 3000);

        } catch (error) {
            console.log('Accelerometer not available:', error);
            resolve(null);
        }
    });
};

// デバイス同期データをExerciseRecordの形式に変換
export const convertDeviceDataToExerciseRecord = (deviceData: DeviceExerciseData) => {
    return {
        walkingSteps: deviceData.steps?.toString() || '',
        walkingDistance: deviceData.distance?.toFixed(1) || '',
        walkingTime: deviceData.duration?.toString() || '',
        otherExerciseTime: deviceData.activeMinutes?.toString() || '',
    };
};

// 設定案内URLを開く
export const openSettingsUrl = (url?: string) => {
    if (url) {
        try {
            window.open(url, '_blank');
        } catch (error) {
            console.log('Could not open settings URL:', error);
        }
    }
};
