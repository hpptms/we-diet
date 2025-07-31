import React from 'react';
import { Card, CardContent, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../recoil/darkModeAtom';

interface WeightRecordsListProps {
  weightRecords: any[];
  viewPeriod: 'month' | 'year';
  currentDate?: Date;
}

const WeightRecordsList: React.FC<WeightRecordsListProps> = ({
  weightRecords,
  viewPeriod,
  currentDate,
}) => {
  const isDarkMode = useRecoilValue(darkModeState);

  return (
    <Card sx={{
      ...(isDarkMode && {
        backgroundColor: '#000',
        border: '1px solid #fff',
        color: '#fff'
      })
    }}>
      <CardContent>
        <Typography variant="h5" component="h3" sx={{ 
          mb: 2, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          ...(isDarkMode && {
            color: '#fff'
          })
        }}>
          <TrendingUp color="primary" />
          記録一覧
        </Typography>
        {weightRecords.length > 0 ? (
          <Box sx={{ width: '100%', overflowX: 'hidden' }}>
            <List>
              {viewPeriod === 'month' ? (
                [...weightRecords]
                  .filter(record => {
                    // 月の範囲内のレコードのみを表示
                    const date = record.date || record.Date;
                    if (!date) return false;
                    
                    const recordDate = new Date(date);
                    // 現在表示している月と同じ年月のレコードのみを含める
                    if (currentDate) {
                      return recordDate.getFullYear() === currentDate.getFullYear() && recordDate.getMonth() === currentDate.getMonth();
                    } else {
                      // currentDateが渡されていない場合は現在月を使用
                      const now = new Date();
                      return recordDate.getFullYear() === now.getFullYear() && recordDate.getMonth() === now.getMonth();
                    }
                  })
                  .sort((a, b) => new Date(b.date || b.Date).getTime() - new Date(a.date || a.Date).getTime())
                  .map((record, index) => (
                    <ListItem key={record.id || record.ID || `record-${index}`} divider>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{
                            ...(isDarkMode && {
                              color: '#fff'
                            })
                          }}>
                            <strong>{new Date(record.date || record.Date).toLocaleDateString('ja-JP')}</strong>
                            <Typography component="span" sx={{ 
                              ml: 2,
                              ...(isDarkMode && {
                                color: '#fff'
                              })
                            }}>
                              体重: {record.weight || record.Weight}kg
                            </Typography>
                            {(record.body_fat || record.BodyFat) && (
                              <Typography component="span" sx={{ 
                                ml: 2,
                                ...(isDarkMode && {
                                  color: '#fff'
                                })
                              }}>
                                体脂肪率: {record.body_fat || record.BodyFat}%
                              </Typography>
                            )}
                          </Typography>
                        }
                        secondary={(record.note || record.Note) && (
                          <Typography variant="body2" sx={{ 
                            mt: 0.5,
                            color: isDarkMode ? '#ccc' : 'text.secondary'
                          }}>
                            メモ: {record.note || record.Note}
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
                          <Typography variant="body1" sx={{
                            ...(isDarkMode && {
                              color: '#fff'
                            })
                          }}>
                            <strong>{record.year_month.replace('-', '年') + '月'}</strong>
                            <Typography component="span" sx={{ 
                              ml: 2,
                              ...(isDarkMode && {
                                color: '#fff'
                              })
                            }}>
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
          <Typography variant="body1" sx={{ 
            textAlign: 'center', 
            py: 3, 
            color: isDarkMode ? '#ccc' : 'text.secondary'
          }}>
            記録がありません
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default WeightRecordsList;
