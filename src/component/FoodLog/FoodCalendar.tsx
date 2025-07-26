import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    IconButton, 
    Grid, 
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from '@mui/material';
import { ChevronLeft, ChevronRight, Close } from '@mui/icons-material';

interface FoodCalendarProps {
    open: boolean;
    onClose: () => void;
    recordedDates: string[];
    onDateSelect: (date: string) => void;
}

const FoodCalendar: React.FC<FoodCalendarProps> = ({
    open,
    onClose,
    recordedDates,
    onDateSelect
}) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const today = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get first day of the month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    // Create calendar grid
    const calendarDays: (number | null)[] = [];
    
    // Add empty cells for days before the first day of month
    for (let i = 0; i < startDayOfWeek; i++) {
        calendarDays.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    const navigatePrevious = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const navigateNext = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const isRecordedDate = (day: number) => {
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return recordedDates.includes(dateString);
    };

    const isFutureDate = (day: number) => {
        const dateToCheck = new Date(year, month, day);
        return dateToCheck > today;
    };

    const handleDateClick = (day: number) => {
        if (isFutureDate(day)) return;
        
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        onDateSelect(dateString);
    };

    const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">
                    過去の記録を選択
                </Typography>
                <IconButton onClick={onClose}>
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {/* Month Navigation */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <IconButton onClick={navigatePrevious}>
                        <ChevronLeft />
                    </IconButton>
                    <Typography variant="h6">
                        {year}年{month + 1}月
                    </Typography>
                    <IconButton onClick={navigateNext}>
                        <ChevronRight />
                    </IconButton>
                </Box>

                {/* Week Days Header */}
                <Grid container spacing={1} sx={{ mb: 1 }}>
                    {weekDays.map((day) => (
                        <Grid item xs key={day} sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary" fontWeight="bold">
                                {day}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>

                {/* Calendar Grid */}
                <Grid container spacing={1}>
                    {calendarDays.map((day, index) => (
                        <Grid item xs key={index} sx={{ textAlign: 'center' }}>
                            {day && (
                                <Paper
                                    elevation={isRecordedDate(day) ? 3 : 1}
                                    sx={{
                                        p: 1,
                                        minHeight: 40,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: isFutureDate(day) ? 'not-allowed' : 'pointer',
                                        backgroundColor: isRecordedDate(day) 
                                            ? 'primary.main' 
                                            : isFutureDate(day) 
                                            ? 'action.disabled'
                                            : 'background.paper',
                                        color: isRecordedDate(day) 
                                            ? 'primary.contrastText' 
                                            : isFutureDate(day)
                                            ? 'text.disabled'
                                            : 'text.primary',
                                        '&:hover': !isFutureDate(day) ? {
                                            backgroundColor: isRecordedDate(day) 
                                                ? 'primary.dark' 
                                                : 'action.hover'
                                        } : {}
                                    }}
                                    onClick={() => handleDateClick(day)}
                                >
                                    <Typography variant="body2">
                                        {day}
                                    </Typography>
                                </Paper>
                            )}
                        </Grid>
                    ))}
                </Grid>

                <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Paper 
                            sx={{ 
                                width: 20, 
                                height: 20, 
                                backgroundColor: 'primary.main' 
                            }} 
                        />
                        <Typography variant="body2">記録あり</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Paper 
                            sx={{ 
                                width: 20, 
                                height: 20, 
                                backgroundColor: 'background.paper',
                                border: 1,
                                borderColor: 'divider'
                            }} 
                        />
                        <Typography variant="body2">記録なし</Typography>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    閉じる
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FoodCalendar;
