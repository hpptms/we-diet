import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  Chip,
  Divider,
} from '@mui/material';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import { DistanceButtons, TimeButtons } from './CommonButtons';

interface AerobicExerciseCardProps {
  walkingDistance: string;
  walkingTime: string;
  runningDistance: string;
  runningTime: string;
  onWalkingDistanceChange: (value: string) => void;
  onWalkingTimeChange: (value: string) => void;
  onRunningDistanceChange: (value: string) => void;
  onRunningTimeChange: (value: string) => void;
  isDarkMode?: boolean;
}

const AerobicExerciseCard: React.FC<AerobicExerciseCardProps> = ({
  walkingDistance,
  walkingTime,
  runningDistance,
  runningTime,
  onWalkingDistanceChange,
  onWalkingTimeChange,
  onRunningDistanceChange,
  onRunningTimeChange,
  isDarkMode = false,
}) => {
  return (
    <Card sx={{ mb: 3, borderRadius: 3, overflow: 'hidden', border: isDarkMode ? '1px solid white' : 'none' }}>
      <Box sx={{ 
        background: isDarkMode ? '#000000' : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
        p: 2,
        border: isDarkMode ? '1px solid white' : 'none',
      }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          🏃‍♂️ 有酸素運動
        </Typography>
      </Box>
      <CardContent sx={{ background: isDarkMode ? '#000000' : '#f8f9ff' }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <DirectionsWalkIcon sx={{ color: '#4CAF50' }} />
              <Typography variant="h6" sx={{ color: isDarkMode ? 'white' : '#4CAF50', fontWeight: 'bold' }}>
                徒歩
              </Typography>
              {walkingDistance && (
                <Chip label="記録済み" color="success" size="small" />
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  label="距離"
                  value={walkingDistance}
                  onChange={(e) => onWalkingDistanceChange(e.target.value)}
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">km</InputAdornment>,
                  }}
                  fullWidth
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
                        borderColor: isDarkMode ? 'white' : '#2196F3',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: isDarkMode ? 'white' : 'inherit',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: isDarkMode ? 'white' : '#2196F3',
                    },
                  }}
                />
                <DistanceButtons
                  onAdd={(amount) => {
                    const walk = parseFloat(walkingDistance || '0');
                    onWalkingDistanceChange((isNaN(walk) ? amount : walk + amount).toFixed(1));
                  }}
                  isDarkMode={isDarkMode}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  label="時間"
                  value={walkingTime}
                  onChange={(e) => onWalkingTimeChange(e.target.value)}
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">分</InputAdornment>,
                  }}
                  fullWidth
                  variant="outlined"
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      color: isDarkMode ? 'white' : 'inherit',
                      '& fieldset': {
                        borderColor: isDarkMode ? 'white' : 'rgba(0, 0, 0, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: isDarkMode ? 'white' : 'rgba(0, 0, 0, 0.87)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: isDarkMode ? 'white' : '#2196F3',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: isDarkMode ? 'white' : 'inherit',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: isDarkMode ? 'white' : '#2196F3',
                    },
                  }}
                />
                <TimeButtons
                  onAdd={(amount) => {
                    const walk = parseInt(walkingTime || '0', 10);
                    onWalkingTimeChange((isNaN(walk) ? amount : walk + amount).toString());
                  }}
                  isDarkMode={isDarkMode}
                />
              </Box>
            </Box>
          </Grid>

          <Divider sx={{ width: '100%', my: 2 }} />

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <DirectionsRunIcon sx={{ color: '#FF5722' }} />
              <Typography variant="h6" sx={{ color: isDarkMode ? 'white' : '#FF5722', fontWeight: 'bold' }}>
                ランニング
              </Typography>
              {runningDistance && (
                <Chip label="記録済み" color="warning" size="small" />
              )}
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ flex: 1 }}>
                <TextField
                  label="距離"
                  value={runningDistance}
                  onChange={(e) => onRunningDistanceChange(e.target.value)}
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">km</InputAdornment>,
                  }}
                  fullWidth
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
                        borderColor: isDarkMode ? 'white' : '#2196F3',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: isDarkMode ? 'white' : 'inherit',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: isDarkMode ? 'white' : '#2196F3',
                    },
                  }}
                />
                <DistanceButtons
                  onAdd={(amount) => {
                    const run = parseFloat(runningDistance || '0');
                    onRunningDistanceChange((isNaN(run) ? amount : run + amount).toFixed(1));
                  }}
                  isDarkMode={isDarkMode}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  label="時間"
                  value={runningTime}
                  onChange={(e) => onRunningTimeChange(e.target.value)}
                  type="number"
                  InputProps={{
                    endAdornment: <InputAdornment position="end">分</InputAdornment>,
                  }}
                  fullWidth
                  variant="outlined"
                  sx={{
                    flex: 1,
                    '& .MuiOutlinedInput-root': {
                      color: isDarkMode ? 'white' : 'inherit',
                      '& fieldset': {
                        borderColor: isDarkMode ? 'white' : 'rgba(0, 0, 0, 0.23)',
                      },
                      '&:hover fieldset': {
                        borderColor: isDarkMode ? 'white' : 'rgba(0, 0, 0, 0.87)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: isDarkMode ? 'white' : '#2196F3',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: isDarkMode ? 'white' : 'inherit',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: isDarkMode ? 'white' : '#2196F3',
                    },
                  }}
                />
                <TimeButtons
                  onAdd={(amount) => {
                    const run = parseInt(runningTime || '0', 10);
                    onRunningTimeChange((isNaN(run) ? amount : run + amount).toString());
                  }}
                  isDarkMode={isDarkMode}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default AerobicExerciseCard;
