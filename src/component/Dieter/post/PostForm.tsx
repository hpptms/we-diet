import React, { useState, useRef } from 'react';
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../../recoil/darkModeAtom';
import {
  EmojiPicker,
  ImagePreview,
  UserAvatar,
  PostFormActions,
} from './PostForm/index';
import { useTranslation } from '../../../hooks/useTranslation';

interface PostFormProps {
  onPost?: (content: string, images?: File[], isSensitive?: boolean) => Promise<void>;
  currentUser?: {
    name: string;
    avatar?: string;
  };
}

const PostForm: React.FC<PostFormProps> = ({ onPost, currentUser = { name: 'ユーザー', avatar: '' } }) => {
  const { t } = useTranslation();
  const [postContent, setPostContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isSensitive, setIsSensitive] = useState(false);
  const [emojiAnchorEl, setEmojiAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isDarkMode = useRecoilValue(darkModeState);
  const maxCharacters = 300;
  const maxImages = 3;

  const handleEmojiCategoryChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedEmojiCategory(newValue);
  };

  const handlePost = async () => {
    if (postContent.trim() || selectedImages.length > 0) {
      try {
        await onPost?.(postContent, selectedImages, isSensitive);
        
        // 投稿成功後にフォームをリセット
        imageUrls.forEach(url => URL.revokeObjectURL(url));
        setPostContent('');
        setSelectedImages([]);
        setImageUrls([]);
        setHashtags([]);
        setIsSensitive(false);
        
        console.log('投稿フォームがリセットされました');
      } catch (error) {
        console.error('投稿処理でエラーが発生しました:', error);
      }
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.shiftKey && event.key === 'Enter') {
      event.preventDefault();
      handlePost();
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files).slice(0, maxImages - selectedImages.length);
      const newUrls = newImages.map(file => URL.createObjectURL(file));
      
      setSelectedImages(prev => [...prev, ...newImages]);
      setImageUrls(prev => [...prev, ...newUrls]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const urlToRevoke = imageUrls[index];
    if (urlToRevoke) {
      URL.revokeObjectURL(urlToRevoke);
    }
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  React.useEffect(() => {
    return () => {
      imageUrls.forEach(url => {
        URL.revokeObjectURL(url);
      });
    };
  }, [imageUrls]);

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPostContent(value);
    
    // Extract hashtags from the content
    const hashtagMatches = value.match(/#[\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/g);
    const extractedHashtags = hashtagMatches ? Array.from(new Set(hashtagMatches)) : [];
    setHashtags(extractedHashtags);
  };

  const handleEmojiSelect = (emoji: string) => {
    const newContent = postContent + emoji;
    setPostContent(newContent);
    
    // Update hashtags after adding emoji
    const hashtagMatches = newContent.match(/#[\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]+/g);
    const extractedHashtags = hashtagMatches ? Array.from(new Set(hashtagMatches)) : [];
    setHashtags(extractedHashtags);
  };


  const openEmojiPicker = (event: React.MouseEvent<HTMLButtonElement>) => {
    setEmojiAnchorEl(event.currentTarget);
  };

  const closeEmojiPicker = () => {
    setEmojiAnchorEl(null);
  };

  const canPost = (Boolean(postContent.trim()) || selectedImages.length > 0) && postContent.length <= maxCharacters;

  return (
    <Box sx={{ 
      p: { xs: 2, sm: 4 }, 
      mb: 0, 
      borderBottom: isDarkMode ? '2px solid #29b6f6' : '2px solid #e1f5fe',
      background: isDarkMode 
        ? '#000000' 
        : 'linear-gradient(135deg, rgba(227, 242, 253, 0.3) 0%, rgba(187, 222, 251, 0.2) 100%)'
    }}>
      {/* 隠されたファイル入力 */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        multiple
        onChange={handleFileSelect}
      />

      <Box display="flex" gap={{ xs: 2, sm: 3 }}>
        <UserAvatar currentUser={currentUser} />
        <Box flex={1}>
          <TextField
            multiline
            rows={3}
            fullWidth
            placeholder={t('dieter', 'postModal.placeholder', {}, '今どうしてる？')}
            value={postContent}
            onChange={handleContentChange}
            onKeyDown={handleKeyDown}
            variant="outlined"
            sx={{ 
              mb: 1.5,
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                backgroundColor: isDarkMode ? '#000000' : 'white',
                border: isDarkMode ? '2px solid #29b6f6' : '2px solid #e1f5fe',
                fontSize: { xs: '1rem', sm: '1.1rem' },
                color: isDarkMode ? '#ffffff' : '#000000',
                transition: 'all 0.3s ease',
                outline: 'none',
                '&:hover': {
                  borderColor: '#29b6f6',
                  boxShadow: '0 4px 12px rgba(41, 182, 246, 0.15)'
                },
                '&.Mui-focused': {
                  borderColor: '#29b6f6',
                  boxShadow: '0 6px 20px rgba(41, 182, 246, 0.25)',
                  outline: 'none'
                }
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none'
              },
              '& .MuiInputBase-input::placeholder': {
                color: isDarkMode ? '#bbbbbb' : '#90a4ae',
                opacity: 1
              }
            }}
            inputProps={{ maxLength: maxCharacters }}
          />

          {/* Hashtags display */}
          {hashtags.length > 0 && (
            <Box
              sx={{
                mb: 1.5,
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              {hashtags.map((hashtag, index) => (
                <Box
                  key={`hashtag-${index}-${hashtag}`}
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: isDarkMode ? '#4A90E2' : '#87CEEB',
                    color: isDarkMode ? '#fff' : '#333',
                    padding: '6px 12px',
                    borderRadius: '16px',
                    fontSize: '14px',
                    border: isDarkMode ? '1px solid #357ABD' : '1px solid #5DADE2',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    fontWeight: 500,
                  }}
                >
                  {hashtag}
                </Box>
              ))}
            </Box>
          )}

          <ImagePreview 
            imageUrls={imageUrls}
            onRemoveImage={removeImage}
          />

          <PostFormActions
            selectedImagesCount={selectedImages.length}
            maxImages={maxImages}
            postContentLength={postContent.length}
            maxCharacters={maxCharacters}
            onImageUpload={handleImageUpload}
            onEmojiClick={openEmojiPicker}
            onPost={handlePost}
            canPost={canPost}
          />

          {/* センシティブチェックボックス - 文字か写真の入力がある時のみ表示 */}
          {(Boolean(postContent.trim()) || selectedImages.length > 0) && (
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                justifyContent: 'center',
                backgroundColor: isDarkMode ? 'rgba(41, 182, 246, 0.1)' : 'rgba(41, 182, 246, 0.05)',
                border: isDarkMode ? '1px solid rgba(41, 182, 246, 0.3)' : '1px solid rgba(41, 182, 246, 0.2)',
                borderRadius: 3,
                padding: 2,
                transition: 'all 0.3s ease',
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isSensitive}
                    onChange={(e) => setIsSensitive(e.target.checked)}
                    sx={{
                      color: '#29b6f6',
                      '&.Mui-checked': {
                        color: '#29b6f6',
                      },
                      '& .MuiSvgIcon-root': {
                        fontSize: 20,
                      }
                    }}
                  />
                }
                label={t('dieter', 'postModal.sensitive', {}, 'センシティブ')}
                sx={{
                  '& .MuiFormControlLabel-label': {
                    color: isDarkMode ? '#ffffff' : '#333333',
                    fontSize: '1rem',
                    fontWeight: 500,
                  }
                }}
              />
            </Box>
          )}

        </Box>
      </Box>

      <EmojiPicker
        anchorEl={emojiAnchorEl}
        onClose={closeEmojiPicker}
        onEmojiSelect={handleEmojiSelect}
        selectedCategory={selectedEmojiCategory}
        onCategoryChange={handleEmojiCategoryChange}
      />
    </Box>
  );
};

export default PostForm;
