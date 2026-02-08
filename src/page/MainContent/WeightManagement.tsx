import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Box } from '@mui/material';

// Static import for Chart.js to ensure proper registration
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

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { weightRecordCacheAtom, clearWeightCacheAtom } from '../../recoil/weightRecordCacheAtom';
import { darkModeState } from '../../recoil/darkModeAtom';
import { useToast } from '../../hooks/useToast';
import { useTranslation } from '../../hooks/useTranslation';
import ToastProvider from '../../component/ToastProvider';

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
import {
    GetWeightRecordResponse as ProtoGetWeightRecordResponse,
    GetWeightRecordsResponse as ProtoGetWeightRecordsResponse,
} from '../../proto/weight_record';

// Protobuf → Legacy変換
const convertProtoWeightRecordToLegacy = (wr: { id: number; userId: number; date: string; weight: number; bodyFat?: number; note: string; isPublic: boolean; createdAt: string; updatedAt: string }): WeightRecord => ({
    id: wr.id,
    user_id: wr.userId,
    date: wr.date,
    weight: wr.weight,
    body_fat: wr.bodyFat,
    note: wr.note,
    is_public: wr.isPublic,
    created_at: wr.createdAt,
    updated_at: wr.updatedAt,
});

import '../../styles/mobile-responsive-fix.css';

// Import components
import WeightManagementHeader from '../../component/WeightManagement/WeightManagementHeader';
import WeightActionButtons from '../../component/WeightManagement/WeightActionButtons';
import WeightChart from '../../component/WeightManagement/WeightChart';
import WeightRecordsList from '../../component/WeightManagement/WeightRecordsList';
import WeightRecordModal from '../../component/WeightManagement/WeightRecordModal';
import OverwriteConfirmDialog from '../../component/WeightManagement/OverwriteConfirmDialog';

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
    const isDarkMode = useRecoilValue(darkModeState);
    const { toast, hideToast, showSuccess, showError, showWarning } = useToast();
    const { t } = useTranslation();
    
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
    const fetchWeightRecords = useCallback(async () => {
        // console.log('fetchWeightRecords called with:', { currentDate, viewPeriod });
        
        const cacheKey = generateCacheKey(currentDate, viewPeriod);
        
        // 現在の月の場合は常にキャッシュを無視して最新データを取得
        const now = new Date();
        const isCurrentMonth = viewPeriod === 'month' && 
                              currentDate.getFullYear() === now.getFullYear() && 
                              currentDate.getMonth() === now.getMonth();
        
        // console.log('Cache check:', { cacheKey, isCurrentMonth, hasMonthlyCache: !!cache.monthlyRecords[cacheKey], hasYearlyCache: !!cache.yearlyRecords[cacheKey] });
        
        // Try to get from cache (現在の月以外の場合のみ)
        if (!isCurrentMonth) {
            if (viewPeriod === 'month' && cache.monthlyRecords[cacheKey]) {
                // console.log('Using monthly cache for:', cacheKey);
                setWeightRecords(cache.monthlyRecords[cacheKey]);
                return;
            }
            if (viewPeriod === 'year' && cache.yearlyRecords[cacheKey]) {
                // console.log('Using yearly cache for:', cacheKey);
                setWeightRecords(cache.yearlyRecords[cacheKey]);
                return;
            }
        }

        // console.log('Making API request...');
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
                    endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                } else {
                    // 過去または未来の月の場合は月末まで
                    endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59);
                }
                
                // console.log('Date range:', {
                //     startDate: startDate.toISOString().slice(0, 10),
                //     endDate: endDate.toISOString().slice(0, 10),
                //     isCurrentMonth
                // });
                
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/weight_records`, {
                    params: {
                        user_id: userId,
                        start_date: startDate.toISOString().slice(0, 10),
                        end_date: endDate.toISOString().slice(0, 10)
                    },
                    headers: { ...headers, Accept: 'application/x-protobuf' },
                    responseType: 'arraybuffer',
                });
                const protoResp = ProtoGetWeightRecordsResponse.fromBinary(new Uint8Array(response.data));
                const records = protoResp.records.map(convertProtoWeightRecordToLegacy);
                // console.log('Extracted records:', records);
                setWeightRecords(records);
                
                // キャッシュ更新（状態変更の最小化）
                setCache((prev: any) => {
                    const newCache = {
                        ...prev,
                        monthlyRecords: {
                            ...prev.monthlyRecords,
                            [cacheKey]: records
                        }
                    };
                    // currentDateとviewPeriodは変更しない（無限ループ防止）
                    return newCache;
                });
            } else {
                startDate = new Date(currentDate.getFullYear(), 0, 1);
                endDate = new Date(currentDate.getFullYear(), 11, 31);
                
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}api/weight_records`, {
                    params: {
                        user_id: userId,
                        start_date: startDate.toISOString().slice(0, 10),
                        end_date: endDate.toISOString().slice(0, 10),
                        monthly_average: true
                    },
                    headers
                });
                // console.log('Year API Response:', response.data);
                const records = response.data.monthly_averages || [];
                // console.log('Extracted year records:', records);
                setWeightRecords(records);
                
                // キャッシュ更新（状態変更の最小化）
                setCache((prev: any) => {
                    const newCache = {
                        ...prev,
                        yearlyRecords: {
                            ...prev.yearlyRecords,
                            [cacheKey]: records
                        }
                    };
                    // currentDateとviewPeriodは変更しない（無限ループ防止）
                    return newCache;
                });
            }
        } catch (error: any) {
            console.error(t('weight', 'fetchFailed'), error);
            if (error.response && error.response.status === 401) {
                setError(t('weight', 'authError'));
            } else if (error.response && error.response.data && error.response.data.error) {
                setError(t('weight', 'apiError', { error: error.response.data.error }));
            } else {
                setError(t('weight', 'fetchFailed'));
            }
        } finally {
            setLoading(false);
        }
    }, [currentDate, viewPeriod, userId, t]);

    useEffect(() => {
        fetchWeightRecords();
    }, [fetchWeightRecords]);

    // Check if record exists for given date
    const checkExistingRecord = async (date: string) => {
        try {
            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/weight_record`, {
                params: {
                    user_id: userId,
                    date: date
                },
                headers: { ...headers, Accept: 'application/x-protobuf' },
                responseType: 'arraybuffer',
            });

            const protoResp = ProtoGetWeightRecordResponse.fromBinary(new Uint8Array(response.data));
            return protoResp.record ? convertProtoWeightRecordToLegacy(protoResp.record) : null;
        } catch (error) {
            console.error(t('weight', 'checkExistingFailed'), error);
            return null;
        }
    };

    // Overwrite weight record
    const handleOverwriteRecord = async () => {
        if (!pendingRecord) return;

        try {
            const token = localStorage.getItem("token");
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            // console.log('Sending overwrite request:', pendingRecord);
            const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/weight_record/overwrite`, pendingRecord, { headers });
            // console.log('Overwrite response:', response.data);
            
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
            showSuccess(t('weight', 'overwriteSuccess'));
        } catch (error: any) {
            console.error('体重記録の上書きに失敗しました:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
            
            if (error.response?.data?.error) {
                showError(t('weight', 'overwriteFailedWithError', { error: error.response.data.error }));
            } else {
                showError(t('weight', 'overwriteFailed'));
            }
        }
    };

    // Add weight record handlers
    const handleAddWeight = async () => {
        if (!formData.weight) {
            showWarning(t('weight', 'enterWeight'));
            return;
        }

        // 体重の値をチェック
        const weightValue = parseFloat(formData.weight);
        if (isNaN(weightValue) || weightValue <= 0) {
            showWarning(t('weight', 'enterValidWeight'));
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

            // console.log('体重記録送信データ:', request);

            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/weight_record`, request, { headers });
            
            // console.log('体重記録レスポンス:', response.data);
            
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
            showSuccess(t('weight', 'addSuccess'));
        } catch (error: any) {
            console.error(t('weight', 'addFailed'), error);
            
            let errorMessage = t('weight', 'addFailed');
            
            if (error.response) {
                // サーバーからのエラーレスポンス
                console.error('サーバーエラー:', error.response.data);
                if (error.response.data && error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else if (error.response.status === 409) {
                    errorMessage = t('weight', 'recordExists');
                } else if (error.response.status === 400) {
                    errorMessage = t('weight', 'badRequest');
                } else if (error.response.status === 401) {
                    errorMessage = t('weight', 'authFailed');
                } else if (error.response.status >= 500) {
                    errorMessage = t('weight', 'serverError');
                }
            } else if (error.request) {
                // ネットワークエラー
                console.error('ネットワークエラー:', error.request);
                errorMessage = t('weight', 'networkError');
            }
            
            showError(errorMessage);
        }
    };

    const handleAddPastWeight = async () => {
        if (!pastFormData.weight) {
            showWarning(t('weight', 'enterWeight'));
            return;
        }

        // 体重の値をチェック
        const weightValue = parseFloat(pastFormData.weight);
        if (isNaN(weightValue) || weightValue <= 0) {
            showWarning(t('weight', 'enterValidWeight'));
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

            // console.log('過去の体重記録送信データ:', request);

            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}api/weight_record`, request, { headers });
            
            // console.log('過去の体重記録レスポンス:', response.data);
            
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
            showSuccess(t('weight', 'addPastSuccess'));
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
            
            showError(errorMessage);
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
            return t('weight', 'monthFormat', { 
                year: currentDate.getFullYear(), 
                month: currentDate.getMonth() + 1 
            }, `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月`);
        } else {
            return t('weight', 'yearFormat', { 
                year: currentDate.getFullYear() 
            }, `${currentDate.getFullYear()}年`);
        }
    };

    const handleViewPeriodChange = (period: 'month' | 'year') => {
        setViewPeriod(period);
        setCurrentDate(new Date());
    };

    // Chart data preparation with memoization
    const chartData = useMemo(() => {
        // console.log('prepareChartData called with:', {
        //     weightRecords,
        //     viewPeriod,
        //     recordsLength: weightRecords?.length || 0
        // });
        
        if (!weightRecords || weightRecords.length === 0) {
            // console.log('No weight records found, returning empty chart data');
            return {
                labels: [],
                datasets: []
            };
        }

        if (viewPeriod === 'month') {
            // // デバッグ：最初のレコードの構造を確認
            // if (weightRecords.length > 0) {
            //     console.log('Sample record structure:', JSON.stringify(weightRecords[0], null, 2));
            // }

            // フィルタリングして有効なレコードのみを取得（月の範囲チェックも追加）
            const validRecords = weightRecords.filter(record => {
                // プロトバフ定義に基づくフィールド名: date, weight, body_fat, note
                const date = record.date || record.Date;
                const weight = record.weight || record.Weight;
                
                // 日付が有効で、体重データが存在するかチェック
                if (!date || weight === undefined || weight === null || isNaN(parseFloat(weight.toString()))) {
                    // console.log('Record filter check - invalid data:', { date, weight, record });
                    return false;
                }
                
                // 表示している月の範囲内かチェック
                const recordDate = new Date(date);
                const isInCurrentMonth = recordDate.getFullYear() === currentDate.getFullYear() && 
                                        recordDate.getMonth() === currentDate.getMonth();
                
                // console.log('Record filter check:', { 
                //     date, 
                //     weight, 
                //     recordDate: recordDate.toISOString().slice(0, 10),
                //     currentMonth: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`,
                //     isInCurrentMonth,
                //     record 
                // });
                
                return isInCurrentMonth;
            });

            // console.log('Valid records for chart:', validRecords);

            if (validRecords.length === 0) {
                // console.log('No valid records found for chart');
                return {
                    labels: [],
                    datasets: []
                };
            }

            const sortedRecords = [...validRecords].sort((a, b) => 
                new Date(a.date || a.Date).getTime() - new Date(b.date || b.Date).getTime()
            );

            const labels = sortedRecords.map(record => {
                const dateStr = record.date || record.Date;
                return new Date(dateStr).toLocaleDateString('ja-JP', { 
                    month: 'short', 
                    day: 'numeric' 
                });
            });
            
            const weights = sortedRecords.map(record => {
                const weight = record.weight || record.Weight;
                return parseFloat(weight.toString());
            });
            
            const bodyFats = sortedRecords.map(record => {
                const bodyFat = record.body_fat || record.BodyFat;
                if (bodyFat !== undefined && bodyFat !== null && !isNaN(parseFloat(bodyFat.toString()))) {
                    return parseFloat(bodyFat.toString());
                }
                return null;
            });

            // console.log('Chart data prepared:', { labels, weights, bodyFats });

            return {
                labels,
                datasets: [
                    {
                        label: t('weight', 'weightLabel', {}, '体重 (kg)'),
                        data: weights,
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        yAxisID: 'y',
                        tension: 0.1,
                    },
                    {
                        label: t('weight', 'bodyFatLabel', {}, '体脂肪率 (%)'),
                        data: bodyFats,
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        yAxisID: 'y1',
                        tension: 0.1,
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
                return t('weight', 'monthFormat', {
                    year: parseInt(year),
                    month: parseInt(month)
                }, `${year}年${parseInt(month)}月`);
            });
            const weights = sortedRecords.map(record => record.average_weight);
            
            // 体脂肪率データを取得（年単位表示でも）
            const bodyFats = sortedRecords.map(record => {
                // 全てのフィールドパターンをチェック
                const bodyFat = record.AverageBodyFat || record.average_body_fat || record.averageBodyFat;
                
                // console.log('Year view body fat detailed check:', { 
                //     record: JSON.stringify(record),
                //     allKeys: Object.keys(record),
                //     AverageBodyFat: record.AverageBodyFat,
                //     average_body_fat: record.average_body_fat,
                //     averageBodyFat: record.averageBodyFat,
                //     bodyFat: bodyFat,
                //     type: typeof bodyFat,
                // });
                
                if (bodyFat !== undefined && bodyFat !== null && !isNaN(parseFloat(bodyFat.toString()))) {
                    return parseFloat(bodyFat.toString());
                }
                return null;
            });

            // console.log('Year view final chart data:', { labels, weights, bodyFats, hasBodyFat: bodyFats.some(bf => bf !== null) });

            const datasets = [
                {
                    label: t('weight', 'monthlyAverageWeightLabel', {}, '月平均体重 (kg)'),
                    data: weights,
                    borderColor: 'rgb(75, 192, 192)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    yAxisID: 'y',
                    tension: 0.1,
                }
            ];

            // 体脂肪率データがある場合は追加
            const hasBodyFatData = bodyFats.some(bf => bf !== null);
            // console.log('Year view hasBodyFatData:', hasBodyFatData, 'bodyFats:', bodyFats);
            
            if (hasBodyFatData) {
                datasets.push({
                    label: t('weight', 'monthlyAverageBodyFatLabel', {}, '月平均体脂肪率 (%)'),
                    data: bodyFats,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    yAxisID: 'y1',
                    tension: 0.1,
                });
                // console.log('Added body fat dataset to year view');
            } else {
                // console.log('No body fat data found for year view');
            }

            return {
                labels,
                datasets
            };
        }
    }, [weightRecords, viewPeriod, currentDate]);

    const chartOptions = useMemo(() => ({
        responsive: true,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            title: {
                display: true,
                text: t('weight', 'chartTitle', { period: formatCurrentPeriod() }, `体重推移 (${formatCurrentPeriod()})`),
                ...(isDarkMode && {
                    color: '#ccc'
                })
            },
            legend: {
                display: true,
                ...(isDarkMode && {
                    labels: {
                        color: '#ccc'
                    }
                })
            },
            tooltip: {
                        callbacks: {
                            afterBody: function(context: any) {
                                if (viewPeriod === 'month' && weightRecords && context.length > 0) {
                                    const dataIndex = context[0].dataIndex;
                                    const sortedRecords = [...weightRecords].sort((a, b) => 
                                        new Date(a.date || a.Date).getTime() - new Date(b.date || b.Date).getTime()
                                    );
                                    const record = sortedRecords[dataIndex];
                                    if (record && (record.note || record.Note)) {
                                        return [t('weight', 'noteLabel', { note: record.note || record.Note }, `メモ: ${record.note || record.Note}`)];
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
                    text: t('weight', 'dateAxisLabel', {}, '日付'),
                    ...(isDarkMode && {
                        color: '#ccc'
                    })
                },
                ticks: {
                    ...(isDarkMode && {
                        color: '#ccc'
                    })
                },
                grid: {
                    ...(isDarkMode && {
                        color: '#444'
                    })
                }
            },
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
                title: {
                    display: true,
                    text: t('weight', 'weightAxisLabel', {}, '体重 (kg)'),
                    ...(isDarkMode && {
                        color: '#ccc'
                    })
                },
                ticks: {
                    ...(isDarkMode && {
                        color: '#ccc'
                    })
                },
                grid: {
                    ...(isDarkMode && {
                        color: '#444'
                    })
                }
            },
            ...((viewPeriod === 'month' || (viewPeriod === 'year' && chartData?.datasets?.length > 1)) && {
                y1: {
                    type: 'linear' as const,
                    display: true,
                    position: 'right' as const,
                    title: {
                        display: true,
                        text: viewPeriod === 'month' ? t('weight', 'bodyFatAxisLabel', {}, '体脂肪率 (%)') : t('weight', 'monthlyBodyFatAxisLabel', {}, '月平均体脂肪率 (%)'),
                        ...(isDarkMode && {
                            color: '#ccc'
                        })
                    },
                    ticks: {
                        ...(isDarkMode && {
                            color: '#ccc'
                        })
                    },
                    grid: {
                        drawOnChartArea: false,
                        ...(isDarkMode && {
                            color: '#444'
                        })
                    },
                }
            }),
        },
    }), [viewPeriod, currentDate, weightRecords, isDarkMode]);

    return (
        <Box sx={{
            p: { xs: 1, sm: 2, lg: 3 },
            maxWidth: { xs: '100%', lg: 1200 },
            width: '100%',
            mx: { xs: 0, lg: 'auto' },
            pb: { xs: '100px', sm: '80px', lg: 3 },
            minHeight: '100vh',
            backgroundColor: isDarkMode ? '#000000' : '#ffffff',
            color: isDarkMode ? '#ffffff' : 'inherit',
            boxSizing: 'border-box'
        }}>
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
                currentDate={currentDate}
            />

            {/* Today's Weight Record Modal */}
            <WeightRecordModal
                open={isAddModalOpen}
                title={t('weight', 'recordTodayWeight', {}, '今日の体重を記録')}
                dateValue={formData.date}
                weightValue={formData.weight}
                noteValue={formData.note}
                isDateReadOnly={true}
                onClose={() => setIsAddModalOpen(false)}
                onDateChange={(value: string) => setFormData({...formData, date: value})}
                onWeightChange={(value: string) => setFormData({...formData, weight: value})}
                onNoteChange={(value: string) => setFormData({...formData, note: value})}
                onSubmit={handleAddWeight}
                submitButtonText={t('weight', 'record', {}, '記録する')}
                submitButtonColor="success"
            />

            {/* Past Weight Record Modal */}
            <WeightRecordModal
                open={isPastRecordModalOpen}
                title={t('weight', 'recordPastWeight', {}, '過去の体重を記録')}
                dateValue={pastFormData.date}
                weightValue={pastFormData.weight}
                noteValue={pastFormData.note}
                isDateReadOnly={false}
                onClose={() => setIsPastRecordModalOpen(false)}
                onDateChange={(value: string) => setPastFormData({...pastFormData, date: value})}
                onWeightChange={(value: string) => setPastFormData({...pastFormData, weight: value})}
                onNoteChange={(value: string) => setPastFormData({...pastFormData, note: value})}
                onSubmit={handleAddPastWeight}
                submitButtonText={t('weight', 'record', {}, '記録する')}
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
                currentWeight={existingRecord?.weight || existingRecord?.Weight}
                newWeight={pendingRecord?.weight || 0}
            />
            
            {/* 共通トースト */}
            <ToastProvider toast={toast} onClose={hideToast} />
        </Box>
    );
};

export default WeightManagement;
