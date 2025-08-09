import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Grid,
  TextField,
  InputAdornment,
} from '@mui/material';
import { RepsButtons } from './CommonButtons';
import { useTranslation } from '../../hooks/useTranslation';

interface StrengthTrainingCardProps {
  pushUps: string;
  sitUps: string;
  squats: string;
  onPushUpsChange: (value: string) => void;
  onSitUpsChange: (value: string) => void;
  onSquatsChange: (value: string) => void;
  isDarkMode?: boolean;
}

const StrengthTrainingCard: React.FC<StrengthTrainingCardProps> = ({
  pushUps,
  sitUps,
  squats,
  onPushUpsChange,
  onSitUpsChange,
  onSquatsChange,
  isDarkMode = false,
}) => {
  const { t } = useTranslation();
  
  return (
    <Card sx={{ mb: 3, borderRadius: 3, overflow: 'hidden', border: isDarkMode ? '1px solid white' : 'none' }}>
      <Box sx={{ 
        background: isDarkMode ? '#000000' : 'linear-gradient(45deg, #E91E63 30%, #F48FB1 90%)',
        p: 2,
        border: isDarkMode ? '1px solid white' : 'none',
      }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          💪 {t('exercise', 'strengthTraining.title')}
        </Typography>
      </Box>
      <CardContent sx={{ background: isDarkMode ? '#000000' : '#fff5f8' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="body2" sx={{ color: isDarkMode ? 'white' : '#E91E63', fontWeight: 'bold' }}>
                {t('exercise', 'strengthTraining.pushUps')} 🔥
              </Typography>
            </Box>
            <TextField
              label={t('exercise', 'strengthTraining.pushUpsPlaceholder')}
              value={pushUps}
              onChange={(e) => onPushUpsChange(e.target.value)}
              type="number"
              fullWidth
              InputProps={{
                endAdornment: <InputAdornment position="end">{t('exercise', 'postMessages.units.times')}</InputAdornment>,
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
                    borderColor: isDarkMode ? 'white' : '#E91E63',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? 'white' : 'inherit',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: isDarkMode ? 'white' : '#E91E63',
                },
              }}
            />
            <RepsButtons
              onSet={(value) => {
                const current = parseInt(pushUps || '0', 10);
                onPushUpsChange((isNaN(current) ? value : current + value).toString());
              }}
              isDarkMode={isDarkMode}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="body2" sx={{ color: isDarkMode ? 'white' : '#E91E63', fontWeight: 'bold' }}>
                {t('exercise', 'strengthTraining.sitUps')} ⚡
              </Typography>
            </Box>
            <TextField
              label={t('exercise', 'strengthTraining.sitUpsPlaceholder')}
              value={sitUps}
              onChange={(e) => onSitUpsChange(e.target.value)}
              type="number"
              fullWidth
              InputProps={{
                endAdornment: <InputAdornment position="end">{t('exercise', 'postMessages.units.times')}</InputAdornment>,
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
                    borderColor: isDarkMode ? 'white' : '#E91E63',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? 'white' : 'inherit',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: isDarkMode ? 'white' : '#E91E63',
                },
              }}
            />
            <RepsButtons
              onSet={(value) => {
                const current = parseInt(sitUps || '0', 10);
                onSitUpsChange((isNaN(current) ? value : current + value).toString());
              }}
              isDarkMode={isDarkMode}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="body2" sx={{ color: isDarkMode ? 'white' : '#E91E63', fontWeight: 'bold' }}>
                {t('exercise', 'strengthTraining.squats')} 🦵
              </Typography>
            </Box>
            <TextField
              label={t('exercise', 'strengthTraining.squatsPlaceholder')}
              value={squats}
              onChange={(e) => onSquatsChange(e.target.value)}
              type="number"
              fullWidth
              InputProps={{
                endAdornment: <InputAdornment position="end">{t('exercise', 'postMessages.units.times')}</InputAdornment>,
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
                    borderColor: isDarkMode ? 'white' : '#E91E63',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: isDarkMode ? 'white' : 'inherit',
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: isDarkMode ? 'white' : '#E91E63',
                },
              }}
            />
            <RepsButtons
              onSet={(value) => {
                const current = parseInt(squats || '0', 10);
                onSquatsChange((isNaN(current) ? value : current + value).toString());
              }}
              isDarkMode={isDarkMode}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default StrengthTrainingCard;
