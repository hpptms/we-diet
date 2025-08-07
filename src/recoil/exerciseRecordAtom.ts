import { atom } from 'recoil';

export interface ExerciseRecordData {
    userId?: number;
    walkingDistance: string;
    walkingTime: string;
    walkingSteps: string; // 歩数フィールドを追加
    runningDistance: string;
    runningTime: string;
    pushUps: string;
    sitUps: string;
    squats: string;
    otherExerciseTime: string;
    todayWeight: string;
    exerciseNote: string; // どんな運動したの？自由入力欄
    todayImages: File[]; // 今日の一枚（最大3枚）
    imageUrls?: string[]; // サーバーから取得した画像URL（表示用）
    isPublic: boolean;
    hasWeightInput: boolean; // 体重入力があったかどうかのフラグ
    isSensitive: boolean; // センシティブコンテンツかどうか
}

// ローカルストレージ用のキー
const EXERCISE_RECORD_STORAGE_KEY = 'exerciseRecordData';
const EXERCISE_RECORD_DATE_KEY = 'exerciseRecordDate';

// デフォルト値
const defaultExerciseData: ExerciseRecordData = {
    userId: undefined,
    walkingDistance: '',
    walkingTime: '',
    walkingSteps: '', // 歩数のデフォルト値
    runningDistance: '',
    runningTime: '',
    pushUps: '',
    sitUps: '',
    squats: '',
    otherExerciseTime: '',
    todayWeight: '',
    exerciseNote: '',
    todayImages: [],
    isPublic: false,
    hasWeightInput: false,
    isSensitive: false,
};

// 今日の日付を取得（YYYY-MM-DD形式）
const getTodayString = (): string => {
    return new Date().toISOString().slice(0, 10);
};

// ローカルストレージから読み込み（日付チェック付き）
const loadFromLocalStorage = (): ExerciseRecordData => {
    try {
        const storedDate = localStorage.getItem(EXERCISE_RECORD_DATE_KEY);
        const todayString = getTodayString();

        // 日付が変わっていたら古いデータを削除
        if (storedDate !== todayString) {
            localStorage.removeItem(EXERCISE_RECORD_STORAGE_KEY);
            localStorage.removeItem(EXERCISE_RECORD_DATE_KEY);
            localStorage.setItem(EXERCISE_RECORD_DATE_KEY, todayString);
            return defaultExerciseData;
        }

        const storedData = localStorage.getItem(EXERCISE_RECORD_STORAGE_KEY);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            // File型のtodayImagesは復元できないので空配列にする
            return {
                ...parsedData,
                todayImages: [],
            };
        }

        return defaultExerciseData;
    } catch (error) {
        console.error('ローカルストレージからの読み込みに失敗しました:', error);
        return defaultExerciseData;
    }
};

// ローカルストレージに保存
const saveToLocalStorage = (data: ExerciseRecordData) => {
    try {
        const todayString = getTodayString();
        localStorage.setItem(EXERCISE_RECORD_DATE_KEY, todayString);

        // File型のtodayImagesは保存できないので除外
        const dataToSave = {
            ...data,
            todayImages: [], // File型は保存しない
        };

        localStorage.setItem(EXERCISE_RECORD_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
        console.error('ローカルストレージへの保存に失敗しました:', error);
    }
};

export const exerciseRecordState = atom<ExerciseRecordData>({
    key: 'exerciseRecordState',
    default: loadFromLocalStorage(),
    effects: [
        ({ onSet }) => {
            onSet((newValue) => {
                saveToLocalStorage(newValue);
            });
        },
    ],
});

// データをリセットする関数
export const resetExerciseRecordData = (): ExerciseRecordData => {
    localStorage.removeItem(EXERCISE_RECORD_STORAGE_KEY);
    localStorage.removeItem(EXERCISE_RECORD_DATE_KEY);
    return defaultExerciseData;
};

// 手動で日付チェックを行う関数
export const checkAndResetIfDateChanged = (): ExerciseRecordData | null => {
    const storedDate = localStorage.getItem(EXERCISE_RECORD_DATE_KEY);
    const todayString = getTodayString();

    if (storedDate && storedDate !== todayString) {
        return resetExerciseRecordData();
    }

    return null;
};

// データが空かどうかをチェックする関数
export const isExerciseDataEmpty = (data: ExerciseRecordData): boolean => {
    return (
        !data.walkingDistance &&
        !data.walkingTime &&
        !data.walkingSteps &&
        !data.runningDistance &&
        !data.runningTime &&
        !data.pushUps &&
        !data.sitUps &&
        !data.squats &&
        !data.otherExerciseTime &&
        !data.todayWeight &&
        !data.exerciseNote &&
        data.todayImages.length === 0
    );
};
