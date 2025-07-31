import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { Whatshot, CalendarToday } from '@mui/icons-material';

interface DailyProgressCardProps {
    recordedDates: string[];
    isDarkMode?: boolean;
}

const DailyProgressCard: React.FC<DailyProgressCardProps> = ({
    recordedDates,
    isDarkMode = false
}) => {
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
        if (consecutiveDays >= 365) return '🎉 1年連続達成！伝説のレベルです！ 🎉';
        if (consecutiveDays >= 300) return '🌟 300日突破！もう習慣の達人ですね！';
        if (consecutiveDays >= 270) return '💎 270日達成！ダイヤモンドレベル！';
        if (consecutiveDays >= 240) return '🚀 240日継続！宇宙レベルの継続力！';
        if (consecutiveDays >= 210) return '⭐ 210日達成！スターレベルです！';
        if (consecutiveDays >= 180) return '🎯 半年達成！完璧な継続力！';
        if (consecutiveDays >= 150) return '🏆 150日達成！チャンピオンレベル！';
        if (consecutiveDays >= 120) return '🎖️ 4ヶ月継続！メダリストです！';
        if (consecutiveDays >= 90) return '🏅 3ヶ月達成！素晴らしい習慣！';
        if (consecutiveDays >= 75) return '🥇 75日突破！ゴールドレベル！';
        if (consecutiveDays >= 60) return '🔱 2ヶ月継続！トライデントパワー！';
        if (consecutiveDays >= 45) return '⚡ 45日達成！電光石火の継続力！';
        if (consecutiveDays >= 30) return '💪 1ヶ月達成！パワーアップしました！';
        if (consecutiveDays >= 27) return '🌈 27日継続！虹色の輝き！';
        if (consecutiveDays >= 24) return '✨ 24日達成！キラキラ輝いてます！';
        if (consecutiveDays >= 21) return '🎊 3週間継続！お祝いしましょう！';
        if (consecutiveDays >= 18) return '🌙 18日達成！月のパワー！';
        if (consecutiveDays >= 15) return '☀️ 15日継続！太陽のように輝いてます！';
        if (consecutiveDays >= 12) return '🌸 12日達成！桜のように美しい継続！';
        if (consecutiveDays >= 9) return '🔮 9日継続！魔法の力を感じます！';
        if (consecutiveDays >= 6) return '💫 6日達成！流れ星のように素敵！';
        if (consecutiveDays >= 3) return '🚩 3日連続！フラッグが立ちました！';
        if (consecutiveDays >= 1) return '🔥 記録開始！炎のように燃えてます！';
        return '🌱 今日から記録を始めよう！新芽の成長を！';
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
                    📊 記録継続状況
                </Typography>
                
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                    <Typography variant="h2" sx={{ fontSize: '3rem', fontWeight: 'bold', mb: 1 }}>
                        {getStreakIcon()} {consecutiveDays}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 1 }}>
                        連続記録日数
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        {getStreakMessage()}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Chip
                        icon={<Whatshot />}
                        label={`${consecutiveDays}日連続`}
                        sx={{
                            color: '#ff6b6b',
                            backgroundColor: 'white',
                            fontWeight: 'bold',
                        }}
                    />
                    <Chip
                        icon={<CalendarToday />}
                        label={`総記録 ${totalRecords}日`}
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
