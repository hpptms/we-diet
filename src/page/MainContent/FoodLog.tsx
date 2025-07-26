import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Alert,
    CircularProgress
} from '@mui/material';
import { useRecoilState } from 'recoil';
import { foodLogState } from '../../recoil/foodLogAtom';
import {
    CreateFoodLogRequest,
    CreateFoodLogResponse,
    GetFoodLogRequest,
    GetFoodLogResponse,
    GetFoodLogsRequest,
    GetFoodLogsResponse,
    type FoodLog as FoodLogType
} from '../../proto/food_log_pb';

// Import components
import FoodLogHeader from '../../component/FoodLog/FoodLogHeader';
import DiaryField from '../../component/FoodLog/DiaryField';
import PhotoUploadField from '../../component/FoodLog/PhotoUploadField';
import PublicToggle from '../../component/common/PublicToggle';
import SaveButtons from '../../component/common/SaveButtons';
import FoodActionButtons from '../../component/FoodLog/FoodActionButtons';
import FoodCalendar from '../../component/FoodLog/FoodCalendar';
import RecordViewDialog from '../../component/FoodLog/RecordViewDialog';

interface FoodLogProps {
    onBack?: () => void;
}

const FoodLog: React.FC<FoodLogProps> = ({ onBack }) => {
    const [foodLog, setFoodLog] = useRecoilState(foodLogState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [recordViewOpen, setRecordViewOpen] = useState(false);
    const [viewingRecord, setViewingRecord] = useState<FoodLogType | undefined>();

    const userId = 1; // TODO: 実際のユーザーIDを取得

    // Load today's record on component mount
    useEffect(() => {
        loadTodayRecord();
        loadRecordedDates();
    }, []);

    const loadTodayRecord = async () => {
        try {
            const request: GetFoodLogRequest = {
                user_id: userId,
                date: foodLog.selectedDate
            };

            const response = await axios.post<GetFoodLogResponse>(
                '/api/proto/food_log/get',
                request,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response.data.success && response.data.record) {
                const record = response.data.record;
                setFoodLog(prev => ({
                    ...prev,
                    diary: record.diary || '',
                    photos: record.photos || [],
                    isPublic: record.is_public || false,
                    currentRecord: record
                }));
            }
        } catch (error: any) {
            console.log('今日の記録は見つかりませんでした');
        }
    };

    const loadRecordedDates = async () => {
        try {
            const request: GetFoodLogsRequest = {
                user_id: userId
            };

            const response = await axios.post<GetFoodLogsResponse>(
                '/api/proto/food_log/list',
                request,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response.data.success) {
                const dates = response.data.records.map(record => record.date);
                setFoodLog(prev => ({
                    ...prev,
                    recordedDates: dates
                }));
            }
        } catch (error: any) {
            console.error('記録日の取得に失敗しました:', error);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // 既存の記録があるかチェック
            const isUpdate = foodLog.currentRecord !== undefined;
            const confirmMessage = isUpdate 
                ? '既存の記録を更新します。古い写真は自動的に削除され、新しい写真で置き換えられます。よろしいですか？'
                : '新しい食事記録を保存します。よろしいですか？';
            
            if (!window.confirm(confirmMessage)) {
                setLoading(false);
                return;
            }

            const request: CreateFoodLogRequest = {
                user_id: userId,
                date: foodLog.selectedDate,
                diary: foodLog.diary,
                photos: foodLog.photos,
                is_public: foodLog.isPublic
            };

            console.log('送信するリクエストデータ:', request);

            const response = await axios.post<CreateFoodLogResponse>(
                '/api/proto/food_log/create',
                request,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            console.log('食事記録保存レスポンス:', response.data);

            if (response.data.success) {
                const successMessage = isUpdate 
                    ? '食事記録を更新しました！古い写真は自動的に削除されました。'
                    : '食事記録を保存しました！';
                setSuccess(successMessage);
                setFoodLog(prev => ({
                    ...prev,
                    currentRecord: response.data.record
                }));
                // Reload recorded dates
                loadRecordedDates();
            } else {
                setError(`食事記録の保存に失敗しました: ${response.data.message}`);
            }
        } catch (error: any) {
            console.error('食事記録の保存に失敗しました:', error);
            
            let errorMessage = '食事記録の保存に失敗しました';
            
            if (error.response) {
                console.error('Response data:', error.response.data);
                if (error.response.data && error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else if (error.response.status === 400) {
                    errorMessage = 'リクエストが不正です。入力内容を確認してください';
                } else if (error.response.status === 401) {
                    errorMessage = '認証エラーです。再度ログインしてください';
                } else if (error.response.status >= 500) {
                    errorMessage = 'サーバーエラーが発生しました。しばらく時間をおいて再試行してください';
                }
            } else if (error.request) {
                errorMessage = 'ネットワークエラーが発生しました。接続を確認してください';
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleYesterdayRecord = async () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().slice(0, 10);

        try {
            const request: GetFoodLogRequest = {
                user_id: userId,
                date: yesterdayString
            };

            const response = await axios.post<GetFoodLogResponse>(
                '/api/proto/food_log/get',
                request,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response.data.success && response.data.record) {
                setViewingRecord(response.data.record);
                setRecordViewOpen(true);
            } else {
                setError('昨日の記録が見つかりませんでした');
            }
        } catch (error: any) {
            console.error('昨日の記録の取得に失敗しました:', error);
            setError('昨日の記録の取得に失敗しました');
        }
    };

    const handleDateSelect = async (dateString: string) => {
        setCalendarOpen(false);

        try {
            const request: GetFoodLogRequest = {
                user_id: userId,
                date: dateString
            };

            const response = await axios.post<GetFoodLogResponse>(
                '/api/proto/food_log/get',
                request,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response.data.success && response.data.record) {
                setViewingRecord(response.data.record);
                setRecordViewOpen(true);
            } else {
                setError('選択した日の記録が見つかりませんでした');
            }
        } catch (error: any) {
            console.error('記録の取得に失敗しました:', error);
            setError('記録の取得に失敗しました');
        }
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            {/* Header */}
            <FoodLogHeader 
                onBack={onBack} 
                selectedDate={foodLog.selectedDate}
            />

            {/* Action Buttons */}
            <FoodActionButtons
                onYesterdayRecord={handleYesterdayRecord}
                onViewPastRecords={() => setCalendarOpen(true)}
            />

            {/* Alert Messages */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
                    {success}
                </Alert>
            )}

            {/* Main Form */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    {/* Diary Field */}
                    <DiaryField
                        diary={foodLog.diary}
                        onChange={(diary) => setFoodLog(prev => ({ ...prev, diary }))}
                    />

                    {/* Photo Upload Field */}
                    <PhotoUploadField
                        photos={foodLog.photos}
                        onChange={(photos) => setFoodLog(prev => ({ ...prev, photos }))}
                    />

                    {/* Public Toggle */}
                    <PublicToggle
                        isPublic={foodLog.isPublic}
                        onChange={(isPublic) => setFoodLog(prev => ({ ...prev, isPublic }))}
                    />

                    {/* Save Buttons */}
                    <SaveButtons
                        loading={loading}
                        onSave={handleSave}
                        onBack={onBack}
                    />
                </CardContent>
            </Card>

            {/* Calendar Dialog */}
            <FoodCalendar
                open={calendarOpen}
                onClose={() => setCalendarOpen(false)}
                recordedDates={foodLog.recordedDates}
                onDateSelect={handleDateSelect}
            />

            {/* Record View Dialog */}
            <RecordViewDialog
                open={recordViewOpen}
                onClose={() => {
                    setRecordViewOpen(false);
                    setViewingRecord(undefined);
                }}
                record={viewingRecord}
            />
        </Box>
    );
};

export default FoodLog;
