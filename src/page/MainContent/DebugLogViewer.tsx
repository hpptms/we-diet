import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Pagination,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Card,
  CardContent,
  CircularProgress,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormControlLabel,
  Avatar
} from '@mui/material';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../recoil/darkModeAtom';
import * as adminApi from '../../api/adminApi';
import { AdminUser, AdminPost, GetUsersResponse, GetPostsResponse } from '../../proto/admin';

interface DebugLogEntry {
  id: number;
  user_id: number;
  log_level: string;
  message: string;
  details: string;
  source: string;
  user_agent: string;
  url: string;
  created_at: string;
  updated_at: string;
}

interface DebugLogResponse {
  success: boolean;
  message: string;
  logs: DebugLogEntry[];
  total_count: number;
  limit: number;
  offset: number;
}


interface DebugLogViewerProps {
  onBack: () => void;
}

const DebugLogViewer: React.FC<DebugLogViewerProps> = ({ onBack }) => {
  const isDarkMode = useRecoilValue(darkModeState);
  
  // タブ管理
  const [activeTab, setActiveTab] = useState(0);
  
  // デバッグログ用の状態
  const [logs, setLogs] = useState<DebugLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [filterSource, setFilterSource] = useState('');
  const [filterUserId, setFilterUserId] = useState('');
  const [filterLogLevel, setFilterLogLevel] = useState('');

  // ユーザー管理用の状態
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersTotalCount, setUsersTotalCount] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [usersLimit, setUsersLimit] = useState(20);
  const [usersSearch, setUsersSearch] = useState('');
  const [deleteUserDialog, setDeleteUserDialog] = useState<{ open: boolean; user?: AdminUser }>({ open: false });

  // 投稿管理用の状態
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsTotalCount, setPostsTotalCount] = useState(0);
  const [postsPage, setPostsPage] = useState(1);
  const [postsLimit, setPostsLimit] = useState(20);
  const [showHiddenPosts, setShowHiddenPosts] = useState(false);
  const [postsUserIdFilter, setPostsUserIdFilter] = useState('');
  const [minKarmaFilter, setMinKarmaFilter] = useState('');
  const [deletePostDialog, setDeletePostDialog] = useState<{ open: boolean; post?: AdminPost }>({ open: false });

  const fetchDebugLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterUserId) params.append('user_id', filterUserId);
      if (filterSource) params.append('source', filterSource);
      params.append('limit', limit.toString());
      params.append('offset', ((page - 1) * limit).toString());

      const token = localStorage.getItem('jwt_token');
      const headers: HeadersInit = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}debug_logs?${params}`, {
        headers
      });
      
      if (!response.ok) {
        // レスポンス本文を取得してエラー詳細を確認
        const errorText = await response.text();
        console.error('Debug logs API error response:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data: DebugLogResponse = await response.json();
      
      if (data.success) {
        let filteredLogs = data.logs;
        
        // クライアントサイドでのログレベルフィルタリング
        if (filterLogLevel) {
          filteredLogs = data.logs.filter(log => log.log_level === filterLogLevel);
        }
        
        setLogs(filteredLogs);
        setTotalCount(data.total_count);
      } else {
        console.error('Failed to fetch debug logs:', data.message);
        setLogs([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error('Error fetching debug logs:', error);
      setLogs([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // ユーザー一覧を取得
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', usersPage.toString());
      params.append('limit', usersLimit.toString());
      if (usersSearch) params.append('search', usersSearch);

      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}admin/users?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data: GetUsersResponse = await response.json();
      setUsers(data.users || []);
      setUsersTotalCount(data.pagination.total);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    } finally {
      setUsersLoading(false);
    }
  };

  // 投稿一覧を取得
  const fetchPosts = async () => {
    setPostsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', postsPage.toString());
      params.append('limit', postsLimit.toString());
      if (showHiddenPosts) params.append('show_hidden', 'true');
      if (postsUserIdFilter) params.append('user_id', postsUserIdFilter);
      if (minKarmaFilter) params.append('min_karma', minKarmaFilter);

      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}admin/posts?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (!response.ok) throw new Error('Failed to fetch posts');
      
      const data: GetPostsResponse = await response.json();
      setPosts(data.posts || []);
      setPostsTotalCount(data.pagination.total);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setPostsLoading(false);
    }
  };

  // ユーザー削除
  const handleDeleteUser = async () => {
    if (!deleteUserDialog.user) return;
    
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}admin/users/${deleteUserDialog.user.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (!response.ok) throw new Error('Failed to delete user');
      
      setDeleteUserDialog({ open: false });
      fetchUsers(); // リフレッシュ
      alert('ユーザーが削除されました');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('ユーザー削除に失敗しました');
    }
  };

  // 投稿削除
  const handleDeletePost = async () => {
    if (!deletePostDialog.post) return;
    
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}admin/posts/${deletePostDialog.post.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (!response.ok) throw new Error('Failed to delete post');
      
      setDeletePostDialog({ open: false });
      fetchPosts(); // リフレッシュ
      alert('投稿が削除されました');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('投稿削除に失敗しました');
    }
  };

  // 投稿の表示/非表示切り替え
  const handleTogglePostVisibility = async (post: AdminPost) => {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}admin/posts/${post.id}/toggle-visibility`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (!response.ok) throw new Error('Failed to toggle post visibility');

      fetchPosts(); // リフレッシュ
      const action = post.is_hide ? '表示' : '非表示';
      alert(`投稿を${action}にしました`);
    } catch (error) {
      console.error('Error toggling post visibility:', error);
      alert('投稿の表示/非表示切り替えに失敗しました');
    }
  };

  useEffect(() => {
    if (activeTab === 0) {
      fetchDebugLogs();
    } else if (activeTab === 1) {
      fetchUsers();
    } else if (activeTab === 2) {
      fetchPosts();
    }
  }, [
    activeTab,
    // デバッグログ用
    page, limit, filterSource, filterUserId, filterLogLevel,
    // ユーザー管理用
    usersPage, usersLimit, usersSearch,
    // 投稿管理用
    postsPage, postsLimit, showHiddenPosts, postsUserIdFilter, minKarmaFilter
  ]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleLimitChange = (event: SelectChangeEvent<number>) => {
    setLimit(event.target.value as number);
    setPage(1);
  };

  const handleUsersPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setUsersPage(value);
  };

  const handlePostsPageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPostsPage(value);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getLogLevelColor = (level: string) => {
    switch (level.toUpperCase()) {
      case 'ERROR':
        return 'error';
      case 'WARN':
        return 'warning';
      case 'INFO':
        return 'info';
      case 'DEBUG':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const totalPages = Math.ceil(totalCount / limit);

  const usersTotalPages = Math.ceil(usersTotalCount / usersLimit);
  const postsTotalPages = Math.ceil(postsTotalCount / postsLimit);

  return (
    <Box sx={{ 
      p: 3,
      backgroundColor: isDarkMode ? '#000000' : '#ffffff',
      minHeight: '100vh',
      color: isDarkMode ? '#ffffff' : 'inherit'
    }}>
      {/* ヘッダー */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          🔧 管理者パネル
        </Typography>
        <Button variant="outlined" onClick={onBack}>
          ← ダッシュボードに戻る
        </Button>
      </Box>

      {/* タブ */}
      <Box sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              color: isDarkMode ? '#ffffff' : 'inherit',
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#1976d2',
            }
          }}
        >
          <Tab label="デバッグログ" />
          <Tab label="ユーザー管理" />
          <Tab label="投稿管理" />
        </Tabs>
      </Box>

      {/* タブコンテンツ */}
      {activeTab === 0 && (
        <>
          {/* デバッグログフィルター */}
          <Card sx={{ 
            mb: 3,
            backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
            border: isDarkMode ? '1px solid #333' : 'none'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>フィルター</Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <TextField
                  label="ユーザーID"
                  value={filterUserId}
                  onChange={(e) => {
                    setFilterUserId(e.target.value);
                    setPage(1);
                  }}
                  type="number"
                  sx={{ minWidth: 120 }}
                  size="small"
                />
                
                <TextField
                  label="ソース"
                  value={filterSource}
                  onChange={(e) => {
                    setFilterSource(e.target.value);
                    setPage(1);
                  }}
                  sx={{ minWidth: 150 }}
                  size="small"
                />

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>ログレベル</InputLabel>
                  <Select
                    value={filterLogLevel}
                    label="ログレベル"
                    onChange={(e) => {
                      setFilterLogLevel(e.target.value);
                      setPage(1);
                    }}
                  >
                    <MenuItem value="">すべて</MenuItem>
                    <MenuItem value="ERROR">ERROR</MenuItem>
                    <MenuItem value="WARN">WARN</MenuItem>
                    <MenuItem value="INFO">INFO</MenuItem>
                    <MenuItem value="DEBUG">DEBUG</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 100 }}>
                  <InputLabel>表示件数</InputLabel>
                  <Select
                    value={limit}
                    label="表示件数"
                    onChange={handleLimitChange}
                  >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                  </Select>
                </FormControl>

                <Button variant="contained" onClick={() => {
                  setFilterUserId('');
                  setFilterSource('');
                  setFilterLogLevel('');
                  setPage(1);
                }}>
                  フィルターをクリア
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* デバッグログテーブル */}
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ 
                mb: 3,
                backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
                '& .MuiTableCell-head': {
                  backgroundColor: isDarkMode ? '#333333' : '#f5f5f5',
                  color: isDarkMode ? '#ffffff' : 'inherit',
                  fontWeight: 'bold'
                },
                '& .MuiTableCell-body': {
                  color: isDarkMode ? '#ffffff' : 'inherit',
                  borderColor: isDarkMode ? '#333333' : 'rgba(224, 224, 224, 1)'
                }
              }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>日時</TableCell>
                      <TableCell>ユーザーID</TableCell>
                      <TableCell>レベル</TableCell>
                      <TableCell>ソース</TableCell>
                      <TableCell>メッセージ</TableCell>
                      <TableCell>詳細</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {logs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body1" color="textSecondary">
                            ログが見つかりませんでした
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      logs.map((log) => (
                        <TableRow key={log.id} hover>
                          <TableCell sx={{ minWidth: 160 }}>
                            {formatDate(log.created_at)}
                          </TableCell>
                          <TableCell>{log.user_id}</TableCell>
                          <TableCell>
                            <Chip 
                              label={log.log_level}
                              color={getLogLevelColor(log.log_level) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ 
                              maxWidth: 120,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {log.source || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ 
                              maxWidth: 400,
                              wordBreak: 'break-word',
                              whiteSpace: 'pre-wrap',
                              lineHeight: 1.4
                            }}>
                              {log.message}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ 
                              maxWidth: 600,
                              wordBreak: 'break-word',
                              whiteSpace: 'pre-wrap',
                              fontFamily: 'monospace',
                              fontSize: '0.75rem',
                              lineHeight: 1.3,
                              backgroundColor: isDarkMode ? '#0a0a0a' : '#f8f8f8',
                              padding: '8px',
                              borderRadius: '4px',
                              border: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0'
                            }}>
                              {log.details ? (() => {
                                try {
                                  const parsed = JSON.parse(log.details);
                                  return JSON.stringify(parsed, null, 2);
                                } catch (e) {
                                  return log.details;
                                }
                              })() : '-'}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* ページネーション */}
              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}

              {/* 統計情報 */}
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                  全{totalCount}件中 {((page - 1) * limit) + 1}〜{Math.min(page * limit, totalCount)}件を表示
                </Typography>
              </Box>
            </>
          )}
        </>
      )}

      {/* ユーザー管理タブ */}
      {activeTab === 1 && (
        <>
          {/* ユーザー管理フィルター */}
          <Card sx={{ 
            mb: 3,
            backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
            border: isDarkMode ? '1px solid #333' : 'none'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>ユーザー検索</Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  label="ユーザー名・メールアドレス"
                  value={usersSearch}
                  onChange={(e) => {
                    setUsersSearch(e.target.value);
                    setUsersPage(1);
                  }}
                  sx={{ minWidth: 300 }}
                  size="small"
                />
                <Button variant="contained" onClick={() => {
                  setUsersSearch('');
                  setUsersPage(1);
                }}>
                  クリア
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* ユーザーテーブル */}
          {usersLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ 
                mb: 3,
                backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
                '& .MuiTableCell-head': {
                  backgroundColor: isDarkMode ? '#333333' : '#f5f5f5',
                  color: isDarkMode ? '#ffffff' : 'inherit',
                  fontWeight: 'bold'
                },
                '& .MuiTableCell-body': {
                  color: isDarkMode ? '#ffffff' : 'inherit',
                  borderColor: isDarkMode ? '#333333' : 'rgba(224, 224, 224, 1)'
                }
              }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>アイコン</TableCell>
                      <TableCell>ID</TableCell>
                      <TableCell>ユーザー名</TableCell>
                      <TableCell>メールアドレス</TableCell>
                      <TableCell>権限</TableCell>
                      <TableCell>登録日</TableCell>
                      <TableCell>アクション</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body1" color="textSecondary">
                            ユーザーが見つかりませんでした
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id} hover>
                          <TableCell>
                            <Avatar
                              src={user.picture}
                              sx={{ width: 40, height: 40 }}
                            >
                              {user.user_name?.charAt(0) || 'U'}
                            </Avatar>
                          </TableCell>
                          <TableCell>{user.id}</TableCell>
                          <TableCell>{user.user_name || '-'}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Chip
                              label={user.permission >= 10 ? '管理者' : '一般'}
                              color={user.permission >= 10 ? 'error' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{formatDate(user.created_at)}</TableCell>
                          <TableCell>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => setDeleteUserDialog({ open: true, user })}
                            >
                              削除
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* ページネーション */}
              {usersTotalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={usersTotalPages}
                    page={usersPage}
                    onChange={handleUsersPageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}

              {/* 統計情報 */}
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                  全{usersTotalCount}件中 {((usersPage - 1) * usersLimit) + 1}〜{Math.min(usersPage * usersLimit, usersTotalCount)}件を表示
                </Typography>
              </Box>
            </>
          )}
        </>
      )}

      {/* 投稿管理タブ */}
      {activeTab === 2 && (
        <>
          {/* 投稿管理フィルター */}
          <Card sx={{ 
            mb: 3,
            backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5',
            border: isDarkMode ? '1px solid #333' : 'none'
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>フィルター</Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={showHiddenPosts}
                      onChange={(e) => {
                        setShowHiddenPosts(e.target.checked);
                        setPostsPage(1);
                      }}
                    />
                  }
                  label="非表示投稿も表示"
                />
                <TextField
                  label="ユーザーID"
                  value={postsUserIdFilter}
                  onChange={(e) => {
                    setPostsUserIdFilter(e.target.value);
                    setPostsPage(1);
                  }}
                  type="number"
                  sx={{ minWidth: 120 }}
                  size="small"
                />
                <TextField
                  label="最小カルマ値"
                  value={minKarmaFilter}
                  onChange={(e) => {
                    setMinKarmaFilter(e.target.value);
                    setPostsPage(1);
                  }}
                  type="number"
                  sx={{ minWidth: 120 }}
                  size="small"
                />
                <Button variant="contained" onClick={() => {
                  setShowHiddenPosts(false);
                  setPostsUserIdFilter('');
                  setMinKarmaFilter('');
                  setPostsPage(1);
                }}>
                  フィルターをクリア
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* 投稿テーブル */}
          {postsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TableContainer component={Paper} sx={{ 
                mb: 3,
                backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
                '& .MuiTableCell-head': {
                  backgroundColor: isDarkMode ? '#333333' : '#f5f5f5',
                  color: isDarkMode ? '#ffffff' : 'inherit',
                  fontWeight: 'bold'
                },
                '& .MuiTableCell-body': {
                  color: isDarkMode ? '#ffffff' : 'inherit',
                  borderColor: isDarkMode ? '#333333' : 'rgba(224, 224, 224, 1)'
                }
              }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>投稿者</TableCell>
                      <TableCell>内容</TableCell>
                      <TableCell>状態</TableCell>
                      <TableCell>カルマ</TableCell>
                      <TableCell>投稿日時</TableCell>
                      <TableCell>アクション</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {posts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body1" color="textSecondary">
                            投稿が見つかりませんでした
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      posts.map((post) => (
                        <TableRow key={post.id} hover>
                          <TableCell>{post.id}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar
                                src={post.author_picture}
                                sx={{ width: 32, height: 32 }}
                              >
                                {post.author_name?.charAt(0) || 'U'}
                              </Avatar>
                              <Box>
                                <Typography variant="body2">{post.author_name}</Typography>
                                <Typography variant="caption" color="textSecondary">
                                  ID: {post.user_id}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{
                              maxWidth: 300,
                              wordBreak: 'break-word',
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical'
                            }}>
                              {post.content}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={post.is_hide ? '非表示' : '公開'}
                              color={post.is_hide ? 'error' : 'success'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={post.karma}
                              color={post.karma >= 10 ? 'error' : post.karma >= 5 ? 'warning' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{formatDate(post.created_at)}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                variant="outlined"
                                color={post.is_hide ? 'success' : 'warning'}
                                size="small"
                                onClick={() => handleTogglePostVisibility(post)}
                              >
                                {post.is_hide ? '表示' : '非表示'}
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => setDeletePostDialog({ open: true, post })}
                              >
                                削除
                              </Button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* ページネーション */}
              {postsTotalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <Pagination
                    count={postsTotalPages}
                    page={postsPage}
                    onChange={handlePostsPageChange}
                    color="primary"
                    size="large"
                    showFirstButton
                    showLastButton
                  />
                </Box>
              )}

              {/* 統計情報 */}
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="textSecondary">
                  全{postsTotalCount}件中 {((postsPage - 1) * postsLimit) + 1}〜{Math.min(postsPage * postsLimit, postsTotalCount)}件を表示
                </Typography>
              </Box>
            </>
          )}
        </>
      )}

      {/* ユーザー削除確認ダイアログ */}
      <Dialog open={deleteUserDialog.open} onClose={() => setDeleteUserDialog({ open: false })}>
        <DialogTitle>ユーザー削除確認</DialogTitle>
        <DialogContent>
          <Typography>
            ユーザー「{deleteUserDialog.user?.user_name}」を削除しますか？
            この操作は元に戻せません。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteUserDialog({ open: false })}>
            キャンセル
          </Button>
          <Button onClick={handleDeleteUser} color="error" variant="contained">
            削除
          </Button>
        </DialogActions>
      </Dialog>

      {/* 投稿削除確認ダイアログ */}
      <Dialog open={deletePostDialog.open} onClose={() => setDeletePostDialog({ open: false })}>
        <DialogTitle>投稿削除確認</DialogTitle>
        <DialogContent>
          <Typography>
            投稿ID「{deletePostDialog.post?.id}」を削除しますか？
            この操作は元に戻せません。
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeletePostDialog({ open: false })}>
            キャンセル
          </Button>
          <Button onClick={handleDeletePost} color="error" variant="contained">
            削除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DebugLogViewer;
