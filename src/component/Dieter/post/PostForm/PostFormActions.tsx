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
import { useTranslation } from '../../../../hooks/useTranslation';

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
  const { t } = useTranslation();

  return (
    <Box 
      display="flex" 
      justifyContent="space-between" 
      alignItems="center"
      sx={{
        flexDirection: { xs: 'row', sm: 'row' },
        flexWrap: { xs: 'wrap', sm: 'nowrap' },
        gap: { xs: 1, sm: 2 }
      }}
    >
      {/* アクションボタン部分 */}
      <Box 
        display="flex" 
        gap={{ xs: 1, sm: 2 }} 
        alignItems="center"
        sx={{
          flex: { xs: '1 1 auto', sm: '0 0 auto' },
          minWidth: 0
        }}
      >
        {/* 画像アップロードボタン */}
        <Tooltip title={t('dieter', 'postModal.addPhoto', {}, '写真を追加')}>
          <span>
            <IconButton 
              onClick={onImageUpload}
              disabled={selectedImagesCount >= maxImages}
              sx={{
                color: selectedImagesCount >= maxImages ? '#9e9e9e' : '#29b6f6',
                borderRadius: 3,
                padding: { xs: 0.5, sm: 1 },
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
                  fontSize: { xs: '1.2rem', sm: '1.5rem' }
                }}
              />
            </IconButton>
          </span>
        </Tooltip>

        {/* 絵文字ボタン */}
        <Tooltip title={t('dieter', 'postModal.addEmoji', {}, '絵文字を追加')}>
          <IconButton 
            onClick={onEmojiClick}
            sx={{
              color: '#29b6f6',
              borderRadius: 3,
              padding: { xs: 0.5, sm: 1 },
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
                fontSize: { xs: '1.2rem', sm: '1.5rem' }
              }}
            />
          </IconButton>
        </Tooltip>
      </Box>

      {/* カウンター表示とポストボタン */}
      <Box 
        display="flex" 
        alignItems="center" 
        gap={{ xs: 1, sm: 2 }}
        sx={{
          flex: { xs: '1 1 auto', sm: '0 0 auto' },
          justifyContent: 'flex-end',
          minWidth: 0
        }}
      >
        {/* カウンター表示をコンパクトに */}
        <Box 
          display="flex" 
          alignItems="center" 
          gap={{ xs: 1, sm: 1.5 }}
          sx={{
            flexShrink: 0
          }}
        >
          {/* 画像アップロード進捗表示 */}
          <Typography
            variant="body2"
            sx={{
              color: selectedImagesCount >= maxImages ? '#f44336' : '#29b6f6',
              fontWeight: 500,
              fontSize: { xs: '0.7rem', sm: '0.8rem' },
              whiteSpace: 'nowrap'
            }}
          >
            📷{selectedImagesCount}/{maxImages}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: postContentLength > maxCharacters * 0.9 ? '#f44336' : '#29b6f6',
              fontWeight: 500,
              fontSize: { xs: '0.7rem', sm: '0.9rem' },
              whiteSpace: 'nowrap'
            }}
          >
            {postContentLength}/{maxCharacters}
          </Typography>
        </Box>

        {/* ポストボタン - より柔軟なサイズ */}
        <Button
          variant="contained"
          onClick={onPost}
          disabled={!canPost}
          sx={{ 
            borderRadius: { xs: 2, sm: 3 },
            px: { xs: 1.5, sm: 2.5 },
            py: { xs: 0.5, sm: 1 },
            fontSize: { xs: '0.8rem', sm: '0.9rem' },
            fontWeight: 600,
            background: 'linear-gradient(45deg, #29b6f6 30%, #42a5f5 90%)',
            boxShadow: '0 6px 20px rgba(41, 182, 246, 0.4)',
            transition: 'all 0.3s ease',
            minWidth: { xs: 'auto', sm: 'auto' },
            flexShrink: 0,
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
          {t('dieter', 'postModal.post', {}, 'ポスト')}
        </Button>
      </Box>
    </Box>
  );
};

export default PostFormActions;
