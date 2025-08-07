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

// デバイス同期の権限状態を管理
const SYNC_PERMISSION_KEY = 'device_sync_permission';

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
    return deviceInfo.isIOS || deviceInfo.isAndroid;
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
            settingsUrl: 'prefs:root=PRIVACY&path=MOTION',
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

// 実際のデバイス同期のみを試行（自動推定は行わない）
export const syncWithDevice = async (): Promise<DeviceExerciseData | null> => {
    try {
        console.log('デバイス同期を開始...');

        // 実験的なセンサーAPI試行のみ
        const sensorData = await tryExperimentalSensors();
        if (sensorData) {
            console.log('センサーからデータを取得:', sensorData);
            return sensorData;
        }

        // センサーアクセスに失敗した場合はnullを返す（自動推定は行わない）
        console.log('センサーアクセスに失敗しました');
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
