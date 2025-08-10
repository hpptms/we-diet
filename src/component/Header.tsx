import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Button, Switch, FormControlLabel } from '@mui/material';
import { AccountCircle, DarkMode, LightMode } from '@mui/icons-material';
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil';
import { useNavigate, useLocation } from 'react-router-dom';
import { profileSettingsState, serverProfileState, convertServerProfileToLocalProfile, resetServerProfileData } from '../recoil/profileSettingsAtom';
import { darkModeState } from '../recoil/darkModeAtom';
import { DEFAULT_IMAGES } from '../image/DefaultImage';
import { useTranslation } from '../hooks/useTranslation';
import axios from 'axios';

const Header: React.FC = () => {
  const location = useLocation();
  const isDarkMode = useRecoilValue(darkModeState);
  const { t } = useTranslation();
  
  // 青系ストライプ色を定義
  const stripes = ['#cceeff', '#b3e5fc', '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da'];

  const stripeBackground = `repeating-linear-gradient(
    to right,
    ${stripes.map((color, i) => `${color} ${i * 14.2}% ${(i + 1) * 14.2}%`).join(', ')}
  )`;

  // ログインページまたはトップページの場合はアイコンを非表示
  const shouldHideIcon = location.pathname === '/login' || location.pathname === '/';

  return (
    <AppBar
      position="static"
      sx={{
        backgroundImage: isDarkMode ? 'none' : stripeBackground,
        backgroundColor: isDarkMode ? '#000000' : 'transparent',
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        color: isDarkMode ? '#ffffff' : '#000', // テキストを見やすく
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)', // ← しっかりめの影
        borderBottom: isDarkMode ? '2px solid #ffffff' : 'none',
        zIndex: 1100, // 重なり順を確保（任意）
        }}
    >
      <Toolbar>
        <Typography
          variant="h2"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: 700,
            fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
            letterSpacing: '0.05em',
            display: 'flex',
            alignItems: 'center',
            fontFamily: "'Pacifico', 'Caveat', 'Lobster', 'Dancing Script', 'M PLUS 1p', sans-serif",
            textShadow: `
              -2px -2px 0 #fff,
              2px -2px 0 #fff,
              -2px 2px 0 #fff,
              2px 2px 0 #fff,
              0px 2px 0 #fff,
              2px 0px 0 #fff,
              0px -2px 0 #fff,
              -2px 0px 0 #fff
            `,
          }}
        >
          We Diet
        </Typography>
        {!shouldHideIcon && (
          <Box sx={{ ml: 'auto' }}>
            <ProfileIcon />
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

// プロフィールアイコンコンポーネント
const ProfileIcon: React.FC = () => {
  const profileSettings = useRecoilValue(profileSettingsState);
  const setProfileSettings = useSetRecoilState(profileSettingsState);
  const serverProfile = useRecoilValue(serverProfileState);
  const setServerProfile = useSetRecoilState(serverProfileState);
  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useRecoilState(darkModeState);
  const { t } = useTranslation();

  // サーバーからプロフィール情報を取得
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const accountName = localStorage.getItem('accountName');
        if (!accountName) {
          return;
        }

        // キャッシュチェック（1時間以内なら再取得しない）
        const now = Date.now();
        if (serverProfile.profile && serverProfile.lastFetched && 
            (now - serverProfile.lastFetched) < 3600000) {
          // キャッシュされたデータでローカル設定を更新（既にローカルにアイコン情報がない場合のみ）
          if (!profileSettings.selectedPresetId && !profileSettings.uploadedIcon) {
            const localProfile = convertServerProfileToLocalProfile(serverProfile.profile);
            setProfileSettings(localProfile);
          }
          return;
        }

        // localStorageからuserIDを取得
        const userIdFromStorage = localStorage.getItem('user_id');
        if (!userIdFromStorage) {
          return;
        }
        const userId = parseInt(userIdFromStorage);

        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/proto/user_profile/${userId}`);
        
        if (response.data && response.data.profile) {
          const profile = response.data.profile;
          
          // サーバープロフィール状態を更新
          setServerProfile({
            userId,
            profile,
            lastFetched: now,
          });
          
          // ローカル設定も更新（ただし、既にアイコン情報がある場合は上書きしない）
          if (!profileSettings.selectedPresetId && !profileSettings.uploadedIcon) {
            const localProfile = convertServerProfileToLocalProfile(profile);
            setProfileSettings(localProfile);
          }
        }
      } catch (error: any) {
        console.error('プロフィール取得エラー:', error);
        // 404エラーの場合は初回ログイン（プロフィール未作成）
        if (error.response?.status === 404) {
          // ログ出力なし
        }
      }
    };

    // accountNameが存在する場合のみ実行
    const accountName = localStorage.getItem('accountName');
    if (accountName) {
      fetchUserProfile();
    }
  }, []); // 依存関係を空にして、コンポーネントマウント時のみ実行

  const getIconSrc = React.useMemo(() => {
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
  }, [serverProfile.profile, profileSettings.iconType, profileSettings.uploadedIcon, profileSettings.selectedPresetId]);

  const handleIconClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogout = () => {
    // ローカルストレージをクリア
    localStorage.removeItem('accountName');
    // プロフィール設定もクリア
    localStorage.removeItem('profileSettingsData');
    // サーバープロフィールもクリア
    localStorage.removeItem('serverProfileData');
    // その他の関連データもクリア
    localStorage.removeItem('foodLogData');
    localStorage.removeItem('weightRecordCacheData');
    localStorage.removeItem('exerciseRecordData');
    
    // Recoil状態もリセット
    resetServerProfileData();
    
    // ログインページにリダイレクト
    navigate('/login');
  };

  const handleDialogClose = () => {
    setLogoutDialogOpen(false);
  };

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* ダークモードトグル */}
        <FormControlLabel
          control={
            <Switch
              checked={isDarkMode}
              onChange={(e) => setIsDarkMode(e.target.checked)}
              color="primary"
              sx={{
                '& .MuiSwitch-switchBase': {
                  color: '#ffffff',
                  '&.Mui-checked': {
                    color: '#29b6f6',
                    '& + .MuiSwitch-track': {
                      backgroundColor: '#29b6f6',
                      opacity: 0.5,
                    },
                  },
                },
                '& .MuiSwitch-track': {
                  backgroundColor: isDarkMode ? '#29b6f6' : '#ffffff',
                  opacity: isDarkMode ? 0.5 : 0.8,
                  borderRadius: 20,
                  border: isDarkMode ? `2px solid #29b6f6` : `2px solid #ffffff`,
                },
                '& .MuiSwitch-thumb': {
                  backgroundColor: '#ffffff',
                  width: 20,
                  height: 20,
                  boxShadow: `0 2px 4px rgba(0,0,0,0.2)`,
                  border: `2px solid #29b6f6`,
                },
              }}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
              {isDarkMode ? <DarkMode sx={{ color: '#29b6f6' }} /> : <LightMode sx={{ color: '#ffffff' }} />}
              <Typography sx={{ 
                fontSize: { xs: '0.7rem', sm: '0.9rem' }, 
                fontWeight: 600, 
                color: isDarkMode ? '#29b6f6' : '#ffffff',
                display: { xs: 'none', sm: 'block' }
              }}>
                {t('common', 'ui.darkMode', {}, 'ダークモード')}
              </Typography>
            </Box>
          }
          sx={{
            m: 0,
            justifyContent: 'space-between',
            marginLeft: 0,
            '& .MuiFormControlLabel-label': {
              flex: 1,
            },
          }}
        />
        
        <Avatar
          onClick={handleIconClick}
          sx={{
            width: 45,
            height: 45,
            border: '3px solid #1976d2',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.4)',
            cursor: 'pointer',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'scale(1.05)',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.7), 0 3px 6px rgba(0, 0, 0, 0.5)',
            },
          }}
          src={getIconSrc}
        >
          {!getIconSrc && <AccountCircle sx={{ fontSize: '2.2rem' }} />}
        </Avatar>
      </Box>

      <Dialog
        open={logoutDialogOpen}
        onClose={handleDialogClose}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 2,
            padding: 1,
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          {t('common', 'ui.logoutConfirmation', {}, 'ログアウト確認')}
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
          {t('common', 'ui.logoutConfirmMessage', {}, 'ログアウトしますか？')}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
          <Button
            onClick={handleDialogClose}
            variant="outlined"
            sx={{ minWidth: 80 }}
          >
            {t('common', 'no', {}, 'NO')}
          </Button>
          <Button
            onClick={handleLogout}
            variant="contained"
            color="error"
            sx={{ minWidth: 80 }}
          >
            {t('common', 'yes', {}, 'YES')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
