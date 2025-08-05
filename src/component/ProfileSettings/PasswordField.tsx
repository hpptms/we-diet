import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';

interface PasswordFieldProps {
  isDarkMode: boolean;
}

const PasswordField: React.FC<PasswordFieldProps> = ({ isDarkMode }) => {
  const [hasPassword, setHasPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [changing, setChanging] = useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  // ユーザー情報とパスワード有無を取得
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userIdFromStorage = localStorage.getItem('user_id');
        if (!userIdFromStorage) {
          setError('ユーザーIDが見つかりません');
          return;
        }

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/user/${userIdFromStorage}`
        );

        if (response.status === 200) {
          setHasPassword(response.data.has_password);
        }
      } catch (error: any) {
        console.error('ユーザー情報取得エラー:', error);
        setError('ユーザー情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handlePasswordChange = async () => {
    setError('');
    setMessage('');

    // バリデーション
    if (newPassword.length < 6) {
      setError('新しいパスワードは6文字以上である必要があります');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('新しいパスワードと確認用パスワードが一致しません');
      return;
    }

    if (hasPassword && !currentPassword) {
      setError('現在のパスワードを入力してください');
      return;
    }

    setChanging(true);

    try {
      const userIdFromStorage = localStorage.getItem('user_id');
      if (!userIdFromStorage) {
        setError('ユーザーIDが見つかりません');
        return;
      }

      const requestData = {
        current_password: hasPassword ? currentPassword : '',
        new_password: newPassword,
      };

      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/user/${userIdFromStorage}/password`,
        requestData
      );

      if (response.status === 200) {
        setMessage('パスワードが正常に変更されました');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setHasPassword(true); // パスワードが設定されました
      }
    } catch (error: any) {
      console.error('パスワード変更エラー:', error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('パスワードの変更に失敗しました');
      }
    } finally {
      setChanging(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ color: isDarkMode ? '#ffffff' : 'inherit' }}>
          パスワード設定
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      </Box>
    );
  }

  // パスワードが設定されていないユーザーには表示しない
  if (!hasPassword) {
    return null;
  }

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: isDarkMode ? '#ffffff' : 'inherit' }}>
        パスワード変更
      </Typography>

      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {hasPassword && (
          <TextField
            label="現在のパスワード"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            variant="outlined"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: isDarkMode ? '#000000' : 'white',
                color: isDarkMode ? '#ffffff' : 'inherit',
                '& fieldset': {
                  borderColor: isDarkMode ? '#ffffff' : 'rgba(0, 0, 0, 0.23)',
                },
                '&:hover fieldset': {
                  borderColor: isDarkMode ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: isDarkMode ? '#ffffff' : '#1976d2',
                },
              },
              '& .MuiInputLabel-root': {
                color: isDarkMode ? '#ffffff' : 'inherit',
                '&.Mui-focused': {
                  color: isDarkMode ? '#ffffff' : '#1976d2',
                },
              },
            }}
          />
        )}

        <TextField
          label="新しいパスワード"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          variant="outlined"
          fullWidth
          helperText="6文字以上で入力してください"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: isDarkMode ? '#000000' : 'white',
              color: isDarkMode ? '#ffffff' : 'inherit',
              '& fieldset': {
                borderColor: isDarkMode ? '#ffffff' : 'rgba(0, 0, 0, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: isDarkMode ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
              },
              '&.Mui-focused fieldset': {
                borderColor: isDarkMode ? '#ffffff' : '#1976d2',
              },
            },
            '& .MuiInputLabel-root': {
              color: isDarkMode ? '#ffffff' : 'inherit',
              '&.Mui-focused': {
                color: isDarkMode ? '#ffffff' : '#1976d2',
              },
            },
            '& .MuiFormHelperText-root': {
              color: isDarkMode ? '#ffffff' : 'inherit',
            },
          }}
        />

        <TextField
          label="新しいパスワード（確認）"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          variant="outlined"
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: isDarkMode ? '#000000' : 'white',
              color: isDarkMode ? '#ffffff' : 'inherit',
              '& fieldset': {
                borderColor: isDarkMode ? '#ffffff' : 'rgba(0, 0, 0, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: isDarkMode ? '#ffffff' : 'rgba(0, 0, 0, 0.87)',
              },
              '&.Mui-focused fieldset': {
                borderColor: isDarkMode ? '#ffffff' : '#1976d2',
              },
            },
            '& .MuiInputLabel-root': {
              color: isDarkMode ? '#ffffff' : 'inherit',
              '&.Mui-focused': {
                color: isDarkMode ? '#ffffff' : '#1976d2',
              },
            },
          }}
        />

        <Button
          variant="contained"
          onClick={handlePasswordChange}
          disabled={changing}
          sx={{
            backgroundColor: isDarkMode ? '#ffffff' : '#1976d2',
            color: isDarkMode ? '#000000' : '#ffffff',
            '&:hover': {
              backgroundColor: isDarkMode ? '#f0f0f0' : '#1565c0',
            },
            '&:disabled': {
              backgroundColor: isDarkMode ? '#666666' : '#cccccc',
              color: isDarkMode ? '#999999' : '#666666',
            },
          }}
        >
          {changing ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              変更中...
            </>
          ) : (
            'パスワードを変更'
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default PasswordField;
