import React from 'react';
import { Card, CardContent, Typography, TextField, Box, Chip } from '@mui/material';
import { Restaurant } from '@mui/icons-material';
import { useTranslation } from '../../hooks/useTranslation';

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
    const { t } = useTranslation();
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
                    🍽️ {t('food', 'unifiedMealCard.title')}
                </Typography>
            </Box>
            <CardContent sx={{ background: isDarkMode ? '#000000' : '#fffbf0' }}>
                <TextField
                    multiline
                    rows={8}
                    fullWidth
                    value={content}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={t('food', 'unifiedMealCard.placeholder')}
                    variant="outlined"
                    inputProps={{
                        maxLength: maxLength,
                        style: { fontSize: '16px' } // iOS で自動ズームを防止するため16px以上
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
                        {t('food', 'unifiedMealCard.description')}
                    </Typography>
                    <Chip
                        label={t('food', 'unifiedMealCard.characterCount', { current: content.length, max: maxLength })}
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
                        {t('food', 'unifiedMealCard.characterLimitExceeded', { count: Math.abs(remainingChars) })}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default UnifiedMealCard;
