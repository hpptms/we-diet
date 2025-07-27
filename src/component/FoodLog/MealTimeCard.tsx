import React, { useState } from 'react';
import {
    Paper,
    Typography,
    Box,
    TextField,
    Chip,
    IconButton,
    Collapse,
    Button
} from '@mui/material';
import {
    WbSunny,
    LightMode,
    WbTwilight,
    LocalCafe,
    ExpandMore,
    ExpandLess,
    Add,
    Restaurant
} from '@mui/icons-material';

interface MealTimeCardProps {
    mealTime: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    content: string;
    onChange: (content: string) => void;
}

const MealTimeCard: React.FC<MealTimeCardProps> = ({ mealTime, content, onChange }) => {
    const [expanded, setExpanded] = useState(false);
    const [suggestions] = useState([
        '🍞 パン', '🍚 ご飯', '🥗 サラダ', '🍖 肉料理', '🐟 魚料理', 
        '🍜 ラーメン', '🍝 パスタ', '🍲 スープ', '🥛 牛乳', '☕ コーヒー'
    ]);

    const getMealConfig = () => {
        switch (mealTime) {
            case 'breakfast':
                return {
                    title: '🌅 朝食',
                    icon: <WbSunny />,
                    color: '#FFD54F',
                    gradient: 'linear-gradient(135deg, #FFD54F 0%, #FFECB3 100%)',
                    placeholder: '今日の朝食は何でしたか？例：トースト、コーヒー',
                    tips: ['バランスの良い朝食で一日をスタート！', '水分補給も忘れずに'],
                };
            case 'lunch':
                return {
                    title: '☀️ 昼食',
                    icon: <LightMode />,
                    color: '#66BB6A',
                    gradient: 'linear-gradient(135deg, #66BB6A 0%, #C8E6C9 100%)',
                    placeholder: 'お昼に食べたものを記録しましょう！例：定食、おにぎり',
                    tips: ['エネルギー補給の大切な時間', '野菜を意識して摂取しましょう'],
                };
            case 'dinner':
                return {
                    title: '🌙 夕食',
                    icon: <WbTwilight />,
                    color: '#AB47BC',
                    gradient: 'linear-gradient(135deg, #AB47BC 0%, #E1BEE7 100%)',
                    placeholder: '今日の夕食を教えてください！例：焼き魚、味噌汁、野菜炒め',
                    tips: ['一日の疲れを癒す美味しい夕食', '就寝3時間前までに食事を'],
                };
            case 'snack':
                return {
                    title: '🍪 間食・おやつ',
                    icon: <LocalCafe />,
                    color: '#FF8A65',
                    gradient: 'linear-gradient(135deg, #FF8A65 0%, #FFCCBC 100%)',
                    placeholder: '間食やおやつがあれば記録しましょう！例：クッキー、果物',
                    tips: ['適度な間食でエネルギーチャージ', '糖分の摂りすぎに注意'],
                };
        }
    };

    const config = getMealConfig();

    const addSuggestion = (suggestion: string) => {
        const newContent = content ? `${content}, ${suggestion}` : suggestion;
        onChange(newContent);
    };

    return (
        <Paper
            elevation={3}
            sx={{
                mb: 2,
                borderRadius: 3,
                overflow: 'hidden',
                background: config.gradient,
                position: 'relative',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 6,
                },
            }}
        >
            {/* ヘッダー部分 */}
            <Box
                sx={{
                    p: 2,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.1)',
                }}
                onClick={() => setExpanded(!expanded)}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <Box
                        sx={{
                            mr: 2,
                            p: 1,
                            borderRadius: '50%',
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {config.icon}
                    </Box>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                        }}
                    >
                        {config.title}
                    </Typography>
                </Box>
                
                {content && (
                    <Chip
                        label="記録済み"
                        size="small"
                        sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                            color: config.color,
                            fontWeight: 'bold',
                            mr: 1,
                        }}
                    />
                )}
                
                <IconButton sx={{ color: 'white' }}>
                    {expanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
            </Box>

            {/* 展開可能なコンテンツ */}
            <Collapse in={expanded}>
                <Box sx={{ p: 3, bgcolor: 'rgba(255, 255, 255, 0.95)' }}>
                    {/* 入力フィールド */}
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={content}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={config.placeholder}
                        variant="outlined"
                        sx={{
                            mb: 2,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover fieldset': {
                                    borderColor: config.color,
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: config.color,
                                },
                            },
                        }}
                    />

                    {/* 候補タグ */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                            よく使う食材・料理：
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {suggestions.map((suggestion, index) => (
                                <Chip
                                    key={index}
                                    label={suggestion}
                                    size="small"
                                    onClick={() => addSuggestion(suggestion)}
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': {
                                            bgcolor: config.color,
                                            color: 'white',
                                        },
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>

                    {/* ヒント */}
                    <Box
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: 'rgba(0, 0, 0, 0.05)',
                        }}
                    >
                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                            💡 ヒント：
                        </Typography>
                        {config.tips.map((tip, index) => (
                            <Typography key={index} variant="body2" sx={{ color: 'text.secondary' }}>
                                • {tip}
                            </Typography>
                        ))}
                    </Box>
                </Box>
            </Collapse>

            {/* デコレーション要素 */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    opacity: 0.2,
                    fontSize: 20,
                    animation: 'wiggle 4s ease-in-out infinite',
                    '@keyframes wiggle': {
                        '0%, 100%': { transform: 'rotate(0deg)' },
                        '25%': { transform: 'rotate(5deg)' },
                        '75%': { transform: 'rotate(-5deg)' },
                    },
                }}
            >
                <Restaurant />
            </Box>
        </Paper>
    );
};

export default MealTimeCard;
