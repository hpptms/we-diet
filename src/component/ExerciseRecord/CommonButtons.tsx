import React from 'react';
import { Box, Button, useTheme, useMediaQuery } from '@mui/material';

// 距離ボタン（100m・1キロ）コンポーネント
export const DistanceButtons: React.FC<{
  onAdd: (amount: number) => void;
  isDarkMode?: boolean;
}> = ({ onAdd, isDarkMode = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
      <Button
        size="medium"
        variant="contained"
        sx={{
          minWidth: isMobile ? 45 : 60,
          px: isMobile ? 1 : 2.5,
          py: 0.5,
          fontWeight: 'bold',
          fontSize: isMobile ? '0.75rem' : '1rem',
          borderRadius: 3,
          background: isDarkMode ? '#000000' : 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
          color: '#fff',
          border: isDarkMode ? '1px solid white' : 'none',
          boxShadow: isDarkMode ? 'none' : '0 2px 8px 0 rgba(67,233,123,0.10)',
          transition: 'transform 0.1s, box-shadow 0.1s',
          height: 40,
          whiteSpace: 'nowrap',
          '&:hover': {
            background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(90deg, #38f9d7 0%, #43e97b 100%)',
            transform: 'scale(1.05)',
            boxShadow: isDarkMode ? 'none' : '0 4px 16px 0 rgba(67,233,123,0.18)',
          },
        }}
        onClick={() => onAdd(0.1)}
      >
        100m
      </Button>
      <Button
        size="medium"
        variant="contained"
        sx={{
          minWidth: isMobile ? 50 : 70,
          px: isMobile ? 1 : 2.5,
          py: 0.5,
          fontWeight: 'bold',
          fontSize: isMobile ? '0.75rem' : '1rem',
          borderRadius: 3,
          background: isDarkMode ? '#000000' : 'linear-gradient(90deg, #fa709a 0%, #fee140 100%)',
          color: '#fff',
          border: isDarkMode ? '1px solid white' : 'none',
          boxShadow: isDarkMode ? 'none' : '0 2px 8px 0 rgba(250,112,154,0.10)',
          transition: 'transform 0.1s, box-shadow 0.1s',
          height: 40,
          whiteSpace: 'nowrap',
          '&:hover': {
            background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(90deg, #fee140 0%, #fa709a 100%)',
            transform: 'scale(1.05)',
            boxShadow: isDarkMode ? 'none' : '0 4px 16px 0 rgba(250,112,154,0.18)',
          },
        }}
        onClick={() => onAdd(1)}
      >
        1キロ
      </Button>
    </Box>
  );
};

// 時間ボタン（1分・10分・1時間）コンポーネント
export const TimeButtons: React.FC<{
  onAdd: (amount: number) => void;
  isDarkMode?: boolean;
}> = ({ onAdd, isDarkMode = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
      <Button
        size="medium"
        variant="contained"
        sx={{
          minWidth: isMobile ? 35 : 50,
          px: isMobile ? 0.8 : 2.5,
          py: 0.5,
          fontWeight: 'bold',
          fontSize: isMobile ? '0.75rem' : '1rem',
          borderRadius: 3,
          background: isDarkMode ? '#000000' : 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
          color: '#fff',
          border: isDarkMode ? '1px solid white' : 'none',
          boxShadow: isDarkMode ? 'none' : '0 2px 8px 0 rgba(67,206,162,0.10)',
          transition: 'transform 0.1s, box-shadow 0.1s',
          height: 40,
          whiteSpace: 'nowrap',
          '&:hover': {
            background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(90deg, #185a9d 0%, #43cea2 100%)',
            transform: 'scale(1.05)',
            boxShadow: isDarkMode ? 'none' : '0 4px 16px 0 rgba(67,206,162,0.18)',
          },
        }}
        onClick={() => onAdd(1)}
      >
        1分
      </Button>
      <Button
        size="medium"
        variant="contained"
        sx={{
          minWidth: isMobile ? 42 : 60,
          px: isMobile ? 0.8 : 2.5,
          py: 0.5,
          fontWeight: 'bold',
          fontSize: isMobile ? '0.75rem' : '1rem',
          borderRadius: 3,
          background: isDarkMode ? '#000000' : 'linear-gradient(90deg, #f7971e 0%, #ffd200 100%)',
          color: '#fff',
          border: isDarkMode ? '1px solid white' : 'none',
          boxShadow: isDarkMode ? 'none' : '0 2px 8px 0 rgba(247,151,30,0.10)',
          transition: 'transform 0.1s, box-shadow 0.1s',
          height: 40,
          whiteSpace: 'nowrap',
          '&:hover': {
            background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(90deg, #ffd200 0%, #f7971e 100%)',
            transform: 'scale(1.05)',
            boxShadow: isDarkMode ? 'none' : '0 4px 16px 0 rgba(247,151,30,0.18)',
          },
        }}
        onClick={() => onAdd(10)}
      >
        10分
      </Button>
      <Button
        size="medium"
        variant="contained"
        sx={{
          minWidth: isMobile ? 50 : 70,
          px: isMobile ? 0.8 : 2.5,
          py: 0.5,
          fontWeight: 'bold',
          fontSize: isMobile ? '0.75rem' : '1rem',
          borderRadius: 3,
          background: isDarkMode ? '#000000' : 'linear-gradient(90deg, #ff5858 0%, #f09819 100%)',
          color: '#fff',
          border: isDarkMode ? '1px solid white' : 'none',
          boxShadow: isDarkMode ? 'none' : '0 2px 8px 0 rgba(255,88,88,0.10)',
          transition: 'transform 0.1s, box-shadow 0.1s',
          height: 40,
          whiteSpace: 'nowrap',
          '&:hover': {
            background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(90deg, #f09819 0%, #ff5858 100%)',
            transform: 'scale(1.05)',
            boxShadow: isDarkMode ? 'none' : '0 4px 16px 0 rgba(255,88,88,0.18)',
          },
        }}
        onClick={() => onAdd(60)}
      >
        1時間
      </Button>
    </Box>
  );
};

// 回数ボタン（1回・10回）コンポーネント
export const RepsButtons: React.FC<{
  onSet: (value: number) => void;
  isDarkMode?: boolean;
}> = ({ onSet, isDarkMode = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'center' }}>
      <Button
        size="medium"
        variant="contained"
        sx={{
          minWidth: isMobile ? 40 : 60,
          px: isMobile ? 0.8 : 2.5,
          py: 0.5,
          fontWeight: 'bold',
          fontSize: isMobile ? '0.75rem' : '1rem',
          borderRadius: 3,
          background: isDarkMode ? '#000000' : 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
          color: '#fff',
          border: isDarkMode ? '1px solid white' : 'none',
          boxShadow: isDarkMode ? 'none' : '0 2px 8px 0 rgba(67,233,123,0.10)',
          transition: 'transform 0.1s, box-shadow 0.1s',
          height: 40,
          whiteSpace: 'nowrap',
          '&:hover': {
            background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(90deg, #38f9d7 0%, #43e97b 100%)',
            transform: 'scale(1.05)',
            boxShadow: isDarkMode ? 'none' : '0 4px 16px 0 rgba(67,233,123,0.18)',
          },
        }}
        onClick={() => onSet(1)}
      >
        1回
      </Button>
      <Button
        size="medium"
        variant="contained"
        sx={{
          minWidth: isMobile ? 45 : 65,
          px: isMobile ? 0.8 : 2.5,
          py: 0.5,
          fontWeight: 'bold',
          fontSize: isMobile ? '0.75rem' : '1rem',
          borderRadius: 3,
          background: isDarkMode ? '#000000' : 'linear-gradient(90deg, #fa709a 0%, #fee140 100%)',
          color: '#fff',
          border: isDarkMode ? '1px solid white' : 'none',
          boxShadow: isDarkMode ? 'none' : '0 2px 8px 0 rgba(250,112,154,0.10)',
          transition: 'transform 0.1s, box-shadow 0.1s',
          height: 40,
          whiteSpace: 'nowrap',
          '&:hover': {
            background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(90deg, #fee140 0%, #fa709a 100%)',
            transform: 'scale(1.05)',
            boxShadow: isDarkMode ? 'none' : '0 4px 16px 0 rgba(250,112,154,0.18)',
          },
        }}
        onClick={() => onSet(10)}
      >
        10回
      </Button>
    </Box>
  );
};
