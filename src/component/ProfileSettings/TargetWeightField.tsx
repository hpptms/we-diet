import React from 'react';
import { Box, TextField, Typography, FormControlLabel, Checkbox } from '@mui/material';

interface TargetWeightFieldProps {
  targetWeight: string;
  isTargetWeightPrivate: boolean;
  onTargetWeightChange: (targetWeight: string) => void;
  onPrivacyChange: (isPrivate: boolean) => void;
}

const TargetWeightField: React.FC<TargetWeightFieldProps> = ({
  targetWeight,
  isTargetWeightPrivate,
  onTargetWeightChange,
  onPrivacyChange,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          label="目標体重"
          type="number"
          value={targetWeight}
          onChange={(e) => onTargetWeightChange(e.target.value)}
          sx={{ flex: 1 }}
          InputProps={{
            endAdornment: <Typography variant="body2">kg</Typography>
          }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isTargetWeightPrivate}
              onChange={(e) => onPrivacyChange(e.target.checked)}
            />
          }
          label="非公開"
        />
      </Box>
    </Box>
  );
};

export default TargetWeightField;
