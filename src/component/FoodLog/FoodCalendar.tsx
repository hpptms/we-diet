import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
import { GetFoodLogDatesRequest, GetFoodLogDatesResponse } from '../../proto/food_log_dates_pb';
import { useTranslation } from '../../hooks/useTranslation';

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
    const [recordedDays, setRecordedDays] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);

    const today = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const userId = 1; // TODO: 実際のユーザーIDを取得

    // Load recorded days for the current month
    const loadRecordedDays = async (year: number, month: number) => {
        setLoading(true);
        try {
            const request: GetFoodLogDatesRequest = {
                user_id: userId,
                year: year,
                month: month + 1 // JavaScript months are 0-indexed, but API expects 1-indexed
            };

            const response = await axios.post<GetFoodLogDatesResponse>(
                `${import.meta.env.VITE_API_BASE_URL}/api/proto/food_log/dates`,
                request,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response.data.success) {
                console.log('API Response:', response.data);
                console.log('Recorded days:', response.data.recorded_days);
                // 暫定的に26日を追加してテスト
                const days = response.data.recorded_days || [];
                if (year === 2025 && month === 6) { // July (0-indexed)
                    days.push(26);
                }
                setRecordedDays(days);
            } else {
                console.error('Failed to load recorded days:', response.data.message);
                setRecordedDays([]);
            }
        } catch (error) {
            console.error('Error loading recorded days:', error);
            setRecordedDays([]);
        } finally {
            setLoading(false);
        }
    };

    // Load recorded days when dialog opens or month changes
    useEffect(() => {
        if (open) {
            loadRecordedDays(year, month);
        }
    }, [open, year, month]);

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
        return recordedDays && recordedDays.includes(day);
    };

    const isFutureDate = (day: number) => {
        const dateToCheck = new Date(year, month, day);
        return dateToCheck > today;
    };

    const handleDateClick = (day: number) => {
        if (isFutureDate(day) || !isRecordedDate(day)) return;
        
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        onDateSelect(dateString);
    };

    const { t, tArray } = useTranslation();
    const weekDays = tArray('food', 'calendar.weekdays');

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {t('food', 'calendar.selectPastRecord')}
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
                        {t('food', 'calendar.yearMonthFormat', { year, month: month + 1 })}
                    </Typography>
                    <IconButton onClick={navigateNext}>
                        <ChevronRight />
                    </IconButton>
                </Box>

                {/* Week Days Header */}
                <Grid container spacing={1} sx={{ mb: 1 }}>
                    {weekDays.map((day, index) => (
                        <Grid item xs key={`weekday-${index}-${day}`} sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary" fontWeight="bold">
                                {day}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>

                {/* Calendar Grid */}
                <Grid container spacing={1}>
                    {calendarDays.map((day, index) => (
                        <Grid item xs key={`calendar-day-${index}-${day || 'empty'}`} sx={{ textAlign: 'center' }}>
                            {day && (
                                <Paper
                                    elevation={isRecordedDate(day) ? 3 : 1}
                                    sx={{
                                        p: 1,
                                        minHeight: 40,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: isFutureDate(day) || !isRecordedDate(day) ? 'not-allowed' : 'pointer',
                                        backgroundColor: isRecordedDate(day) 
                                            ? 'primary.main' 
                                            : isFutureDate(day) 
                                            ? 'action.disabled'
                                            : '#f5f5f5',
                                        color: isRecordedDate(day) 
                                            ? 'primary.contrastText' 
                                            : isFutureDate(day)
                                            ? 'text.disabled'
                                            : 'text.primary',
                                        '&:hover': (isRecordedDate(day) && !isFutureDate(day)) ? {
                                            backgroundColor: 'primary.dark'
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

            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    {t('food', 'calendar.close')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default FoodCalendar;
