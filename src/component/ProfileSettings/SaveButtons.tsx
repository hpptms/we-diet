import React from 'react';
import { Box, Button, CircularProgress } from '@mui/material';

interface SaveButtonsProps {
  loading: boolean;
  onSave: () => void;
  onBack: () => void;
}

const SaveButtons: React.FC<SaveButtonsProps> = ({
  loading,
  onSave,
  onBack,
}) => {
  return (
    <Box sx={{ textAlign: 'center', mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
      <Button
        variant="contained"
        size="large"
        onClick={onSave}
        disabled={loading}
        sx={{
          px: 4,
          py: 1.5,
          fontSize: '1.1rem',
          borderRadius: 2
        }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'プロフィールを保存'}
      </Button>
      <Button
        variant="outlined"
        size="large"
        onClick={onBack}
        sx={{
          px: 4,
          py: 1.5,
          fontSize: '1.1rem',
          borderRadius: 2
        }}
      >
        戻る
      </Button>
    </Box>
  );
};

export default SaveButtons;
