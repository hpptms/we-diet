import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Favorite,
  ChatBubbleOutline,
  Repeat,
  Share,
} from '@mui/icons-material';
import { Post } from './types';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <Box sx={{ 
      p: 4, 
      mb: 0, 
      borderBottom: '2px solid #e1f5fe',
      transition: 'all 0.3s ease',
      '&:hover': { 
        backgroundColor: 'rgba(227, 242, 253, 0.4)',
        transform: 'translateX(4px)',
        boxShadow: '0 4px 20px rgba(41, 182, 246, 0.1)'
      } 
    }}>
      <Box display="flex" gap={3}>
          <Avatar sx={{ 
            bgcolor: 'linear-gradient(45deg, #42a5f5 30%, #29b6f6 90%)',
            width: 48,
            height: 48,
            fontSize: '1.2rem',
            fontWeight: 'bold',
            boxShadow: '0 3px 10px rgba(66, 165, 245, 0.3)'
          }}>{post.user.avatar}</Avatar>
          <Box flex={1}>
            <Box display="flex" alignItems="center" gap={2} mb={2}>
              <Typography variant="subtitle1" sx={{ 
                fontWeight: 600,
                color: '#0277bd',
                fontSize: '1.1rem'
              }}>
                {post.user.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#546e7a' }}>
                {post.user.username}
              </Typography>
              <Typography variant="body2" sx={{ color: '#90a4ae' }}>
                ·
              </Typography>
              <Typography variant="body2" sx={{ color: '#90a4ae' }}>
                {post.timestamp}
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ 
              mb: 3, 
              lineHeight: 1.6,
              fontSize: '1.1rem',
              color: '#37474f'
            }}>
              {post.content}
            </Typography>
            {post.image && (
              <Box mb={3}>
                <img
                  src={post.image}
                  alt="投稿画像"
                  style={{
                    width: '100%',
                    maxHeight: '400px',
                    objectFit: 'cover',
                    borderRadius: '16px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                    border: '2px solid #e1f5fe'
                  }}
                />
              </Box>
            )}
            <Box display="flex" justifyContent="space-between" maxWidth={400}>
              <Box display="flex" alignItems="center" gap={1}>
                <IconButton 
                  size="medium"
                  sx={{
                    color: '#29b6f6',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(41, 182, 246, 0.1)',
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 12px rgba(41, 182, 246, 0.3)'
                    }
                  }}
                >
                  <ChatBubbleOutline />
                </IconButton>
                <Typography variant="body2" sx={{ 
                  color: '#546e7a',
                  fontWeight: 500
                }}>
                  {post.comments}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <IconButton 
                  size="medium"
                  sx={{
                    color: '#4caf50',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(76, 175, 80, 0.1)',
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                    }
                  }}
                >
                  <Repeat />
                </IconButton>
                <Typography variant="body2" sx={{ 
                  color: '#546e7a',
                  fontWeight: 500
                }}>
                  {post.retweets}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <IconButton 
                  size="medium"
                  sx={{
                    color: '#e91e63',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(233, 30, 99, 0.1)',
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 12px rgba(233, 30, 99, 0.3)'
                    }
                  }}
                >
                  <Favorite />
                </IconButton>
                <Typography variant="body2" sx={{ 
                  color: '#546e7a',
                  fontWeight: 500
                }}>
                  {post.likes}
                </Typography>
              </Box>
              <IconButton 
                size="medium"
                sx={{
                  color: '#ff9800',
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 152, 0, 0.1)',
                    transform: 'scale(1.1)',
                    boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)'
                  }
                }}
              >
                <Share />
              </IconButton>
            </Box>
          </Box>
        </Box>
    </Box>
  );
};

export default PostCard;
