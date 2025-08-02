import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  Avatar,
  Button,
  CircularProgress,
  Tab,
  Tabs,
  Card,
  CardContent,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Favorite as FavoriteIcon,
  Repeat as RetweetIcon,
  Comment as CommentIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../../recoil/darkModeAtom';
import { postsApi } from '../../../api/postsApi';
import { Notification, NotificationResponse } from '../types';

interface NotificationsPageProps {
  onBack?: () => void;
  onNotificationClick?: (notification: Notification) => void;
}

const NotificationsPage: React.FC<NotificationsPageProps> = ({ onBack, onNotificationClick }) => {
  const isDarkMode = useRecoilValue(darkModeState);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0,
  });

  useEffect(() => {
    loadNotifications();
  }, [tabValue]);

  const loadNotifications = async (page: number = 1) => {
    setLoading(page === 1);
    setRefreshing(page !== 1);
    
    try {
      const unreadOnly = tabValue === 1;
      const response: NotificationResponse = await postsApi.getNotifications(page, 20, unreadOnly);
      
      if (page === 1) {
        setNotifications(response.notifications);
      } else {
        setNotifications(prev => [...prev, ...response.notifications]);
      }
      
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleRefresh = () => {
    loadNotifications(1);
  };

  const handleLoadMore = () => {
    if (pagination.page < pagination.total_pages) {
      loadNotifications(pagination.page + 1);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    try {
      if (!notification.is_read) {
        await postsApi.markNotificationAsRead(notification.id);
        setNotifications(prev =>
          prev.map(n =>
            n.id === notification.id ? { ...n, is_read: true } : n
          )
        );
      }
      
      if (onNotificationClick) {
        onNotificationClick(notification);
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await postsApi.markAllNotificationsAsRead();
      setNotifications(prev =>
        prev.map(n => ({ ...n, is_read: true }))
      );
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <FavoriteIcon sx={{ color: '#e91e63', fontSize: 20 }} />;
      case 'retweet':
        return <RetweetIcon sx={{ color: '#4caf50', fontSize: 20 }} />;
      case 'comment':
        return <CommentIcon sx={{ color: '#2196f3', fontSize: 20 }} />;
      default:
        return null;
    }
  };

  const getNotificationMessage = (notification: Notification) => {
    const actorName = notification.actor.UserName || 'ユーザー';
    switch (notification.type) {
      case 'like':
        return `${actorName}さんがあなたの投稿をいいねしました`;
      case 'retweet':
        return `${actorName}さんがあなたの投稿をリツイートしました`;
      case 'comment':
        return `${actorName}さんがあなたの投稿にコメントしました`;
      default:
        return `${actorName}さんからの通知`;
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '今';
    if (diffMins < 60) return `${diffMins}分前`;
    if (diffHours < 24) return `${diffHours}時間前`;
    if (diffDays < 7) return `${diffDays}日前`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(n => 
    tabValue === 0 || !n.is_read
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: isDarkMode ? '#000000' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: isDarkMode ? '#000000' : '#ffffff',
          borderBottom: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0',
          p: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          {onBack && (
            <IconButton
              onClick={onBack}
              sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant="h5" sx={{ fontWeight: 'bold', flex: 1 }}>
            通知
          </Typography>
          <IconButton
            onClick={handleRefresh}
            disabled={refreshing}
            sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}
          >
            {refreshing ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <RefreshIcon />
            )}
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                color: isDarkMode ? '#999999' : '#666666',
                fontSize: '0.9rem',
                minWidth: 'auto',
                px: 2,
              },
              '& .Mui-selected': {
                color: isDarkMode ? '#bb86fc' : '#1976d2',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: isDarkMode ? '#bb86fc' : '#1976d2',
              },
            }}
          >
            <Tab label="すべて" />
            <Tab label="未読" />
          </Tabs>
          
          {tabValue === 0 && notifications.some(n => !n.is_read) && (
            <Button
              size="small"
              onClick={handleMarkAllAsRead}
              sx={{
                color: isDarkMode ? '#bb86fc' : '#1976d2',
                fontSize: '0.8rem',
              }}
            >
              すべて既読
            </Button>
          )}
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ px: 2, pb: 2 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredNotifications.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography
              variant="h6"
              sx={{ color: isDarkMode ? '#999999' : '#666666', mb: 1 }}
            >
              {tabValue === 0 ? '通知がありません' : '未読の通知がありません'}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: isDarkMode ? '#777777' : '#999999' }}
            >
              {tabValue === 0 
                ? '新しい通知が届くとここに表示されます'
                : 'すべての通知を既読にしました'
              }
            </Typography>
          </Box>
        ) : (
          <>
            <List sx={{ p: 0 }}>
              {filteredNotifications.map((notification, index) => (
                <ListItem
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    cursor: 'pointer',
                    p: 0,
                    mb: 1,
                    '&:hover': {
                      '& .notification-card': {
                        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                      },
                    },
                  }}
                >
                  <Card
                    className="notification-card"
                    sx={{
                      width: '100%',
                      backgroundColor: notification.is_read
                        ? 'transparent'
                        : isDarkMode
                        ? 'rgba(187, 134, 252, 0.1)'
                        : 'rgba(25, 118, 210, 0.1)',
                      border: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0',
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Avatar
                          src={notification.actor.Picture}
                          sx={{ width: 48, height: 48 }}
                        >
                          {notification.actor.UserName?.charAt(0) || 'U'}
                        </Avatar>
                        
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            {getNotificationIcon(notification.type)}
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight: notification.is_read ? 'normal' : 'bold',
                                color: isDarkMode ? '#ffffff' : '#000000',
                              }}
                            >
                              {getNotificationMessage(notification)}
                            </Typography>
                            {!notification.is_read && (
                              <Chip
                                label="新着"
                                size="small"
                                sx={{
                                  backgroundColor: isDarkMode ? '#bb86fc' : '#1976d2',
                                  color: '#ffffff',
                                  fontSize: '0.7rem',
                                  height: 20,
                                }}
                              />
                            )}
                          </Box>
                          
                          {notification.post && (
                            <Box
                              sx={{
                                p: 1.5,
                                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                                borderRadius: 1,
                                mb: 1,
                                border: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0',
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color: isDarkMode ? '#cccccc' : '#666666',
                                  fontSize: '0.85rem',
                                  overflow: 'hidden',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                }}
                              >
                                {notification.post.Content}
                              </Typography>
                            </Box>
                          )}
                          
                          <Typography
                            variant="caption"
                            sx={{
                              color: isDarkMode ? '#999999' : '#666666',
                              fontSize: '0.75rem',
                            }}
                          >
                            {formatTimeAgo(notification.created_at)}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </ListItem>
              ))}
            </List>

            {/* Load More Button */}
            {pagination.page < pagination.total_pages && (
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={handleLoadMore}
                  disabled={refreshing}
                  sx={{
                    borderColor: isDarkMode ? '#bb86fc' : '#1976d2',
                    color: isDarkMode ? '#bb86fc' : '#1976d2',
                    '&:hover': {
                      borderColor: isDarkMode ? '#bb86fc' : '#1976d2',
                      backgroundColor: isDarkMode ? 'rgba(187, 134, 252, 0.1)' : 'rgba(25, 118, 210, 0.1)',
                    },
                  }}
                >
                  {refreshing ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    'もっと読み込む'
                  )}
                </Button>
              </Box>
            )}

            {/* Summary */}
            <Box sx={{ textAlign: 'center', mt: 4, mb: 2 }}>
              <Typography
                variant="body2"
                sx={{ color: isDarkMode ? '#777777' : '#999999' }}
              >
                {pagination.total}件中 {filteredNotifications.length}件を表示
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default NotificationsPage;
