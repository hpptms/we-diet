import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { Whatshot, CalendarToday } from '@mui/icons-material';
import { useTranslation } from '../../hooks/useTranslation';

interface DailyProgressCardProps {
    recordedDates: string[];
    isDarkMode?: boolean;
}

const DailyProgressCard: React.FC<DailyProgressCardProps> = ({
    recordedDates,
    isDarkMode = false
}) => {
    const { t } = useTranslation();
    const [consecutiveDays, setConsecutiveDays] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);

    useEffect(() => {
        if (!recordedDates || recordedDates.length === 0) {
            setConsecutiveDays(0);
            setTotalRecords(0);
            return;
        }

        // 日付を降順でソート
        const sortedDates = [...recordedDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        
        // 総記録数
        setTotalRecords(sortedDates.length);

        // 連続記録日数を計算
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        let consecutive = 0;
        let currentDate = new Date(today);

        for (let i = 0; i < sortedDates.length; i++) {
            const recordDate = new Date(sortedDates[i]);
            recordDate.setHours(0, 0, 0, 0);
            
            if (recordDate.getTime() === currentDate.getTime()) {
                consecutive++;
                currentDate.setDate(currentDate.getDate() - 1);
            } else {
                break;
            }
        }

        setConsecutiveDays(consecutive);
    }, [recordedDates]);

    const getStreakIcon = () => {
        // 365日まで段階的にアイコンが変化
        if (consecutiveDays >= 365) return '👑'; // 1年達成！
        if (consecutiveDays >= 300) return '🌟'; // 10ヶ月
        if (consecutiveDays >= 270) return '💎'; // 9ヶ月
        if (consecutiveDays >= 240) return '🚀'; // 8ヶ月
        if (consecutiveDays >= 210) return '⭐'; // 7ヶ月
        if (consecutiveDays >= 180) return '🎯'; // 6ヶ月
        if (consecutiveDays >= 150) return '🏆'; // 5ヶ月
        if (consecutiveDays >= 120) return '🎖️'; // 4ヶ月
        if (consecutiveDays >= 90) return '🏅'; // 3ヶ月
        if (consecutiveDays >= 75) return '🥇'; // 75日
        if (consecutiveDays >= 60) return '🔱'; // 2ヶ月
        if (consecutiveDays >= 45) return '⚡'; // 45日
        if (consecutiveDays >= 30) return '💪'; // 1ヶ月
        if (consecutiveDays >= 27) return '🌈'; // 27日
        if (consecutiveDays >= 24) return '✨'; // 24日
        if (consecutiveDays >= 21) return '🎊'; // 3週間
        if (consecutiveDays >= 18) return '🌙'; // 18日
        if (consecutiveDays >= 15) return '☀️'; // 15日
        if (consecutiveDays >= 12) return '🌸'; // 12日
        if (consecutiveDays >= 9) return '🔮'; // 9日
        if (consecutiveDays >= 6) return '💫'; // 6日
        if (consecutiveDays >= 3) return '🚩'; // 3日
        if (consecutiveDays >= 1) return '🔥'; // 1日
        return '🌱'; // 0日（これから始める）
    };

    const getStreakMessage = () => {
        if (consecutiveDays >= 365) return t('food', 'dailyProgressCard.streakMessages.365');
        if (consecutiveDays >= 300) return t('food', 'dailyProgressCard.streakMessages.300');
        if (consecutiveDays >= 270) return t('food', 'dailyProgressCard.streakMessages.270');
        if (consecutiveDays >= 240) return t('food', 'dailyProgressCard.streakMessages.240');
        if (consecutiveDays >= 210) return t('food', 'dailyProgressCard.streakMessages.210');
        if (consecutiveDays >= 180) return t('food', 'dailyProgressCard.streakMessages.180');
        if (consecutiveDays >= 150) return t('food', 'dailyProgressCard.streakMessages.150');
        if (consecutiveDays >= 120) return t('food', 'dailyProgressCard.streakMessages.120');
        if (consecutiveDays >= 90) return t('food', 'dailyProgressCard.streakMessages.90');
        if (consecutiveDays >= 75) return t('food', 'dailyProgressCard.streakMessages.75');
        if (consecutiveDays >= 60) return t('food', 'dailyProgressCard.streakMessages.60');
        if (consecutiveDays >= 45) return t('food', 'dailyProgressCard.streakMessages.45');
        if (consecutiveDays >= 30) return t('food', 'dailyProgressCard.streakMessages.30');
        if (consecutiveDays >= 27) return t('food', 'dailyProgressCard.streakMessages.27');
        if (consecutiveDays >= 24) return t('food', 'dailyProgressCard.streakMessages.24');
        if (consecutiveDays >= 21) return t('food', 'dailyProgressCard.streakMessages.21');
        if (consecutiveDays >= 18) return t('food', 'dailyProgressCard.streakMessages.18');
        if (consecutiveDays >= 15) return t('food', 'dailyProgressCard.streakMessages.15');
        if (consecutiveDays >= 12) return t('food', 'dailyProgressCard.streakMessages.12');
        if (consecutiveDays >= 9) return t('food', 'dailyProgressCard.streakMessages.9');
        if (consecutiveDays >= 6) return t('food', 'dailyProgressCard.streakMessages.6');
        if (consecutiveDays >= 3) return t('food', 'dailyProgressCard.streakMessages.3');
        if (consecutiveDays >= 1) return t('food', 'dailyProgressCard.streakMessages.1');
        return t('food', 'dailyProgressCard.streakMessages.0');
    };

    return (
        <Card 
            sx={{ 
                mb: 3, 
                borderRadius: 3, 
                background: isDarkMode ? '#000000' : 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
                border: isDarkMode ? '1px solid white' : 'none',
                color: 'white',
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            {/* Background decoration */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                }}
            />
            
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    📊 {t('food', 'dailyProgressCard.title')}
                </Typography>
                
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                    <Typography variant="h2" sx={{ fontSize: '3rem', fontWeight: 'bold', mb: 1 }}>
                        {getStreakIcon()} {consecutiveDays}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 1 }}>
                        {t('food', 'dailyProgressCard.consecutiveDays')}
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        {getStreakMessage()}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                        icon={<Whatshot />}
                        label={t('food', 'dailyProgressCard.consecutiveCount', { count: consecutiveDays })}
                        sx={{
                            color: '#ff6b6b',
                            backgroundColor: 'white',
                            fontWeight: 'bold',
                        }}
                    />
                    <Chip
                        icon={<CalendarToday />}
                        label={t('food', 'dailyProgressCard.totalRecords', { count: totalRecords })}
                        sx={{
                            color: '#74b9ff',
                            backgroundColor: 'white',
                            fontWeight: 'bold',
                        }}
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default DailyProgressCard;
