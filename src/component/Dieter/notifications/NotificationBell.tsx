import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Typography,
  Avatar,
  Divider,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  NotificationsNone as NotificationsNoneIcon,
  Favorite as FavoriteIcon,
  Repeat as RetweetIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../../recoil/darkModeAtom';
import { postsApi } from '../../../api/postsApi';
import { Notification } from '../types';

interface NotificationBellProps {
  onNotificationClick?: (notification: Notification) => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ onNotificationClick }) => {
  const isDarkMode = useRecoilValue(darkModeState);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const open = Boolean(anchorEl);

  // 通知数を定期的に取得
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await postsApi.getUnreadNotificationCount();
        setUnreadCount(response.unread_count);
      } catch (error) {
        console.error('Failed to fetch unread count:', error);
      }
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // 30秒ごとに更新

    return () => clearInterval(interval);
  }, []);

  const handleClick = async (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setLoading(true);
    
    try {
      const response = await postsApi.getNotifications(1, 10);
      setNotifications(response.notifications);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClick = async (notification: Notification) => {
    try {
      if (!notification.is_read) {
        await postsApi.markNotificationAsRead(notification.id);
        setUnreadCount(prev => Math.max(0, prev - 1));
        setNotifications(prev => 
          prev.map(n => 
            n.id === notification.id ? { ...n, is_read: true } : n
          )
        );
      }
      
      if (onNotificationClick) {
        onNotificationClick(notification);
      }
      
      handleClose();
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await postsApi.markAllNotificationsAsRead();
      setUnreadCount(0);
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
        return <FavoriteIcon sx={{ color: '#e91e63', fontSize: 16 }} />;
      case 'retweet':
        return <RetweetIcon sx={{ color: '#4caf50', fontSize: 16 }} />;
      case 'comment':
        return <CommentIcon sx={{ color: '#2196f3', fontSize: 16 }} />;
      default:
        return <NotificationsIcon sx={{ fontSize: 16 }} />;
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

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          color: isDarkMode ? '#ffffff' : '#666666',
          '&:hover': {
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <Badge badgeContent={unreadCount} color="error" max={99}>
          {unreadCount > 0 ? <NotificationsIcon /> : <NotificationsNoneIcon />}
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 400,
            backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
            border: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0',
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
              通知
            </Typography>
            {unreadCount > 0 && (
              <Button
                size="small"
                onClick={handleMarkAllAsRead}
                sx={{
                  color: isDarkMode ? '#bb86fc' : '#1976d2',
                  fontSize: '0.75rem',
                }}
              >
                すべて既読
              </Button>
            )}
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={24} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography
              variant="body2"
              sx={{ color: isDarkMode ? '#999999' : '#666666' }}
            >
              新しい通知はありません
            </Typography>
          </Box>
        ) : (
          notifications.map((notification, index) => (
            <MenuItem
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              sx={{
                display: 'block',
                p: 2,
                backgroundColor: notification.is_read
                  ? 'transparent'
                  : isDarkMode
                  ? 'rgba(187, 134, 252, 0.1)'
                  : 'rgba(25, 118, 210, 0.1)',
                '&:hover': {
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Avatar
                  src={notification.actor.Picture}
                  sx={{ width: 40, height: 40 }}
                >
                  {notification.actor.UserName?.charAt(0) || 'U'}
                </Avatar>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    {getNotificationIcon(notification.type)}
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDarkMode ? '#ffffff' : '#000000',
                        fontWeight: notification.is_read ? 'normal' : 'bold',
                      }}
                    >
                      {getNotificationMessage(notification)}
                    </Typography>
                  </Box>
                  {notification.post && (
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDarkMode ? '#cccccc' : '#666666',
                        fontSize: '0.75rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {notification.post.Content}
                    </Typography>
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      color: isDarkMode ? '#999999' : '#666666',
                      fontSize: '0.7rem',
                    }}
                  >
                    {formatTimeAgo(notification.created_at)}
                  </Typography>
                </Box>
              </Box>
              {index < notifications.length - 1 && (
                <Divider sx={{ mt: 1, borderColor: isDarkMode ? '#333' : '#e0e0e0' }} />
              )}
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;
