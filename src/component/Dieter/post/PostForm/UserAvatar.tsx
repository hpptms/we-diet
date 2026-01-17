import React, { useMemo } from 'react';
import { Avatar } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useRecoilValue } from 'recoil';
import { profileSettingsState, serverProfileState } from '../../../../recoil/profileSettingsAtom';
import { getUserUtils } from '../../layout/LeftSidebar/utils/userUtils';

interface UserAvatarProps {
  currentUser?: {
    name: string;
    avatar?: string;
  };
}

const UserAvatar: React.FC<UserAvatarProps> = ({ currentUser = { name: 'ユーザー', avatar: '' } }) => {
  const profileSettings = useRecoilValue(profileSettingsState);
  const serverProfile = useRecoilValue(serverProfileState);

  // getUserUtilsを使ってアイコンソースを取得
  const iconSrc = useMemo(() => {
    const { getIconSrc } = getUserUtils(profileSettings, serverProfile);
    const src = getIconSrc();
    // getUserUtilsで取得できない場合、currentUserのavatarをチェック
    return src || currentUser.avatar || undefined;
  }, [profileSettings, serverProfile, currentUser.avatar]);

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

export default React.memo(UserAvatar);
