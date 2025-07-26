import { atom } from 'recoil';

export type GenderType = 'male' | 'female' | 'secret';

export interface ProfileSettingsState {
    displayName: string;
    selectedPresetId: number | null;
    iconType: 'preset' | 'upload';
    uploadedIcon: string | null;
    uploadedIconPublicId: string | null;
    gender: GenderType;
    age: string;
    height: string;
    activityLevel: string;
    currentWeight: string;
    targetWeight: string;
    showPreset: boolean;
    prText: string;
    isGenderPrivate: boolean;
    isAgePrivate: boolean;
    isHeightPrivate: boolean;
    isActivityPrivate: boolean;
    isCurrentWeightPrivate: boolean;
    isTargetWeightPrivate: boolean;
}

// ローカルストレージ用のキー
const PROFILE_SETTINGS_STORAGE_KEY = 'profileSettingsData';

// デフォルト値
const defaultProfileSettings: ProfileSettingsState = {
    displayName: '',
    selectedPresetId: null,
    iconType: 'preset',
    uploadedIcon: null,
    uploadedIconPublicId: null,
    gender: 'male',
    age: '',
    height: '',
    activityLevel: '',
    currentWeight: '',
    targetWeight: '',
    showPreset: true,
    prText: '',
    isGenderPrivate: false,
    isAgePrivate: false,
    isHeightPrivate: false,
    isActivityPrivate: false,
    isCurrentWeightPrivate: false,
    isTargetWeightPrivate: false,
};

// ローカルストレージから読み込み
const loadFromLocalStorage = (): ProfileSettingsState => {
    try {
        const storedData = localStorage.getItem(PROFILE_SETTINGS_STORAGE_KEY);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            return {
                ...defaultProfileSettings,
                ...parsedData,
            };
        }
        return defaultProfileSettings;
    } catch (error) {
        console.error('プロフィール設定のローカルストレージ読み込みに失敗しました:', error);
        return defaultProfileSettings;
    }
};

// ローカルストレージに保存
const saveToLocalStorage = (data: ProfileSettingsState) => {
    try {
        localStorage.setItem(PROFILE_SETTINGS_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('プロフィール設定のローカルストレージ保存に失敗しました:', error);
    }
};

export const profileSettingsState = atom<ProfileSettingsState>({
    key: 'profileSettingsState',
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
export const resetProfileSettingsData = (): ProfileSettingsState => {
    localStorage.removeItem(PROFILE_SETTINGS_STORAGE_KEY);
    return defaultProfileSettings;
};

// プロフィールデータが空かどうかをチェックする関数
export const isProfileDataEmpty = (data: ProfileSettingsState): boolean => {
    return (
        !data.displayName &&
        !data.age &&
        !data.height &&
        !data.activityLevel &&
        !data.currentWeight &&
        !data.targetWeight &&
        !data.prText
    );
};
