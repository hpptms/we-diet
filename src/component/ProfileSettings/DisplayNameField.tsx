import React from 'react';
import { Box, TextField } from '@mui/material';

interface DisplayNameFieldProps {
  displayName: string;
  onChange: (displayName: string) => void;
}

const DisplayNameField: React.FC<DisplayNameFieldProps> = ({
  displayName,
  onChange,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <TextField
        fullWidth
        label="表示名"
        value={displayName}
        onChange={(e) => onChange(e.target.value)}
        variant="outlined"
      />
    </Box>
  );
};

export default DisplayNameField;
