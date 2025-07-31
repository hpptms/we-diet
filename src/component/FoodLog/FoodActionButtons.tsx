import React from 'react';
import { Box, Button } from '@mui/material';
import { SkipPrevious, CalendarMonth, Timeline, Insights } from '@mui/icons-material';

interface FoodActionButtonsProps {
    onYesterdayRecord: () => void;
    onViewPastRecords: () => void;
    isDarkMode?: boolean;
}

const FoodActionButtons: React.FC<FoodActionButtonsProps> = ({
    onYesterdayRecord,
    onViewPastRecords,
    isDarkMode = false
}) => {
    return (
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
            <Button
                variant="contained"
                startIcon={<SkipPrevious />}
                onClick={onYesterdayRecord}
                sx={{
                    minWidth: 160,
                    borderRadius: 3,
                    bgcolor: isDarkMode ? '#000000' : 'rgba(102, 126, 234, 0.9)',
                    border: isDarkMode ? '1px solid white' : 'none',
                    color: 'white',
                    fontWeight: 'bold',
                    py: 1.5,
                    transition: 'all 0.3s ease',
                    boxShadow: isDarkMode ? 'none' : '0 4px 15px rgba(0,0,0,0.1)',
                    '&:hover': {
                        bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(102, 126, 234, 1)',
                        transform: 'translateY(-2px)',
                        boxShadow: isDarkMode ? 'none' : '0 6px 20px rgba(0,0,0,0.15)',
                    },
                    '&:active': {
                        transform: 'translateY(0)',
                    },
                }}
            >
                🗓️ 昨日の記録
            </Button>
            <Button
                variant="contained"
                startIcon={<CalendarMonth />}
                onClick={onViewPastRecords}
                sx={{
                    minWidth: 160,
                    borderRadius: 3,
                    bgcolor: isDarkMode ? '#000000' : 'rgba(118, 75, 162, 0.9)',
                    border: isDarkMode ? '1px solid white' : 'none',
                    color: 'white',
                    fontWeight: 'bold',
                    py: 1.5,
                    transition: 'all 0.3s ease',
                    boxShadow: isDarkMode ? 'none' : '0 4px 15px rgba(0,0,0,0.1)',
                    '&:hover': {
                        bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(118, 75, 162, 1)',
                        transform: 'translateY(-2px)',
                        boxShadow: isDarkMode ? 'none' : '0 6px 20px rgba(0,0,0,0.15)',
                    },
                    '&:active': {
                        transform: 'translateY(0)',
                    },
                }}
            >
                📊 過去の記録
            </Button>
        </Box>
    );
};

export default FoodActionButtons;
