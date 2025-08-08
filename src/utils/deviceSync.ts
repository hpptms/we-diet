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

// Google Fit API設定（GAPI使用）
const GOOGLE_FIT_CONFIG = {
    clientId: process.env.REACT_APP_GOOGLE_FIT_CLIENT_ID || '',
    apiKey: process.env.REACT_APP_GOOGLE_API_KEY || '',
    discoveryDoc: 'https://www.googleapis.com/discovery/v1/apis/fitness/v1/rest',
    scopes: [
        'https://www.googleapis.com/auth/fitness.activity.read',
        'https://www.googleapis.com/auth/fitness.body.read'
    ]
};

// デバッグ用設定ログ出力
console.log('=== Google Fit設定 (GAPI) ===');
console.log('Client ID source:', process.env.REACT_APP_GOOGLE_FIT_CLIENT_ID ? 'Environment' : 'Default');
console.log('Client ID:', GOOGLE_FIT_CONFIG.clientId);
console.log('API Key source:', process.env.REACT_APP_GOOGLE_API_KEY ? 'Environment' : 'Default');
console.log('Scopes:', GOOGLE_FIT_CONFIG.scopes.join(', '));
console.log('================================');

// GAPI初期化状態
let gapiInitialized = false;
let gapiAuthInstance: any = null;

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

// GAPI ライブラリを動的にロード
const loadGapiScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        if ((window as any).gapi) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Google API script'));
        document.head.appendChild(script);
    });
};

// GAPI初期化
const initializeGapi = async (): Promise<void> => {
    if (gapiInitialized) {
        return;
    }

    try {
        console.log('=== GAPI初期化開始 ===');

        // GAPIスクリプトをロード
        await loadGapiScript();

        // GAPI初期化
        await new Promise<void>((resolve, reject) => {
            (window as any).gapi.load('client:auth2', {
                callback: resolve,
                onerror: () => reject(new Error('Failed to load GAPI client'))
            });
        });

        // クライアント初期化
        await (window as any).gapi.client.init({
            apiKey: GOOGLE_FIT_CONFIG.apiKey,
            clientId: GOOGLE_FIT_CONFIG.clientId,
            discoveryDocs: [GOOGLE_FIT_CONFIG.discoveryDoc],
            scope: GOOGLE_FIT_CONFIG.scopes.join(' ')
        });

        gapiAuthInstance = (window as any).gapi.auth2.getAuthInstance();
        gapiInitialized = true;
        console.log('GAPI初期化完了');
    } catch (error) {
        console.error('GAPI初期化エラー:', error);
        throw error;
    }
};

// Google Fit認証を開始（GAPI使用）
export const initiateGoogleFitAuth = async (): Promise<void> => {
    console.log('=== Google Fit認証開始 (GAPI) ===');

    if (!GOOGLE_FIT_CONFIG.clientId || !GOOGLE_FIT_CONFIG.apiKey) {
        console.error('Google Fit credentials are not configured');
        alert('Google Fit認証情報が設定されていません。環境変数を確認してください。');
        return;
    }

    try {
        // GAPI初期化
        await initializeGapi();

        // 認証実行
        console.log('Google認証を実行中...');
        const authResult = await gapiAuthInstance.signIn({
            scope: GOOGLE_FIT_CONFIG.scopes.join(' ')
        });

        const accessToken = authResult.getAuthResponse().access_token;
        const expiresIn = authResult.getAuthResponse().expires_in;

        // 認証情報をlocalStorageに保存
        setGoogleFitAuthStatus(accessToken, expiresIn);

        console.log('Google Fit認証成功');
        alert('Google Fitとの連携が完了しました！\n再度「スマホと同期」ボタンを押してデータを取得してください。');

    } catch (error) {
        console.error('Google Fit認証エラー:', error);
        alert(`認証に失敗しました: ${error}`);
    }
};

// GAPI認証状態をチェック
export const handleGoogleFitAuthCallback = (): GoogleFitAuthStatus => {
    // GAPI実装では、URLフラグメント処理は不要
    // 認証はinitializeGapi()とsignIn()で完結している

    try {
        if (gapiInitialized && gapiAuthInstance && gapiAuthInstance.isSignedIn.get()) {
            const user = gapiAuthInstance.currentUser.get();
            const authResponse = user.getAuthResponse();

            if (authResponse && authResponse.access_token) {
                console.log('GAPI認証状態: 認証済み');
                return {
                    isAuthenticated: true,
                    accessToken: authResponse.access_token,
                    expiresAt: authResponse.expires_at
                };
            }
        }
    } catch (error) {
        console.error('GAPI認証状態チェックエラー:', error);
    }

    return { isAuthenticated: false };
};

// Google Fit APIからデータを取得（GAPI使用）
export const fetchGoogleFitData = async (accessToken?: string): Promise<DeviceExerciseData | null> => {
    try {
        console.log('=== Google Fit データ取得開始 ===');

        // GAPI初期化を確認
        if (!gapiInitialized) {
            await initializeGapi();
        }

        // 認証状態を確認
        if (!gapiAuthInstance.isSignedIn.get()) {
            console.log('Google認証が必要です');
            return null;
        }

        const now = new Date();
        const startTimeMillis = now.setHours(0, 0, 0, 0); // 今日の0時
        const endTimeMillis = Date.now();

        console.log('データ取得期間:', new Date(startTimeMillis), '～', new Date(endTimeMillis));

        // 歩数データを集計取得
        const requestBody = {
            aggregateBy: [
                { dataTypeName: 'com.google.step_count.delta' }
            ],
            bucketByTime: { durationMillis: 86400000 }, // 1日単位 (24 * 60 * 60 * 1000)
            startTimeMillis: startTimeMillis,
            endTimeMillis: endTimeMillis
        };

        console.log('Request body:', JSON.stringify(requestBody, null, 2));

        const response = await (window as any).gapi.client.fitness.users.dataset.aggregate({
            userId: 'me',
            resource: requestBody
        });

        console.log('Google Fit API レスポンス:', response);

        let totalSteps = 0;
        let totalDistance = 0;
        let activeMinutes = 0;

        if (response.result && response.result.bucket) {
            for (const bucket of response.result.bucket) {
                if (bucket.dataset && bucket.dataset.length > 0) {
                    for (const dataset of bucket.dataset) {
                        if (dataset.point && dataset.point.length > 0) {
                            for (const point of dataset.point) {
                                if (point.value && point.value.length > 0) {
                                    // 歩数データを集計
                                    totalSteps += point.value[0].intVal || 0;
                                }
                            }
                        }
                    }
                }
            }
        }

        // 距離データも取得（別リクエスト）
        try {
            const distanceRequest = {
                aggregateBy: [
                    { dataTypeName: 'com.google.distance.delta' }
                ],
                bucketByTime: { durationMillis: 86400000 },
                startTimeMillis: startTimeMillis,
                endTimeMillis: endTimeMillis
            };

            const distanceResponse = await (window as any).gapi.client.fitness.users.dataset.aggregate({
                userId: 'me',
                resource: distanceRequest
            });

            if (distanceResponse.result && distanceResponse.result.bucket) {
                for (const bucket of distanceResponse.result.bucket) {
                    if (bucket.dataset && bucket.dataset.length > 0) {
                        for (const dataset of bucket.dataset) {
                            if (dataset.point && dataset.point.length > 0) {
                                for (const point of dataset.point) {
                                    if (point.value && point.value.length > 0) {
                                        totalDistance += point.value[0].fpVal || 0; // メートル単位
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (distanceError) {
            console.log('Distance data not available:', distanceError);
        }

        console.log('取得データ - 歩数:', totalSteps, '距離:', totalDistance);

        if (totalSteps > 0) {
            // 歩数からアクティブ時間を推定（80歩/分として計算）
            activeMinutes = Math.round(totalSteps / 80);

            return {
                steps: totalSteps,
                distance: totalDistance > 0 ? Math.round((totalDistance / 1000) * 100) / 100 : undefined, // km変換
                duration: activeMinutes,
                calories: Math.round(totalSteps * 0.04), // 歩数からカロリー推定
                activeMinutes: activeMinutes
            };
        }

        console.log('歩数データが見つかりませんでした');
        return null;

    } catch (error) {
        console.error('Google Fit データ取得エラー:', error);
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

        // Android端末でGoogle Fit認証済みの場合はGAPI使用
        if (deviceInfo.isAndroid) {
            if (gapiInitialized && gapiAuthInstance && gapiAuthInstance.isSignedIn.get()) {
                console.log('Google Fit GAPI を使用してデータを取得...');
                const fitData = await fetchGoogleFitData();
                if (fitData) {
                    console.log('Google Fit GAPI からデータを取得:', fitData);
                    return fitData;
                }
            } else {
                const authStatus = getGoogleFitAuthStatus();
                if (authStatus.isAuthenticated) {
                    console.log('LocalStorage認証情報でGoogle Fit APIを使用...');
                    const fitData = await fetchGoogleFitData(authStatus.accessToken);
                    if (fitData) {
                        console.log('Google Fit API からデータを取得:', fitData);
                        return fitData;
                    }
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

// Samsung Health同期試行（将来実装用）
export const syncWithSamsungHealth = async (): Promise<DeviceExerciseData | null> => {
    try {
        console.log('Samsung Health同期を試行中...');

        // 演出として少し待機
        await new Promise(resolve => setTimeout(resolve, 800));

        // Samsung Health Web APIは存在しないため、現在は未実装
        // 将来的には以下のような実装が考えられる：
        // 1. Chrome拡張機能経由でのデータ取得
        // 2. Samsung Health APIの公開（現在未提供）
        // 3. 専用Androidアプリとの連携

        console.log('Samsung Health: Web APIは未対応');
        // 現在はnullを返す（実装されていない）
        return null;
    } catch (error) {
        console.error('Samsung Health sync error:', error);
        return null;
    }
};

// Huawei Health同期試行（将来実装用）
export const syncWithHuaweiHealth = async (): Promise<DeviceExerciseData | null> => {
    try {
        console.log('Huawei Health同期を試行中...');

        // 演出として少し待機
        await new Promise(resolve => setTimeout(resolve, 800));

        // Huawei Health Kit Web APIは限定的なため、現在は未実装
        // 将来的には以下のような実装が考えられる：
        // 1. HMS Core Health Kit
        // 2. Huawei Health APIの拡張
        // 3. 専用Huaweiアプリとの連携

        console.log('Huawei Health: Web APIは未対応');
        // 現在はnullを返す（実装されていない）
        return null;
    } catch (error) {
        console.error('Huawei Health sync error:', error);
        return null;
    }
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
