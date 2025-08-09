import React from 'react';
import { Box, TextField, FormControlLabel, Checkbox } from '@mui/material';
import { useTranslation } from '../../hooks/useTranslation';

interface ActivityLevelFieldProps {
  activityLevel: string;
  isActivityPrivate: boolean;
  onActivityLevelChange: (activityLevel: string) => void;
  onPrivacyChange: (isPrivate: boolean) => void;
  isDarkMode?: boolean;
}

const ActivityLevelField: React.FC<ActivityLevelFieldProps> = ({
  activityLevel,
  isActivityPrivate,
  onActivityLevelChange,
  onPrivacyChange,
  isDarkMode = false,
}) => {
  const { t } = useTranslation();
  
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          label={t('profile', 'activityLevel')}
          placeholder={t('profile', 'activityLevelPlaceholder')}
          type="text"
          value={activityLevel}
          onChange={(e) => {
            if (e.target.value.length <= 150) onActivityLevelChange(e.target.value);
          }}
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
            '& .MuiFormHelperText-root': {
              color: isDarkMode ? '#ffffff' : undefined,
            },
          }}
          inputProps={{ maxLength: 150 }}
          helperText={`${activityLevel.length}/150`}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isActivityPrivate}
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

export default ActivityLevelField;
