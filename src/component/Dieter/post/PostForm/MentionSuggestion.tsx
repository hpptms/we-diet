import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  CircularProgress,
  Paper,
} from '@mui/material';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../../../recoil/darkModeAtom';
import { MentionUser } from '../../../../hooks/useMentionSuggestion';

interface MentionSuggestionProps {
  suggestions: MentionUser[];
  isLoading: boolean;
  selectedIndex: number;
  onSelect: (user: MentionUser) => void;
  onHover: (index: number) => void;
}

const MentionSuggestion: React.FC<MentionSuggestionProps> = ({
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
          <CircularProgress size={24} sx={{ color: '#29b6f6' }} />
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
        {suggestions.map((user, index) => (
          <ListItem
            key={user.id}
            onClick={() => onSelect(user)}
            onMouseEnter={() => onHover(index)}
            sx={{
              cursor: 'pointer',
              backgroundColor: index === selectedIndex
                ? (isDarkMode ? 'rgba(41, 182, 246, 0.2)' : 'rgba(41, 182, 246, 0.1)')
                : 'transparent',
              '&:hover': {
                backgroundColor: isDarkMode ? 'rgba(41, 182, 246, 0.15)' : 'rgba(41, 182, 246, 0.08)',
              },
              transition: 'background-color 0.15s ease',
              py: 1,
              px: 2,
            }}
          >
            <ListItemAvatar sx={{ minWidth: 40 }}>
              <Avatar
                src={user.avatar && user.avatar.startsWith('http') ? user.avatar : undefined}
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: '#29b6f6',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                }}
              >
                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: isDarkMode ? '#ffffff' : '#1976d2',
                    fontSize: '0.9rem',
                  }}
                >
                  @{user.username}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default React.memo(MentionSuggestion);
