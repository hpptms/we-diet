import React from 'react';
import { Box, TextField } from '@mui/material';

interface DisplayNameFieldProps {
  displayName: string;
  onChange: (displayName: string) => void;
  isDarkMode?: boolean;
}

const DisplayNameField: React.FC<DisplayNameFieldProps> = ({
  displayName,
  onChange,
  isDarkMode = false,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        label="表示名"
        value={displayName}
        onChange={(e) => onChange(e.target.value)}
        variant="outlined"
        sx={{
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
    </Box>
  );
};

export default DisplayNameField;
