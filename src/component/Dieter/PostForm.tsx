import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Avatar,
  InputAdornment,
  IconButton,
  Typography,
} from '@mui/material';
import {
  PhotoCamera,
  EmojiEmotions,
  LocationOn,
  Image as ImageIcon,
} from '@mui/icons-material';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../recoil/darkModeAtom';

interface PostFormProps {
  onPost?: (content: string) => void;
}

const PostForm: React.FC<PostFormProps> = ({ onPost }) => {
  const [postContent, setPostContent] = useState('');
  const isDarkMode = useRecoilValue(darkModeState);
  const maxCharacters = 300;

  const handlePost = () => {
    if (postContent.trim()) {
      onPost?.(postContent);
      setPostContent('');
    }
  };

  const handleImageUpload = () => {
    // 画像アップロード処理を実装
    console.log('画像アップロード');
  };

  return (
    <Box sx={{ 
      p: 4, 
      mb: 0, 
      borderBottom: isDarkMode ? '2px solid #29b6f6' : '2px solid #e1f5fe',
      background: isDarkMode 
        ? '#000000' 
        : 'linear-gradient(135deg, rgba(227, 242, 253, 0.3) 0%, rgba(187, 222, 251, 0.2) 100%)'
    }}>
      <Box display="flex" gap={3}>
        <Avatar sx={{ 
          bgcolor: 'linear-gradient(45deg, #29b6f6 30%, #42a5f5 90%)',
          width: 56,
          height: 56,
          fontSize: '1.5rem',
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(41, 182, 246, 0.3)'
        }}>U</Avatar>
        <Box flex={1}>
          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="今どうしてる？"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            variant="outlined"
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: isDarkMode ? '#000000' : 'white',
                border: isDarkMode ? '2px solid #29b6f6' : '2px solid #e1f5fe',
                fontSize: '1.1rem',
                color: isDarkMode ? '#ffffff' : '#000000',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: '#29b6f6',
                  boxShadow: '0 4px 12px rgba(41, 182, 246, 0.15)'
                },
                '&.Mui-focused': {
                  borderColor: '#29b6f6',
                  boxShadow: '0 6px 20px rgba(41, 182, 246, 0.25)'
                }
              },
              '& .MuiInputBase-input::placeholder': {
                color: isDarkMode ? '#bbbbbb' : '#90a4ae',
                opacity: 1
              }
            }}
            inputProps={{ maxLength: maxCharacters }}
          />
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" gap={2}>
              <IconButton 
                onClick={handleImageUpload}
                sx={{
                  color: '#29b6f6',
                  borderRadius: 3,
                  padding: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(41, 182, 246, 0.1)',
                    transform: 'scale(1.1)',
                    boxShadow: '0 4px 12px rgba(41, 182, 246, 0.3)'
                  }
                }}
              >
                <ImageIcon fontSize="large" />
              </IconButton>
            </Box>
            <Box display="flex" alignItems="center" gap={3}>
              <Typography
                variant="body1"
                sx={{
                  color: postContent.length > maxCharacters * 0.9 ? '#f44336' : '#29b6f6',
                  fontWeight: 500,
                  fontSize: '1rem'
                }}
              >
                {postContent.length}/{maxCharacters}
              </Typography>
              <Button
                variant="contained"
                onClick={handlePost}
                disabled={!postContent.trim() || postContent.length > maxCharacters}
                sx={{ 
                  borderRadius: 4,
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(45deg, #29b6f6 30%, #42a5f5 90%)',
                  boxShadow: '0 6px 20px rgba(41, 182, 246, 0.4)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #0288d1 30%, #1976d2 90%)',
                    boxShadow: '0 8px 25px rgba(41, 182, 246, 0.6)',
                    transform: 'translateY(-2px)'
                  },
                  '&:disabled': {
                    background: '#e0e0e0',
                    color: '#9e9e9e'
                  }
                }}
              >
                ポスト
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PostForm;
