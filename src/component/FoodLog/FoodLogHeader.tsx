import React from 'react';
import { Typography, Box, IconButton, Paper, Chip, useTheme, useMediaQuery } from '@mui/material';
import { ArrowBack, Restaurant, LocalDining, Cake } from '@mui/icons-material';

interface FoodLogHeaderProps {
    onBack?: () => void;
    selectedDate: string;
    isDarkMode?: boolean;
}

const FoodLogHeader: React.FC<FoodLogHeaderProps> = ({ onBack, selectedDate, isDarkMode = false }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short'
        });
    };

    const getMotivationalMessage = () => {
        const messages = [
            "今日も美味しい食事を記録しましょう！🍽️",
            "健康的な食生活への第一歩です！💪",
            "今日の食事を記録して振り返りませんか？📝",
            "美味しい記録が待っています！✨",
            "食事の記録で健康管理を楽しく！🌟"
        ];
        const today = new Date().getDate();
        return messages[today % messages.length];
    };

    return (
        <Paper 
            elevation={4}
            sx={{
                background: isDarkMode ? '#000000' : 'linear-gradient(135deg, #74b9ff 0%, #0984e3 50%, #74b9ff 100%)',
                border: isDarkMode ? '1px solid white' : 'none',
                borderRadius: 4,
                p: 3,
                mb: 3,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 100,
                    height: 100,
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    animation: 'float 6s ease-in-out infinite',
                },
                '@keyframes float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <Restaurant sx={{ mr: 2, fontSize: 32, color: 'white' }} />
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        sx={{ 
                            color: 'white', 
                            fontWeight: 'bold',
                            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        🍽️ 食事記録
                    </Typography>
                </Box>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalDining sx={{ color: 'white', fontSize: 20 }} />
                <Typography 
                    variant="body1" 
                    sx={{ 
                        color: 'white',
                        fontWeight: 500,
                        textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                    }}
                >
                    {getMotivationalMessage()}
                </Typography>
            </Box>
            
            {/* Mobile Date Display - ヘッダー内部下部中央 */}
            {isMobile && (
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    mt: 3,
                    position: 'relative',
                    zIndex: 10
                }}>
                    <Box sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: 2,
                        px: 2.5,
                        py: 1,
                        textAlign: 'center',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '0.9rem'
                            }}
                        >
                            📅 {formatDate(selectedDate)}
                        </Typography>
                    </Box>
                </Box>
            )}
            
            {/* Desktop Date Display - デスクトップ時は右下 */}
            {!isMobile && (
                <Chip
                    label={formatDate(selectedDate)}
                    sx={{
                        position: 'absolute',
                        bottom: 16,
                        right: 16,
                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        height: 40,
                        '& .MuiChip-label': {
                            fontSize: '1.1rem',
                            px: 2,
                        },
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        zIndex: 10,
                    }}
                />
            )}

            {/* デコレーション要素 */}
            <Box sx={{
                position: 'absolute',
                bottom: -20,
                left: -20,
                fontSize: 40,
                opacity: 0.3,
                animation: 'bounce 2s infinite',
                '@keyframes bounce': {
                    '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                    '40%': { transform: 'translateY(-10px)' },
                    '60%': { transform: 'translateY(-5px)' },
                },
            }}>
                🥗
            </Box>
            <Box sx={{
                position: 'absolute',
                top: 10,
                right: 80,
                fontSize: 24,
                opacity: 0.4,
                animation: 'pulse 3s infinite',
                '@keyframes pulse': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.1)' },
                },
            }}>
                🍎
            </Box>
        </Paper>
    );
};

export default FoodLogHeader;
