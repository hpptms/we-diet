import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Box, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useNavigate, useLocation } from 'react-router-dom';
import { profileSettingsState, serverProfileState, convertServerProfileToLocalProfile, resetServerProfileData } from '../recoil/profileSettingsAtom';
import { DEFAULT_IMAGES } from '../image/DefaultImage';
import axios from 'axios';

const Header: React.FC = () => {
  const location = useLocation();
  
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
        backgroundImage: stripeBackground,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        color: '#000', // テキストを見やすく
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.3)', // ← しっかりめの影
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

  // サーバーからプロフィール情報を取得
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const accountName = localStorage.getItem('accountName');
        if (!accountName) {
          console.log('accountNameが見つかりません');
          return;
        }

        // キャッシュチェック（1時間以内なら再取得しない）
        const now = Date.now();
        if (serverProfile.profile && serverProfile.lastFetched && 
            (now - serverProfile.lastFetched) < 3600000) {
          console.log('キャッシュされたプロフィールを使用:', serverProfile.profile);
          // キャッシュされたデータでローカル設定を更新（既にローカルにアイコン情報がない場合のみ）
          if (!profileSettings.selectedPresetId && !profileSettings.uploadedIcon) {
            const localProfile = convertServerProfileToLocalProfile(serverProfile.profile);
            console.log('キャッシュからローカル設定を更新:', localProfile);
            setProfileSettings(localProfile);
          }
          return;
        }

        // まず、accountNameからuserIDを取得する必要があります
        // ここでは仮に固定のuserID=2を使用します（実際の実装では適切なAPIを呼ぶ必要があります）
        const userId = 2; // TODO: accountNameからuserIDを取得するAPIを実装

        console.log('サーバープロフィール取得中...', { userId, accountName });
        const response = await axios.get(`/api/proto/user_profile/${userId}`);
        
        if (response.data && response.data.profile) {
          const profile = response.data.profile;
          console.log('サーバープロフィール取得成功:', profile);
          
          // サーバープロフィール状態を更新
          setServerProfile({
            userId,
            profile,
            lastFetched: now,
          });
          
          // ローカル設定も更新（ただし、既にアイコン情報がある場合は上書きしない）
          if (!profileSettings.selectedPresetId && !profileSettings.uploadedIcon) {
            const localProfile = convertServerProfileToLocalProfile(profile);
            console.log('ローカルプロフィール変換結果:', localProfile);
            setProfileSettings(localProfile);
          }
        }
      } catch (error: any) {
        console.error('プロフィール取得エラー:', error);
        // 404エラーの場合は初回ログイン（プロフィール未作成）
        if (error.response?.status === 404) {
          console.log('プロフィールが見つかりません（初回ログイン）');
        }
      }
    };

    // accountNameが存在する場合のみ実行
    const accountName = localStorage.getItem('accountName');
    if (accountName) {
      fetchUserProfile();
    }
  }, []); // 依存関係を空にして、コンポーネントマウント時のみ実行

  const getIconSrc = () => {
    console.log('アイコン取得中:', {
      serverProfile: serverProfile.profile,
      profileSettings: profileSettings
    });
    
    // サーバーからのデータを優先
    if (serverProfile.profile) {
      console.log('サーバープロフィール使用:', {
        icon_type: serverProfile.profile.icon_type,
        uploaded_icon: serverProfile.profile.uploaded_icon,
        selected_preset_id: serverProfile.profile.selected_preset_id
      });
      
      if (serverProfile.profile.icon_type === 'upload' && serverProfile.profile.uploaded_icon) {
        console.log('アップロードアイコン使用:', serverProfile.profile.uploaded_icon);
        return serverProfile.profile.uploaded_icon;
      }
      if (serverProfile.profile.icon_type === 'preset' && serverProfile.profile.selected_preset_id) {
        const presetImage = DEFAULT_IMAGES.find(img => img.id === serverProfile.profile!.selected_preset_id);
        console.log('プリセットアイコン使用:', { presetId: serverProfile.profile.selected_preset_id, url: presetImage?.url });
        return presetImage?.url;
      }
    }
    
    // ローカルデータにフォールバック
    console.log('ローカルデータ使用:', {
      iconType: profileSettings.iconType,
      uploadedIcon: profileSettings.uploadedIcon,
      selectedPresetId: profileSettings.selectedPresetId
    });
    
    if (profileSettings.iconType === 'upload' && profileSettings.uploadedIcon) {
      console.log('ローカルアップロードアイコン使用:', profileSettings.uploadedIcon);
      return profileSettings.uploadedIcon;
    }
    if (profileSettings.iconType === 'preset' && profileSettings.selectedPresetId) {
      const presetImage = DEFAULT_IMAGES.find(img => img.id === profileSettings.selectedPresetId);
      console.log('ローカルプリセットアイコン使用:', { presetId: profileSettings.selectedPresetId, url: presetImage?.url });
      return presetImage?.url;
    }
    
    console.log('アイコンが見つかりません - デフォルトアイコンを使用');
    return undefined;
  };

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
        src={getIconSrc()}
      >
        {!getIconSrc() && <AccountCircle sx={{ fontSize: '2.2rem' }} />}
      </Avatar>

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
          ログアウト確認
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
          ログアウトしますか？
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
          <Button
            onClick={handleDialogClose}
            variant="outlined"
            sx={{ minWidth: 80 }}
          >
            NO
          </Button>
          <Button
            onClick={handleLogout}
            variant="contained"
            color="error"
            sx={{ minWidth: 80 }}
          >
            YES
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
