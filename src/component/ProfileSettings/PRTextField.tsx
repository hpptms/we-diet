import React from 'react';
import { Box, TextField } from '@mui/material';

interface PRTextFieldProps {
  prText: string;
  onPRTextChange: (prText: string) => void;
  isDarkMode?: boolean;
}

const PRTextField: React.FC<PRTextFieldProps> = ({
  prText,
  onPRTextChange,
  isDarkMode = false,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        label="自己PR"
        type="text"
        value={prText}
        onChange={(e) => {
          if (e.target.value.length <= 300) onPRTextChange(e.target.value);
        }}
        fullWidth
        multiline
        minRows={3}
        maxRows={6}
        inputProps={{ maxLength: 300 }}
        helperText={`${prText.length}/300`}
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
          '& .MuiFormHelperText-root': {
            color: isDarkMode ? '#ffffff' : undefined,
          },
        }}
      />
    </Box>
  );
};

export default PRTextField;
