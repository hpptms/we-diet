import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  TextField,
  Chip,
} from '@mui/material';
import { useTranslation } from '../../hooks/useTranslation';

interface ExerciseNoteCardProps {
  exerciseNote: string;
  onExerciseNoteChange: (value: string) => void;
  isDarkMode?: boolean;
}

const ExerciseNoteCard: React.FC<ExerciseNoteCardProps> = ({
  exerciseNote,
  onExerciseNoteChange,
  isDarkMode = false,
}) => {
  const { t } = useTranslation();
  
  return (
    <Card sx={{ mb: 3, borderRadius: 3, overflow: 'hidden', border: isDarkMode ? '1px solid white' : 'none' }}>
      <Box sx={{ 
        background: isDarkMode ? '#000000' : 'linear-gradient(45deg, #FF6B6B 30%, #FFE66D 90%)',
        p: 2,
        border: isDarkMode ? '1px solid white' : 'none',
      }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          📝 {t('exercise', 'exerciseNote.title')}
        </Typography>
      </Box>
      <CardContent sx={{ background: isDarkMode ? '#000000' : '#fffaf0' }}>
        <TextField
          label={t('exercise', 'exerciseNote.placeholder')}
          value={exerciseNote}
          onChange={(e) => {
            if (e.target.value.length <= 300) onExerciseNoteChange(e.target.value);
          }}
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          placeholder={t('exercise', 'exerciseNote.example')}
          inputProps={{ maxLength: 300 }}
          sx={{
            '& .MuiOutlinedInput-root': {
              color: isDarkMode ? 'white' : 'inherit',
              '& fieldset': {
                borderColor: isDarkMode ? 'white' : 'rgba(0, 0, 0, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: isDarkMode ? 'white' : '#FF6B6B',
              },
              '&.Mui-focused fieldset': {
                borderColor: isDarkMode ? 'white' : '#FF6B6B',
              },
            },
            '& .MuiInputLabel-root': {
              color: isDarkMode ? 'white' : 'inherit',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: isDarkMode ? 'white' : '#FF6B6B',
            },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Typography variant="body2" sx={{ color: isDarkMode ? 'white' : '#666', fontSize: '0.75rem' }}>
            {t('exercise', 'exerciseNote.characterCount', { current: exerciseNote.length, max: 300 })}
          </Typography>
          {exerciseNote && (
            <Chip 
              label={t('exercise', 'exerciseNote.completedMessage')} 
              color="warning" 
              size="small"
              sx={{ 
                background: 'linear-gradient(45deg, #FF6B6B 30%, #FFE66D 90%)',
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          )}
        </Box>
        {exerciseNote && (
          <Box sx={{ 
            mt: 2, 
            p: 2, 
            borderRadius: 2, 
            background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 107, 107, 0.1)',
            border: isDarkMode ? '1px solid white' : '1px solid rgba(255, 107, 107, 0.3)'
          }}>
            <Typography variant="body2" sx={{ color: isDarkMode ? 'white' : '#d32f2f', fontWeight: 'bold' }}>
              {t('exercise', 'exerciseNote.encouragementMessage')}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ExerciseNoteCard;
