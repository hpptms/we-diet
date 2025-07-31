import React from 'react';
import {
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  TrendingUp,
} from '@mui/icons-material';
import { useRecoilValue } from 'recoil';
import { TrendingTopic } from './types';
import { darkModeState } from '../../recoil/darkModeAtom';

interface TrendingTopicsProps {
  topics: TrendingTopic[];
}

const TrendingTopics: React.FC<TrendingTopicsProps> = ({ topics }) => {
  const isDarkMode = useRecoilValue(darkModeState);
  
  return (
    <Box sx={{ 
      p: 2, 
      mb: 2
    }}>
      <Typography variant="h6" sx={{ 
        fontWeight: 700, 
        mb: 2,
        color: isDarkMode ? '#ffffff' : '#0277bd',
        fontSize: '1.1rem',
        background: 'linear-gradient(45deg, #29b6f6 30%, #42a5f5 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        🔥 いまどうしてる
      </Typography>
      {topics.map((topic, index) => (
        <Box key={index} sx={{
          mb: 2,
          p: 1.5,
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
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <Box sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'linear-gradient(45deg, #29b6f6 30%, #42a5f5 90%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.75rem'
            }}>
              {index + 1}
            </Box>
            <TrendingUp sx={{ color: '#29b6f6', fontSize: '1.2rem' }} />
            <Typography variant="body2" sx={{ 
              color: '#546e7a',
              fontWeight: 500,
              fontSize: '0.8rem'
            }}>
              トレンド
            </Typography>
          </Box>
          <Typography variant="h6" sx={{ 
            fontWeight: 600,
            color: '#0277bd',
            fontSize: '1rem',
            mb: 0.5
          }}>
            {topic.hashtag}
          </Typography>
          <Typography variant="body2" sx={{ 
            color: '#546e7a',
            fontWeight: 500,
            fontSize: '0.8rem'
          }}>
            {topic.posts.toLocaleString()}件の投稿
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default TrendingTopics;
