import React, { useMemo, useCallback } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { PostForm, PostCard } from '../post';
import { Messages } from '../message';
import NotificationsPage from '../notifications/NotificationsPage';
import { useTranslation } from '../../../hooks/useTranslation';

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
  showFollowingPosts?: boolean;
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
  showFollowingPosts = false,
  onBackFromMessages,
  onBackFromNotifications,
  onNotificationClick,
  onPost,
  onPostDelete,
  filterSensitivePosts,
}) => {
  const { t } = useTranslation();

  // フィルタリングされた投稿をメモ化
  const filteredPosts = useMemo(() => {
    return filterSensitivePosts(posts)
      .filter(post => !deletedPostIds.has(post.ID))
      .slice(0, 200);
  }, [posts, deletedPostIds, filterSensitivePosts]);

  // フィルタリングされた検索結果をメモ化
  const filteredSearchResults = useMemo(() => {
    return filterSensitivePosts(searchResults)
      .filter(post => !deletedPostIds.has(post.ID));
  }, [searchResults, deletedPostIds, filterSensitivePosts]);

  // 表示件数情報を計算
  const postCountInfo = useMemo(() => {
    const validPosts = filterSensitivePosts(posts).filter(post => !deletedPostIds.has(post.ID));
    const displayedCount = Math.min(validPosts.length, 200);
    return { validPosts, displayedCount };
  }, [posts, deletedPostIds, filterSensitivePosts]);

  // 通知クリックハンドラをメモ化
  const handleNotificationClick = useCallback((notification: any) => {
    console.log('通知アイテムクリック:', notification);
    onNotificationClick(notification);
  }, [onNotificationClick]);

  if (showMessages) {
    return <Messages onBack={onBackFromMessages} />;
  }

  if (showNotifications) {
    return (
      <NotificationsPage
        onBack={onBackFromNotifications}
        onNotificationClick={handleNotificationClick}
      />
    );
  }

  return (
    <>
      {/* Timeline Header - Show which timeline is active */}
      {!isSearching && !showMessages && !showNotifications && (
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
            {showFollowingPosts ? t('dieter', 'timeline.following', {}, 'フォローTL') : t('dieter', 'timeline.home', {}, 'ホームTL')}
          </Typography>
          {showFollowingPosts && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: isDarkMode ? '#cccccc' : '#666666',
                fontSize: '0.9rem',
                mt: 0.5
              }}
            >
              {t('dieter', 'timeline.followingDescription', {}, 'フォロー中のユーザーの投稿のみ表示')}
            </Typography>
          )}
        </Box>
      )}

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
              {t('dieter', 'search.resultsFor', {}, '"{searchQuery}" の検索結果').replace('{searchQuery}', searchQuery)}
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
                {t('dieter', 'timeline.searching', {}, '検索中...')}
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
                dangerouslySetInnerHTML={{
                  __html: t('dieter', 'search.noResults', {}, '"{searchQuery}" に一致する投稿が見つかりませんでした。<br />別のキーワードで検索してみてください。').replace('{searchQuery}', searchQuery)
                }}
              />
            </Box>
          ) : (
            filteredSearchResults.map((post, index) => (
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
                {t('dieter', 'timeline.loading', {}, '投稿を読み込み中...')}
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
                dangerouslySetInnerHTML={{
                  __html: showFollowingPosts 
                    ? t('dieter', 'timeline.noFollowingPosts', {}, 'フォロー中のユーザーの投稿がありません。<br />ユーザーをフォローしてタイムラインを充実させましょう！')
                    : t('dieter', 'timeline.noPosts', {}, 'まだ投稿がありません。<br />最初の投稿をしてみましょう！')
                }}
              />
            </Box>
          ) : (
            filteredPosts.map((post, index) => (
              <PostCard
                key={`${post.ID}-${post.CreatedAt}-${index}`}
                post={post}
                onPostDelete={onPostDelete}
              />
            ))
          )}

          {/* Display post count info */}
          {!loading && posts.length > 0 && (
            <Box sx={{
              p: 2,
              textAlign: 'center',
              borderTop: `1px solid ${isDarkMode ? '#333' : '#e0e0e0'}`,
              backgroundColor: isDarkMode ? '#1a1a1a' : '#f8f9fa'
            }}>
              <Typography
                variant="body2"
                sx={{
                  color: isDarkMode ? '#cccccc' : '#666666',
                  fontSize: '0.9rem'
                }}
              >
                {postCountInfo.validPosts.length <= 200
                  ? `${postCountInfo.displayedCount}件の投稿を表示中`
                  : `最新の200件を表示中 (全${postCountInfo.validPosts.length}件)`
                }
                {postCountInfo.validPosts.length > 200 && (
                  <><br />パフォーマンス向上のため、200件を超える投稿は非表示になります</>
                )}
              </Typography>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default React.memo(MainContent);
