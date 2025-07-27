import React from 'react';
import { Box, Button } from '@mui/material';
import { SkipPrevious, CalendarMonth, Timeline, Insights } from '@mui/icons-material';

interface FoodActionButtonsProps {
    onYesterdayRecord: () => void;
    onViewPastRecords: () => void;
}

const FoodActionButtons: React.FC<FoodActionButtonsProps> = ({
    onYesterdayRecord,
    onViewPastRecords
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
                    bgcolor: 'rgba(102, 126, 234, 0.9)',
                    color: 'white',
                    fontWeight: 'bold',
                    py: 1.5,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    '&:hover': {
                        bgcolor: 'rgba(102, 126, 234, 1)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
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
                    bgcolor: 'rgba(118, 75, 162, 0.9)',
                    color: 'white',
                    fontWeight: 'bold',
                    py: 1.5,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    '&:hover': {
                        bgcolor: 'rgba(118, 75, 162, 1)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
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
