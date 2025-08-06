import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface MobileHeaderProps {
  onBack?: () => void;
  title: string;
  isDarkMode: boolean;
  onShowLeftSidebar: () => void;
  onShowRightSidebar: () => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  onBack,
  title,
  isDarkMode,
  onShowLeftSidebar,
  onShowRightSidebar
}) => {
  return (
    <Box sx={{
      display: { xs: 'block', md: 'none' },
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      backgroundColor: isDarkMode ? '#000000' : 'white',
      borderBottom: `1px solid ${isDarkMode ? '#333' : '#e0e0e0'}`,
      p: 2
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Back Button */}
        {onBack && (
          <Button
            onClick={onBack}
            sx={{
              minWidth: 'auto',
              p: 1,
              color: isDarkMode ? '#ffffff' : '#333333',
              fontSize: '0.9rem'
            }}
          >
            ← ダッシュボード
          </Button>
        )}
        
        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            color: isDarkMode ? '#ffffff' : '#333333',
            fontWeight: 'bold'
          }}
        >
          {title}
        </Typography>
        
        {/* Sidebar Buttons */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Left Menu Button */}
          <Button
            onClick={onShowLeftSidebar}
            sx={{
              minWidth: 'auto',
              p: 1,
              backgroundColor: '#4fc3f7',
              color: 'white',
              borderRadius: 2,
              fontSize: '0.8rem',
              '&:hover': {
                backgroundColor: '#29b6f6',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            メニュー
          </Button>
          
          {/* Right Search Button */}
          <Button
            onClick={onShowRightSidebar}
            sx={{
              minWidth: 'auto',
              p: 1,
              backgroundColor: '#1976d2',
              color: 'white',
              borderRadius: 2,
              fontSize: '0.8rem',
              '&:hover': {
                backgroundColor: '#1565c0',
                transform: 'scale(1.05)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            検索
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MobileHeader;
