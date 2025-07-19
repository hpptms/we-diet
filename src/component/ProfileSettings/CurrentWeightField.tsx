import React from 'react';
import { Box, TextField, Typography, FormControlLabel, Checkbox } from '@mui/material';

interface CurrentWeightFieldProps {
  currentWeight: string;
  isCurrentWeightPrivate: boolean;
  onCurrentWeightChange: (currentWeight: string) => void;
  onPrivacyChange: (isPrivate: boolean) => void;
}

const CurrentWeightField: React.FC<CurrentWeightFieldProps> = ({
  currentWeight,
  isCurrentWeightPrivate,
  onCurrentWeightChange,
  onPrivacyChange,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          label="現在の体重"
          type="number"
          value={currentWeight}
          onChange={(e) => onCurrentWeightChange(e.target.value)}
          sx={{ flex: 1 }}
          InputProps={{
            endAdornment: <Typography variant="body2">kg</Typography>
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isCurrentWeightPrivate}
              onChange={(e) => onPrivacyChange(e.target.checked)}
            />
          }
          label="非公開"
        />
      </Box>
    </Box>
  );
};

export default CurrentWeightField;
