import { atom } from 'recoil';
import { type FoodLog as FoodLogType } from '../proto/food_log_pb';

export interface FoodLogState {
    selectedDate: string;
    diary: string;
    photos: string[];
    isPublic: boolean;
    isSensitive: boolean;
    currentRecord?: FoodLogType;
    recordedDates: string[];
}

export const foodLogState = atom<FoodLogState>({
    key: 'foodLogState',
    default: {
        selectedDate: new Date().toISOString().slice(0, 10),
        diary: '',
        photos: [],
        isPublic: false,
        isSensitive: false,
        currentRecord: undefined,
        recordedDates: [],
    },
});
