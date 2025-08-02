import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../../recoil/darkModeAtom';
import { serverProfileState } from '../../../recoil/profileSettingsAtom';
import { postsApi } from '../../../api/postsApi';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`follow-tabpanel-${index}`}
      aria-labelledby={`follow-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface FollowUser {
  id: number;
  username: string;
  picture: string;
}

interface FollowManagementProps {
  onBack?: () => void;
}

const FollowManagement: React.FC<FollowManagementProps> = ({ onBack }) => {
  const isDarkMode = useRecoilValue(darkModeState);
  const serverProfile = useRecoilValue(serverProfileState);
  const [tabValue, setTabValue] = useState(0);
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [following, setFollowing] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentUserId = serverProfile.userId;

  useEffect(() => {
    if (currentUserId) {
      fetchFollowData();
    }
  }, [currentUserId]);

  const fetchFollowData = async () => {
    if (!currentUserId) return;

    try {
      setLoading(true);
      setError(null);

      const [followersResponse, followingResponse] = await Promise.all([
        postsApi.getFollowers(currentUserId),
        postsApi.getFollowing(currentUserId),
      ]);

      setFollowers(followersResponse.followers || []);
      setFollowing(followingResponse.following || []);
    } catch (error) {
      console.error('フォロー情報の取得に失敗しました:', error);
      setError('フォロー情報の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleUnfollow = async (userId: number) => {
    try {
      await postsApi.toggleFollow(userId);
      // フォロー情報を再取得
      await fetchFollowData();
    } catch (error) {
      console.error('フォロー解除に失敗しました:', error);
    }
  };

  const renderUserList = (users: FollowUser[], isFollowingTab: boolean) => {
    if (users.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography
            variant="body1"
            sx={{
              color: isDarkMode ? '#ffffff' : '#666666',
            }}
          >
            {isFollowingTab ? 'フォロー中のユーザーはいません' : 'フォロワーはいません'}
          </Typography>
        </Box>
      );
    }

    return (
      <List sx={{ p: 0 }}>
        {users.map((user) => (
          <ListItem
            key={user.id}
            sx={{
              mb: 1,
              borderRadius: 2,
              backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#f8f9fa',
              border: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e9ecef',
            }}
          >
            <ListItemAvatar>
              <Avatar
                src={user.picture}
                sx={{
                  width: 48,
                  height: 48,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                {user.username.charAt(0).toUpperCase()}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={user.username}
              sx={{
                '& .MuiTypography-root': {
                  color: isDarkMode ? '#ffffff' : '#424242',
                  fontWeight: 500,
                },
              }}
            />
            {isFollowingTab && (
              <Button
                variant="outlined"
                size="small"
                onClick={() => handleUnfollow(user.id)}
                sx={{
                  borderColor: '#f44336',
                  color: '#f44336',
                  '&:hover': {
                    borderColor: '#d32f2f',
                    backgroundColor: 'rgba(244, 67, 54, 0.04)',
                  },
                }}
              >
                フォロー解除
              </Button>
            )}
          </ListItem>
        ))}
      </List>
    );
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: isDarkMode 
        ? '#000000'
        : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
      p: 2,
    }}>
      <Card sx={{
        maxWidth: 600,
        mx: 'auto',
        borderRadius: 4,
        boxShadow: isDarkMode 
          ? '0 8px 32px rgba(187, 134, 252, 0.15)'
          : '0 8px 32px rgba(66, 165, 245, 0.15)',
        backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
      }}>
        <CardContent sx={{ p: 0 }}>
          {/* ヘッダー */}
          <Box sx={{ 
            p: 3, 
            borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 'bold',
                color: isDarkMode ? '#ffffff' : '#1976d2',
              }}
            >
              フォロー管理
            </Typography>
            {onBack && (
              <Button 
                variant="outlined" 
                onClick={onBack}
                sx={{
                  borderColor: '#29b6f6',
                  color: '#29b6f6',
                }}
              >
                戻る
              </Button>
            )}
          </Box>

          {/* タブ */}
          <Box sx={{ borderBottom: isDarkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e0e0e0' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  color: isDarkMode ? '#ffffff' : '#666666',
                  '&.Mui-selected': {
                    color: '#29b6f6',
                  },
                },
                '& .MuiTabs-indicator': {
                  backgroundColor: '#29b6f6',
                },
              }}
            >
              <Tab 
                label={`フォロワー (${followers ? followers.length : 0})`} 
                id="follow-tab-0"
                aria-controls="follow-tabpanel-0"
              />
              <Tab 
                label={`フォロー中 (${following ? following.length : 0})`} 
                id="follow-tab-1"
                aria-controls="follow-tabpanel-1"
              />
            </Tabs>
          </Box>

          {/* コンテンツ */}
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              py: 8 
            }}>
              <CircularProgress sx={{ color: '#29b6f6' }} />
            </Box>
          ) : error ? (
            <Box sx={{ p: 3 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          ) : (
            <>
              <TabPanel value={tabValue} index={0}>
                {renderUserList(followers, false)}
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                {renderUserList(following, true)}
              </TabPanel>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default FollowManagement;
