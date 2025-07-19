import { atom } from 'recoil';

export interface ExerciseRecordData {
    userId?: number;
    walkingDistance: string;
    walkingTime: string;
    runningDistance: string;
    runningTime: string;
    pushUps: string;
    sitUps: string;
    squats: string;
    otherExerciseTime: string;
    todayWeight: string;
    exerciseNote: string; // どんな運動したの？自由入力欄
    todayImages: File[]; // 今日の一枚（最大3枚）
    isPublic: boolean;
    hasWeightInput: boolean; // 体重入力があったかどうかのフラグ
}

export const exerciseRecordState = atom<ExerciseRecordData>({
    key: 'exerciseRecordState',
    default: {
        userId: undefined,
        walkingDistance: '',
        walkingTime: '',
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
    },
});
