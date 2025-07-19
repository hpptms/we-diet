import React from 'react';
import { Box, TextField, FormControlLabel, Checkbox } from '@mui/material';

interface ActivityLevelFieldProps {
  activityLevel: string;
  isActivityPrivate: boolean;
  onActivityLevelChange: (activityLevel: string) => void;
  onPrivacyChange: (isPrivate: boolean) => void;
}

const ActivityLevelField: React.FC<ActivityLevelFieldProps> = ({
  activityLevel,
  isActivityPrivate,
  onActivityLevelChange,
  onPrivacyChange,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          label="活動範囲"
          type="text"
          value={activityLevel}
          onChange={(e) => {
            if (e.target.value.length <= 150) onActivityLevelChange(e.target.value);
          }}
          sx={{ flex: 1 }}
          inputProps={{ maxLength: 150 }}
          helperText={`${activityLevel.length}/150`}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isActivityPrivate}
              onChange={(e) => onPrivacyChange(e.target.checked)}
            />
          }
          label="非公開"
        />
      </Box>
    </Box>
  );
};

export default ActivityLevelField;
