import React from 'react';
import { Box, TextField, Typography, FormControlLabel, Checkbox } from '@mui/material';
import { useTranslation } from '../../hooks/useTranslation';

interface HeightFieldProps {
  height: string;
  isHeightPrivate: boolean;
  onHeightChange: (height: string) => void;
  onPrivacyChange: (isPrivate: boolean) => void;
  isDarkMode?: boolean;
}

const HeightField: React.FC<HeightFieldProps> = ({
  height,
  isHeightPrivate,
  onHeightChange,
  onPrivacyChange,
  isDarkMode = false,
}) => {
  const { t } = useTranslation();
  
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          label={t('profile', 'height')}
          placeholder={t('profile', 'heightPlaceholder')}
          type="number"
          value={height}
          onChange={(e) => onHeightChange(e.target.value)}
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
          InputProps={{
            endAdornment: <Typography variant="body2" sx={{ color: isDarkMode ? '#ffffff' : 'inherit' }}>cm</Typography>
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isHeightPrivate}
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

export default HeightField;
