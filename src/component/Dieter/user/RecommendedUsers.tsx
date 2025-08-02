import React from 'react';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Divider,
} from '@mui/material';
import {
  PersonAdd,
} from '@mui/icons-material';
import { RecommendedUser } from '../types';

interface RecommendedUsersProps {
  users: RecommendedUser[];
  onFollow?: (username: string) => void;
}

const RecommendedUsers: React.FC<RecommendedUsersProps> = ({ users, onFollow }) => {
  return (
    <Box sx={{ 
      p: 2
    }}>
      <Typography variant="h6" sx={{ 
        fontWeight: 700, 
        mb: 2,
        color: '#0277bd',
        fontSize: '1.1rem',
        background: 'linear-gradient(45deg, #29b6f6 30%, #42a5f5 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        ⭐ おすすめユーザー
      </Typography>
      {users.map((user, index) => (
        <Box key={index} sx={{
          mb: 2,
          p: 1.5,
          borderRadius: 3,
          backgroundColor: 'white',
          border: '1px solid #e1f5fe',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-2px) translateX(4px)',
            borderColor: '#29b6f6'
          }
        }}>
          <Box display="flex" flexDirection="column" gap={1.5}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Avatar 
                src={user.avatar.startsWith('http') ? user.avatar : undefined}
                sx={{ 
                  bgcolor: 'linear-gradient(45deg, #42a5f5 30%, #29b6f6 90%)',
                  width: 36,
                  height: 36,
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  boxShadow: '0 3px 10px rgba(66, 165, 245, 0.3)'
                }}
              >
                {!user.avatar.startsWith('http') ? user.avatar : user.name?.charAt(0) || 'U'}
              </Avatar>
              <Box flex={1}>
                <Typography variant="subtitle1" sx={{ 
                  fontWeight: 600,
                  color: '#0277bd',
                  fontSize: '0.95rem'
                }}>
                  {user.name}
                </Typography>
              </Box>
            </Box>
            <Button
              variant={user.isFollowing ? 'outlined' : 'contained'}
              size="small"
              startIcon={<PersonAdd sx={{ fontSize: '1rem' }} />}
              fullWidth
              sx={{ 
                borderRadius: 4,
                py: 1,
                fontSize: '0.8rem',
                fontWeight: 600,
                ...(user.isFollowing ? {
                  borderColor: '#29b6f6',
                  color: '#29b6f6',
                  '&:hover': {
                    borderColor: '#0288d1',
                    backgroundColor: 'rgba(41, 182, 246, 0.08)',
                    transform: 'scale(1.02)'
                  }
                } : {
                  background: 'linear-gradient(45deg, #29b6f6 30%, #42a5f5 90%)',
                  boxShadow: '0 4px 12px rgba(41, 182, 246, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #0288d1 30%, #1976d2 90%)',
                    boxShadow: '0 6px 16px rgba(41, 182, 246, 0.6)',
                    transform: 'scale(1.02)'
                  }
                }),
                transition: 'all 0.3s ease'
              }}
              onClick={() => onFollow?.(user.username)}
            >
              {user.isFollowing ? 'フォロー中' : 'フォロー'}
            </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default RecommendedUsers;
