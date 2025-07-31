import React from 'react';
import { Box, TextField, Typography, FormControlLabel, Checkbox } from '@mui/material';

interface TargetWeightFieldProps {
  targetWeight: string;
  isTargetWeightPrivate: boolean;
  onTargetWeightChange: (targetWeight: string) => void;
  onPrivacyChange: (isPrivate: boolean) => void;
  isDarkMode?: boolean;
}

const TargetWeightField: React.FC<TargetWeightFieldProps> = ({
  targetWeight,
  isTargetWeightPrivate,
  onTargetWeightChange,
  onPrivacyChange,
  isDarkMode = false,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          label="目標体重"
          type="number"
          value={targetWeight}
          onChange={(e) => onTargetWeightChange(e.target.value)}
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
            endAdornment: <Typography variant="body2" sx={{ color: isDarkMode ? '#ffffff' : 'inherit' }}>kg</Typography>
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isTargetWeightPrivate}
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
            '& .MuiFormControlLabel-label': {
              color: isDarkMode ? '#ffffff' : 'inherit',
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default TargetWeightField;
