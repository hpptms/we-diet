import React from 'react';
import {
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
} from '@mui/icons-material';
import { TrendingTopic } from './types';

interface TrendingTopicsProps {
  topics: TrendingTopic[];
}

const TrendingTopics: React.FC<TrendingTopicsProps> = ({ topics }) => {
  return (
    <Box sx={{ 
      p: 3, 
      mb: 4,
      borderBottom: '2px solid #e1f5fe'
    }}>
      <Typography variant="h6" sx={{ 
        fontWeight: 700, 
        mb: 3,
        color: '#0277bd',
        fontSize: '1.3rem',
        background: 'linear-gradient(45deg, #29b6f6 30%, #42a5f5 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        🔥 いまどうしてる
      </Typography>
      {topics.map((topic, index) => (
        <Box key={index} sx={{
          mb: 3,
          p: 2,
          borderRadius: 3,
          backgroundColor: 'white',
          border: '1px solid #e1f5fe',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          '&:hover': {
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-2px) translateX(4px)',
            borderColor: '#29b6f6'
          }
        }}>
          <Box display="flex" alignItems="center" gap={2} mb={1}>
            <Box sx={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #29b6f6 30%, #42a5f5 90%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.9rem'
            }}>
              {index + 1}
            </Box>
            <TrendingUp sx={{ color: '#29b6f6', fontSize: '1.5rem' }} />
            <Typography variant="body2" sx={{ 
              color: '#546e7a',
              fontWeight: 500
            }}>
              トレンド
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ 
            fontWeight: 600,
            color: '#0277bd',
            fontSize: '1.2rem',
            mb: 1
          }}>
            {topic.hashtag}
          </Typography>
          <Typography variant="body2" sx={{ 
            color: '#546e7a',
            fontWeight: 500
          }}>
            {topic.posts.toLocaleString()}件の投稿
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default TrendingTopics;
