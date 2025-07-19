import React from 'react';
import { Box, TextField } from '@mui/material';

interface PRTextFieldProps {
  prText: string;
  onPRTextChange: (prText: string) => void;
}

const PRTextField: React.FC<PRTextFieldProps> = ({
  prText,
  onPRTextChange,
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
      />
    </Box>
  );
};

export default PRTextField;
