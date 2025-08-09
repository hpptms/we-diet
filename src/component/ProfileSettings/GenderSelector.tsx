import React from 'react';
import { Box, Typography, Button, FormControlLabel, Checkbox, useTheme, useMediaQuery } from '@mui/material';
import { GenderType } from '../../recoil/profileSettingsAtom';
import { useTranslation } from '../../hooks/useTranslation';

interface GenderSelectorProps {
  gender: GenderType;
  isGenderPrivate: boolean;
  onGenderChange: (gender: GenderType) => void;
  onPrivacyChange: (isPrivate: boolean) => void;
  isDarkMode?: boolean;
}

const GenderSelector: React.FC<GenderSelectorProps> = ({
  gender,
  isGenderPrivate,
  onGenderChange,
  onPrivacyChange,
  isDarkMode = false,
}) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm')); // 600px以下
  const { t } = useTranslation();

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, color: isDarkMode ? '#ffffff' : 'inherit' }}>
        {t('profile', 'gender')}
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isSmallScreen ? 'column' : 'row',
        alignItems: isSmallScreen ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        gap: isSmallScreen ? 2 : 0
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant={gender === 'female' ? 'contained' : 'outlined'}
              onClick={() => onGenderChange('female')}
              sx={{
                minWidth: 80,
                backgroundColor: gender === 'female' ? '#e91e63' : 'transparent',
                color: gender === 'female' ? '#fff' : '#e91e63',
                borderColor: '#e91e63',
                '&:hover': {
                  backgroundColor: gender === 'female' ? '#d81b60' : '#f8bbd0',
                  color: '#fff',
                  borderColor: '#e91e63'
                }
              }}
            >
              {t('profile', 'female')}
            </Button>
            <Button
              variant={gender === 'male' ? 'contained' : 'outlined'}
              onClick={() => onGenderChange('male')}
              sx={{
                minWidth: 80,
                backgroundColor: gender === 'male' ? '#1976d2' : 'transparent',
                color: gender === 'male' ? '#fff' : '#1976d2',
                borderColor: '#1976d2',
                '&:hover': {
                  backgroundColor: gender === 'male' ? '#1565c0' : '#bbdefb',
                  color: '#fff',
                  borderColor: '#1976d2'
                }
              }}
            >
              {t('profile', 'male')}
            </Button>
            <Button
              variant={gender === 'secret' ? 'contained' : 'outlined'}
              color="success"
              onClick={() => onGenderChange('secret')}
              sx={{
                minWidth: 80,
                fontWeight: 'bold',
                backgroundColor: gender === 'secret' ? '#43a047' : 'transparent',
                color: gender === 'secret' ? '#fff' : '#43a047',
                borderColor: '#43a047',
                '&:hover': {
                  backgroundColor: gender === 'secret' ? '#388e3c' : '#c8e6c9',
                  color: '#fff',
                  borderColor: '#43a047'
                }
              }}
            >
              {t('profile', 'other')}
            </Button>
        </Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={isGenderPrivate}
              onChange={(e) => onPrivacyChange(e.target.checked)}
              sx={{
                color: isDarkMode ? '#ffffff' : 'inherit',
                '&.Mui-checked': {
                  color: isDarkMode ? '#ffffff' : 'inherit',
                },
              }}
            />
          }
          label={t('profile', 'private')}
          sx={{ 
            ml: isSmallScreen ? 0 : 2,
            '& .MuiFormControlLabel-label': {
              color: isDarkMode ? '#ffffff' : 'inherit',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default GenderSelector;
