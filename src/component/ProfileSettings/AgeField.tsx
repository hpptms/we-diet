import React from 'react';
import { Box, TextField, Typography, FormControlLabel, Checkbox } from '@mui/material';

interface AgeFieldProps {
  age: string;
  isAgePrivate: boolean;
  onAgeChange: (age: string) => void;
  onPrivacyChange: (isPrivate: boolean) => void;
}

const AgeField: React.FC<AgeFieldProps> = ({
  age,
  isAgePrivate,
  onAgeChange,
  onPrivacyChange,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          label="年齢"
          type="number"
          value={age}
          onChange={(e) => onAgeChange(e.target.value)}
          sx={{ flex: 1 }}
          InputProps={{
            endAdornment: <Typography variant="body2">歳</Typography>
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isAgePrivate}
              onChange={(e) => onPrivacyChange(e.target.checked)}
            />
          }
          label="非公開"
        />
      </Box>
    </Box>
  );
};

export default AgeField;
