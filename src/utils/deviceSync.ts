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

// デバイスがフィットネス機能をサポートしているかチェック
export const isDeviceSyncSupported = (): boolean => {
    // Web標準のセンサーAPIをチェック
    return (
        'permissions' in navigator ||
        'devicemotion' in window ||
        'DeviceMotionEvent' in window ||
        // PWA/Service Worker環境でのセンサーアクセス
        'serviceWorker' in navigator
    );
};

// 歩数データの取得を試行（複数のAPI経由）
export const getStepsData = async (): Promise<number | null> => {
    try {
        // Method 1: Web標準のPermissions APIを使用
        if ('permissions' in navigator) {
            try {
                // @ts-ignore - 実験的API
                const result = await navigator.permissions.query({ name: 'accelerometer' });
                if (result.state === 'granted') {
                    // センサーデータから歩数を推定（簡易実装）
                    const steps = await estimateStepsFromSensor();
                    if (steps !== null) return steps;
                }
            } catch (e) {
                console.log('Accelerometer permission not available:', e);
            }
        }

        // Method 2: Device Motion APIを使用
        if ('DeviceMotionEvent' in window) {
            const steps = await getStepsFromDeviceMotion();
            if (steps !== null) return steps;
        }

        // Method 3: Local Storage内の歩数データ（既存の入力から推定）
        const lastSteps = getStoredStepsData();
        if (lastSteps !== null) return lastSteps;

    } catch (error) {
        console.error('Error getting steps data:', error);
    }

    return null;
};

// センサーデータから歩数を推定（簡易実装）
const estimateStepsFromSensor = async (): Promise<number | null> => {
    return new Promise((resolve) => {
        try {
            // @ts-ignore - 実験的API
            const sensor = new Accelerometer({ frequency: 10 });
            let stepCount = 0;
            let lastPeak = 0;
            const threshold = 12; // 加速度の閾値

            sensor.addEventListener('reading', () => {
                // @ts-ignore
                const acceleration = Math.sqrt(sensor.x ** 2 + sensor.y ** 2 + sensor.z ** 2);

                if (acceleration > threshold && Date.now() - lastPeak > 300) {
                    stepCount++;
                    lastPeak = Date.now();
                }
            });

            sensor.start();

            // 5秒間測定して推定値を返す
            setTimeout(() => {
                sensor.stop();
                resolve(stepCount > 0 ? stepCount * 1200 : null); // 5秒のデータから1日分を推定
            }, 5000);

        } catch (error) {
            console.log('Accelerometer not available:', error);
            resolve(null);
        }
    });
};

// Device Motion APIから歩数データを取得
const getStepsFromDeviceMotion = (): Promise<number | null> => {
    return new Promise((resolve) => {
        let stepCount = 0;
        let lastAccel = { x: 0, y: 0, z: 0 };
        let isListening = false;

        const handleMotion = (event: DeviceMotionEvent) => {
            if (!event.acceleration) return;

            const { x, y, z } = event.acceleration;
            if (x === null || y === null || z === null) return;

            // 歩行パターンの検出（簡易実装）
            const currentAccel = Math.sqrt(x * x + y * y + z * z);
            const lastAccelTotal = Math.sqrt(lastAccel.x ** 2 + lastAccel.y ** 2 + lastAccel.z ** 2);

            if (Math.abs(currentAccel - lastAccelTotal) > 2) {
                stepCount++;
            }

            lastAccel = { x, y, z };
        };

        // 権限の確認（iOS 13+）
        if (typeof DeviceMotionEvent !== 'undefined' && 'requestPermission' in DeviceMotionEvent) {
            // @ts-ignore
            DeviceMotionEvent.requestPermission()
                .then((response: string) => {
                    if (response === 'granted') {
                        window.addEventListener('devicemotion', handleMotion);
                        isListening = true;
                    } else {
                        resolve(null);
                    }
                })
                .catch(() => resolve(null));
        } else {
            // Android or older iOS
            window.addEventListener('devicemotion', handleMotion);
            isListening = true;
        }

        if (isListening) {
            // 3秒間リスニングして結果を返す
            setTimeout(() => {
                window.removeEventListener('devicemotion', handleMotion);
                resolve(stepCount > 0 ? stepCount * 1440 : null); // 3秒のデータから1日分を推定
            }, 3000);
        }
    });
};

// ローカルストレージから歩数データを取得
const getStoredStepsData = (): number | null => {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const exerciseData = localStorage.getItem(`exerciseRecord_${today}`);
        if (exerciseData) {
            const data = JSON.parse(exerciseData);
            return data.walkingSteps ? parseInt(data.walkingSteps, 10) : null;
        }
    } catch (error) {
        console.log('Error reading stored steps:', error);
    }
    return null;
};

// 健康・フィットネスデータの総合取得
export const syncWithDevice = async (): Promise<DeviceExerciseData | null> => {
    try {
        const deviceData: DeviceExerciseData = {};

        // 歩数データの取得
        const steps = await getStepsData();
        if (steps !== null && steps > 0) {
            deviceData.steps = steps;

            // 歩数から距離を推定（平均歩幅65cm）
            deviceData.distance = Math.round((steps * 0.65) / 1000 * 100) / 100; // km単位

            // 歩数から消費カロリーを推定
            deviceData.calories = Math.round(steps * 0.04);

            // 歩数からアクティブ時間を推定（分速100歩として計算）
            deviceData.duration = Math.round(steps / 100);
        }

        // バッテリー情報からデバイスの活動レベルを推定
        if ('getBattery' in navigator) {
            try {
                // @ts-ignore
                const battery = await navigator.getBattery();
                if (battery.level < 0.3) {
                    // バッテリー残量が少ない場合、アクティブな使用を推定
                    deviceData.activeMinutes = Math.min((deviceData.duration || 0) + 30, 120);
                }
            } catch (e) {
                console.log('Battery API not available:', e);
            }
        }

        // 何らかのデータが取得できた場合のみ返す
        if (Object.keys(deviceData).length > 0) {
            console.log('Synced device data:', deviceData);
            return deviceData;
        }

    } catch (error) {
        console.error('Error syncing with device:', error);
    }

    return null;
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
