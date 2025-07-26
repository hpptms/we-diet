import React from 'react';
import { Card, CardContent, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';

interface WeightRecordsListProps {
  weightRecords: any[];
  viewPeriod: 'month' | 'year';
}

const WeightRecordsList: React.FC<WeightRecordsListProps> = ({
  weightRecords,
  viewPeriod,
}) => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h3" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrendingUp color="primary" />
          記録一覧
        </Typography>
        {weightRecords.length > 0 ? (
          <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
            <List>
              {viewPeriod === 'month' ? (
                [...weightRecords]
                  .sort((a, b) => new Date(b.Date || b.date).getTime() - new Date(a.Date || a.date).getTime())
                  .map((record, index) => (
                    <ListItem key={record.ID || record.id || `record-${index}`} divider>
                      <ListItemText
                        primary={
                          <Typography variant="body1">
                            <strong>{new Date(record.Date || record.date).toLocaleDateString('ja-JP')}</strong>
                            <Typography component="span" sx={{ ml: 2 }}>
                              体重: {record.Weight || record.weight}kg
                            </Typography>
                            {(record.BodyFat || record.body_fat) && (
                              <Typography component="span" sx={{ ml: 2 }}>
                                体脂肪率: {record.BodyFat || record.body_fat}%
                              </Typography>
                            )}
                          </Typography>
                        }
                        secondary={(record.Note || record.note) && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            メモ: {record.Note || record.note}
                          </Typography>
                        )}
                      />
                    </ListItem>
                  ))
              ) : (
                weightRecords
                  .filter(record => record && typeof record.year_month === 'string' && typeof record.average_weight === 'number')
                  .map(record => (
                    <ListItem key={record.year_month} divider>
                      <ListItemText
                        primary={
                          <Typography variant="body1">
                            <strong>{record.year_month.replace('-', '年') + '月'}</strong>
                            <Typography component="span" sx={{ ml: 2 }}>
                              平均体重: {record.average_weight.toFixed(1)}kg
                            </Typography>
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))
              )}
            </List>
          </Box>
        ) : (
          <Typography variant="body1" sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
            記録がありません
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default WeightRecordsList;
