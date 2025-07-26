import React from 'react';
import { Typography, Box, IconButton } from '@mui/material';
import { ArrowBack, CalendarToday } from '@mui/icons-material';

interface FoodLogHeaderProps {
    onBack?: () => void;
    selectedDate: string;
}

const FoodLogHeader: React.FC<FoodLogHeaderProps> = ({ onBack, selectedDate }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'short'
        });
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            {onBack && (
                <IconButton 
                    onClick={onBack} 
                    sx={{ mr: 2 }}
                    aria-label="戻る"
                >
                    <ArrowBack />
                </IconButton>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h4" component="h1">
                    食事記録
                </Typography>
            </Box>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                {formatDate(selectedDate)}
            </Typography>
        </Box>
    );
};

export default FoodLogHeader;
