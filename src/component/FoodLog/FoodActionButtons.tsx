import React from 'react';
import { Box, Button } from '@mui/material';
import { SkipPrevious, CalendarMonth } from '@mui/icons-material';

interface FoodActionButtonsProps {
    onYesterdayRecord: () => void;
    onViewPastRecords: () => void;
}

const FoodActionButtons: React.FC<FoodActionButtonsProps> = ({
    onYesterdayRecord,
    onViewPastRecords
}) => {
    return (
        <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'center' }}>
            <Button
                variant="outlined"
                startIcon={<SkipPrevious />}
                onClick={onYesterdayRecord}
                sx={{ minWidth: 140 }}
            >
                昨日の記録
            </Button>
            <Button
                variant="outlined"
                startIcon={<CalendarMonth />}
                onClick={onViewPastRecords}
                sx={{ minWidth: 140 }}
            >
                過去の記録を見る
            </Button>
        </Box>
    );
};

export default FoodActionButtons;
