import { atom } from 'recoil';

const DARK_MODE_STORAGE_KEY = 'darkModeSettings';

// ローカルストレージから初期値を取得
const getInitialDarkMode = (): boolean => {
    try {
        const stored = localStorage.getItem(DARK_MODE_STORAGE_KEY);
        return stored ? JSON.parse(stored) : false;
    } catch (error) {
        console.error('ダークモード設定の読み込みエラー:', error);
        return false;
    }
};

export const darkModeState = atom({
    key: 'darkModeState',
    default: getInitialDarkMode(),
    effects: [
        ({ onSet }) => {
            onSet((newValue) => {
                try {
                    localStorage.setItem(DARK_MODE_STORAGE_KEY, JSON.stringify(newValue));
                } catch (error) {
                    console.error('ダークモード設定の保存エラー:', error);
                }
            });
        }
    ],
});
