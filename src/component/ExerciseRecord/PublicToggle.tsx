import React from 'react';
import { Paper, FormControlLabel, Checkbox, Box, Typography } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';

interface PublicToggleProps {
  isPublic: boolean;
  onChange: (isPublic: boolean) => void;
}

const PublicToggle: React.FC<PublicToggleProps> = ({
  isPublic,
  onChange,
}) => {
  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={isPublic}
            onChange={(e) => onChange(e.target.checked)}
            color="primary"
          />
        }
        label={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <GroupIcon />
            <Typography>dieterに投稿</Typography>
          </Box>
        }
      />
    </Paper>
  );
};

export default PublicToggle;
