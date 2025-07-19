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

interface WeightInputCardProps {
  todayWeight: string;
  hasWeightInput: boolean;
  onTodayWeightChange: (value: string) => void;
}

const WeightInputCard: React.FC<WeightInputCardProps> = ({
  todayWeight,
  hasWeightInput,
  onTodayWeightChange,
}) => {
  return (
    <Card sx={{ borderRadius: 3, overflow: 'hidden', height: '100%' }}>
      <Box sx={{ 
        background: 'linear-gradient(45deg, #FF9800 30%, #FFB74D 90%)',
        p: 2,
      }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <MonitorWeightIcon /> 本日の体重
        </Typography>
      </Box>
      <CardContent sx={{ background: '#fff8f0' }}>
        <TextField
          label="体重"
          value={todayWeight}
          onChange={(e) => onTodayWeightChange(e.target.value)}
          type="number"
          fullWidth
          InputProps={{
            endAdornment: <InputAdornment position="end">kg</InputAdornment>,
          }}
          variant="outlined"
        />
        {hasWeightInput && (
          <Chip 
            label="体重記録済み ✅" 
            color="warning" 
            sx={{ mt: 2 }} 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default WeightInputCard;
