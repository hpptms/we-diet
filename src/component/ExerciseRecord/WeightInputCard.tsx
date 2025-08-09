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
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import { useTranslation } from '../../hooks/useTranslation';

interface WeightInputCardProps {
  todayWeight: string;
  hasWeightInput: boolean;
  onTodayWeightChange: (value: string) => void;
  isDarkMode?: boolean;
}

const WeightInputCard: React.FC<WeightInputCardProps> = ({
  todayWeight,
  hasWeightInput,
  onTodayWeightChange,
  isDarkMode = false,
}) => {
  const { t } = useTranslation();
  
  return (
    <Card sx={{ borderRadius: 3, overflow: 'hidden', height: '100%', border: isDarkMode ? '1px solid white' : 'none' }}>
      <Box sx={{ 
        background: isDarkMode ? '#000000' : 'linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)',
        p: 2,
        border: isDarkMode ? '1px solid white' : 'none',
      }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <MonitorWeightIcon /> {t('exercise', 'weightInput.title')}
        </Typography>
      </Box>
      <CardContent sx={{ background: isDarkMode ? '#000000' : '#fff8f0' }}>
        <TextField
          label={t('exercise', 'weightInput.weightPlaceholder')}
          value={todayWeight}
          onChange={(e) => onTodayWeightChange(e.target.value)}
          type="number"
          fullWidth
          InputProps={{
            endAdornment: <InputAdornment position="end">{t('exercise', 'postMessages.units.kg')}</InputAdornment>,
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
                borderColor: isDarkMode ? 'white' : '#FF9800',
              },
            },
            '& .MuiInputLabel-root': {
              color: isDarkMode ? 'white' : 'inherit',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: isDarkMode ? 'white' : '#FF9800',
            },
          }}
        />
        {hasWeightInput && (
          <Chip 
            label={t('exercise', 'weightInput.recordedMessage')} 
            color="warning" 
            sx={{ mt: 2 }} 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default WeightInputCard;
