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
  return (
    <Card sx={{ borderRadius: 3, overflow: 'hidden', height: '100%', border: isDarkMode ? '1px solid white' : 'none' }}>
      <Box sx={{ 
        background: isDarkMode ? '#000000' : 'linear-gradient(45deg, #9C27B0 30%, #BA68C8 90%)',
        p: 2,
        border: isDarkMode ? '1px solid white' : 'none',
      }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <SportsIcon /> その他運動
        </Typography>
      </Box>
      <CardContent sx={{ background: isDarkMode ? '#000000' : '#faf5ff' }}>
        <TextField
          label="時間"
          value={otherExerciseTime}
          onChange={(e) => onOtherExerciseTimeChange(e.target.value)}
          type="number"
          fullWidth
          InputProps={{
            endAdornment: <InputAdornment position="end">分</InputAdornment>,
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
            label={`${otherExerciseTime}分間頑張りました！`} 
            color="secondary" 
            sx={{ mt: 2 }} 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default OtherExerciseCard;
