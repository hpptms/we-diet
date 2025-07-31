import React from 'react';
import { Card, CardContent, Typography, TextField, Box, Chip } from '@mui/material';
import { Restaurant } from '@mui/icons-material';

interface UnifiedMealCardProps {
    content: string;
    onChange: (content: string) => void;
    isDarkMode?: boolean;
}

const UnifiedMealCard: React.FC<UnifiedMealCardProps> = ({
    content,
    onChange,
    isDarkMode = false
}) => {
    const maxLength = 300;
    const remainingChars = maxLength - content.length;

    return (
        <Card sx={{ mb: 3, borderRadius: 3, overflow: 'hidden', border: isDarkMode ? '1px solid white' : 'none' }}>
            <Box sx={{ 
                background: isDarkMode ? '#000000' : 'linear-gradient(45deg, #FF9800 30%, #FFC107 90%)',
                border: isDarkMode ? '1px solid white' : 'none',
                p: 2,
            }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
                    🍽️ 今日の食事記録
                </Typography>
            </Box>
            <CardContent sx={{ background: isDarkMode ? '#000000' : '#fffbf0' }}>
                <TextField
                    multiline
                    rows={8}
                    fullWidth
                    value={content}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="今日食べた食事や飲み物を自由に記録してください。
                    
例：
朝食：トースト、コーヒー
昼食：おにぎり2個、お茶
夕食：カレーライス、サラダ
間食：クッキー2枚"
                    variant="outlined"
                    inputProps={{
                        maxLength: maxLength,
                        style: { fontSize: '14px' }
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            backgroundColor: isDarkMode ? '#000000' : 'white',
                            color: isDarkMode ? 'white' : 'inherit',
                            '& fieldset': {
                                borderColor: isDarkMode ? 'white' : '#FF9800',
                            },
                            '&:hover fieldset': {
                                borderColor: isDarkMode ? 'white' : '#F57C00',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: isDarkMode ? 'white' : '#FF9800',
                            },
                        },
                        '& .MuiInputLabel-root': {
                            color: isDarkMode ? 'white' : 'inherit',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                            color: isDarkMode ? 'white' : '#FF9800',
                        },
                    }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="body2" sx={{ color: isDarkMode ? 'white' : 'text.secondary' }}>
                        朝食・昼食・夕食・間食を自由に記録
                    </Typography>
                    <Chip
                        label={`${content.length}/${maxLength}文字`}
                        size="small"
                        color={remainingChars < 50 ? 'warning' : 'default'}
                        sx={{
                            color: remainingChars < 0 ? 'error.main' : 'inherit',
                            fontWeight: 'bold'
                        }}
                    />
                </Box>
                {remainingChars < 0 && (
                    <Typography variant="caption" sx={{ color: 'error.main', mt: 1, display: 'block' }}>
                        文字数制限を超えています。{Math.abs(remainingChars)}文字削除してください。
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default UnifiedMealCard;
