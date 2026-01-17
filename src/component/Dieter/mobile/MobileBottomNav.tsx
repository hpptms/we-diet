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
    minWidth: 56,
    minHeight: 56,
    p: 1,
    flexDirection: 'column',
    fontSize: '0.75rem',
    fontWeight: 500,
    borderRadius: 2,
    '&:active': {
      transform: 'scale(0.95)',
    },
  };

  return (
    <Box sx={{
      backgroundColor: isDarkMode ? '#000000' : 'white',
      borderTop: `1px solid ${isDarkMode ? '#bb86fc' : '#42a5f5'}`,
      py: 0.5,
      paddingBottom: 'max(8px, env(safe-area-inset-bottom))', // iOS Safari対応
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        maxWidth: 500,
        mx: 'auto',
        px: 1,
      }}>
        {/* Home Button */}
        <Button
          onClick={onNavigateToHome}
          sx={{
            ...buttonStyle,
            color: (!showFollowingPosts && !showMessages && !showNotifications)
              ? '#29b6f6'
              : (isDarkMode ? '#999' : '#666'),
          }}
        >
          <HomeIcon sx={{ fontSize: 24, mb: 0.25 }} />
          ホーム
        </Button>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          sx={{
            ...buttonStyle,
            color: isSearching ? '#29b6f6' : (isDarkMode ? '#999' : '#666'),
          }}
        >
          <Box sx={{ fontSize: 22, mb: 0.25, lineHeight: 1 }}>🔍</Box>
          検索
        </Button>

        {/* Post Button */}
        <Button
          onClick={onOpenPostModal}
          sx={{
            ...buttonStyle,
            color: '#29b6f6',
          }}
        >
          <EditIcon sx={{ fontSize: 24, mb: 0.25 }} />
          投稿
        </Button>

        {/* Notification Button */}
        <Button
          onClick={onNavigateToNotifications}
          sx={{
            ...buttonStyle,
            color: showNotifications
              ? '#29b6f6'
              : (isDarkMode ? '#999' : '#666'),
            position: 'relative',
          }}
        >
          <Box sx={{ fontSize: 22, mb: 0.25, lineHeight: 1 }}>🔔</Box>
          通知
        </Button>

        {/* Profile Button */}
        <Button
          onClick={onNavigateToProfile}
          sx={{
            ...buttonStyle,
            color: isDarkMode ? '#999' : '#666',
          }}
        >
          <PeopleIcon sx={{ fontSize: 24, mb: 0.25 }} />
          設定
        </Button>
      </Box>
    </Box>
  );
};

export default MobileBottomNav;
