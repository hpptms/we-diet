import React from 'react';
import { Box, TextField, Typography, FormControlLabel, Checkbox } from '@mui/material';

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
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          label="年齢"
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
          InputProps={{
            endAdornment: <Typography variant="body2" sx={{ color: isDarkMode ? '#ffffff' : 'inherit' }}>歳</Typography>
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

export default AgeField;
