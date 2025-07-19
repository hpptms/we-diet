import { atom } from 'recoil';

export const exerciseRecordedDateAtom = atom<string | null>({
    key: 'exerciseRecordedDateAtom',
    default: null, // YYYY-MM-DD形式の日付文字列、またはnull
});
