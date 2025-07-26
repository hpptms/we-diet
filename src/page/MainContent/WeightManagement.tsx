import React, { useState, useEffect, useMemo } from 'react';
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

// Import protobuf types
import {
    WeightRecord,
    CreateWeightRecordRequest,
    CreateWeightRecordResponse,
    GetWeightRecordRequest,
    GetWeightRecordResponse,
    GetWeightRecordsRequest,
    GetWeightRecordsResponse,
    UpdateWeightRecordRequest,
    UpdateWeightRecordResponse
} from '../../proto/weight_record_pb';

// Import components
import WeightManagementHeader from '../../component/WeightManagement/WeightManagementHeader';
import WeightActionButtons from '../../component/WeightManagement/WeightActionButtons';
import WeightChart from '../../component/WeightManagement/WeightChart';
import WeightRecordsList from '../../component/WeightManagement/WeightRecordsList';
import WeightRecordModal from '../../component/WeightManagement/WeightRecordModal';
import OverwriteConfirmDialog from '../../component/WeightManagement/OverwriteConfirmDialog';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Protobuf communication utilities
const sendProtobufRequest = async (endpoint: string, requestData: any): Promise<any> => {
    const token = localStorage.getItem("token");
    const headers: any = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Protobuf request failed:', error);
        throw error;
    }
};

const sendProtobufGetRequest = async (endpoint: string, params?: any): Promise<any> => {
    const token = localStorage.getItem("token");
    const headers: any = {
        'Accept': 'application/json'
    };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const url = new URL(endpoint, window.location.origin);
    if (params) {
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null) {
                url.searchParams.append(key, params[key].toString());
            }
        });
    }

    try {
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Protobuf GET request failed:', error);
        throw error;
    }
};

interface WeightManagementProps {
    onBack?: () => void;
}

const WeightManagement: React.FC<WeightManagementProps> = ({ onBack }: WeightManagementProps) => {
    // Recoil state
    const [cache, setCache] = useRecoilState(weightRecordCacheAtom);
    const setClearCache = useSetRecoilState(clearWeightCacheAtom);
    
    // State
    const [weightRecords, setWeightRecords] = useState<any[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isPastRecordModalOpen, setIsPastRecordModalOpen] = useState(false);
    const [isOverwriteDialogOpen, setIsOverwriteDialogOpen] = useState(false);
    const [existingRecord, setExistingRecord] = useState<any>(null);
    const [pendingRecord, setPendingRecord] = useState<any>(null);
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

    // Current date and view period (常に月の1日に設定)
    const [currentDate, setCurrentDate] = useState(() => {
        const date = cache.currentDate || new Date();
        return new Date(date.getFullYear(), date.getMonth(), 1);
    });
    const [viewPeriod, setViewPeriod] = useState<'month' | 'year'>(cache.viewPeriod);

    const userId = 1;

    useEffect(() => {
        fetchWeightRecords();
    }, [viewPeriod, currentDate, cache]);

    // Handle back navigation
    const handleBack = () => {
        // キャッシュを完全にクリア
        setClearCache(true);
        setCache({
            monthlyRecords: {},
            yearlyRecords: {},
            currentDate: new Date(),
            viewPeriod: 'month'
        });
        
        // ローカルのステートもリセット
        setWeightRecords([]);
        setCurrentDate(new Date());
        setViewPeriod('month');
        
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
        
        // 現在の月の場合は常にキャッシュを無視して最新データを取得
        const now = new Date();
        const isCurrentMonth = viewPeriod === 'month' && 
                              currentDate.getFullYear() === now.getFullYear() && 
                              currentDate.getMonth() === now.getMonth();
        
        // Try to get from cache (現在の月以外の場合のみ)
        if (!isCurrentMonth) {
            if (viewPeriod === 'month' && cache.monthlyRecords[cacheKey]) {
                setWeightRecords(cache.monthlyRecords[cacheKey]);
                return;
            }
            if (viewPeriod === 'year' && cache.yearlyRecords[cacheKey]) {
                setWeightRecords(cache.yearlyRecords[cacheKey]);
                return;
            }
        }

        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem("token");
            let startDate: Date;
            let endDate: Date;
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            if (viewPeriod === 'month') {
                // 月の開始日（1日）から終了日を設定
                startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                
                // 現在の月の場合は今日まで、過去の月の場合は月末まで
                const now = new Date();
                const isCurrentMonth = currentDate.getFullYear() === now.getFullYear() && 
                                     currentDate.getMonth() === now.getMonth();
                
                if (isCurrentMonth) {
                    // 現在の月の場合は今日まで
                    endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                } else {
                    // 過去または未来の月の場合は月末まで
                    endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                }
                
                const response = await axios.get('/api/weight_records', {
                    params: {
                        user_id: userId,
                        start_date: startDate.toISOString().slice(0, 10),
                        end_date: endDate.toISOString().slice(0, 10)
                    },
                    headers
                });
                console.log('API Response:', response.data);
                const records = response.data.records || [];
                console.log('Extracted records:', records);
                setWeightRecords(records);
                
                setCache((prev: any) => ({
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
                console.log('Year API Response:', response.data);
                const records = response.data.monthly_averages || [];
                console.log('Extracted year records:', records);
                setWeightRecords(records);
                
                setCache((prev: any) => ({
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

    // Check if record exists for given date
    const checkExistingRecord = async (date: string) => {
        try {
            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const response = await axios.get('/api/weight_record', {
                params: {
                    user_id: userId,
                    date: date
                },
                headers
            });

            return response.data.record;
        } catch (error) {
            console.error('既存記録の確認に失敗しました:', error);
            return null;
        }
    };

    // Overwrite weight record
    const handleOverwriteRecord = async () => {
        if (!pendingRecord) return;

        try {
            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            console.log('Sending overwrite request:', pendingRecord);
            const response = await axios.put('/api/weight_record/overwrite', pendingRecord, { headers });
            console.log('Overwrite response:', response.data);
            
            // Reset states
            setFormData({
                date: new Date().toISOString().slice(0, 10),
                weight: '',
                note: ''
            });
            setPastFormData({
                date: new Date().toISOString().slice(0, 10),
                weight: '',
                note: ''
            });
            
            setIsAddModalOpen(false);
            setIsPastRecordModalOpen(false);
            setIsOverwriteDialogOpen(false);
            setExistingRecord(null);
            setPendingRecord(null);
            
            // Clear cache and refetch
            const cacheKey = generateCacheKey(currentDate, viewPeriod);
            if (viewPeriod === 'month') {
                setCache((prev: any) => {
                    const newMonthlyRecords = { ...prev.monthlyRecords };
                    delete newMonthlyRecords[cacheKey];
                    return {
                        ...prev,
                        monthlyRecords: newMonthlyRecords
                    };
                });
            } else {
                setCache((prev: any) => {
                    const newYearlyRecords = { ...prev.yearlyRecords };
                    delete newYearlyRecords[cacheKey];
                    return {
                        ...prev,
                        yearlyRecords: newYearlyRecords
                    };
                });
            }
            
            // Clear all caches for past records
            setCache((prev: any) => ({
                ...prev,
                monthlyRecords: {},
                yearlyRecords: {}
            }));
            
            fetchWeightRecords();
            alert('体重記録を上書きしました');
        } catch (error: any) {
            console.error('体重記録の上書きに失敗しました:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            
            if (error.response?.data?.error) {
                alert(`体重記録の上書きに失敗しました: ${error.response.data.error}`);
            } else {
                alert('体重記録の上書きに失敗しました');
            }
        }
    };

    // Add weight record handlers
    const handleAddWeight = async () => {
        if (!formData.weight) {
            alert('体重を入力してください');
            return;
        }

        // 体重の値をチェック
        const weightValue = parseFloat(formData.weight);
        if (isNaN(weightValue) || weightValue <= 0) {
            alert('正しい体重を入力してください');
            return;
        }

        // Check if record already exists
        const existing = await checkExistingRecord(formData.date);
        if (existing) {
            const request = {
                user_id: userId,
                date: formData.date,
                weight: weightValue,
                note: formData.note,
                is_public: "false"
            };
            setExistingRecord(existing);
            setPendingRecord(request);
            setIsOverwriteDialogOpen(true);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const request = {
                user_id: userId,
                date: formData.date,
                weight: weightValue,
                note: formData.note,
                is_public: "false"
            };

            console.log('体重記録送信データ:', request);

            const response = await axios.post('/api/weight_record', request, { headers });
            
            console.log('体重記録レスポンス:', response.data);
            
            setFormData({
                date: new Date().toISOString().slice(0, 10),
                weight: '',
                note: ''
            });
            
            setIsAddModalOpen(false);
            
            // Clear cache and refetch
            const cacheKey = generateCacheKey(currentDate, viewPeriod);
            if (viewPeriod === 'month') {
                setCache((prev: any) => {
                    const newMonthlyRecords = { ...prev.monthlyRecords };
                    delete newMonthlyRecords[cacheKey];
                    return {
                        ...prev,
                        monthlyRecords: newMonthlyRecords
                    };
                });
            } else {
                setCache((prev: any) => {
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
        } catch (error: any) {
            console.error('体重記録の追加に失敗しました:', error);
            
            let errorMessage = '体重記録の追加に失敗しました';
            
            if (error.response) {
                // サーバーからのエラーレスポンス
                console.error('サーバーエラー:', error.response.data);
                if (error.response.data && error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else if (error.response.status === 409) {
                    errorMessage = 'この日付の体重記録は既に存在します';
                } else if (error.response.status === 400) {
                    errorMessage = 'リクエストが不正です。入力内容を確認してください';
                } else if (error.response.status === 401) {
                    errorMessage = '認証エラーです。再度ログインしてください';
                } else if (error.response.status >= 500) {
                    errorMessage = 'サーバーエラーが発生しました。しばらく時間をおいて再試行してください';
                }
            } else if (error.request) {
                // ネットワークエラー
                console.error('ネットワークエラー:', error.request);
                errorMessage = 'ネットワークエラーが発生しました。接続を確認してください';
            }
            
            alert(errorMessage);
        }
    };

    const handleAddPastWeight = async () => {
        if (!pastFormData.weight) {
            alert('体重を入力してください');
            return;
        }

        // 体重の値をチェック
        const weightValue = parseFloat(pastFormData.weight);
        if (isNaN(weightValue) || weightValue <= 0) {
            alert('正しい体重を入力してください');
            return;
        }

        // Check if record already exists
        const existing = await checkExistingRecord(pastFormData.date);
        if (existing) {
            const request = {
                user_id: userId,
                date: pastFormData.date,
                weight: weightValue,
                note: pastFormData.note,
                is_public: "false"
            };
            setExistingRecord(existing);
            setPendingRecord(request);
            setIsOverwriteDialogOpen(true);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const request = {
                user_id: userId,
                date: pastFormData.date,
                weight: weightValue,
                note: pastFormData.note,
                is_public: "false"
            };

            console.log('過去の体重記録送信データ:', request);

            const response = await axios.post('/api/weight_record', request, { headers });
            
            console.log('過去の体重記録レスポンス:', response.data);
            
            setPastFormData({
                date: new Date().toISOString().slice(0, 10),
                weight: '',
                note: ''
            });
            
            setIsPastRecordModalOpen(false);
            
            setCache((prev: any) => ({
                ...prev,
                monthlyRecords: {},
                yearlyRecords: {}
            }));
            
            fetchWeightRecords();
            alert('過去の体重記録を追加しました');
        } catch (error: any) {
            console.error('体重記録の追加に失敗しました:', error);
            
            let errorMessage = '体重記録の追加に失敗しました';
            
            if (error.response) {
                // サーバーからのエラーレスポンス
                console.error('サーバーエラー:', error.response.data);
                if (error.response.data && error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else if (error.response.status === 409) {
                    errorMessage = 'この日付の体重記録は既に存在します';
                } else if (error.response.status === 400) {
                    errorMessage = 'リクエストが不正です。入力内容を確認してください';
                } else if (error.response.status === 401) {
                    errorMessage = '認証エラーです。再度ログインしてください';
                } else if (error.response.status >= 500) {
                    errorMessage = 'サーバーエラーが発生しました。しばらく時間をおいて再試行してください';
                }
            } else if (error.request) {
                // ネットワークエラー
                console.error('ネットワークエラー:', error.request);
                errorMessage = 'ネットワークエラーが発生しました。接続を確認してください';
            }
            
            alert(errorMessage);
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

    // Chart data preparation with memoization
    const chartData = useMemo(() => {
        console.log('prepareChartData called with:', {
            weightRecords,
            viewPeriod,
            recordsLength: weightRecords?.length || 0
        });
        
        if (!weightRecords || weightRecords.length === 0) {
            console.log('No weight records found, returning empty chart data');
            return {
                labels: [],
                datasets: []
            };
        }

        if (viewPeriod === 'month') {
            const sortedRecords = [...weightRecords].sort((a, b) => 
                new Date(a.Date || a.date).getTime() - new Date(b.Date || b.date).getTime()
            );

            const labels = sortedRecords.map(record => 
                new Date(record.Date || record.date).toLocaleDateString('ja-JP', { 
                    month: 'short', 
                    day: 'numeric' 
                })
            );
            
            const weights = sortedRecords.map(record => record.Weight || record.weight);
            const bodyFats = sortedRecords.map(record => record.BodyFat || record.body_fat || null);

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
    }, [weightRecords, viewPeriod, weightRecords.length]);

    const chartOptions = useMemo(() => ({
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
            tooltip: {
                callbacks: {
                    afterBody: function(context: any) {
                        if (viewPeriod === 'month' && weightRecords && context.length > 0) {
                            const dataIndex = context[0].dataIndex;
                            const sortedRecords = [...weightRecords].sort((a, b) => 
                                new Date(a.date).getTime() - new Date(b.date).getTime()
                            );
                            const record = sortedRecords[dataIndex];
                            if (record && record.note) {
                                return [`メモ: ${record.note}`];
                            }
                        }
                        return [];
                    }
                }
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
    }), [viewPeriod, currentDate, weightRecords]);

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
                chartData={chartData}
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
                onDateChange={(value: string) => setFormData({...formData, date: value})}
                onWeightChange={(value: string) => setFormData({...formData, weight: value})}
                onNoteChange={(value: string) => setFormData({...formData, note: value})}
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
                onDateChange={(value: string) => setPastFormData({...pastFormData, date: value})}
                onWeightChange={(value: string) => setPastFormData({...pastFormData, weight: value})}
                onNoteChange={(value: string) => setPastFormData({...pastFormData, note: value})}
                onSubmit={handleAddPastWeight}
                submitButtonText="記録する"
                submitButtonColor="info"
            />

            {/* Overwrite Confirmation Dialog */}
            <OverwriteConfirmDialog
                open={isOverwriteDialogOpen}
                onClose={() => {
                    setIsOverwriteDialogOpen(false);
                    setExistingRecord(null);
                    setPendingRecord(null);
                }}
                onConfirm={handleOverwriteRecord}
                date={pendingRecord?.date || ''}
                currentWeight={existingRecord?.Weight || existingRecord?.weight}
                newWeight={pendingRecord?.weight || 0}
            />
        </Box>
    );
};

export default WeightManagement;
