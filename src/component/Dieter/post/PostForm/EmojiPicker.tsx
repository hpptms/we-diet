import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  Popover,
  Grid,
  Tabs,
  Tab,
} from '@mui/material';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../../../recoil/darkModeAtom';
import { emojiCategories, getRecentEmojis, addRecentEmoji } from '../../emoji';

interface EmojiPickerProps {
  anchorEl: HTMLButtonElement | null;
  onClose: () => void;
  onEmojiSelect: (emoji: string) => void;
  selectedCategory: number;
  onCategoryChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({
  anchorEl,
  onClose,
  onEmojiSelect,
  selectedCategory,
  onCategoryChange,
}) => {
  const isDarkMode = useRecoilValue(darkModeState);
  const isOpen = Boolean(anchorEl);

  const handleEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    addRecentEmoji(emoji);
    onClose();
  };

  // 最近使った絵文字を含む動的なカテゴリーリストを生成
  const getDynamicEmojiCategories = () => {
    const categories = [...emojiCategories];
    const recentEmojis = getRecentEmojis();
    categories[0] = {
      ...categories[0],
      emojis: recentEmojis
    };
    return categories;
  };

  return (
    <Popover
      open={isOpen}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
    >
      <Box sx={{ 
        width: 480,
        maxHeight: 400,
        backgroundColor: isDarkMode ? '#000000' : 'white',
        border: isDarkMode ? '1px solid #29b6f6' : '1px solid #e0e0e0',
        borderRadius: 2,
        overflow: 'hidden'
      }}>
        {/* カテゴリータブ */}
        <Tabs
          value={selectedCategory}
          onChange={onCategoryChange}
          variant="scrollable"
          scrollButtons={true}
          allowScrollButtonsMobile
          sx={{
            borderBottom: isDarkMode ? '1px solid #29b6f6' : '1px solid #e0e0e0',
            '& .MuiTab-root': {
              minWidth: 42,
              fontSize: '1rem',
              color: isDarkMode ? '#ffffff' : '#666666',
              padding: '4px 2px',
              '&.Mui-selected': {
                color: '#29b6f6'
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#29b6f6'
            },
            '& .MuiTabs-scrollButtons': {
              color: '#29b6f6',
              '&.Mui-disabled': {
                opacity: 0.3
              }
            }
          }}
        >
          {getDynamicEmojiCategories().map((category, index) => (
            <Tab
              key={index}
              icon={<span style={{ fontSize: '1rem' }}>{category.icon}</span>}
              title={category.name}
            />
          ))}
        </Tabs>

        {/* 絵文字グリッド */}
        <Box sx={{ 
          p: 2, 
          maxHeight: 280,
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '5px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(0,0,0,0.1)',
            borderRadius: '2px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(41, 182, 246, 0.5)',
            borderRadius: '2px',
            '&:hover': {
              background: 'rgba(41, 182, 246, 0.7)',
            },
          }
        }}>
          <Grid container spacing={0.3}>
            {getDynamicEmojiCategories()[selectedCategory].emojis.length === 0 && selectedCategory === 0 ? (
              <Box sx={{ 
                width: '100%', 
                textAlign: 'center', 
                py: 4,
                color: isDarkMode ? '#666666' : '#999999'
              }}>
                <Typography variant="body2">
                  まだ絵文字を使用していません
                </Typography>
              </Box>
            ) : (
              getDynamicEmojiCategories()[selectedCategory].emojis.map((emoji, index) => (
                <Grid item key={`${selectedCategory}-${index}`}>
                  <IconButton
                    onClick={() => handleEmojiClick(emoji)}
                    sx={{
                      fontSize: '1.1rem',
                      width: 28,
                      height: 28,
                      padding: 0,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(41, 182, 246, 0.1)',
                        transform: 'scale(1.2)',
                        borderRadius: '50%'
                      }
                    }}
                  >
                    {emoji}
                  </IconButton>
                </Grid>
              ))
            )}
          </Grid>
        </Box>

        {/* カテゴリー名表示 */}
        <Box sx={{
          px: 1.5,
          py: 0.5,
          backgroundColor: isDarkMode ? 'rgba(41, 182, 246, 0.1)' : 'rgba(41, 182, 246, 0.05)',
          borderTop: isDarkMode ? '1px solid #29b6f6' : '1px solid #e0e0e0'
        }}>
          <Typography
            variant="caption"
            sx={{
              color: isDarkMode ? '#29b6f6' : '#666666',
              fontWeight: 500,
              fontSize: '0.75rem'
            }}
          >
            {getDynamicEmojiCategories()[selectedCategory].name} ({getDynamicEmojiCategories()[selectedCategory].emojis.length}個)
          </Typography>
        </Box>
      </Box>
    </Popover>
  );
};

export default EmojiPicker;
