import React from 'react';
import { Box, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface ActionButtonsProps {
  onSave: () => void;
  onBack: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSave,
  onBack,
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', pb: 2 }}>
      <Button
        variant="contained"
        onClick={onSave}
        sx={{ 
          minWidth: 150,
          py: 2,
          fontSize: '1.1rem',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
          boxShadow: '0 4px 20px 0 rgba(76, 175, 80, 0.3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #388E3C 30%, #689F38 90%)',
            transform: 'translateY(-2px)',
          }
        }}
      >
        🎯 保存
      </Button>
      <Button
        variant="contained"
        onClick={onBack}
        startIcon={<ArrowBackIcon />}
        sx={{ 
          minWidth: 150,
          py: 2,
          fontSize: '1.1rem',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #757575 30%, #9E9E9E 90%)',
          color: 'white',
          boxShadow: '0 4px 20px 0 rgba(117, 117, 117, 0.3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #616161 30%, #757575 90%)',
            transform: 'translateY(-2px)',
          }
        }}
      >
        戻る
      </Button>
    </Box>
  );
};

export default ActionButtons;
