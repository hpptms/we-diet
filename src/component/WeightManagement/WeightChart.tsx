import React from 'react';
import { Card, CardContent, Alert, Box, Typography, CircularProgress } from '@mui/material';
import { Line } from 'react-chartjs-2';

interface WeightChartProps {
  error: string | null;
  loading: boolean;
  weightRecords: any[];
  chartData: any;
  chartOptions: any;
}

const WeightChart: React.FC<WeightChartProps> = ({
  error,
  loading,
  weightRecords,
  chartData,
  chartOptions,
}) => {
  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        {error ? (
          <Alert severity="error" sx={{ textAlign: 'center' }}>
            {error}
          </Alert>
        ) : loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 6 }}>
            <CircularProgress />
          </Box>
        ) : weightRecords.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <Typography variant="h6" sx={{ textAlign: 'center', p: 6, color: 'text.secondary' }}>
            体重記録がありません。
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default WeightChart;
