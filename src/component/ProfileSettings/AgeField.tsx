import React from 'react';
import { Box, TextField, Typography, FormControlLabel, Checkbox } from '@mui/material';
import { useTranslation } from '../../hooks/useTranslation';

interface AgeFieldProps {
  age: string;
  isAgePrivate: boolean;
  onAgeChange: (age: string) => void;
  onPrivacyChange: (isPrivate: boolean) => void;
  isDarkMode?: boolean;
}

const AgeField: React.FC<AgeFieldProps> = ({
  age,
  isAgePrivate,
  onAgeChange,
  onPrivacyChange,
  isDarkMode = false,
}) => {
  const { t } = useTranslation();
  
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          label={t('profile', 'age')}
          placeholder={t('profile', 'agePlaceholder')}
          type="number"
          value={age}
          onChange={(e) => onAgeChange(e.target.value)}
          sx={{ 
            flex: 1,
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: isDarkMode ? '#ffffff' : undefined,
              },
              '&:hover fieldset': {
                borderColor: isDarkMode ? '#ffffff' : undefined,
              },
              '&.Mui-focused fieldset': {
                borderColor: isDarkMode ? '#ffffff' : undefined,
              },
              color: isDarkMode ? '#ffffff' : undefined,
            },
            '& .MuiInputLabel-root': {
              color: isDarkMode ? '#ffffff' : undefined,
              '&.Mui-focused': {
                color: isDarkMode ? '#ffffff' : undefined,
              },
            },
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isAgePrivate}
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
            '& .MuiFormControlLabel-label': {
              color: isDarkMode ? '#ffffff' : 'inherit',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default AgeField;
