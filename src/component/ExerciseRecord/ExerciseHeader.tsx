import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import { useTranslation } from '../../hooks/useTranslation';

interface ExerciseHeaderProps {
  isDarkMode?: boolean;
}

const ExerciseHeader: React.FC<ExerciseHeaderProps> = ({ isDarkMode = false }) => {
  const { t } = useTranslation();
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 3, 
        background: isDarkMode ? '#000000' : 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        borderRadius: 3,
        border: isDarkMode ? '1px solid white' : 'none',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <FitnessCenterIcon sx={{ fontSize: 40, color: 'white' }} />
        <Typography variant="h4" component="h1" sx={{ color: 'white', fontWeight: 'bold' }}>
          {t('exercise', 'header.title')}
        </Typography>
      </Box>
      <Typography variant="subtitle1" sx={{ color: 'white', opacity: 0.9 }}>
        {t('exercise', 'header.subtitle')}
      </Typography>
    </Paper>
  );
};

export default ExerciseHeader;
