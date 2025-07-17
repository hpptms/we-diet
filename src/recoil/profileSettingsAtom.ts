import { atom } from 'recoil';

export type GenderType = 'male' | 'female' | 'secret';

export interface ProfileSettingsState {
    displayName: string;
    selectedPresetId: number | null;
    iconType: 'preset' | 'upload';
    uploadedIcon: string | null;
    gender: GenderType;
    age: string;
    activityLevel: string;
    currentWeight: string;
    targetWeight: string;
    showPreset: boolean;
    prText: string;
    isGenderPrivate: boolean;
    isAgePrivate: boolean;
    isActivityPrivate: boolean;
    isCurrentWeightPrivate: boolean;
    isTargetWeightPrivate: boolean;
}

export const profileSettingsState = atom<ProfileSettingsState>({
    key: 'profileSettingsState',
    default: {
        displayName: '',
        selectedPresetId: null,
        iconType: 'preset',
        uploadedIcon: null,
        gender: 'male',
        age: '',
        activityLevel: '',
        currentWeight: '',
        targetWeight: '',
        showPreset: true,
        prText: '',
        isGenderPrivate: false,
        isAgePrivate: false,
        isActivityPrivate: false,
        isCurrentWeightPrivate: false,
        isTargetWeightPrivate: false,
    },
});
