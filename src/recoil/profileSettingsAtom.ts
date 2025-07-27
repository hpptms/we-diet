import { atom } from 'recoil';
import { UserProfile } from '../proto/user_profile_pb';

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

// サーバープロフィール用の状態
export interface ServerProfileState {
    userId: number | null;
    profile: UserProfile | null;
    lastFetched: number | null;
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
        console.log('ローカルストレージからプロフィール設定を読み込み:', storedData);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            console.log('パースされたプロフィール設定:', parsedData);
            return {
                ...defaultProfileSettings,
                ...parsedData,
            };
        }
        console.log('ローカルストレージにプロフィール設定が見つかりません - デフォルト値を使用');
        return defaultProfileSettings;
    } catch (error) {
        console.error('プロフィール設定のローカルストレージ読み込みに失敗しました:', error);
        return defaultProfileSettings;
    }
};

// ローカルストレージに保存
const saveToLocalStorage = (data: ProfileSettingsState) => {
    try {
        console.log('プロフィール設定をローカルストレージに保存:', data);
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

// サーバープロフィール用のローカルストレージキー
const SERVER_PROFILE_STORAGE_KEY = 'serverProfileData';

// サーバープロフィールのデフォルト値
const defaultServerProfile: ServerProfileState = {
    userId: null,
    profile: null,
    lastFetched: null,
};

// サーバープロフィールのローカルストレージ操作
const loadServerProfileFromLocalStorage = (): ServerProfileState => {
    try {
        const storedData = localStorage.getItem(SERVER_PROFILE_STORAGE_KEY);
        if (storedData) {
            return JSON.parse(storedData);
        }
        return defaultServerProfile;
    } catch (error) {
        console.error('サーバープロフィールのローカルストレージ読み込みに失敗しました:', error);
        return defaultServerProfile;
    }
};

const saveServerProfileToLocalStorage = (data: ServerProfileState) => {
    try {
        localStorage.setItem(SERVER_PROFILE_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('サーバープロフィールのローカルストレージ保存に失敗しました:', error);
    }
};

// サーバープロフィール状態管理
export const serverProfileState = atom<ServerProfileState>({
    key: 'serverProfileState',
    default: loadServerProfileFromLocalStorage(),
    effects: [
        ({ onSet }) => {
            onSet((newValue) => {
                saveServerProfileToLocalStorage(newValue);
            });
        },
    ],
});

// UserProfileからProfileSettingsStateに変換する関数
export const convertServerProfileToLocalProfile = (serverProfile: UserProfile): ProfileSettingsState => {
    return {
        displayName: serverProfile.display_name || '',
        selectedPresetId: serverProfile.selected_preset_id || null,
        iconType: (serverProfile.icon_type as 'preset' | 'upload') || 'preset',
        uploadedIcon: serverProfile.uploaded_icon || null,
        uploadedIconPublicId: serverProfile.uploaded_icon_public_id || null,
        gender: (serverProfile.gender as GenderType) || 'male',
        age: serverProfile.age?.toString() || '',
        height: serverProfile.height?.toString() || '',
        activityLevel: serverProfile.activity_level || '',
        currentWeight: serverProfile.current_weight?.toString() || '',
        targetWeight: serverProfile.target_weight?.toString() || '',
        showPreset: serverProfile.show_preset ?? true,
        prText: serverProfile.pr_text || '',
        isGenderPrivate: serverProfile.is_gender_private ?? false,
        isAgePrivate: serverProfile.is_age_private ?? false,
        isHeightPrivate: serverProfile.is_height_private ?? false,
        isActivityPrivate: serverProfile.is_activity_private ?? false,
        isCurrentWeightPrivate: serverProfile.is_current_weight_private ?? false,
        isTargetWeightPrivate: serverProfile.is_target_weight_private ?? false,
    };
};

// データをリセットする関数
export const resetProfileSettingsData = (): ProfileSettingsState => {
    localStorage.removeItem(PROFILE_SETTINGS_STORAGE_KEY);
    return defaultProfileSettings;
};

export const resetServerProfileData = (): ServerProfileState => {
    localStorage.removeItem(SERVER_PROFILE_STORAGE_KEY);
    return defaultServerProfile;
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
