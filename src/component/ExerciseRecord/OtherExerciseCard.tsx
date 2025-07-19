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
}

const OtherExerciseCard: React.FC<OtherExerciseCardProps> = ({
  otherExerciseTime,
  onOtherExerciseTimeChange,
}) => {
  return (
    <Card sx={{ borderRadius: 3, overflow: 'hidden', height: '100%' }}>
      <Box sx={{ 
        background: 'linear-gradient(45deg, #9C27B0 30%, #BA68C8 90%)',
        p: 2,
      }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <SportsIcon /> その他運動
        </Typography>
      </Box>
      <CardContent sx={{ background: '#faf5ff' }}>
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
