import React from 'react';
import { Box, TextField, Typography, FormControlLabel, Checkbox } from '@mui/material';

interface HeightFieldProps {
  height: string;
  isHeightPrivate: boolean;
  onHeightChange: (height: string) => void;
  onPrivacyChange: (isPrivate: boolean) => void;
}

const HeightField: React.FC<HeightFieldProps> = ({
  height,
  isHeightPrivate,
  onHeightChange,
  onPrivacyChange,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          label="身長"
          type="number"
          value={height}
          onChange={(e) => onHeightChange(e.target.value)}
          sx={{ flex: 1 }}
          InputProps={{
            endAdornment: <Typography variant="body2">cm</Typography>
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isHeightPrivate}
              onChange={(e) => onPrivacyChange(e.target.checked)}
            />
          }
          label="非公開"
        />
      </Box>
    </Box>
  );
};

export default HeightField;
