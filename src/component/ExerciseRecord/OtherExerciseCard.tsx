import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Chip,
} from '@mui/material';
import SportsIcon from '@mui/icons-material/Sports';
import { useTranslation } from '../../hooks/useTranslation';

interface OtherExerciseCardProps {
  otherExerciseTime: string;
  onOtherExerciseTimeChange: (value: string) => void;
  isDarkMode?: boolean;
}

const OtherExerciseCard: React.FC<OtherExerciseCardProps> = ({
  otherExerciseTime,
  onOtherExerciseTimeChange,
  isDarkMode = false,
}) => {
  const { t } = useTranslation();
  
  return (
    <Card sx={{ borderRadius: 3, overflow: 'hidden', height: '100%', border: isDarkMode ? '1px solid white' : 'none' }}>
      <Box sx={{ 
        background: isDarkMode ? '#000000' : 'linear-gradient(45deg, #9C27B0 30%, #BA68C8 90%)',
        p: 2,
        border: isDarkMode ? '1px solid white' : 'none',
      }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <SportsIcon /> {t('exercise', 'otherExercise.title')}
        </Typography>
      </Box>
      <CardContent sx={{ background: isDarkMode ? '#000000' : '#faf5ff' }}>
        <TextField
          label={t('exercise', 'otherExercise.timePlaceholder')}
          value={otherExerciseTime}
          onChange={(e) => onOtherExerciseTimeChange(e.target.value)}
          type="number"
          fullWidth
          InputProps={{
            endAdornment: <InputAdornment position="end">{t('exercise', 'postMessages.units.minutes')}</InputAdornment>,
          }}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              color: isDarkMode ? 'white' : 'inherit',
              '& fieldset': {
                borderColor: isDarkMode ? 'white' : 'rgba(0, 0, 0, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: isDarkMode ? 'white' : 'rgba(0, 0, 0, 0.87)',
              },
              '&.Mui-focused fieldset': {
                borderColor: isDarkMode ? 'white' : '#9C27B0',
              },
            },
            '& .MuiInputLabel-root': {
              color: isDarkMode ? 'white' : 'inherit',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: isDarkMode ? 'white' : '#9C27B0',
            },
          }}
        />
        {otherExerciseTime && (
          <Chip 
            label={t('exercise', 'otherExercise.congratulationMessage', { time: otherExerciseTime })} 
            color="secondary" 
            sx={{ mt: 2 }} 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default OtherExerciseCard;
