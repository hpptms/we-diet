import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  Typography,
  Box,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import { Close, Person, Cake, Height, FitnessCenter, MonitorWeight, Flag } from '@mui/icons-material';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../../recoil/darkModeAtom';
import { UserProfile } from '../../../api/postsApi';
import { DEFAULT_IMAGES } from '../../../image/DefaultImage';
import { useTranslation } from '../../../hooks/useTranslation';

interface UserProfileModalProps {
  open: boolean;
  onClose: () => void;
  profile: UserProfile | null;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ open, onClose, profile }) => {
  const isDarkMode = useRecoilValue(darkModeState);
  const { t } = useTranslation();

  if (!profile) return null;

  // プロフィール画像の取得
  const getProfileImage = () => {
    if (profile.IconType === 'upload' && profile.UploadedIcon) {
      return profile.UploadedIcon;
    }
    if (profile.IconType === 'preset' && profile.SelectedPresetID) {
      const presetImage = DEFAULT_IMAGES.find(img => img.id === profile.SelectedPresetID);
      return presetImage?.url;
    }
    return undefined;
  };

  // 性別表示の取得
  const getGenderDisplay = () => {
    if (profile.IsGenderPrivate) return null;
    switch (profile.Gender) {
      case 'male': return t('profile', 'male', {}, '男性');
      case 'female': return t('profile', 'female', {}, '女性');
      case 'secret': return t('profile', 'private', {}, '非公開');
      default: return profile.Gender;
    }
  };

  // BMI計算
  const calculateBMI = () => {
    if (profile.IsHeightPrivate || profile.IsCurrentWeightPrivate || !profile.Height || !profile.CurrentWeight) {
      return null;
    }
    const heightInM = profile.Height / 100;
    const bmi = profile.CurrentWeight / (heightInM * heightInM);
    return bmi.toFixed(1);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: isDarkMode ? '#1a1a1a' : 'white',
          color: isDarkMode ? 'white' : 'black',
          borderRadius: 2,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 2,
        borderBottom: `1px solid ${isDarkMode ? '#333' : '#e0e0e0'}`
      }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {t('profile', 'profileTitle', {}, 'プロフィール')}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: isDarkMode ? 'white' : 'black' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {/* プロフィール画像と基本情報 */}
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Avatar
            src={getProfileImage()}
            alt={profile.DisplayName}
            sx={{
              width: 100,
              height: 100,
              mb: 2,
              fontSize: '2rem',
              fontWeight: 'bold',
              bgcolor: 'linear-gradient(45deg, #42a5f5 30%, #29b6f6 90%)',
              boxShadow: '0 4px 16px rgba(66, 165, 245, 0.3)'
            }}
          >
            {profile.DisplayName ? profile.DisplayName.charAt(0).toUpperCase() : 'U'}
          </Avatar>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
            {profile.DisplayName || t('profile', 'user', {}, 'ユーザー')}
          </Typography>
          {profile.PrText && (
            <Typography
              variant="body2"
              sx={{
                color: isDarkMode ? '#b0b0b0' : '#666',
                textAlign: 'center',
                fontStyle: 'italic',
                mb: 2
              }}
            >
              "{profile.PrText}"
            </Typography>
          )}
        </Box>

        <Divider sx={{ mb: 3, borderColor: isDarkMode ? '#333' : '#e0e0e0' }} />

        {/* プロフィール詳細情報 */}
        <Box display="flex" flexDirection="column" gap={2}>
          {/* 性別 */}
          {getGenderDisplay() && (
            <Box display="flex" alignItems="center" gap={2}>
              <Person sx={{ color: '#29b6f6' }} />
              <Box>
                <Typography variant="body2" sx={{ color: isDarkMode ? '#b0b0b0' : '#666' }}>
                  {t('profile', 'gender', {}, '性別')}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {getGenderDisplay()}
                </Typography>
              </Box>
            </Box>
          )}

          {/* 年齢 */}
          {!profile.IsAgePrivate && profile.Age && (
            <Box display="flex" alignItems="center" gap={2}>
              <Cake sx={{ color: '#29b6f6' }} />
              <Box>
                <Typography variant="body2" sx={{ color: isDarkMode ? '#b0b0b0' : '#666' }}>
                  {t('profile', 'age', {}, '年齢')}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {t('profile', 'yearsOld', {age: String(profile.Age)}, `${profile.Age}歳`)}
                </Typography>
              </Box>
            </Box>
          )}

          {/* 身長 */}
          {!profile.IsHeightPrivate && profile.Height && (
            <Box display="flex" alignItems="center" gap={2}>
              <Height sx={{ color: '#29b6f6' }} />
              <Box>
                <Typography variant="body2" sx={{ color: isDarkMode ? '#b0b0b0' : '#666' }}>
                  {t('profile', 'height', {}, '身長')}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {profile.Height}cm
                </Typography>
              </Box>
            </Box>
          )}

          {/* 現在の体重 */}
          {!profile.IsCurrentWeightPrivate && profile.CurrentWeight && (
            <Box display="flex" alignItems="center" gap={2}>
              <MonitorWeight sx={{ color: '#29b6f6' }} />
              <Box>
                <Typography variant="body2" sx={{ color: isDarkMode ? '#b0b0b0' : '#666' }}>
                  {t('profile', 'currentWeight', {}, '現在の体重')}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {profile.CurrentWeight}kg
                </Typography>
              </Box>
            </Box>
          )}

          {/* 目標体重 */}
          {!profile.IsTargetWeightPrivate && profile.TargetWeight && (
            <Box display="flex" alignItems="center" gap={2}>
              <Flag sx={{ color: '#29b6f6' }} />
              <Box>
                <Typography variant="body2" sx={{ color: isDarkMode ? '#b0b0b0' : '#666' }}>
                  {t('profile', 'targetWeight', {}, '目標体重')}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {profile.TargetWeight}kg
                </Typography>
              </Box>
            </Box>
          )}

          {/* アクティビティレベル */}
          {!profile.IsActivityPrivate && profile.ActivityLevel && (
            <Box display="flex" alignItems="center" gap={2}>
              <FitnessCenter sx={{ color: '#29b6f6' }} />
              <Box>
                <Typography variant="body2" sx={{ color: isDarkMode ? '#b0b0b0' : '#666' }}>
                  {t('profile', 'activityLevel', {}, 'アクティビティレベル')}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {profile.ActivityLevel}
                </Typography>
              </Box>
            </Box>
          )}

          {/* BMI表示 */}
          {calculateBMI() && (
            <Box display="flex" alignItems="center" gap={2}>
              <Box sx={{ 
                width: 24, 
                height: 24, 
                borderRadius: '50%', 
                bgcolor: '#29b6f6', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <Typography variant="caption" sx={{ color: 'white', fontSize: '0.7rem', fontWeight: 'bold' }}>
                  BMI
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: isDarkMode ? '#b0b0b0' : '#666' }}>
                  BMI
                </Typography>
                <Chip
                  label={calculateBMI()}
                  size="small"
                  sx={{
                    bgcolor: '#e3f2fd',
                    color: '#1976d2',
                    fontWeight: 600
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>

        {/* 登録日時 */}
        <Box mt={3} pt={2} sx={{ borderTop: `1px solid ${isDarkMode ? '#333' : '#e0e0e0'}` }}>
          <Typography variant="caption" sx={{ color: isDarkMode ? '#888' : '#999' }}>
            {t('profile', 'registrationDate', {}, '登録日')}: {new Date(profile.CreatedAt).toLocaleDateString()}
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
