import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Save } from '@mui/icons-material';

interface ActionButtonsProps {
  onSave: () => void;
  onBack: () => void;
  loading?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSave,
  onBack,
  loading = false,
}) => {
  return (
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
      <Box
        component="button"
        onClick={onSave}
        disabled={loading}
        sx={{
          flex: 1,
          maxWidth: 200,
          py: 2,
          px: 3,
          borderRadius: 3,
          border: 'none',
          background: loading 
            ? 'linear-gradient(135deg, #ccc 0%, #999 100%)'
            : 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '1rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          boxShadow: loading 
            ? 'none'
            : '0 4px 15px rgba(76, 175, 80, 0.3)',
          '&:hover': {
            background: loading 
              ? 'linear-gradient(135deg, #ccc 0%, #999 100%)'
              : 'linear-gradient(135deg, #8BC34A 0%, #4CAF50 100%)',
            transform: loading ? 'none' : 'translateY(-2px)',
            boxShadow: loading 
              ? 'none'
              : '0 6px 20px rgba(76, 175, 80, 0.4)',
          },
          '&:active': {
            transform: loading ? 'none' : 'translateY(0)',
          },
        }}
      >
        {loading ? (
          <>
            <CircularProgress size={20} color="inherit" />
            保存中...
          </>
        ) : (
          <>
            <Save sx={{ fontSize: 20 }} />
            保存
          </>
        )}
      </Box>
      <Box
        component="button"
        onClick={onBack}
        sx={{
          flex: 1,
          maxWidth: 200,
          py: 2,
          px: 3,
          borderRadius: 3,
          border: '2px solid #6c757d',
          backgroundColor: 'white',
          color: '#6c757d',
          fontWeight: 'bold',
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          '&:hover': {
            backgroundColor: '#6c757d',
            color: 'white',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(108, 117, 125, 0.3)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        }}
      >
        ← 戻る
      </Box>
    </Box>
  );
};

export default ActionButtons;
