import React from 'react';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Typography,
  Avatar,
} from '@mui/material';
import {
  Home,
  Notifications,
  Message,
  Person,
  Edit,
  ArrowBack,
  People,
  AccountCircle,
} from '@mui/icons-material';
import { useRecoilValue } from 'recoil';
import { profileSettingsState, serverProfileState } from '../../recoil/profileSettingsAtom';
import { DEFAULT_IMAGES } from '../../image/DefaultImage';

interface LeftSidebarProps {
  onBack?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateToExercise?: () => void;
  onNavigateToFoodLog?: () => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ 
  onBack, 
  onNavigateToProfile,
  onNavigateToExercise, 
  onNavigateToFoodLog 
}) => {
  // Recoilからプロフィール情報を取得
  const profileSettings = useRecoilValue(profileSettingsState);
  const serverProfile = useRecoilValue(serverProfileState);

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

  const leftMenuItems = [
    { icon: <Home />, label: 'ホーム', active: true, onClick: undefined },
    { icon: <People />, label: 'フォローTL', active: false, onClick: undefined },
    { icon: <Notifications />, label: '通知', active: false, onClick: undefined },
    { icon: <Message />, label: 'メッセージ', active: false, onClick: undefined },
    { icon: <Person />, label: 'プロフィール', active: false, onClick: onNavigateToProfile },
  ];

  // 新しく追加するメニューアイテム
  const additionalMenuItems = [
    { icon: <span style={{ fontSize: '24px' }}>💪</span>, label: '今日の運動', active: false, onClick: onNavigateToExercise },
    { icon: <span style={{ fontSize: '24px' }}>🍽️</span>, label: '食事を記録', active: false, onClick: onNavigateToFoodLog },
  ];

  return (
    <Box sx={{ p: 2, position: 'sticky', top: 0, minHeight: '100vh' }}>
      {/* 戻るボタン */}
      {onBack && (
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={onBack}
          fullWidth
          sx={{ 
            mb: 2, 
            borderRadius: 3, 
            py: 1,
            fontSize: '0.9rem',
            borderColor: '#29b6f6',
            color: '#29b6f6',
            '&:hover': {
              borderColor: '#0288d1',
              backgroundColor: 'rgba(41, 182, 246, 0.08)'
            }
          }}
        >
          ダッシュボードに戻る
        </Button>
      )}
      <List sx={{ p: 0 }}>
        {leftMenuItems.map((item, index) => (
          <ListItem
            key={index}
            button
            onClick={item.onClick}
            sx={{
              borderRadius: 3,
              mb: 1,
              px: 2,
              py: 1.5,
              backgroundColor: item.active ? 'rgba(41, 182, 246, 0.15)' : 'transparent',
              border: item.active ? '2px solid #29b6f6' : '2px solid transparent',
              transition: 'all 0.3s ease',
              cursor: item.onClick ? 'pointer' : 'default',
              '&:hover': { 
                backgroundColor: 'rgba(41, 182, 246, 0.1)',
                transform: item.onClick ? 'translateX(6px)' : 'none',
                boxShadow: item.onClick ? '0 3px 8px rgba(41, 182, 246, 0.3)' : 'none'
              },
            }}
          >
            <ListItemIcon sx={{ 
              color: item.active ? '#0288d1' : '#757575',
              minWidth: '36px'
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              sx={{ 
                color: item.active ? '#0288d1' : '#424242',
                '& .MuiTypography-root': {
                  fontWeight: item.active ? 600 : 400,
                  fontSize: '1rem'
                }
              }}
            />
          </ListItem>
        ))}
        
        {/* 新しく追加するメニューアイテム */}
        {additionalMenuItems.map((item, index) => (
          <ListItem
            key={`additional-${index}`}
            button
            onClick={item.onClick}
            sx={{
              borderRadius: 3,
              mb: 1,
              px: 2,
              py: 1.5,
              backgroundColor: item.active ? 'rgba(76, 175, 80, 0.15)' : 'transparent',
              border: item.active ? '2px solid #4CAF50' : '2px solid transparent',
              transition: 'all 0.3s ease',
              cursor: item.onClick ? 'pointer' : 'default',
              '&:hover': { 
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                transform: item.onClick ? 'translateX(6px)' : 'none',
                boxShadow: item.onClick ? '0 3px 8px rgba(76, 175, 80, 0.3)' : 'none'
              },
            }}
          >
            <ListItemIcon sx={{ 
              color: item.active ? '#4CAF50' : '#757575',
              minWidth: '36px'
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              sx={{ 
                color: item.active ? '#4CAF50' : '#424242',
                '& .MuiTypography-root': {
                  fontWeight: item.active ? 600 : 400,
                  fontSize: '1rem'
                }
              }}
            />
          </ListItem>
        ))}
        <Button
          variant="contained"
          startIcon={<Edit />}
          fullWidth
          sx={{ 
            mt: 2, 
            borderRadius: 3, 
            py: 1.5,
            px: 2,
            background: 'linear-gradient(45deg, #29b6f6 30%, #42a5f5 90%)',
            boxShadow: '0 4px 16px rgba(41, 182, 246, 0.4)',
            fontSize: '1rem',
            fontWeight: 600,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(45deg, #0288d1 30%, #1976d2 90%)',
              boxShadow: '0 6px 20px rgba(41, 182, 246, 0.6)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          ポストする
        </Button>
      </List>
      
      {/* ユーザーカード */}
      <Card sx={{ 
        mt: 2,
        borderRadius: 4,
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.8)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.15), 0 6px 12px rgba(0, 0, 0, 0.1)'
        }
      }}>
        <CardContent sx={{ 
          p: 2,
          '&:last-child': { pb: 2 }
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 1.5
          }}>
            <Avatar 
              src={getIconSrc()}
              sx={{ 
                width: 48, 
                height: 48,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontSize: '1.3rem',
                fontWeight: 'bold',
                boxShadow: '0 3px 10px rgba(102, 126, 234, 0.4)',
                border: '2px solid rgba(255, 255, 255, 0.8)'
              }}
            >
              {!getIconSrc() && <AccountCircle sx={{ fontSize: '1.8rem' }} />}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ 
                fontWeight: 'bold',
                color: '#2c3e50',
                fontSize: '1rem',
                mb: 0.3
              }}>
                {getDisplayName()}
              </Typography>
              <Typography variant="body2" sx={{ 
                color: '#6c757d',
                fontSize: '0.8rem'
              }}>
                {getUserId()}
              </Typography>
              <Box sx={{ 
                mt: 1,
                display: 'flex',
                gap: 1.5
              }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ 
                    color: '#495057',
                    fontWeight: 600,
                    display: 'block',
                    fontSize: '0.7rem'
                  }}>
                    フォロー
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    color: '#29b6f6',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}>
                    128
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ 
                    color: '#495057',
                    fontWeight: 600,
                    display: 'block',
                    fontSize: '0.7rem'
                  }}>
                    フォロワー
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    color: '#4CAF50',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}>
                    256
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LeftSidebar;
