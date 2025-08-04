import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  Button,
  Tooltip,
  FormControlLabel,
  Checkbox,
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
    <Box 
      display="flex" 
      justifyContent="space-between" 
      alignItems="center"
      sx={{
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 }
      }}
    >
      {/* モバイル表示用のコンパクトなレイアウト */}
      <Box 
        display="flex" 
        gap={{ xs: 1.5, sm: 2 }} 
        alignItems="center"
        sx={{
          width: { xs: '100%', sm: 'auto' },
          justifyContent: { xs: 'center', sm: 'flex-start' }
        }}
      >
        {/* 画像アップロードボタン */}
        <IconButton 
          onClick={onImageUpload}
          disabled={selectedImagesCount >= maxImages}
          sx={{
            color: selectedImagesCount >= maxImages ? '#9e9e9e' : '#29b6f6',
            borderRadius: 3,
            padding: { xs: 1, sm: 1.5 },
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: selectedImagesCount >= maxImages ? 'transparent' : 'rgba(41, 182, 246, 0.1)',
              transform: selectedImagesCount >= maxImages ? 'none' : 'scale(1.1)',
              boxShadow: selectedImagesCount >= maxImages ? 'none' : '0 4px 12px rgba(41, 182, 246, 0.3)'
            }
          }}
        >
          <ImageIcon 
            sx={{
              fontSize: { xs: '1.5rem', sm: '2rem' }
            }}
          />
        </IconButton>

        {/* 絵文字ボタン */}
        <IconButton 
          onClick={onEmojiClick}
          sx={{
            color: '#29b6f6',
            borderRadius: 3,
            padding: { xs: 1, sm: 1.5 },
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(41, 182, 246, 0.1)',
              transform: 'scale(1.1)',
              boxShadow: '0 4px 12px rgba(41, 182, 246, 0.3)'
            }
          }}
        >
          <EmojiEmotions 
            sx={{
              fontSize: { xs: '1.5rem', sm: '2rem' }
            }}
          />
        </IconButton>

        {/* ポストボタン - モバイルではコンパクトに */}
        <Button
          variant="contained"
          onClick={onPost}
          disabled={!canPost}
          sx={{ 
            borderRadius: { xs: 3, sm: 4 },
            px: { xs: 2.5, sm: 4 },
            py: { xs: 1, sm: 1.5 },
            fontSize: { xs: '0.9rem', sm: '1.1rem' },
            fontWeight: 600,
            background: 'linear-gradient(45deg, #29b6f6 30%, #42a5f5 90%)',
            boxShadow: '0 6px 20px rgba(41, 182, 246, 0.4)',
            transition: 'all 0.3s ease',
            minWidth: { xs: 'auto', sm: 'auto' },
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

      {/* カウンター表示 - モバイルでは小さく表示 */}
      <Box 
        display="flex" 
        alignItems="center" 
        gap={{ xs: 2, sm: 3 }}
        sx={{
          width: { xs: '100%', sm: 'auto' },
          justifyContent: { xs: 'space-between', sm: 'flex-end' }
        }}
      >
        {/* 画像アップロード進捗表示 */}
        <Typography
          variant="body2"
          sx={{
            color: selectedImagesCount >= maxImages ? '#f44336' : '#29b6f6',
            fontWeight: 500,
            fontSize: { xs: '0.8rem', sm: '0.9rem' }
          }}
        >
          画像 {selectedImagesCount}/{maxImages}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: postContentLength > maxCharacters * 0.9 ? '#f44336' : '#29b6f6',
            fontWeight: 500,
            fontSize: { xs: '0.8rem', sm: '1rem' }
          }}
        >
          {postContentLength}/{maxCharacters}
        </Typography>
      </Box>
    </Box>
  );
};

export default PostFormActions;
