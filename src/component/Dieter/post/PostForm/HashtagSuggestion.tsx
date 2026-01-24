import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Tag } from '@mui/icons-material';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../../../recoil/darkModeAtom';
import { HashtagItem } from '../../../../hooks/useHashtagSuggestion';

interface HashtagSuggestionProps {
  suggestions: HashtagItem[];
  isLoading: boolean;
  selectedIndex: number;
  onSelect: (hashtag: HashtagItem) => void;
  onHover: (index: number) => void;
}

const HashtagSuggestion: React.FC<HashtagSuggestionProps> = ({
  suggestions,
  isLoading,
  selectedIndex,
  onSelect,
  onHover,
}) => {
  const isDarkMode = useRecoilValue(darkModeState);

  if (isLoading) {
    return (
      <Paper
        elevation={8}
        sx={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          zIndex: 1000,
          maxHeight: 300,
          overflow: 'auto',
          backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
          border: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0',
          borderRadius: 2,
          mt: 1,
        }}
      >
        <Box display="flex" justifyContent="center" alignItems="center" p={2}>
          <CircularProgress size={24} sx={{ color: '#1da1f2' }} />
          <Typography variant="body2" sx={{ ml: 1, color: isDarkMode ? '#fff' : '#333' }}>
            検索中...
          </Typography>
        </Box>
      </Paper>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Paper
      elevation={8}
      sx={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        zIndex: 1000,
        maxHeight: 300,
        overflow: 'auto',
        backgroundColor: isDarkMode ? '#1a1a1a' : '#ffffff',
        border: isDarkMode ? '1px solid #333' : '1px solid #e0e0e0',
        borderRadius: 2,
        mt: 1,
      }}
    >
      <List dense sx={{ py: 0.5 }}>
        {suggestions.map((hashtag, index) => (
          <ListItem
            key={hashtag.hashtag}
            onClick={() => onSelect(hashtag)}
            onMouseEnter={() => onHover(index)}
            sx={{
              cursor: 'pointer',
              backgroundColor: index === selectedIndex
                ? (isDarkMode ? 'rgba(29, 161, 242, 0.2)' : 'rgba(29, 161, 242, 0.1)')
                : 'transparent',
              '&:hover': {
                backgroundColor: isDarkMode ? 'rgba(29, 161, 242, 0.15)' : 'rgba(29, 161, 242, 0.08)',
              },
              transition: 'background-color 0.15s ease',
              py: 1,
              px: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 32 }}>
              <Tag
                sx={{
                  width: 24,
                  height: 24,
                  color: '#1da1f2',
                }}
              />
            </Box>
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: isDarkMode ? '#ffffff' : '#1da1f2',
                      fontSize: '0.9rem',
                    }}
                  >
                    {hashtag.hashtag}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: isDarkMode ? '#999' : '#666',
                      fontSize: '0.75rem',
                    }}
                  >
                    {hashtag.posts}件の投稿
                  </Typography>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default React.memo(HashtagSuggestion);
