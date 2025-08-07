import React from 'react';
import { Box, Button } from '@mui/material';
import { createGradientButtonStyle } from '../../hooks/useResponsive';

// 距離ボタン（100m・1キロ）コンポーネント
export const DistanceButtons: React.FC<{
    onAdd: (amount: number) => void;
    isDarkMode?: boolean;
}> = ({ onAdd, isDarkMode = false }) => {
    return (
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Button
                size="medium"
                variant="contained"
                sx={createGradientButtonStyle(['#43e97b', '#38f9d7'], isDarkMode)}
                onClick={() => onAdd(0.1)}
            >
                100m
            </Button>
            <Button
                size="medium"
                variant="contained"
                sx={{
                    ...createGradientButtonStyle(['#fa709a', '#fee140'], isDarkMode),
                    minWidth: isDarkMode ? 50 : 70,
                }}
                onClick={() => onAdd(1)}
            >
                1キロ
            </Button>
        </Box>
    );
};

// 時間ボタン（1分・10分・1時間）コンポーネント
export const TimeButtons: React.FC<{
    onAdd: (amount: number) => void;
    isDarkMode?: boolean;
}> = ({ onAdd, isDarkMode = false }) => {
    return (
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Button
                size="medium"
                variant="contained"
                sx={{
                    ...createGradientButtonStyle(['#43cea2', '#185a9d'], isDarkMode),
                    minWidth: isDarkMode ? 35 : 50,
                }}
                onClick={() => onAdd(1)}
            >
                1分
            </Button>
            <Button
                size="medium"
                variant="contained"
                sx={{
                    ...createGradientButtonStyle(['#f7971e', '#ffd200'], isDarkMode),
                    minWidth: isDarkMode ? 42 : 60,
                }}
                onClick={() => onAdd(10)}
            >
                10分
            </Button>
            <Button
                size="medium"
                variant="contained"
                sx={{
                    ...createGradientButtonStyle(['#ff5858', '#f09819'], isDarkMode),
                    minWidth: isDarkMode ? 50 : 70,
                }}
                onClick={() => onAdd(60)}
            >
                1時間
            </Button>
        </Box>
    );
};

// 回数ボタン（1回・10回）コンポーネント
export const RepsButtons: React.FC<{
    onSet: (value: number) => void;
    isDarkMode?: boolean;
}> = ({ onSet, isDarkMode = false }) => {
    return (
        <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'center' }}>
            <Button
                size="medium"
                variant="contained"
                sx={createGradientButtonStyle(['#43e97b', '#38f9d7'], isDarkMode)}
                onClick={() => onSet(1)}
            >
                1回
            </Button>
            <Button
                size="medium"
                variant="contained"
                sx={{
                    ...createGradientButtonStyle(['#fa709a', '#fee140'], isDarkMode),
                    minWidth: isDarkMode ? 45 : 65,
                }}
                onClick={() => onSet(10)}
            >
                10回
            </Button>
        </Box>
    );
};

// 歩数ボタン（1歩・10歩・100歩・1000歩）コンポーネント
export const StepsButtons: React.FC<{
    onAdd: (amount: number) => void;
    isDarkMode?: boolean;
}> = ({ onAdd, isDarkMode = false }) => {
    return (
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <Button
                size="medium"
                variant="contained"
                sx={{
                    ...createGradientButtonStyle(['#667eea', '#764ba2'], isDarkMode),
                    minWidth: isDarkMode ? 35 : 50,
                }}
                onClick={() => onAdd(1)}
            >
                1歩
            </Button>
            <Button
                size="medium"
                variant="contained"
                sx={{
                    ...createGradientButtonStyle(['#f093fb', '#f5576c'], isDarkMode),
                    minWidth: isDarkMode ? 42 : 60,
                }}
                onClick={() => onAdd(10)}
            >
                10歩
            </Button>
            <Button
                size="medium"
                variant="contained"
                sx={{
                    ...createGradientButtonStyle(['#4facfe', '#00f2fe'], isDarkMode),
                    minWidth: isDarkMode ? 50 : 70,
                }}
                onClick={() => onAdd(100)}
            >
                100歩
            </Button>
            <Button
                size="medium"
                variant="contained"
                sx={{
                    ...createGradientButtonStyle(['#43e97b', '#38f9d7'], isDarkMode),
                    minWidth: isDarkMode ? 55 : 75,
                }}
                onClick={() => onAdd(1000)}
            >
                1000歩
            </Button>
        </Box>
    );
};
