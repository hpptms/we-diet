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
      display: { xs: 'flex', lg: 'none' },
      position: 'sticky',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1100,
      backgroundColor: isDarkMode ? '#000000' : 'white',
      borderBottom: `1px solid ${isDarkMode ? '#333' : '#e0e0e0'}`,
      py: 1,
      px: 1.5,
      boxShadow: isDarkMode
        ? '0 2px 8px rgba(0, 0, 0, 0.5)'
        : '0 2px 8px rgba(0, 0, 0, 0.1)',
      // iOS Safari の自動ヘッダー隠し機能を無効化
      WebkitTransform: 'translateZ(0)',
      transform: 'translateZ(0)',
      // ハードウェアアクセラレーションを強制
      willChange: 'transform',
      // 3D変換コンテキストを作成
      transformStyle: 'preserve-3d',
      // セーフエリア対応
      paddingTop: 'max(8px, env(safe-area-inset-top))'
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        gap: 1
      }}>
        {/* Left Menu Button */}
        <Button
          onClick={onShowLeftSidebar}
          sx={{
            minWidth: 'auto',
            minHeight: 40,
            px: 1.5,
            py: 0.5,
            backgroundColor: isDarkMode ? 'rgba(41, 182, 246, 0.2)' : '#e3f2fd',
            color: isDarkMode ? '#29b6f6' : '#1976d2',
            borderRadius: 2,
            fontSize: { xs: '0.75rem', sm: '0.85rem' },
            fontWeight: 600,
            border: `1px solid ${isDarkMode ? '#29b6f6' : '#90caf9'}`,
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(41, 182, 246, 0.3)' : '#bbdefb',
              transform: 'scale(1.02)'
            },
            '&:active': {
              transform: 'scale(0.98)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          ☰
        </Button>

        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            color: isDarkMode ? '#ffffff' : '#333333',
            fontWeight: 700,
            fontSize: { xs: '1rem', sm: '1.1rem' },
            flex: 1,
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {title}
        </Typography>

        {/* Right Search Button */}
        <Button
          onClick={onShowRightSidebar}
          sx={{
            minWidth: 'auto',
            minHeight: 40,
            px: 1.5,
            py: 0.5,
            backgroundColor: isDarkMode ? 'rgba(25, 118, 210, 0.2)' : '#e8eaf6',
            color: isDarkMode ? '#90caf9' : '#1565c0',
            borderRadius: 2,
            fontSize: { xs: '0.75rem', sm: '0.85rem' },
            fontWeight: 600,
            border: `1px solid ${isDarkMode ? '#1976d2' : '#7986cb'}`,
            '&:hover': {
              backgroundColor: isDarkMode ? 'rgba(25, 118, 210, 0.3)' : '#c5cae9',
              transform: 'scale(1.02)'
            },
            '&:active': {
              transform: 'scale(0.98)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          🔍
        </Button>
      </Box>
    </Box>
  );
};

export default MobileHeader;
