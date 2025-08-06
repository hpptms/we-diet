import React from 'react';
import { Box, Typography, Button } from '@mui/material';

interface MobileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  isDarkMode: boolean;
  side: 'left' | 'right';
}

const MobileOverlay: React.FC<MobileOverlayProps> = ({
  isOpen,
  onClose,
  title,
  children,
  isDarkMode,
  side
}) => {
  if (!isOpen) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1300,
        display: { xs: 'block', md: 'none' }
      }}
    >
      {/* Backdrop */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          animation: 'fadeIn 0.3s ease-out'
        }}
        onClick={onClose}
      />
      
      {/* Sidebar Content */}
      <Box
        sx={{
          position: 'absolute',
          [side]: 0,
          top: 0,
          bottom: 0,
          width: side === 'left' ? '280px' : '300px',
          backgroundColor: isDarkMode ? '#1a1a1a' : 'white',
          boxShadow: side === 'left' ? '2px 0 10px rgba(0, 0, 0, 0.1)' : '-2px 0 10px rgba(0, 0, 0, 0.1)',
          animation: side === 'left' ? 'slideInLeft 0.3s ease-out' : 'slideInRight 0.3s ease-out',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: `1px solid ${isDarkMode ? '#333' : '#e0e0e0'}`
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: isDarkMode ? '#ffffff' : '#333333',
              fontWeight: 'bold'
            }}
          >
            {title}
          </Typography>
          <Button
            onClick={onClose}
            sx={{
              minWidth: 'auto',
              p: 1,
              color: isDarkMode ? '#ffffff' : '#333333'
            }}
          >
            ✕
          </Button>
        </Box>
        
        {/* Content */}
        {children}
      </Box>
    </Box>
  );
};

interface MobileOverlaysProps {
  showLeftSidebar: boolean;
  showRightSidebar: boolean;
  onCloseLeftSidebar: () => void;
  onCloseRightSidebar: () => void;
  isDarkMode: boolean;
  leftSidebarContent: React.ReactNode;
  rightSidebarContent: React.ReactNode;
}

const MobileOverlays: React.FC<MobileOverlaysProps> = ({
  showLeftSidebar,
  showRightSidebar,
  onCloseLeftSidebar,
  onCloseRightSidebar,
  isDarkMode,
  leftSidebarContent,
  rightSidebarContent
}) => {
  return (
    <>
      {/* Left Sidebar Overlay */}
      <MobileOverlay
        isOpen={showLeftSidebar}
        onClose={onCloseLeftSidebar}
        title="メニュー"
        isDarkMode={isDarkMode}
        side="left"
      >
        {leftSidebarContent}
      </MobileOverlay>

      {/* Right Sidebar Overlay */}
      <MobileOverlay
        isOpen={showRightSidebar}
        onClose={onCloseRightSidebar}
        title="検索・おすすめ"
        isDarkMode={isDarkMode}
        side="right"
      >
        <Box sx={{ p: 2 }}>
          {rightSidebarContent}
        </Box>
      </MobileOverlay>
    </>
  );
};

export default MobileOverlays;
