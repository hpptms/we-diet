import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  TextField,
  Chip,
} from '@mui/material';

interface ExerciseNoteCardProps {
  exerciseNote: string;
  onExerciseNoteChange: (value: string) => void;
}

const ExerciseNoteCard: React.FC<ExerciseNoteCardProps> = ({
  exerciseNote,
  onExerciseNoteChange,
}) => {
  return (
    <Card sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ 
        background: 'linear-gradient(45deg, #FF6B6B 30%, #FFE66D 90%)',
        p: 2,
      }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          📝 どんな運動したの？
        </Typography>
      </Box>
      <CardContent sx={{ background: '#fffaf0' }}>
        <TextField
          label="今日頑張った運動や感想を自由に書いてね！"
          value={exerciseNote}
          onChange={(e) => {
            if (e.target.value.length <= 150) onExerciseNoteChange(e.target.value);
          }}
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          placeholder="例：朝のランニングで桜が綺麗だった🌸 / 新しいヨガポーズにチャレンジ！ / 友達と一緒にテニスを楽しんだ♪"
          inputProps={{ maxLength: 150 }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: '#FF6B6B',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#FF6B6B',
              },
            },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
          <Typography variant="body2" sx={{ color: '#666', fontSize: '0.75rem' }}>
            {exerciseNote.length}/150文字
          </Typography>
          {exerciseNote && (
            <Chip 
              label="記録完了 📖" 
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
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid rgba(255, 107, 107, 0.3)'
          }}>
            <Typography variant="body2" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
              ✨ 素敵な記録ですね！継続することで必ず成果が出ますよ 💪
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ExerciseNoteCard;
