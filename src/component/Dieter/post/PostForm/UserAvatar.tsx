import React from 'react';
import { Avatar } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useRecoilValue } from 'recoil';
import { profileSettingsState, serverProfileState } from '../../../../recoil/profileSettingsAtom';
import { DEFAULT_IMAGES } from '../../../../image/DefaultImage';

interface UserAvatarProps {
  currentUser?: {
    name: string;
    avatar?: string;
  };
}

const UserAvatar: React.FC<UserAvatarProps> = ({ currentUser = { name: 'ユーザー', avatar: '' } }) => {
  const profileSettings = useRecoilValue(profileSettingsState);
  const serverProfile = useRecoilValue(serverProfileState);

  // アイコンのソースを取得する関数（LeftSidebarと同じロジック）
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
    
    // currentUserのavatarもチェック
    if (currentUser.avatar) {
      return currentUser.avatar;
    }
    
    return undefined;
  };

  const iconSrc = getIconSrc();

  return (
    <Avatar 
      src={iconSrc}
      sx={{ 
        width: 56,
        height: 56,
        background: iconSrc ? undefined : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        boxShadow: '0 4px 12px rgba(41, 182, 246, 0.3)',
        border: '2px solid rgba(255, 255, 255, 0.8)',
        color: 'white'
      }}
    >
      {!iconSrc && <AccountCircle sx={{ fontSize: '2rem' }} />}
    </Avatar>
  );
};

export default UserAvatar;
