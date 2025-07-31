import React from 'react';
import { Box, Typography, Button, FormControlLabel, Checkbox } from '@mui/material';
import { GenderType } from '../../recoil/profileSettingsAtom';

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
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ mr: 2, color: isDarkMode ? '#ffffff' : 'inherit' }}>
            性別
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
              女性
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
              男性
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
              秘密☆
            </Button>
          </Box>
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
          label="非公開"
          sx={{ 
            ml: 2,
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
