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
  CircularProgress
} from '@mui/material';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../recoil/darkModeAtom';

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
  const [logs, setLogs] = useState<DebugLogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [filterSource, setFilterSource] = useState('');
  const [filterUserId, setFilterUserId] = useState('');
  const [filterLogLevel, setFilterLogLevel] = useState('');

  const fetchDebugLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterUserId) params.append('user_id', filterUserId);
      if (filterSource) params.append('source', filterSource);
      params.append('limit', limit.toString());
      params.append('offset', ((page - 1) * limit).toString());

      const response = await fetch(`${import.meta.env.VITE_API_ENDPOINT}debug_logs?${params}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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

  useEffect(() => {
    fetchDebugLogs();
  }, [page, limit, filterSource, filterUserId, filterLogLevel]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleLimitChange = (event: SelectChangeEvent<number>) => {
    setLimit(event.target.value as number);
    setPage(1);
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
          🔧 デバッグログビューア
        </Typography>
        <Button variant="outlined" onClick={onBack}>
          ← ダッシュボードに戻る
        </Button>
      </Box>

      {/* フィルター */}
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

      {/* ローディング表示 */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* ログテーブル */}
      {!loading && (
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
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {log.message}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ 
                          maxWidth: 300,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontFamily: 'monospace',
                          fontSize: '0.8rem'
                        }}>
                          {log.details || '-'}
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
    </Box>
  );
};

export default DebugLogViewer;
