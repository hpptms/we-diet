import { DEFAULT_IMAGES } from '../../../../../image/DefaultImage';

export const getUserUtils = (profileSettings: any, serverProfile: any) => {
    // アイコンのソースを取得する関数（Headerコンポーネントと同じロジック）
    const getIconSrc = () => {
        // サーバーからのデータを優先
        if (serverProfile.profile) {
            if (serverProfile.profile.icon_type === 'upload' && serverProfile.profile.uploaded_icon) {
                return serverProfile.profile.uploaded_icon;
            }
            if (serverProfile.profile.icon_type === 'preset' && serverProfile.profile.selected_preset_id) {
                const presetImage = DEFAULT_IMAGES.find(img => img.id === serverProfile.profile!.selected_preset_id);
                return presetImage?.url;
            }
        }

        // ローカルデータにフォールバック
        if (profileSettings.iconType === 'upload' && profileSettings.uploadedIcon) {
            return profileSettings.uploadedIcon;
        }
        if (profileSettings.iconType === 'preset' && profileSettings.selectedPresetId) {
            const presetImage = DEFAULT_IMAGES.find(img => img.id === profileSettings.selectedPresetId);
            return presetImage?.url;
        }

        return undefined;
    };

    // 表示名を取得する関数
    const getDisplayName = () => {
        // サーバーからのデータを優先
        if (serverProfile.profile?.display_name) {
            return serverProfile.profile.display_name;
        }
        // ローカルデータにフォールバック
        if (profileSettings.displayName) {
            return profileSettings.displayName;
        }
        // accountNameを取得
        const accountName = localStorage.getItem('accountName');
        if (accountName) {
            return accountName;
        }
        return 'ダイエッター';
    };

    // ユーザーIDを取得する関数
    const getUserId = () => {
        const accountName = localStorage.getItem('accountName');
        return accountName ? `@${accountName}` : '@diet_user';
    };

    return {
        getIconSrc,
        getDisplayName,
        getUserId
    };
};
