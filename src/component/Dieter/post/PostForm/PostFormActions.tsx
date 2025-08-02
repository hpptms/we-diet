import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  Button,
  Tooltip,
} from '@mui/material';
import {
  Image as ImageIcon,
  EmojiEmotions,
} from '@mui/icons-material';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../../../recoil/darkModeAtom';

interface PostFormActionsProps {
  selectedImagesCount: number;
  maxImages: number;
  postContentLength: number;
  maxCharacters: number;
  onImageUpload: () => void;
  onEmojiClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onPost: () => void;
  canPost: boolean;
}

const PostFormActions: React.FC<PostFormActionsProps> = ({
  selectedImagesCount,
  maxImages,
  postContentLength,
  maxCharacters,
  onImageUpload,
  onEmojiClick,
  onPost,
  canPost,
}) => {
  const isDarkMode = useRecoilValue(darkModeState);

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Box display="flex" gap={2} alignItems="center">
        {/* 画像アップロードボタン */}
        <IconButton 
          onClick={onImageUpload}
          disabled={selectedImagesCount >= maxImages}
          sx={{
            color: selectedImagesCount >= maxImages ? '#9e9e9e' : '#29b6f6',
            borderRadius: 3,
            padding: 1.5,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: selectedImagesCount >= maxImages ? 'transparent' : 'rgba(41, 182, 246, 0.1)',
              transform: selectedImagesCount >= maxImages ? 'none' : 'scale(1.1)',
              boxShadow: selectedImagesCount >= maxImages ? 'none' : '0 4px 12px rgba(41, 182, 246, 0.3)'
            }
          }}
        >
          <ImageIcon fontSize="large" />
        </IconButton>

        {/* 画像アップロード進捗表示 */}
        <Typography
          variant="body2"
          sx={{
            color: selectedImagesCount >= maxImages ? '#f44336' : '#29b6f6',
            fontWeight: 500,
            fontSize: '0.9rem'
          }}
        >
          {selectedImagesCount}/{maxImages}
        </Typography>

        {/* 絵文字ボタン */}
        <IconButton 
          onClick={onEmojiClick}
          sx={{
            color: '#29b6f6',
            borderRadius: 3,
            padding: 1.5,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(41, 182, 246, 0.1)',
              transform: 'scale(1.1)',
              boxShadow: '0 4px 12px rgba(41, 182, 246, 0.3)'
            }
          }}
        >
          <EmojiEmotions fontSize="large" />
        </IconButton>
      </Box>

      <Box display="flex" alignItems="center" gap={3}>
        <Typography
          variant="body1"
          sx={{
            color: postContentLength > maxCharacters * 0.9 ? '#f44336' : '#29b6f6',
            fontWeight: 500,
            fontSize: '1rem'
          }}
        >
          {postContentLength}/{maxCharacters}
        </Typography>
        <Tooltip 
          title="shift+enter" 
          placement="top"
          arrow
          sx={{
            '& .MuiTooltip-tooltip': {
              backgroundColor: isDarkMode ? '#29b6f6' : '#1976d2',
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: 500,
              borderRadius: 2,
              padding: '6px 12px'
            },
            '& .MuiTooltip-arrow': {
              color: isDarkMode ? '#29b6f6' : '#1976d2'
            }
          }}
        >
          <span>
            <Button
              variant="contained"
              onClick={onPost}
              disabled={!canPost}
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
          </span>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default PostFormActions;
