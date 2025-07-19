import { atom } from 'recoil';

export interface WeightRecord {
    id: number;
    user_id: number;
    date: string;
    weight: number;
    body_fat?: number;
    note?: string;
    is_public: boolean;
}

export interface MonthlyAverageRecord {
    year_month: string;
    average_weight: number;
}

export interface WeightRecordCache {
    monthlyRecords: { [key: string]: WeightRecord[] };
    yearlyRecords: { [key: string]: MonthlyAverageRecord[] };
    currentDate: Date;
    viewPeriod: 'month' | 'year';
}

export const weightRecordCacheAtom = atom<WeightRecordCache>({
    key: 'weightRecordCacheAtom',
    default: {
        monthlyRecords: {},
        yearlyRecords: {},
        currentDate: new Date(),
        viewPeriod: 'month'
    }
});

// キャッシュクリア用のatomエフェクト
export const clearWeightCacheAtom = atom<boolean>({
    key: 'clearWeightCacheAtom',
    default: false,
    effects_UNSTABLE: [
        ({ onSet, resetSelf }) => {
            onSet((newValue) => {
                if (newValue) {
                    // キャッシュをクリア後、自分自身をリセット
                    setTimeout(() => resetSelf(), 0);
                }
            });
        }
    ]
});
