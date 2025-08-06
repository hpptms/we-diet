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

  return (
    <Box sx={{
      backgroundColor: isDarkMode ? '#000000' : 'white',
      borderTop: `1px solid ${isDarkMode ? '#bb86fc' : '#42a5f5'}`,
      py: 1,
      paddingBottom: 'env(safe-area-inset-bottom)' // iOS Safari対応
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        maxWidth: 500,
        mx: 'auto'
      }}>
        {/* Home Button */}
        <Button
          onClick={onNavigateToHome}
          sx={{
            minWidth: 'auto',
            p: 1,
            color: (!showFollowingPosts && !showMessages && !showNotifications) 
              ? '#29b6f6' 
              : (isDarkMode ? '#888' : '#666'),
            flexDirection: 'column',
            fontSize: '0.7rem'
          }}
        >
          <HomeIcon sx={{ fontSize: 20, mb: 0.5 }} />
          ホーム
        </Button>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          sx={{
            minWidth: 'auto',
            p: 1,
            color: isSearching ? '#29b6f6' : (isDarkMode ? '#888' : '#666'),
            flexDirection: 'column',
            fontSize: '0.7rem'
          }}
        >
          <Box sx={{ fontSize: 20, mb: 0.5 }}>🔍</Box>
          検索
        </Button>

        {/* Post Button */}
        <Button
          onClick={onOpenPostModal}
          sx={{
            minWidth: 'auto',
            p: 1,
            color: '#29b6f6',
            flexDirection: 'column',
            fontSize: '0.7rem'
          }}
        >
          <EditIcon sx={{ fontSize: 20, mb: 0.5 }} />
          投稿
        </Button>

        {/* Notification Button */}
        <Button
          onClick={onNavigateToNotifications}
          sx={{
            minWidth: 'auto',
            p: 1,
            color: showNotifications 
              ? '#29b6f6' 
              : (isDarkMode ? '#888' : '#666'),
            flexDirection: 'column',
            fontSize: '0.7rem',
            position: 'relative'
          }}
        >
          <Box sx={{ fontSize: 20, mb: 0.5 }}>🔔</Box>
          通知
        </Button>

        {/* Profile Button */}
        <Button
          onClick={onNavigateToProfile}
          sx={{
            minWidth: 'auto',
            p: 1,
            color: isDarkMode ? '#888' : '#666',
            flexDirection: 'column',
            fontSize: '0.7rem'
          }}
        >
          <PeopleIcon sx={{ fontSize: 20, mb: 0.5 }} />
          設定
        </Button>
      </Box>
    </Box>
  );
};

export default MobileBottomNav;
