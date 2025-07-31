import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Save } from '@mui/icons-material';

interface ActionButtonsProps {
  onSave: () => void;
  onBack: () => void;
  loading?: boolean;
  isDarkMode?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSave,
  onBack,
  loading = false,
  isDarkMode = false,
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
          border: isDarkMode ? '2px solid white' : 'none',
          background: loading 
            ? (isDarkMode ? '#000000' : 'linear-gradient(135deg, #ccc 0%, #999 100%)')
            : (isDarkMode ? '#000000' : 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)'),
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
            : (isDarkMode ? 'none' : '0 4px 15px rgba(76, 175, 80, 0.3)'),
          '&:hover': {
            background: loading 
              ? (isDarkMode ? '#000000' : 'linear-gradient(135deg, #ccc 0%, #999 100%)')
              : (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(135deg, #8BC34A 0%, #4CAF50 100%)'),
            transform: loading ? 'none' : 'translateY(-2px)',
            boxShadow: loading 
              ? 'none'
              : (isDarkMode ? 'none' : '0 6px 20px rgba(76, 175, 80, 0.4)'),
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
          border: isDarkMode ? '2px solid white' : '2px solid #6c757d',
          backgroundColor: isDarkMode ? '#000000' : 'white',
          color: isDarkMode ? 'white' : '#6c757d',
          fontWeight: 'bold',
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
          '&:hover': {
            backgroundColor: isDarkMode ? 'white' : '#6c757d',
            color: isDarkMode ? '#000000' : 'white',
            transform: 'translateY(-2px)',
            boxShadow: isDarkMode ? '0 6px 20px rgba(255, 255, 255, 0.3)' : '0 6px 20px rgba(108, 117, 125, 0.3)',
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
