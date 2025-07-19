import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Box } from '@mui/material';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { weightRecordCacheAtom, clearWeightCacheAtom } from '../../recoil/weightRecordCacheAtom';

// Import components
import WeightManagementHeader from '../../component/WeightManagement/WeightManagementHeader';
import WeightActionButtons from '../../component/WeightManagement/WeightActionButtons';
import WeightChart from '../../component/WeightManagement/WeightChart';
import WeightRecordsList from '../../component/WeightManagement/WeightRecordsList';
import WeightRecordModal from '../../component/WeightManagement/WeightRecordModal';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface WeightManagementProps {
    onBack?: () => void;
}

const WeightManagement: React.FC<WeightManagementProps> = ({ onBack }) => {
    // Recoil state
    const [cache, setCache] = useRecoilState(weightRecordCacheAtom);
    const setClearCache = useSetRecoilState(clearWeightCacheAtom);
    
    // State
    const [weightRecords, setWeightRecords] = useState<any[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isPastRecordModalOpen, setIsPastRecordModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Form state
    const [formData, setFormData] = useState({
        date: new Date().toISOString().slice(0, 10),
        weight: '',
        note: ''
    });

    const [pastFormData, setPastFormData] = useState({
        date: new Date().toISOString().slice(0, 10),
        weight: '',
        note: ''
    });

    // Current date and view period
    const [currentDate, setCurrentDate] = useState(cache.currentDate);
    const [viewPeriod, setViewPeriod] = useState<'month' | 'year'>(cache.viewPeriod);

    const userId = 1;

    useEffect(() => {
        fetchWeightRecords();
    }, [viewPeriod, currentDate]);

    // Handle back navigation
    const handleBack = () => {
        setClearCache(true);
        setCache({
            monthlyRecords: {},
            yearlyRecords: {},
            currentDate: new Date(),
            viewPeriod: 'month'
        });
        if (onBack) {
            onBack();
        }
    };

    // Cache key generation
    const generateCacheKey = (date: Date, period: 'month' | 'year'): string => {
        if (period === 'month') {
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        } else {
            return `${date.getFullYear()}`;
        }
    };

    // Fetch weight records
    const fetchWeightRecords = async () => {
        const cacheKey = generateCacheKey(currentDate, viewPeriod);
        
        // Try to get from cache
        if (viewPeriod === 'month' && cache.monthlyRecords[cacheKey]) {
            setWeightRecords(cache.monthlyRecords[cacheKey]);
            return;
        }
        if (viewPeriod === 'year' && cache.yearlyRecords[cacheKey]) {
            setWeightRecords(cache.yearlyRecords[cacheKey]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            let startDate: Date;
            let endDate: Date;
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            if (viewPeriod === 'month') {
                startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                
                const response = await axios.get('/api/weight_records', {
                    params: {
                        user_id: userId,
                        start_date: startDate.toISOString().slice(0, 10),
                        end_date: endDate.toISOString().slice(0, 10)
                    },
                    headers
                });
                const records = response.data.records || [];
                setWeightRecords(records);
                
                setCache(prev => ({
                    ...prev,
                    monthlyRecords: {
                        ...prev.monthlyRecords,
                        [cacheKey]: records
                    },
                    currentDate,
                    viewPeriod
                }));
            } else {
                startDate = new Date(currentDate.getFullYear(), 0, 1);
                endDate = new Date(currentDate.getFullYear(), 11, 31);
                
                const response = await axios.get('/api/weight_records', {
                    params: {
                        user_id: userId,
                        start_date: startDate.toISOString().slice(0, 10),
                        end_date: endDate.toISOString().slice(0, 10),
                        monthly_average: true
                    },
                    headers
                });
                const records = response.data.monthly_averages || [];
                setWeightRecords(records);
                
                setCache(prev => ({
                    ...prev,
                    yearlyRecords: {
                        ...prev.yearlyRecords,
                        [cacheKey]: records
                    },
                    currentDate,
                    viewPeriod
                }));
            }
        } catch (error: any) {
            console.error('体重記録の取得に失敗しました:', error);
            if (error.response && error.response.status === 401) {
                setError('認証エラー：再度ログインしてください');
            } else if (error.response && error.response.data && error.response.data.error) {
                setError('エラー: ' + error.response.data.error);
            } else {
                setError('体重記録の取得に失敗しました');
            }
        } finally {
            setLoading(false);
        }
    };

    // Add weight record handlers
    const handleAddWeight = async () => {
        if (!formData.weight) {
            alert('体重を入力してください');
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const request = {
                user_id: userId,
                date: formData.date,
                weight: parseFloat(formData.weight),
                note: formData.note,
                is_public: "false"
            };

            await axios.post('/api/weight_record', request, { headers });
            
            setFormData({
                date: new Date().toISOString().slice(0, 10),
                weight: '',
                note: ''
            });
            
            setIsAddModalOpen(false);
            
            // Clear cache and refetch
            const cacheKey = generateCacheKey(currentDate, viewPeriod);
            if (viewPeriod === 'month') {
                setCache(prev => {
                    const newMonthlyRecords = { ...prev.monthlyRecords };
                    delete newMonthlyRecords[cacheKey];
                    return {
                        ...prev,
                        monthlyRecords: newMonthlyRecords
                    };
                });
            } else {
                setCache(prev => {
                    const newYearlyRecords = { ...prev.yearlyRecords };
                    delete newYearlyRecords[cacheKey];
                    return {
                        ...prev,
                        yearlyRecords: newYearlyRecords
                    };
                });
            }
            
            fetchWeightRecords();
            alert('体重記録を追加しました');
        } catch (error) {
            console.error('体重記録の追加に失敗しました:', error);
            alert('体重記録の追加に失敗しました');
        }
    };

    const handleAddPastWeight = async () => {
        if (!pastFormData.weight) {
            alert('体重を入力してください');
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const request = {
                user_id: userId,
                date: pastFormData.date,
                weight: parseFloat(pastFormData.weight),
                note: pastFormData.note,
                is_public: "false"
            };

            await axios.post('/api/weight_record', request, { headers });
            
            setPastFormData({
                date: new Date().toISOString().slice(0, 10),
                weight: '',
                note: ''
            });
            
            setIsPastRecordModalOpen(false);
            
            setCache(prev => ({
                ...prev,
                monthlyRecords: {},
                yearlyRecords: {}
            }));
            
            fetchWeightRecords();
            alert('過去の体重記録を追加しました');
        } catch (error) {
            console.error('体重記録の追加に失敗しました:', error);
            alert('体重記録の追加に失敗しました');
        }
    };

    // Navigation handlers
    const navigatePrevious = () => {
        if (viewPeriod === 'month') {
            const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
            setCurrentDate(newDate);
        } else {
            const newDate = new Date(currentDate.getFullYear() - 1, 0, 1);
            setCurrentDate(newDate);
        }
    };

    const navigateNext = () => {
        if (viewPeriod === 'month') {
            const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
            setCurrentDate(newDate);
        } else {
            const newDate = new Date(currentDate.getFullYear() + 1, 0, 1);
            setCurrentDate(newDate);
        }
    };

    const isCurrentPeriod = () => {
        const now = new Date();
        if (viewPeriod === 'month') {
            return currentDate.getFullYear() === now.getFullYear() && currentDate.getMonth() === now.getMonth();
        } else {
            return currentDate.getFullYear() === now.getFullYear();
        }
    };

    const formatCurrentPeriod = () => {
        if (viewPeriod === 'month') {
            return `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月`;
        } else {
            return `${currentDate.getFullYear()}年`;
        }
    };

    const handleViewPeriodChange = (period: 'month' | 'year') => {
        setViewPeriod(period);
        setCurrentDate(new Date());
    };

    // Chart data preparation
    const prepareChartData = () => {
        if (!weightRecords || weightRecords.length === 0) {
            return {
                labels: [],
                datasets: []
            };
        }

        if (viewPeriod === 'month') {
            const sortedRecords = [...weightRecords].sort((a, b) => 
                new Date(a.date).getTime() - new Date(b.date).getTime()
            );

            const labels = sortedRecords.map(record => 
                new Date(record.date).toLocaleDateString('ja-JP', { 
                    month: 'short', 
                    day: 'numeric' 
                })
            );
            
            const weights = sortedRecords.map(record => record.weight);
            const bodyFats = sortedRecords.map(record => record.body_fat || null);

            return {
                labels,
                datasets: [
                    {
                        label: '体重 (kg)',
                        data: weights,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        yAxisID: 'y',
                    },
                    {
                        label: '体脂肪率 (%)',
                        data: bodyFats,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        yAxisID: 'y1',
                    }
                ]
            };
        } else {
            const validRecords = Array.isArray(weightRecords)
                ? weightRecords.filter(record => record && typeof record.year_month === 'string' && typeof record.average_weight === 'number')
                : [];
            if (validRecords.length === 0) {
                return {
                    labels: [],
                    datasets: []
                };
            }
            const sortedRecords = [...validRecords].sort((a, b) => a.year_month.localeCompare(b.year_month));
            const labels = sortedRecords.map(record => {
                const [year, month] = record.year_month.split('-');
                return `${year}年${parseInt(month)}月`;
            });
            const weights = sortedRecords.map(record => record.average_weight);

            return {
                labels,
                datasets: [
                    {
                        label: '月平均体重 (kg)',
                        data: weights,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        yAxisID: 'y',
                    }
                ]
            };
        }
    };

    const chartOptions = {
        responsive: true,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            title: {
                display: true,
                text: `体重推移 (${formatCurrentPeriod()})`
            },
            legend: {
                display: true,
            },
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: '日付'
                }
            },
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                title: {
                    display: true,
                    text: '体重 (kg)'
                }
            },
            ...(viewPeriod === 'month' && {
                y1: {
                    type: 'linear' as const,
                    display: true,
                    position: 'right' as const,
                    title: {
                        display: true,
                        text: '体脂肪率 (%)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }),
        },
    };

    return (
        <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
            {/* Header */}
            <WeightManagementHeader onBack={handleBack} />

            {/* Action Buttons */}
            <WeightActionButtons
                viewPeriod={viewPeriod}
                currentPeriod={formatCurrentPeriod()}
                isCurrentPeriod={isCurrentPeriod()}
                onAddTodayWeight={() => setIsAddModalOpen(true)}
                onAddPastWeight={() => setIsPastRecordModalOpen(true)}
                onViewPeriodChange={handleViewPeriodChange}
                onNavigatePrevious={navigatePrevious}
                onNavigateNext={navigateNext}
            />

            {/* Chart */}
            <WeightChart
                error={error}
                loading={loading}
                weightRecords={weightRecords}
                chartData={prepareChartData()}
                chartOptions={chartOptions}
            />

            {/* Records List */}
            <WeightRecordsList
                weightRecords={weightRecords}
                viewPeriod={viewPeriod}
            />

            {/* Today's Weight Record Modal */}
            <WeightRecordModal
                open={isAddModalOpen}
                title="今日の体重を記録"
                dateValue={formData.date}
                weightValue={formData.weight}
                noteValue={formData.note}
                isDateReadOnly={true}
                onClose={() => setIsAddModalOpen(false)}
                onDateChange={(value) => setFormData({...formData, date: value})}
                onWeightChange={(value) => setFormData({...formData, weight: value})}
                onNoteChange={(value) => setFormData({...formData, note: value})}
                onSubmit={handleAddWeight}
                submitButtonText="記録する"
                submitButtonColor="success"
            />

            {/* Past Weight Record Modal */}
            <WeightRecordModal
                open={isPastRecordModalOpen}
                title="過去の体重を記録"
                dateValue={pastFormData.date}
                weightValue={pastFormData.weight}
                noteValue={pastFormData.note}
                isDateReadOnly={false}
                onClose={() => setIsPastRecordModalOpen(false)}
                onDateChange={(value) => setPastFormData({...pastFormData, date: value})}
                onWeightChange={(value) => setPastFormData({...pastFormData, weight: value})}
                onNoteChange={(value) => setPastFormData({...pastFormData, note: value})}
                onSubmit={handleAddPastWeight}
                submitButtonText="記録する"
                submitButtonColor="info"
            />
        </Box>
    );
};

export default WeightManagement;
