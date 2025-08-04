import React from 'react';
import { Card, CardContent, Alert, Box, Typography, CircularProgress } from '@mui/material';
import { Line } from 'react-chartjs-2';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../recoil/darkModeAtom';

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
  const isDarkMode = useRecoilValue(darkModeState);

  // // デバッグ情報をコンソールに出力
  // console.log('WeightChart render:', {
  //   error,
  //   loading,
  //   weightRecordsLength: weightRecords?.length || 0,
  //   chartDataLabels: chartData?.labels?.length || 0,
  //   chartDatasets: chartData?.datasets?.length || 0,
  //   firstRecord: weightRecords?.[0],
  //   chartData: chartData
  // });

  return (
    <Card sx={{ 
      mb: 4,
      ...(isDarkMode && {
        backgroundColor: '#000',
        border: '1px solid #fff',
        color: '#fff'
      })
    }}>
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
          <Box>
            {chartData?.labels?.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <Typography variant="h6" sx={{ textAlign: 'center', p: 6, color: 'text.secondary' }}>
                チャート用のデータが準備できていません。
              </Typography>
            )}
          </Box>
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
