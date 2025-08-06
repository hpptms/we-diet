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
    useMediaQuery,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';
import { Save, PhotoCamera } from '@mui/icons-material';
import { useRecoilState, useRecoilValue } from 'recoil';
import { darkModeState } from '../../recoil/darkModeAtom';
import { foodLogState } from '../../recoil/foodLogAtom';
import { postsApi } from '../../api/postsApi';
import { useToast } from '../../hooks/useToast';
import ToastProvider from '../../component/ToastProvider';
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
import '../../styles/mobile-responsive-fix.css';

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
    const [confirmSaveOpen, setConfirmSaveOpen] = useState(false);
    const [pendingSaveData, setPendingSaveData] = useState<any>(null);
    const isDarkMode = useRecoilValue(darkModeState);
    const { toast, hideToast, showSuccess, showError, showWarning } = useToast();
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

    // 日付が変更された際に新しい記録をロードし、画像データをクリアする
    useEffect(() => {
        loadTodayRecord();
    }, [foodLog.selectedDate]);

    const loadTodayRecord = async () => {
        // 過去のローカルデータを一切参照しない - 常に空の状態から開始
        setMealData({ breakfast: '', lunch: '', dinner: '', snack: '' });
        setFoodLog(prev => ({
            ...prev,
            diary: '',
            photos: [], // 常に空の配列から開始
            isPublic: false,
            isSensitive: false,
            currentRecord: undefined
        }));
        
        // 注意: サーバーからの記録読み込みも行わず、完全に新規状態で開始
        console.log('FoodLog: 常に新規状態で初期化しました');
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
            
            // 確認ダイアログを表示
            setPendingSaveData({ isUpdate });
            setConfirmSaveOpen(true);
            setLoading(false);
            return;
        } catch (error: any) {
            console.error('食事記録の保存に失敗しました:', error);
            let errorMessage = '食事記録の保存に失敗しました';
            setError(errorMessage);
            setLoading(false);
        }
    };

    const performActualSave = async (saveData: any) => {
        setLoading(true);
        try {
            const { isUpdate } = saveData;

            const request: CreateFoodLogRequest = {
                user_id: userId,
                date: foodLog.selectedDate,
                diary: foodLog.diary,
                photos: foodLog.photos,
                is_public: foodLog.isPublic
            };

            const response = await axios.post<CreateFoodLogResponse>(
                `${import.meta.env.VITE_API_BASE_URL}/api/proto/food_log/create`,
                request,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );

            if (response.data.success) {
                // Google Analyticsで食事記録イベントを追跡
                trackDietEvent('food_log', {
                    date: foodLog.selectedDate,
                    has_photos: foodLog.photos.length > 0,
                    is_public: foodLog.isPublic,
                    is_update: isUpdate
                });

                // dieterに投稿がチェックされている場合、現在の入力情報のみで投稿を作成
                if (foodLog.isPublic) {
                    try {
                        const postContent = createFoodLogPostContent();
                        
                        // Base64画像データをFileオブジェクトの配列に変換
                        const imageFiles: File[] = [];
                        if (foodLog.photos && foodLog.photos.length > 0) {
                            for (let i = 0; i < foodLog.photos.length; i++) {
                                const base64Data = foodLog.photos[i];
                                if (base64Data.startsWith('data:')) {
                                    try {
                                        // Base64をBlobに変換してからFileオブジェクトを作成
                                        const response = await fetch(base64Data);
                                        const blob = await response.blob();
                                        const file = new File([blob], `food_image_${i + 1}.jpg`, { type: 'image/jpeg' });
                                        imageFiles.push(file);
                                    } catch (error) {
                                        console.error('画像の変換に失敗しました:', error);
                                    }
                                }
                            }
                            console.log('FoodLog images converted to File objects:', imageFiles.length);
                        }
                        
                        // postsApiを直接使用（FoodLogのrecoilやローカルストレージに依存しない）
                        const postData = {
                            content: postContent,
                            images: imageFiles, // 画像ファイルを含める
                            is_sensitive: foodLog.isSensitive // センシティブフィルターの状態を反映
                        };
                        
                        await postsApi.createPost(postData);
                        const imageText = foodLog.photos.length > 0 ? '（画像付き）' : '（テキストのみ）';
                        const sensitiveText = foodLog.isSensitive ? ' [センシティブ]' : '';
                        console.log(`Dieter投稿を作成しました${imageText}${sensitiveText}`);
                        
                    } catch (postError) {
                        console.error('Dieter投稿作成エラー:', postError);
                        showWarning('食事記録は保存されましたが、Dieter投稿の作成に失敗しました。');
                    }
                }

                const successMessage = isUpdate 
                    ? '食事記録を更新しました！'
                    : '食事記録を保存しました！';
                setSuccess(successMessage);
                setFoodLog(prev => ({
                    ...prev,
                    currentRecord: response.data.record
                }));
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
        background: isDarkMode ? '#000000' : '#ffffff',
        color: isDarkMode ? '#ffffff' : 'inherit',
        position: 'relative' as const,
        display: 'flex',
        flexDirection: 'column' as const,
        boxSizing: 'border-box' as const,
        overflowX: 'hidden' as const,
        paddingBottom: (isTabletOrMobile || isPortraitMode || isSmallScreen) ? 'max(2rem, env(safe-area-inset-bottom))' : undefined,
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
            
            {/* 確認ダイアログ */}
            <Dialog
                open={confirmSaveOpen}
                onClose={() => setConfirmSaveOpen(false)}
                disableScrollLock
                sx={{
                    position: 'fixed',
                    zIndex: 1300,
                    '& .MuiDialog-container': {
                        height: '100vh',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0
                    },
                    '& .MuiDialog-paper': {
                        backgroundColor: isDarkMode ? '#1a1a1a' : 'white',
                        color: isDarkMode ? '#ffffff' : 'inherit',
                        border: isDarkMode ? '1px solid #444' : 'none',
                        margin: 0,
                        maxHeight: '90vh',
                        maxWidth: '90vw',
                        minWidth: '300px',
                        width: 'auto'
                    }
                }}
                BackdropProps={{
                    sx: {
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: -1
                    }
                }}
                PaperProps={{
                    sx: {
                        position: 'relative'
                    }
                }}
            >
                <DialogTitle sx={{ color: isDarkMode ? '#ffffff' : 'inherit' }}>
                    食事記録の保存確認
                </DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ color: isDarkMode ? '#ffffff' : 'inherit' }}>
                        {pendingSaveData?.isUpdate 
                            ? '既存の記録を更新します。よろしいですか？'
                            : '新しい食事記録を保存します。よろしいですか？'
                        }
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => {
                            setConfirmSaveOpen(false);
                            setPendingSaveData(null);
                        }}
                        sx={{ color: isDarkMode ? '#ffffff' : 'inherit' }}
                    >
                        キャンセル
                    </Button>
                    <Button 
                        onClick={async () => {
                            setConfirmSaveOpen(false);
                            if (pendingSaveData) {
                                await performActualSave(pendingSaveData);
                            }
                            setPendingSaveData(null);
                        }}
                        variant="contained"
                        sx={{ 
                            backgroundColor: isDarkMode ? '#ffffff' : '#1976d2',
                            color: isDarkMode ? '#000000' : '#ffffff',
                            '&:hover': {
                                backgroundColor: isDarkMode ? '#f0f0f0' : '#1565c0'
                            }
                        }}
                    >
                        保存する
                    </Button>
                </DialogActions>
            </Dialog>
            
            {/* 共通トースト */}
            <ToastProvider toast={toast} onClose={hideToast} />
        </Box>
    );
};

export default FoodLog;
