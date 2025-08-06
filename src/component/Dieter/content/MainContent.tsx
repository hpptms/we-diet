import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { PostForm, PostCard } from '../post';
import { Messages } from '../message';
import NotificationsPage from '../notifications/NotificationsPage';

interface MainContentProps {
  isDarkMode: boolean;
  showMessages: boolean;
  showNotifications: boolean;
  isSearching: boolean;
  searchQuery: string;
  searchLoading: boolean;
  searchResults: any[];
  loading: boolean;
  posts: any[];
  deletedPostIds: Set<number>;
  currentUser: any;
  onBackFromMessages: () => void;
  onBackFromNotifications: () => void;
  onNotificationClick: (notification: any) => void;
  onPost: (content: string, images?: File[], isSensitive?: boolean) => Promise<void>;
  onPostDelete: (postId: number) => void;
  filterSensitivePosts: (posts: any[]) => any[];
}

const MainContent: React.FC<MainContentProps> = ({
  isDarkMode,
  showMessages,
  showNotifications,
  isSearching,
  searchQuery,
  searchLoading,
  searchResults,
  loading,
  posts,
  deletedPostIds,
  currentUser,
  onBackFromMessages,
  onBackFromNotifications,
  onNotificationClick,
  onPost,
  onPostDelete,
  filterSensitivePosts,
}) => {
  if (showMessages) {
    return <Messages onBack={onBackFromMessages} />;
  }

  if (showNotifications) {
    return (
      <NotificationsPage 
        onBack={onBackFromNotifications}
        onNotificationClick={(notification) => {
          console.log('通知アイテムクリック:', notification);
          onNotificationClick(notification);
        }}
      />
    );
  }

  return (
    <>
      {/* Post Form - Only show when not searching */}
      {!isSearching && (
        <PostForm onPost={onPost} currentUser={currentUser} />
      )}

      {/* Search Mode */}
      {isSearching ? (
        <>
          {/* Search Results Header */}
          <Box sx={{ 
            p: 2, 
            borderBottom: `1px solid ${isDarkMode ? '#333' : '#e0e0e0'}`,
            backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa'
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: isDarkMode ? '#ffffff' : '#333333',
                fontSize: '1.1rem',
                fontWeight: 600 
              }}
            >
              "{searchQuery}" の検索結果
            </Typography>
          </Box>

          {/* Search Results */}
          {searchLoading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              py: 8,
              flexDirection: 'column',
              gap: 2
            }}>
              <CircularProgress 
                size={40} 
                sx={{ 
                  color: '#29b6f6' 
                }} 
              />
              <Typography
                variant="body1"
                sx={{
                  color: isDarkMode ? '#ffffff' : '#666666',
                  fontSize: '1rem'
                }}
              >
                検索中...
              </Typography>
            </Box>
          ) : searchResults.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              py: 8
            }}>
              <Typography
                variant="body1"
                sx={{
                  color: isDarkMode ? '#ffffff' : '#666666',
                  fontSize: '1rem',
                  textAlign: 'center'
                }}
              >
                "{searchQuery}" に一致する投稿が見つかりませんでした。<br />
                別のキーワードで検索してみてください。
              </Typography>
            </Box>
          ) : (
            filterSensitivePosts(searchResults)
              .filter(post => !deletedPostIds.has(post.ID))
              .map((post, index) => (
                <PostCard 
                  key={`search-${post.ID}-${post.CreatedAt}-${index}`} 
                  post={post} 
                  onPostDelete={onPostDelete}
                />
              ))
          )}
        </>
      ) : (
        <>
          {/* Normal Posts List */}
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              py: 8,
              flexDirection: 'column',
              gap: 2
            }}>
              <CircularProgress 
                size={40} 
                sx={{ 
                  color: '#29b6f6' 
                }} 
              />
              <Typography
                variant="body1"
                sx={{
                  color: isDarkMode ? '#ffffff' : '#666666',
                  fontSize: '1rem'
                }}
              >
                投稿を読み込み中...
              </Typography>
            </Box>
          ) : posts.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              py: 8
            }}>
              <Typography
                variant="body1"
                sx={{
                  color: isDarkMode ? '#ffffff' : '#666666',
                  fontSize: '1rem',
                  textAlign: 'center'
                }}
              >
                まだ投稿がありません。<br />
                最初の投稿をしてみましょう！
              </Typography>
            </Box>
          ) : (
            filterSensitivePosts(posts)
              .filter(post => !deletedPostIds.has(post.ID))
              .map((post, index) => (
                <PostCard 
                  key={`${post.ID}-${post.CreatedAt}-${index}`} 
                  post={post} 
                  onPostDelete={onPostDelete}
                />
              ))
          )}
        </>
      )}
    </>
  );
};

export default MainContent;
