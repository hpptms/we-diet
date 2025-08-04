import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Typography,
    Alert,
    CircularProgress,
    Paper,
    Fab,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { Save, PhotoCamera } from '@mui/icons-material';
import { useRecoilState, useRecoilValue } from 'recoil';
import { darkModeState } from '../../recoil/darkModeAtom';
import { foodLogState } from '../../recoil/foodLogAtom';
import { postsApi } from '../../api/postsApi';
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
import UnifiedMealCard from '../../component/FoodLog/UnifiedMealCard';
import DailyProgressCard from '../../component/FoodLog/DailyProgressCard';
import PhotoUploadField from '../../component/FoodLog/PhotoUploadField';
import PublicToggle from '../../component/common/PublicToggle';
import FoodActionButtons from '../../component/FoodLog/FoodActionButtons';
import FoodCalendar from '../../component/FoodLog/FoodCalendar';
import RecordViewDialog from '../../component/FoodLog/RecordViewDialog';
import { trackDietEvent } from '../../utils/googleAnalytics';

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
    const isDarkMode = useRecoilValue(darkModeState);
    const theme = useTheme();
    
    // レスポンシブデザイン用のブレークポイント
    const isTabletOrMobile = useMediaQuery(theme.breakpoints.down('md')); // 768px以下
    const isPortraitMode = useMediaQuery('(orientation: portrait)');
    const isSmallScreen = useMediaQuery('(max-width: 900px)');
    
    // 食事時間別のデータ
    const [mealData, setMealData] = useState({
        breakfast: '',
        lunch: '',
        dinner: '',
        snack: ''
    });

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
                `${import.meta.env.VITE_API_BASE_URL}/api/proto/food_log/get`,
                request,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response.data.success && response.data.record) {
                const record = response.data.record;
                const diary = record.diary || '';
                
                // 既存の記録を時間帯別に分解（簡単な方法）
                const parts = diary.split('\n').filter(part => part.trim());
                const newMealData = { breakfast: '', lunch: '', dinner: '', snack: '' };
                
                parts.forEach(part => {
                    const lower = part.toLowerCase();
                    if (lower.includes('朝') || lower.includes('breakfast')) {
                        newMealData.breakfast += part + '\n';
                    } else if (lower.includes('昼') || lower.includes('lunch')) {
                        newMealData.lunch += part + '\n';
                    } else if (lower.includes('夜') || lower.includes('夕') || lower.includes('dinner')) {
                        newMealData.dinner += part + '\n';
                    } else if (lower.includes('間食') || lower.includes('おやつ') || lower.includes('snack')) {
                        newMealData.snack += part + '\n';
                    } else {
                        // 分類できない場合は朝食に入れる
                        newMealData.breakfast += part + '\n';
                    }
                });
                
                setMealData(newMealData);
                setFoodLog(prev => ({
                    ...prev,
                    diary: diary,
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
                `${import.meta.env.VITE_API_BASE_URL}/api/proto/food_log/list`,
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

    // 食事記録投稿のコンテンツを作成する関数
    const createFoodLogPostContent = () => {
        let content = "今日の食事記録 🍽️\n\n";
        
        if (foodLog.diary.trim()) {
            content += foodLog.diary + "\n\n";
        }
        
        content += "#今日の食事";
        
        return content;
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

            // console.log('送信するリクエストデータ:', request);

            const response = await axios.post<CreateFoodLogResponse>(
                `${import.meta.env.VITE_API_BASE_URL}/api/proto/food_log/create`,
                request,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            // console.log('食事記録保存レスポンス:', response.data);

            if (response.data.success) {
                // Google Analyticsで食事記録イベントを追跡
                trackDietEvent('food_log', {
                    date: foodLog.selectedDate,
                    has_photos: foodLog.photos.length > 0,
                    is_public: foodLog.isPublic,
                    is_update: isUpdate
                });

                // dieterに投稿がチェックされている場合、投稿も作成
                if (foodLog.isPublic) {
                    try {
                        // console.log('=== Dieter投稿作成開始 ===');
                        const postContent = createFoodLogPostContent();
                        // console.log('投稿コンテンツ:', postContent);
                        
                        // 食事記録の写真をFile型に変換（postsApi用）
                        const imageFiles: File[] = [];
                        
                        // URLからFileオブジェクトを作成する関数
                        const convertUrlToFile = async (url: string, filename: string): Promise<File> => {
                            try {
                                const response = await fetch(url);
                                const blob = await response.blob();
                                return new File([blob], filename, { type: blob.type });
                            } catch (error) {
                                console.error(`画像の変換に失敗しました: ${url}`, error);
                                throw error;
                            }
                        };
                        
                        // 保存された写真URLをFile型に変換
                        if (foodLog.photos && foodLog.photos.length > 0) {
                            try {
                                const filePromises = foodLog.photos.map((photoUrl, index) => 
                                    convertUrlToFile(photoUrl, `food-photo-${index + 1}.jpg`)
                                );
                                const convertedFiles = await Promise.all(filePromises);
                                imageFiles.push(...convertedFiles);
                                // console.log(`${convertedFiles.length}枚の写真を変換しました`);
                            } catch (photoError) {
                                console.error('写真の変換でエラーが発生しました:', photoError);
                                // 写真の変換に失敗しても投稿は続行（テキストのみ）
                            }
                        }
                        
                        const postResult = await postsApi.createPost({
                            content: postContent,
                            images: imageFiles,
                            is_sensitive: foodLog.isSensitive
                        });
                        
                        // console.log('Dieter投稿作成成功:', postResult);
                    } catch (postError) {
                        console.error('Dieter投稿作成エラー:', postError);
                        // 投稿作成に失敗してもアラートは表示するが、食事記録の成功メッセージは表示する
                        alert('食事記録は保存されましたが、Dieter投稿の作成に失敗しました。');
                    }
                }

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
                `${import.meta.env.VITE_API_BASE_URL}/api/proto/food_log/get`,
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
                `${import.meta.env.VITE_API_BASE_URL}api/proto/food_log/get`,
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

    // レスポンシブスタイル設定
    const containerStyles = {
        maxWidth: (isTabletOrMobile || isPortraitMode || isSmallScreen) ? '100%' : 900,
        width: (isTabletOrMobile || isPortraitMode || isSmallScreen) ? '100%' : 'auto',
        mx: (isTabletOrMobile || isPortraitMode || isSmallScreen) ? 0 : 'auto',
        p: (isTabletOrMobile || isPortraitMode || isSmallScreen) ? { xs: 0, sm: 1 } : 3,
        minHeight: '100vh',
        background: isDarkMode ? '#000000' : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        color: isDarkMode ? '#ffffff' : 'inherit',
        position: 'relative' as const,
        display: 'flex',
        flexDirection: 'column' as const,
        boxSizing: 'border-box' as const,
        overflowX: 'hidden' as const,
    };

    return (
        <Box sx={containerStyles}>
            {/* Header */}
            <FoodLogHeader 
                onBack={onBack} 
                selectedDate={foodLog.selectedDate}
                isDarkMode={isDarkMode}
            />

            {/* Progress Card */}
            <DailyProgressCard
                recordedDates={foodLog.recordedDates}
                isDarkMode={isDarkMode}
            />

            {/* Action Buttons */}
            <FoodActionButtons
                onYesterdayRecord={handleYesterdayRecord}
                onViewPastRecords={() => setCalendarOpen(true)}
                isDarkMode={isDarkMode}
            />

            {/* Alert Messages */}
            {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setSuccess(null)}>
                    {success}
                </Alert>
            )}

            {/* Public Toggle */}
            <PublicToggle
                isPublic={foodLog.isPublic}
                onChange={(isPublic) => setFoodLog(prev => ({ ...prev, isPublic }))}
                isSensitive={foodLog.isSensitive}
                onSensitiveChange={(isSensitive) => setFoodLog(prev => ({ ...prev, isSensitive }))}
                showSensitiveOption={true}
                isDarkMode={isDarkMode}
            />

            {/* Unified Meal Card */}
            <UnifiedMealCard
                content={foodLog.diary}
                onChange={(content) => setFoodLog(prev => ({ ...prev, diary: content }))}
                isDarkMode={isDarkMode}
            />

            {/* Photo Upload Section */}
            <PhotoUploadField
                photos={foodLog.photos}
                onChange={(photos) => setFoodLog(prev => ({ ...prev, photos }))}
                isDarkMode={isDarkMode}
            />

            {/* Action Buttons */}
            <Box sx={{ 
                display: 'flex', 
                gap: isTabletOrMobile || isPortraitMode || isSmallScreen ? 1 : 2, 
                justifyContent: 'center', 
                mb: isTabletOrMobile || isPortraitMode || isSmallScreen ? 2 : 4,
                px: isTabletOrMobile || isPortraitMode || isSmallScreen ? 1 : 0
            }}>
                <Box
                    component="button"
                    onClick={handleSave}
                    disabled={loading}
                    sx={{
                        flex: 1,
                        maxWidth: 200,
                        py: 2,
                        px: 3,
                        borderRadius: 3,
                        border: isDarkMode && !loading ? '2px solid #ffffff' : 'none',
                        background: loading 
                            ? 'linear-gradient(135deg, #ccc 0%, #999 100%)'
                            : isDarkMode ? '#000000' : 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        boxShadow: loading 
                            ? 'none'
                            : '0 4px 15px rgba(238, 90, 36, 0.3)',
                        '&:hover': {
                            background: loading 
                                ? 'linear-gradient(135deg, #ccc 0%, #999 100%)'
                                : 'linear-gradient(135deg, #ee5a24 0%, #ff6b6b 100%)',
                            transform: loading ? 'none' : 'translateY(-2px)',
                            boxShadow: loading 
                                ? 'none'
                                : '0 6px 20px rgba(238, 90, 36, 0.4)',
                        },
                        '&:active': {
                            transform: loading ? 'none' : 'translateY(0)',
                        },
                    }}
                >
                    {loading ? (
                        <>
                            <CircularProgress size={20} color="inherit" />
                            保存中...
                        </>
                    ) : (
                        <>
                            💾 保存
                        </>
                    )}
                </Box>
                <Box
                    component="button"
                    onClick={onBack}
                    sx={{
                        flex: 1,
                        maxWidth: 200,
                        py: 2,
                        px: 3,
                        borderRadius: 3,
                        border: isDarkMode ? '2px solid #ffffff' : '2px solid #6c757d',
                        backgroundColor: isDarkMode ? '#000000' : 'white',
                        color: isDarkMode ? '#ffffff' : '#6c757d',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        '&:hover': {
                            backgroundColor: '#6c757d',
                            color: 'white',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px rgba(108, 117, 125, 0.3)',
                        },
                        '&:active': {
                            transform: 'translateY(0)',
                        },
                    }}
                >
                    ← 戻る
                </Box>
            </Box>

            {/* Calendar Dialog */}
            <FoodCalendar
                open={calendarOpen}
                onClose={() => setCalendarOpen(false)}
                recordedDates={[]} // 新しいAPIで取得するため空配列を渡す
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

            {/* Background decorations */}
            <Box
                sx={{
                    position: 'fixed',
                    top: '10%',
                    right: '5%',
                    fontSize: '4rem',
                    opacity: 0.1,
                    animation: 'float 8s ease-in-out infinite',
                    pointerEvents: 'none',
                    zIndex: -1,
                    '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-20px)' },
                    },
                }}
            >
                🍎
            </Box>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: '20%',
                    left: '5%',
                    fontSize: '3rem',
                    opacity: 0.1,
                    animation: 'float 6s ease-in-out infinite reverse',
                    pointerEvents: 'none',
                    zIndex: -1,
                    '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-20px)' },
                    },
                }}
            >
                🥗
            </Box>
        </Box>
    );
};

export default FoodLog;
