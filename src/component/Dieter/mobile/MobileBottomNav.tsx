import React from 'react';
import { Box, Button } from '@mui/material';
// 個別インポートでバンドルサイズを削減
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import PeopleIcon from '@mui/icons-material/People';

interface MobileBottomNavProps {
  isDarkMode: boolean;
  showFollowingPosts: boolean;
  showMessages: boolean;
  showNotifications: boolean;
  isSearching: boolean;
  onNavigateToHome: () => void;
  onOpenPostModal: () => void;
  onNavigateToProfile: () => void;
  onNavigateToNotifications: () => void;
  onSearch: (query: string) => void;
}

const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  isDarkMode,
  showFollowingPosts,
  showMessages,
  showNotifications,
  isSearching,
  onNavigateToHome,
  onOpenPostModal,
  onNavigateToProfile,
  onNavigateToNotifications,
  onSearch,
}) => {
  const handleSearch = () => {
    const query = prompt('検索キーワードを入力してください:');
    if (query && query.trim()) {
      onSearch(query.trim());
    }
  };

  // 共通ボタンスタイル（タップターゲット48px以上を確保）
  const buttonStyle = {
    minWidth: { xs: 50, sm: 60 },
    minHeight: { xs: 54, sm: 60 },
    p: { xs: 0.5, sm: 1 },
    flexDirection: 'column',
    fontSize: { xs: '0.7rem', sm: '0.75rem' },
    fontWeight: 600,
    borderRadius: 0,
    transition: 'all 0.2s ease',
    '&:active': {
      transform: 'scale(0.95)',
      backgroundColor: isDarkMode ? 'rgba(41, 182, 246, 0.1)' : 'rgba(41, 182, 246, 0.08)',
    },
  };

  return (
    <Box sx={{
      backgroundColor: isDarkMode ? '#000000' : 'white',
      borderTop: `2px solid ${isDarkMode ? '#29b6f6' : '#42a5f5'}`,
      boxShadow: isDarkMode
        ? '0 -2px 10px rgba(0, 0, 0, 0.5)'
        : '0 -2px 10px rgba(0, 0, 0, 0.1)',
      paddingBottom: 'max(4px, env(safe-area-inset-bottom))', // iOS Safari対応
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'stretch',
        width: '100%',
        maxWidth: '100%',
        mx: 'auto',
      }}>
        {/* Home Button */}
        <Button
          onClick={onNavigateToHome}
          sx={{
            ...buttonStyle,
            color: (!showFollowingPosts && !showMessages && !showNotifications)
              ? '#29b6f6'
              : (isDarkMode ? '#90a4ae' : '#757575'),
            backgroundColor: (!showFollowingPosts && !showMessages && !showNotifications)
              ? (isDarkMode ? 'rgba(41, 182, 246, 0.15)' : 'rgba(41, 182, 246, 0.1)')
              : 'transparent',
            flex: 1,
          }}
        >
          <HomeIcon sx={{ fontSize: { xs: 22, sm: 24 }, mb: 0.25 }} />
          <Box sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>ホーム</Box>
        </Button>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          sx={{
            ...buttonStyle,
            color: isSearching ? '#29b6f6' : (isDarkMode ? '#90a4ae' : '#757575'),
            backgroundColor: isSearching
              ? (isDarkMode ? 'rgba(41, 182, 246, 0.15)' : 'rgba(41, 182, 246, 0.1)')
              : 'transparent',
            flex: 1,
          }}
        >
          <Box sx={{ fontSize: { xs: 20, sm: 22 }, mb: 0.25, lineHeight: 1 }}>🔍</Box>
          <Box sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>検索</Box>
        </Button>

        {/* Post Button - 目立たせる */}
        <Button
          onClick={onOpenPostModal}
          sx={{
            ...buttonStyle,
            color: 'white',
            backgroundColor: '#29b6f6',
            flex: 1,
            '&:hover': {
              backgroundColor: '#1e88e5',
            },
            '&:active': {
              transform: 'scale(0.95)',
              backgroundColor: '#1976d2',
            },
          }}
        >
          <EditIcon sx={{ fontSize: { xs: 22, sm: 24 }, mb: 0.25 }} />
          <Box sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>投稿</Box>
        </Button>

        {/* Notification Button */}
        <Button
          onClick={onNavigateToNotifications}
          sx={{
            ...buttonStyle,
            color: showNotifications
              ? '#29b6f6'
              : (isDarkMode ? '#90a4ae' : '#757575'),
            backgroundColor: showNotifications
              ? (isDarkMode ? 'rgba(41, 182, 246, 0.15)' : 'rgba(41, 182, 246, 0.1)')
              : 'transparent',
            position: 'relative',
            flex: 1,
          }}
        >
          <Box sx={{ fontSize: { xs: 20, sm: 22 }, mb: 0.25, lineHeight: 1 }}>🔔</Box>
          <Box sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>通知</Box>
        </Button>

        {/* Messages Button */}
        <Button
          onClick={onNavigateToProfile}
          sx={{
            ...buttonStyle,
            color: showMessages ? '#29b6f6' : (isDarkMode ? '#90a4ae' : '#757575'),
            backgroundColor: showMessages
              ? (isDarkMode ? 'rgba(41, 182, 246, 0.15)' : 'rgba(41, 182, 246, 0.1)')
              : 'transparent',
            flex: 1,
          }}
        >
          <PeopleIcon sx={{ fontSize: { xs: 22, sm: 24 }, mb: 0.25 }} />
          <Box sx={{ fontSize: { xs: '0.65rem', sm: '0.7rem' } }}>設定</Box>
        </Button>
      </Box>
    </Box>
  );
};

export default MobileBottomNav;
