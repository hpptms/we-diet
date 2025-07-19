import { atom } from 'recoil';

// 今日の日付を取得する関数
const getTodayStr = () => new Date().toISOString().slice(0, 10);

// localStorageから初期値を取得
const getInitialWeightRecordedDate = (): string => {
    return localStorage.getItem('weightRecordedDate') || '';
};

export const weightRecordedDateAtom = atom<string>({
    key: 'weightRecordedDateAtom',
    default: getInitialWeightRecordedDate(),
    effects_UNSTABLE: [
        ({ setSelf, onSet }) => {
            // localStorageの変更をatomに反映
            const handleStorage = (event: StorageEvent) => {
                if (event.key === 'weightRecordedDate') {
                    setSelf(event.newValue || '');
                }
            };
            window.addEventListener('storage', handleStorage);
            return () => {
                window.removeEventListener('storage', handleStorage);
            };
        },
    ],
});
