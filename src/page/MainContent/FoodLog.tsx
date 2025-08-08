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
import { useTranslation } from '../../hooks/useTranslation';
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
    const { t } = useTranslation();
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

    // 日付変更時の処理をスキップ - ユーザー入力を保持
    // useEffect(() => {
    //     loadTodayRecord();
    // }, [foodLog.selectedDate]);

    const loadTodayRecord = async () => {
        // 初回ロードのみ初期化し、その後はユーザー入力を保持
        // ユーザー入力を保持（サイレント処理）
        // 何も変更しない - ユーザーの入力データを維持
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
            console.error(t('food', 'loadRecordDatesFailed'), error);
        }
    };

    // 食事記録投稿のコンテンツを作成する関数
    const createFoodLogPostContent = () => {
        let content = t('food', 'postContent') + "\n\n";
        
        if (foodLog.diary.trim()) {
            content += foodLog.diary + "\n\n";
        }
        
        content += t('food', 'hashtag');
        
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
            console.error(t('food', 'saveFailed'), error);
            let errorMessage = t('food', 'saveFailed');
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

                // dieterに投稿がチェックされている場合、画面に現在入力されている情報のみで投稿を作成
                if (foodLog.isPublic) {
                    try {
                        // 画面に入力されたテキストデータを取得（requestで送信するのと同じデータ）
                        const currentDiary = request.diary; // 現在送信しようとしているdiaryデータ
                        const currentPhotos = request.photos; // 現在送信しようとしているphotosデータ
                        const currentIsSensitive = foodLog.isSensitive; // 現在のセンシティブフラグ
                        
                        // 現在の画面入力データをチェック（サイレント処理）
                        
                        // 投稿内容を現在の入力データから作成
                        let postContent = "今日の食事記録 🍽️\n\n";
                        if (currentDiary && currentDiary.trim()) {
                            postContent += currentDiary + "\n\n";
                        }
                        postContent += "#今日の食事";
                        
                        // Base64画像データをFileオブジェクトの配列に変換
                        const imageFiles: File[] = [];
                        if (currentPhotos && currentPhotos.length > 0) {
                            for (let i = 0; i < currentPhotos.length; i++) {
                                const base64Data = currentPhotos[i];
                                if (base64Data.startsWith('data:')) {
                                    try {
                                        // Base64をBlobに変換してからFileオブジェクトを作成
                                        const response = await fetch(base64Data);
                                        const blob = await response.blob();
                                        const file = new File([blob], `food_image_${i + 1}.jpg`, { type: 'image/jpeg' });
                                        imageFiles.push(file);
                                    } catch (error) {
                                        // 画像の変換に失敗 - サイレント処理
                                    }
                                }
                            }
                        }
                        
                        // postsApiを直接使用（現在の画面入力データのみ使用）
                        const postData = {
                            content: postContent,
                            images: imageFiles, // 現在の画面の画像
                            is_sensitive: currentIsSensitive // 現在のセンシティブフィルター設定
                        };
                        
                        await postsApi.createPost(postData);
                        // Dieter投稿を作成完了（サイレント処理）
                        
                    } catch (postError) {
                        // Dieter投稿作成エラー - サイレント処理
                        showWarning(t('food', 'dieterPostFailed'));
                    }
                }

                const successMessage = isUpdate 
                    ? t('food', 'recordUpdated')
                    : t('food', 'recordSaved');
                setSuccess(successMessage);
                setFoodLog(prev => ({
                    ...prev,
                    currentRecord: response.data.record
                }));
                loadRecordedDates();
            } else {
                setError(`${t('food', 'saveFailed')}: ${response.data.message}`);
            }
        } catch (error: any) {
            console.error('食事記録の保存に失敗しました:', error);
            
            let errorMessage = t('food', 'saveFailed');
            
            if (error.response) {
                console.error('Response data:', error.response.data);
                if (error.response.data && error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else if (error.response.status === 400) {
                    errorMessage = t('food', 'saveFailedBadRequest');
                } else if (error.response.status === 401) {
                    errorMessage = t('food', 'saveFailedAuth');
                } else if (error.response.status >= 500) {
                    errorMessage = t('food', 'saveFailedServer');
                }
            } else if (error.request) {
                errorMessage = t('food', 'saveFailedNetwork');
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
                setError(t('food', 'noYesterdayRecord'));
            }
        } catch (error: any) {
            console.error(t('food', 'loadRecordFailed'), error);
            setError(t('food', 'loadRecordFailed'));
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
        minHeight: (isTabletOrMobile || isPortraitMode || isSmallScreen) ? 'calc(100vh + 8rem)' : '100vh',
        background: isDarkMode ? '#000000' : '#ffffff',
        color: isDarkMode ? '#ffffff' : 'inherit',
        position: 'relative' as const,
        display: 'flex',
        flexDirection: 'column' as const,
        boxSizing: 'border-box' as const,
        overflowX: 'hidden' as const,
        paddingBottom: (isTabletOrMobile || isPortraitMode || isSmallScreen) ? 'max(8rem, env(safe-area-inset-bottom))' : 4,
        // モバイル時のスクロール動作を改善
        WebkitOverflowScrolling: 'touch',
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
