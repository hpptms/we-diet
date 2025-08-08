import React, { useRef, useEffect, useState } from 'react';
import { Box, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';
import { darkModeState } from '../../recoil/darkModeAtom';
import { useTranslation } from '../../hooks/useTranslation';
import { exerciseRecordState, ExerciseRecordData, checkAndResetIfDateChanged, isExerciseDataEmpty } from '../../recoil/exerciseRecordAtom';
import { useSetRecoilState } from 'recoil';
import { weightRecordedDateAtom } from '../../recoil/weightRecordedDateAtom';
import { postsApi } from '../../api/postsApi';
import { exerciseRecordApi } from '../../api/exerciseRecordApi';
import { useToast } from '../../hooks/useToast';
import { useResponsive } from '../../hooks/useResponsive';
import ToastProvider from '../../component/ToastProvider';
import { 
  isDeviceSyncSupported, 
  getSyncPermissionStatus, 
  setSyncPermissionStatus, 
  syncWithDevice, 
  syncWithSamsungHealth,
  syncWithHuaweiHealth,
  convertDeviceDataToExerciseRecord,
  getSettingsInstructions,
  openSettingsUrl,
  getDeviceInfo,
  getGoogleFitAuthStatus,
  initiateGoogleFitAuth,
  handleGoogleFitAuthCallback
} from '../../utils/deviceSync';
import '../../styles/mobile-responsive-fix.css';

// Import components
import ExerciseHeader from '../../component/ExerciseRecord/ExerciseHeader';
import PublicToggle from '../../component/ExerciseRecord/PublicToggle';
import AerobicExerciseCard from '../../component/ExerciseRecord/AerobicExerciseCard';
import StrengthTrainingCard from '../../component/ExerciseRecord/StrengthTrainingCard';
import OtherExerciseCard from '../../component/ExerciseRecord/OtherExerciseCard';
import WeightInputCard from '../../component/ExerciseRecord/WeightInputCard';
import ExerciseNoteCard from '../../component/ExerciseRecord/ExerciseNoteCard';
import PhotoUploadCard from '../../component/common/PhotoUploadCard';
import ActionButtons from '../../component/ExerciseRecord/ActionButtons';

interface ExerciseRecordProps {
  onBack: () => void;
}

const ExerciseRecord: React.FC<ExerciseRecordProps> = ({ onBack }) => {
  const [exerciseData, setExerciseData] = useRecoilState(exerciseRecordState);
  const [loading, setLoading] = useState(false);
  const [confirmOverwriteOpen, setConfirmOverwriteOpen] = useState(false);
  const [pendingSaveData, setPendingSaveData] = useState<any>(null);
  const [overwriteResult, setOverwriteResult] = useState<{calories: number, message: string} | null>(null);
  const [syncPermissionOpen, setSyncPermissionOpen] = useState(false);
  const [syncLoading, setSyncLoading] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [healthAppSelectionOpen, setHealthAppSelectionOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setWeightRecordedDate = useSetRecoilState(weightRecordedDateAtom);
  const isDarkMode = useRecoilValue(darkModeState);
  const { toast, hideToast, showSuccess, showError, showWarning, showInfo } = useToast();
  // レスポンシブデザイン用のブレークポイント
  const { isTabletOrMobile, isPortraitMode, isSmallScreen } = useResponsive();
  const { t } = useTranslation();

  // サーバーから本日のデータを取得する関数
  const loadTodayData = async () => {
    try {
      const userId = exerciseData.userId || 1;
      const today = new Date().toISOString().slice(0, 10);
      
      const response = await exerciseRecordApi.getExerciseRecord(userId, today);
      
      if (response.found && response.record) {
        const record = response.record;
        
        // サーバーから取得したデータでRecoil状態を更新
        setExerciseData({
          ...exerciseData,
          walkingDistance: record.walking_distance || '',
          walkingTime: record.walking_time || '',
          walkingSteps: record.walking_steps || '',
          runningDistance: record.running_distance || '',
          runningTime: record.running_time || '',
          pushUps: record.push_ups || '',
          sitUps: record.sit_ups || '',
          squats: record.squats || '',
          otherExerciseTime: record.other_exercise_time || '',
          todayWeight: record.today_weight || '',
          exerciseNote: record.exercise_note || '',
          isPublic: record.is_public || false,
          hasWeightInput: record.has_weight_input || false,
          // 画像URLを取得（存在する場合）
          imageUrls: record.image_urls || [],
          todayImages: [], // File型は空配列
        });
        
        // console.log('本日の運動記録データを読み込みました');
      }
    } catch (error: any) {
      console.error('運動記録データの取得に失敗しました:', error);
    }
  };

  // コンポーネントマウント時に日付チェックとデータ読み込み
  useEffect(() => {
    const resetData = checkAndResetIfDateChanged();
    if (resetData) {
      setExerciseData(resetData);
      // console.log('日付が変わったため、運動記録データをリセットしました');
      return; // リセットした場合は、サーバーへの問い合わせは不要
    }
    
    // 現在のRecoil状態（ローカルストレージから復元済み）をチェック
    if (isExerciseDataEmpty(exerciseData)) {
      // データが空の場合のみサーバーに問い合わせ
      // console.log('ローカルデータが空のため、サーバーからデータを取得します');
      loadTodayData();
    } else {
      // console.log('ローカルストレージからデータを復元しました');
    }

    // Google Fit OAuth認証コールバックをチェック
    const authResult = handleGoogleFitAuthCallback();
    if (authResult.isAuthenticated) {
      showSuccess(t('exercise', 'googleFitConnectSuccess'));
    } else if (authResult.error) {
      showError(t('exercise', 'googleFitAuthFailed', { error: authResult.error }));
    }
  }, [setExerciseData, showSuccess, showError]);

  const handleInputChange = (field: keyof ExerciseRecordData) => (value: string) => {
    setExerciseData({
      ...exerciseData,
      [field]: value,
      hasWeightInput: field === 'todayWeight' ? value !== '' : exerciseData.hasWeightInput,
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImages = Array.from(files);
      const currentImageCount = (exerciseData.imageUrls?.length || 0) + exerciseData.todayImages.length;
      const totalImages = currentImageCount + newImages.length;
      
      if (totalImages <= 3) {
        setExerciseData({
          ...exerciseData,
          todayImages: [...exerciseData.todayImages, ...newImages],
        });
      } else {
        showWarning(t('errors', 'maxImagesError', {}, '画像は最大3枚まで選択できます'));
      }
    }
  };


  // 運動記録投稿のコンテンツを作成する関数
  const createExercisePostContent = (caloriesBurned: number) => {
    let content = `今日は大体${caloriesBurned}カロリー消費しました！🔥\n\n`;
    
    // 有酸素運動
    if (exerciseData.walkingDistance || exerciseData.walkingTime) {
      content += "🚶 ウォーキング: ";
      if (exerciseData.walkingDistance) {
        content += exerciseData.walkingDistance + "km ";
      }
      if (exerciseData.walkingTime) {
        content += exerciseData.walkingTime + "分";
      }
      content += "\n";
    }
    
    if (exerciseData.runningDistance || exerciseData.runningTime) {
      content += "🏃 ランニング: ";
      if (exerciseData.runningDistance) {
        content += exerciseData.runningDistance + "km ";
      }
      if (exerciseData.runningTime) {
        content += exerciseData.runningTime + "分";
      }
      content += "\n";
    }
    
    // 筋力トレーニング
    if (exerciseData.pushUps) {
      content += "💪 腕立て伏せ: " + exerciseData.pushUps + "回\n";
    }
    if (exerciseData.sitUps) {
      content += "🏋️ 腹筋: " + exerciseData.sitUps + "回\n";
    }
    if (exerciseData.squats) {
      content += "🏋️ スクワット: " + exerciseData.squats + "回\n";
    }
    
    // その他運動
    if (exerciseData.otherExerciseTime) {
      content += "🔥 その他運動: " + exerciseData.otherExerciseTime + "分\n";
    }
    
    // 体重記録
    if (exerciseData.todayWeight) {
      content += "⚖️ 今日の体重: " + exerciseData.todayWeight + "kg\n";
    }
    
    // 運動メモ
    if (exerciseData.exerciseNote) {
      content += "\n📝 " + exerciseData.exerciseNote;
    }
    
    content += "\n\n#今日の運動";
    
    return content;
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const userId = exerciseData.userId || 1;
      const today = new Date().toISOString().slice(0, 10);

      // console.log('=== 運動記録保存開始 ===');
      // console.log('userId:', userId);
      // console.log('date:', today);

      // 既存データがあるか確認（Protobuf API使用）
      let recordExists = false;
      try {
        // console.log('既存データをチェック中...');
        const checkRes = await exerciseRecordApi.getExerciseRecord(userId, today);
        // console.log('既存データチェック結果:', checkRes);
        if (checkRes.found && checkRes.record) {
          recordExists = true;
        }
      } catch (err: any) {
        // console.log('既存データチェックエラー:', err.message);
        // プロトバフAPIではエラー時でも続行
      }
      
      if (recordExists) {
        // 保存データを一時保存してダイアログを表示
        setPendingSaveData({ userId, today });
        setConfirmOverwriteOpen(true);
        setLoading(false);
        return;
      }

      // 実際の保存処理を実行
      await performSave(userId, today);
    } catch (error: any) {
      let errorMessage = '保存に失敗しました。もう一度お試しください。';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = `保存に失敗しました: ${error.response.data.message}`;
      } else if (error.message) {
        errorMessage = `保存に失敗しました: ${error.message}`;
      }
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // 実際の保存処理を行う関数
  const performSave = async (userId: number, today: string) => {
    try {
      // Protobuf APIで送信
      const response = await exerciseRecordApi.createExerciseRecord({
        userId: userId,
        date: today,
        walkingDistance: exerciseData.walkingDistance || '',
        walkingTime: exerciseData.walkingTime || '',
        walkingSteps: exerciseData.walkingSteps || '',
        runningDistance: exerciseData.runningDistance || '',
        runningTime: exerciseData.runningTime || '',
        pushUps: exerciseData.pushUps || '',
        sitUps: exerciseData.sitUps || '',
        squats: exerciseData.squats || '',
        otherExerciseTime: exerciseData.otherExerciseTime || '',
        todayWeight: exerciseData.todayWeight || '',
        exerciseNote: exerciseData.exerciseNote || '',
        todayImages: exerciseData.todayImages,
        isPublic: exerciseData.isPublic,
        hasWeightInput: exerciseData.hasWeightInput,
      });

      console.log('サーバーレスポンス:', response);

      if (!response.success) throw new Error(response.message || '保存に失敗しました');
      const caloriesBurned = response.calories_burned || 0;

      console.log('カロリー消費量:', caloriesBurned);

      // dieterに投稿がチェックされている場合、画面に現在入力されているデータのみで投稿を作成
      if (exerciseData.isPublic) {
        try {
          console.log('=== Dieter投稿作成開始（ExerciseRecord） ===');
          
          // 現在の画面入力データを取得（保存処理と同じデータを使用）
          const currentExerciseData = {
            walkingDistance: exerciseData.walkingDistance || '',
            walkingTime: exerciseData.walkingTime || '',
            runningDistance: exerciseData.runningDistance || '',
            runningTime: exerciseData.runningTime || '',
            pushUps: exerciseData.pushUps || '',
            sitUps: exerciseData.sitUps || '',
            squats: exerciseData.squats || '',
            otherExerciseTime: exerciseData.otherExerciseTime || '',
            todayWeight: exerciseData.todayWeight || '',
            exerciseNote: exerciseData.exerciseNote || '',
            todayImages: exerciseData.todayImages,
            isSensitive: exerciseData.isSensitive
          };
          
          console.log('現在の画面入力データ:', {
            exerciseInputs: Object.keys(currentExerciseData).filter(key => 
              key !== 'todayImages' && key !== 'isSensitive' && (currentExerciseData as any)[key]
            ).length,
            imageCount: currentExerciseData.todayImages.length,
            exerciseNote: currentExerciseData.exerciseNote,
            caloriesBurned: caloriesBurned,
            isSensitive: currentExerciseData.isSensitive
          });
          
          // 投稿内容を現在の画面入力データから作成
          let postContent = `今日は大体${caloriesBurned}カロリー消費しました！🔥\\n\\n`;
          
          // 有酸素運動
          if (currentExerciseData.walkingDistance || currentExerciseData.walkingTime || exerciseData.walkingSteps) {
            postContent += "🚶 ウォーキング: ";
            if (currentExerciseData.walkingDistance) {
              postContent += currentExerciseData.walkingDistance + "km ";
            }
            if (currentExerciseData.walkingTime) {
              postContent += currentExerciseData.walkingTime + "分 ";
            }
            if (exerciseData.walkingSteps) {
              postContent += exerciseData.walkingSteps + "歩";
            }
            postContent += "\\n";
          }
          
          if (currentExerciseData.runningDistance || currentExerciseData.runningTime) {
            postContent += "🏃 ランニング: ";
            if (currentExerciseData.runningDistance) {
              postContent += currentExerciseData.runningDistance + "km ";
            }
            if (currentExerciseData.runningTime) {
              postContent += currentExerciseData.runningTime + "分";
            }
            postContent += "\n";
          }
          
          // 筋力トレーニング
          if (currentExerciseData.pushUps) {
            postContent += "💪 腕立て伏せ: " + currentExerciseData.pushUps + "回\n";
          }
          if (currentExerciseData.sitUps) {
            postContent += "🏋️ 腹筋: " + currentExerciseData.sitUps + "回\n";
          }
          if (currentExerciseData.squats) {
            postContent += "🏋️ スクワット: " + currentExerciseData.squats + "回\n";
          }
          
          // その他運動
          if (currentExerciseData.otherExerciseTime) {
            postContent += "🔥 その他運動: " + currentExerciseData.otherExerciseTime + "分\n";
          }
          
          // 体重記録
          if (currentExerciseData.todayWeight) {
            postContent += "⚖️ 今日の体重: " + currentExerciseData.todayWeight + "kg\n";
          }
          
          // 運動メモ（どんな運動したの？の文字データ）
          if (currentExerciseData.exerciseNote) {
            postContent += "\n📝 " + currentExerciseData.exerciseNote;
          }
          
          postContent += "\n\n#今日の運動";
          
          console.log('投稿用データ:', {
            content: postContent,
            imageCount: currentExerciseData.todayImages.length,
            isSensitive: currentExerciseData.isSensitive
          });
          
          const postResult = await postsApi.createPost({
            content: postContent,
            images: currentExerciseData.todayImages, // 現在の画面の画像（今日の一枚）
            is_sensitive: currentExerciseData.isSensitive // 現在のセンシティブフィルター設定
          });
          
          const imageText = currentExerciseData.todayImages.length > 0 ? '（画像付き）' : '（テキストのみ）';
          const sensitiveText = currentExerciseData.isSensitive ? ' [センシティブ]' : '';
          console.log(`ExerciseRecord Dieter投稿を作成しました${imageText}${sensitiveText}、カロリー消費: ${caloriesBurned}kcal`);
          
        } catch (postError) {
          console.error('Dieter投稿作成エラー:', postError);
          // 投稿作成に失敗してもアラートは表示するが、運動記録の成功メッセージは表示する
          showWarning('運動記録は保存されましたが、Dieter投稿の作成に失敗しました。');
        }
      }

      // 体重記録済みフラグをlocalStorageに保存
      if (exerciseData.hasWeightInput) {
        const todayStr = new Date().toISOString().slice(0, 10);
        localStorage.setItem("weightRecordedDate", todayStr);
        setWeightRecordedDate(todayStr);
      }

      // 保存後は入力をクリアしない - データを保持する
      // 画像のみクリア（アップロード済みなので）
      setExerciseData({
        ...exerciseData,
        todayImages: [],
      });

      const message = `今日は大体${caloriesBurned}カロリー消費しました！\nおつかれさま！`;
      console.log('成功メッセージ:', message);
      console.log('showSuccess呼び出し前のtoast状態:', toast);
      showSuccess(message);
      console.log('showSuccess呼び出し後のtoast状態:', toast);
    } catch (error: any) {
      // console.error('=== 保存エラー詳細 ===');
      // console.error('Error object:', error);
      // console.error('Error message:', error.message);
      // console.error('Error response:', error.response);
      // if (error.response) {
      //   console.error('Response status:', error.response.status);
      //   console.error('Response data:', error.response.data);
      //   console.error('Response headers:', error.response.headers);
      // }
      // console.error('=== エラー詳細終了 ===');
      
      let errorMessage = '保存に失敗しました。もう一度お試しください。';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = `保存に失敗しました: ${error.response.data.message}`;
      } else if (error.message) {
        errorMessage = `保存に失敗しました: ${error.message}`;
      }
      showError(errorMessage);
    }
    // 注意: setLoading(false)はここでは呼び出さない（呼び出し元で処理される）
  };

  // デバイス同期の処理（Android端末でヘルスアプリ連携）
  const handleDeviceSync = async () => {
    if (!isDeviceSyncSupported()) {
      showWarning('お使いのデバイスは同期機能をサポートしていません。');
      return;
    }

    // Android端末で順次ヘルスアプリを試行
    await performSequentialHealthAppSync();
  };

  const performDeviceSync = async () => {
    setSyncLoading(true);
    try {
      showInfo('デバイスと同期中です...');
      
      const deviceData = await syncWithDevice();
      
      if (!deviceData) {
        showWarning('デバイスからデータを取得できませんでした。');
        // 設定案内ダイアログを表示
        setSettingsDialogOpen(true);
        return;
      }

      // デバイスデータをExerciseRecord形式に変換
      const convertedData = convertDeviceDataToExerciseRecord(deviceData);
      
      // 既存データと統合（既存の値を上書きしないように注意）
      const newExerciseData = {
        ...exerciseData,
        walkingSteps: convertedData.walkingSteps || exerciseData.walkingSteps,
        walkingDistance: convertedData.walkingDistance || exerciseData.walkingDistance,  
        walkingTime: convertedData.walkingTime || exerciseData.walkingTime,
        otherExerciseTime: convertedData.otherExerciseTime || exerciseData.otherExerciseTime,
      };

      setExerciseData(newExerciseData);

      // 同期結果をユーザーに通知
      const syncedItems = [];
      if (convertedData.walkingSteps) syncedItems.push(`歩数: ${convertedData.walkingSteps}歩`);
      if (convertedData.walkingDistance) syncedItems.push(`距離: ${convertedData.walkingDistance}km`);
      if (convertedData.walkingTime) syncedItems.push(`時間: ${convertedData.walkingTime}分`);
      if (convertedData.otherExerciseTime) syncedItems.push(`その他運動: ${convertedData.otherExerciseTime}分`);

      if (syncedItems.length > 0) {
        showSuccess(`デバイス同期完了！\n${syncedItems.join('\n')}`);
      } else {
        showWarning('同期できるデータが見つかりませんでした。');
      }

    } catch (error: any) {
      console.error('Device sync error:', error);
      showError('デバイス同期中にエラーが発生しました。再度お試しください。');
    } finally {
      setSyncLoading(false);
    }
  };

  const handleSyncPermissionApprove = async () => {
    setSyncPermissionStatus(true);
    setSyncPermissionOpen(false);
    await performDeviceSync();
  };

  const handleSyncPermissionDeny = () => {
    setSyncPermissionStatus(false);
    setSyncPermissionOpen(false);
    showInfo('デバイス同期が無効になりました。手動で入力してください。');
  };

  // Google Fit連携処理
  const handleGoogleFitConnect = async () => {
    setHealthAppSelectionOpen(false);
    
    // Google Fit認証状態をチェック
    const authStatus = getGoogleFitAuthStatus();
    if (!authStatus.isAuthenticated) {
      showInfo('Google Fitとの連携が必要です。認証画面に移動します...');
      try {
        initiateGoogleFitAuth();
      } catch (error) {
        console.error('Google Fit認証エラー:', error);
        showError(`認証の開始に失敗しました: ${error}`);
      }
      return;
    }

    // 認証済みの場合は同期実行
    await performDeviceSync();
  };

  // Samsung Health連携処理（将来実装）
  const handleSamsungHealthConnect = () => {
    setHealthAppSelectionOpen(false);
    showWarning('Samsung Healthとの連携は今後実装予定です。\n現在はGoogle Fitをご利用ください。');
  };

  // Huawei Health連携処理（将来実装）
  const handleHuaweiHealthConnect = () => {
    setHealthAppSelectionOpen(false);
    showWarning('Huawei Healthとの連携は今後実装予定です。\\n現在はGoogle Fitをご利用ください。');
  };

  // 段階的ヘルスアプリ連携処理（Google Fit → Samsung Health → Huawei Health）
  const performSequentialHealthAppSync = async () => {
    setSyncLoading(true);
    try {
      showInfo('フィットネスデータを取得中です...');
      
      // 1. Google Fit から試行
      console.log('=== Google Fit連携を試行 ===');
      const googleFitData = await tryGoogleFitSync();
      if (googleFitData) {
        await handleSyncSuccess(googleFitData, 'Google Fit');
        return;
      }
      
      // 2. Samsung Health から試行  
      console.log('=== Samsung Health連携を試行 ===');
      const samsungHealthData = await trySamsungHealthSync();
      if (samsungHealthData) {
        await handleSyncSuccess(samsungHealthData, 'Samsung Health');
        return;
      }
      
      // 3. Huawei Health から試行
      console.log('=== Huawei Health連携を試行 ===');
      const huaweiHealthData = await tryHuaweiHealthSync();
      if (huaweiHealthData) {
        await handleSyncSuccess(huaweiHealthData, 'Huawei Health');
        return;
      }
      
      // 4. すべて失敗した場合
      console.log('=== 全ヘルスアプリで同期失敗 ===');
      // 設定案内ダイアログを表示
      setSettingsDialogOpen(true);
      
    } catch (error) {
      console.error('Sequential health app sync error:', error);
      showError('フィットネス同期中にエラーが発生しました。');
    } finally {
      setSyncLoading(false);
    }
  };

  // 同期成功時の処理
  const handleSyncSuccess = async (deviceData: any, appName: string) => {
    // デバイスデータをExerciseRecord形式に変換
    const convertedData = convertDeviceDataToExerciseRecord(deviceData);
    
    // 既存データと統合（既存の値を上書きしないように注意）
    const newExerciseData = {
      ...exerciseData,
      walkingSteps: convertedData.walkingSteps || exerciseData.walkingSteps,
      walkingDistance: convertedData.walkingDistance || exerciseData.walkingDistance,  
      walkingTime: convertedData.walkingTime || exerciseData.walkingTime,
      otherExerciseTime: convertedData.otherExerciseTime || exerciseData.otherExerciseTime,
    };

    setExerciseData(newExerciseData);

    // 同期結果をユーザーに通知
    const syncedItems = [];
    if (convertedData.walkingSteps) syncedItems.push(`歩数: ${convertedData.walkingSteps}歩`);
    if (convertedData.walkingDistance) syncedItems.push(`距離: ${convertedData.walkingDistance}km`);
    if (convertedData.walkingTime) syncedItems.push(`時間: ${convertedData.walkingTime}分`);
    if (convertedData.otherExerciseTime) syncedItems.push(`その他運動: ${convertedData.otherExerciseTime}分`);

    if (syncedItems.length > 0) {
      showSuccess(`${appName}から同期完了！\\n${syncedItems.join('\\n')}`);
    }
  };

  // Google Fit同期試行
  const tryGoogleFitSync = async () => {
    try {
      // Google Fit認証状態をチェック
      const authStatus = getGoogleFitAuthStatus();
      if (!authStatus.isAuthenticated) {
        console.log('Google Fit認証が必要 - 自動認証を試行');
        try {
          await initiateGoogleFitAuth();
          // 認証後にデータ取得を試行
          const deviceData = await syncWithDevice();
          return deviceData;
        } catch (authError) {
          console.log('Google Fit認証失敗:', authError);
          return null;
        }
      }

      // 認証済みの場合は直接同期実行
      const deviceData = await syncWithDevice();
      return deviceData;
    } catch (error) {
      console.log('Google Fit同期エラー:', error);
      return null;
    }
  };

  // Samsung Health同期試行
  const trySamsungHealthSync = async () => {
    try {
      console.log('Samsung Health API呼び出しを試行...');
      const deviceData = await syncWithSamsungHealth();
      return deviceData;
    } catch (error) {
      console.log('Samsung Health同期エラー:', error);
      return null;
    }
  };

  // Huawei Health同期試行
  const tryHuaweiHealthSync = async () => {
    try {
      console.log('Huawei Health API呼び出しを試行...');
      const deviceData = await syncWithHuaweiHealth();
      return deviceData;
    } catch (error) {
      console.log('Huawei Health同期エラー:', error);
      return null;
    }
  };

  // レスポンシブスタイル設定
  const containerStyles = {
    p: (isTabletOrMobile || isPortraitMode || isSmallScreen) ? { xs: 0, sm: 1 } : 2,
    maxWidth: (isTabletOrMobile || isPortraitMode || isSmallScreen) ? '100%' : 900,
    width: (isTabletOrMobile || isPortraitMode || isSmallScreen) ? '100%' : 'auto',
    mx: (isTabletOrMobile || isPortraitMode || isSmallScreen) ? 0 : 'auto',
    background: isDarkMode ? '#000000' : '#ffffff',
    minHeight: (isTabletOrMobile || isPortraitMode || isSmallScreen) ? 'calc(100vh + 10rem)' : '100vh',
    color: isDarkMode ? '#ffffff' : 'inherit',
    paddingBottom: (isTabletOrMobile || isPortraitMode || isSmallScreen) ? 'max(10rem, env(safe-area-inset-bottom))' : 4,
    display: 'flex',
    flexDirection: 'column' as const,
    boxSizing: 'border-box' as const,
    overflowX: 'hidden' as const,
    // モバイル時のスクロール動作を改善
    WebkitOverflowScrolling: 'touch',
    position: 'relative' as const,
  };

  return (
    <Box sx={containerStyles}>
      {/* ヘッダー */}
      <ExerciseHeader isDarkMode={isDarkMode} />

      {/* dieterに投稿設定 */}
      <PublicToggle
        isPublic={exerciseData.isPublic}
        onChange={(isPublic) => setExerciseData({ ...exerciseData, isPublic })}
        isSensitive={exerciseData.isSensitive}
        onSensitiveChange={(isSensitive) => setExerciseData({ ...exerciseData, isSensitive })}
        showSensitiveOption={true}
        isDarkMode={isDarkMode}
      />

      {/* スマホ同期ボタン（Android端末のみ） */}
      {isDeviceSyncSupported() && (
        <Box sx={{ mb: 3, textAlign: 'center', px: 2 }}>
          <Button
            variant="contained"
            onClick={handleDeviceSync}
            disabled={loading || syncLoading}
            sx={{
              background: syncLoading 
                ? (isDarkMode ? 'linear-gradient(45deg, #424242 30%, #616161 90%)' : 'linear-gradient(45deg, #e0e0e0 30%, #f5f5f5 90%)')
                : (isDarkMode 
                  ? 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 50%, #45B7D1 90%)'
                  : 'linear-gradient(45deg, #FF6B6B 30%, #4ECDC4 50%, #45B7D1 90%)'
                ),
              border: 0,
              borderRadius: '25px',
              boxShadow: syncLoading 
                ? '0 2px 4px 0 rgba(0,0,0,0.2)' 
                : '0 4px 15px 0 rgba(255,107,107,0.3), 0 4px 15px 0 rgba(78,205,196,0.2)',
              color: 'white',
              height: 56,
              padding: '12px 32px',
              fontSize: '16px',
              fontWeight: 'bold',
              textTransform: 'none',
              minWidth: '280px',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                background: syncLoading 
                  ? (isDarkMode ? 'linear-gradient(45deg, #424242 30%, #616161 90%)' : 'linear-gradient(45deg, #e0e0e0 30%, #f5f5f5 90%)')
                  : (isDarkMode 
                    ? 'linear-gradient(45deg, #FF5252 30%, #26C6DA 50%, #42A5F5 90%)'
                    : 'linear-gradient(45deg, #FF5252 30%, #26C6DA 50%, #42A5F5 90%)'
                  ),
                boxShadow: syncLoading 
                  ? '0 2px 4px 0 rgba(0,0,0,0.2)' 
                  : '0 6px 20px 0 rgba(255,107,107,0.4), 0 6px 20px 0 rgba(78,205,196,0.3)',
                transform: syncLoading ? 'none' : 'translateY(-2px)',
              },
              '&:disabled': {
                background: isDarkMode ? 'linear-gradient(45deg, #424242 30%, #616161 90%)' : 'linear-gradient(45deg, #e0e0e0 30%, #f5f5f5 90%)',
                color: isDarkMode ? '#888888' : '#999999',
                boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)',
              },
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                transition: 'left 0.6s',
              },
              '&:hover::before': {
                left: '100%',
              },
            }}
            startIcon={
              syncLoading ? (
                <div style={{ 
                  animation: 'spin 1s linear infinite',
                  display: 'inline-block',
                  fontSize: '20px'
                }}>
                  ⚡
                </div>
              ) : (
                <div style={{ fontSize: '20px', marginRight: '8px' }}>📱✨</div>
              )
            }
          >
            {syncLoading ? t('exercise', 'syncingWithDevice') : t('exercise', 'syncWithDevice')}
          </Button>
          <style>
            {`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}
          </style>
        </Box>
      )}

      {/* 有酸素運動 */}
      <AerobicExerciseCard
        walkingDistance={exerciseData.walkingDistance}
        walkingTime={exerciseData.walkingTime}
        walkingSteps={exerciseData.walkingSteps}
        runningDistance={exerciseData.runningDistance}
        runningTime={exerciseData.runningTime}
        onWalkingDistanceChange={handleInputChange('walkingDistance')}
        onWalkingTimeChange={handleInputChange('walkingTime')}
        onWalkingStepsChange={handleInputChange('walkingSteps')}
        onRunningDistanceChange={handleInputChange('runningDistance')}
        onRunningTimeChange={handleInputChange('runningTime')}
        isDarkMode={isDarkMode}
      />

      {/* 筋力トレーニング */}
      <StrengthTrainingCard
        pushUps={exerciseData.pushUps}
        sitUps={exerciseData.sitUps}
        squats={exerciseData.squats}
        onPushUpsChange={handleInputChange('pushUps')}
        onSitUpsChange={handleInputChange('sitUps')}  
        onSquatsChange={handleInputChange('squats')}
        isDarkMode={isDarkMode}
      />

      {/* その他運動 & 体重 */}
      <Grid 
        container 
        spacing={isTabletOrMobile || isPortraitMode || isSmallScreen ? 2 : 3} 
        sx={{ mb: isTabletOrMobile || isPortraitMode || isSmallScreen ? 2 : 3 }}
      >
        <Grid item xs={12} md={6}>
          <OtherExerciseCard
            otherExerciseTime={exerciseData.otherExerciseTime}
            onOtherExerciseTimeChange={handleInputChange('otherExerciseTime')}
            isDarkMode={isDarkMode}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <WeightInputCard
            todayWeight={exerciseData.todayWeight}
            hasWeightInput={exerciseData.hasWeightInput}
            onTodayWeightChange={handleInputChange('todayWeight')}
            isDarkMode={isDarkMode}
          />
        </Grid>
      </Grid>

      {/* どんな運動したの？自由入力欄 */}
      <ExerciseNoteCard
        exerciseNote={exerciseData.exerciseNote}
        onExerciseNoteChange={handleInputChange('exerciseNote')}
        isDarkMode={isDarkMode}
      />

      {/* 今日の一枚 */}
      <PhotoUploadCard
        todayImages={exerciseData.todayImages}
        fileInputRef={fileInputRef}
        onImageUpload={handleImageUpload}
        isDarkMode={isDarkMode}
      />

      {/* ボタン */}
      <ActionButtons
        onSave={handleSave}
        onBack={onBack}
        loading={loading}
        isDarkMode={isDarkMode}
      />
      
      {/* 確認ダイアログ */}
      <Dialog
        open={confirmOverwriteOpen}
        onClose={() => setConfirmOverwriteOpen(false)}
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
          {t('exercise', 'overwriteTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: isDarkMode ? '#ffffff' : 'inherit' }}>
            {overwriteResult ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}>
                  🎉 {overwriteResult.calories}カロリー消費しました！
                </div>
                <div style={{ whiteSpace: 'pre-line' }}>
                  {overwriteResult.message}
                </div>
              </div>
            ) : (
              t('exercise', 'overwriteMessage')
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {overwriteResult ? (
            <Button 
              onClick={() => {
                setConfirmOverwriteOpen(false);
                setPendingSaveData(null);
                setOverwriteResult(null);
              }}
              variant="contained"
              sx={{ 
                backgroundColor: isDarkMode ? '#ffffff' : '#4caf50',
                color: isDarkMode ? '#000000' : '#ffffff',
                '&:hover': {
                  backgroundColor: isDarkMode ? '#f0f0f0' : '#45a049'
                }
              }}
            >
              OK
            </Button>
          ) : (
            <>
              <Button 
                onClick={() => {
                  setConfirmOverwriteOpen(false);
                  setPendingSaveData(null);
                }}
                sx={{ color: isDarkMode ? '#ffffff' : 'inherit' }}
              >
                キャンセル
              </Button>
          <Button 
            onClick={async () => {
              if (pendingSaveData) {
                setLoading(true);
                try {
                  // performSaveを修正して結果を返すようにする
                  const response = await exerciseRecordApi.createExerciseRecord({
                    userId: pendingSaveData.userId,
                    date: pendingSaveData.today,
                    walkingDistance: exerciseData.walkingDistance || '',
                    walkingTime: exerciseData.walkingTime || '',
                    walkingSteps: exerciseData.walkingSteps || '',
                    runningDistance: exerciseData.runningDistance || '',
                    runningTime: exerciseData.runningTime || '',
                    pushUps: exerciseData.pushUps || '',
                    sitUps: exerciseData.sitUps || '',
                    squats: exerciseData.squats || '',
                    otherExerciseTime: exerciseData.otherExerciseTime || '',
                    todayWeight: exerciseData.todayWeight || '',
                    exerciseNote: exerciseData.exerciseNote || '',
                    todayImages: exerciseData.todayImages,
                    isPublic: exerciseData.isPublic,
                    hasWeightInput: exerciseData.hasWeightInput,
                  });

                  if (response.success) {
                    const caloriesBurned = response.calories_burned || 0;
                    const successMessage = `上書き保存が完了しました！\n今日は大体${caloriesBurned}カロリー消費しました！\nおつかれさま！`;
                    setOverwriteResult({ calories: caloriesBurned, message: successMessage });
                    
                    // 保存後は入力をクリアしない - データを保持する
                    // 画像のみクリア（アップロード済みなので）
                    setExerciseData({
                      ...exerciseData,
                      todayImages: [],
                    });
                  } else {
                    showError(response.message || '上書き保存に失敗しました');
                    setConfirmOverwriteOpen(false);
                    setPendingSaveData(null);
                  }
                } catch (error: any) {
                  let errorMessage = '上書き保存に失敗しました。もう一度お試しください。';
                  if (error.response && error.response.data && error.response.data.message) {
                    errorMessage = `上書き保存に失敗しました: ${error.response.data.message}`;
                  } else if (error.message) {
                    errorMessage = `上書き保存に失敗しました: ${error.message}`;
                  }
                  showError(errorMessage);
                  setConfirmOverwriteOpen(false);
                  setPendingSaveData(null);
                } finally {
                  setLoading(false);
                }
              }
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
              上書きする
            </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      
      {/* デバイス同期権限確認ダイアログ */}
      <Dialog
        open={syncPermissionOpen}
        onClose={() => setSyncPermissionOpen(false)}
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
      >
        <DialogTitle sx={{ color: isDarkMode ? '#ffffff' : 'inherit', textAlign: 'center' }}>
          📱 端末と同期しますか？
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: isDarkMode ? '#ffffff' : 'inherit', textAlign: 'center' }}>
            お使いのスマホのフィットネス機能から運動データを取得して、自動で入力欄に反映します。
            <br /><br />
            取得可能なデータ：
            <br />• 歩数
            <br />• 移動距離
            <br />• 活動時間
            <br /><br />
            センサーへのアクセス権限が必要です。
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            onClick={handleSyncPermissionDeny}
            sx={{ color: isDarkMode ? '#ffffff' : 'inherit', mr: 2 }}
          >
            いいえ
          </Button>
          <Button 
            onClick={handleSyncPermissionApprove}
            variant="contained"
            sx={{ 
              backgroundColor: isDarkMode ? '#ffffff' : '#2196F3',
              color: isDarkMode ? '#000000' : '#ffffff',
              '&:hover': {
                backgroundColor: isDarkMode ? '#f0f0f0' : '#1976d2'
              }
            }}
          >
            はい、同期する
          </Button>
        </DialogActions>
      </Dialog>

      {/* ヘルスアプリ選択ダイアログ */}
      <Dialog
        open={healthAppSelectionOpen}
        onClose={() => setHealthAppSelectionOpen(false)}
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
            minWidth: '320px',
            width: 'auto'
          }
        }}
      >
        <DialogTitle sx={{ color: isDarkMode ? '#ffffff' : 'inherit', textAlign: 'center' }}>
          🏃‍♂️ ヘルスアプリを選択
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: isDarkMode ? '#ffffff' : 'inherit', textAlign: 'center', mb: 3 }}>
            お使いのAndroid端末のヘルスアプリと連携して
            <br />
            フィットネスデータを取得します。
          </DialogContentText>
          
          {/* Google Fit */}
          <Button
            fullWidth
            variant="outlined"
            onClick={handleGoogleFitConnect}
            sx={{
              mb: 2,
              py: 2,
              borderColor: isDarkMode ? '#4285f4' : '#4285f4',
              color: isDarkMode ? '#4285f4' : '#4285f4',
              '&:hover': {
                borderColor: isDarkMode ? '#3367d6' : '#3367d6',
                backgroundColor: isDarkMode ? 'rgba(66, 133, 244, 0.1)' : 'rgba(66, 133, 244, 0.1)'
              }
            }}
            startIcon={<span style={{ fontSize: '20px' }}>🟦</span>}
          >
            Google Fit と連携
          </Button>

          {/* Samsung Health */}
          <Button
            fullWidth
            variant="outlined"
            onClick={handleSamsungHealthConnect}
            sx={{
              mb: 2,
              py: 2,
              borderColor: isDarkMode ? '#1f7ed6' : '#1f7ed6',
              color: isDarkMode ? '#1f7ed6' : '#1f7ed6',
              '&:hover': {
                borderColor: isDarkMode ? '#1565c0' : '#1565c0',
                backgroundColor: isDarkMode ? 'rgba(31, 126, 214, 0.1)' : 'rgba(31, 126, 214, 0.1)'
              }
            }}
            startIcon={<span style={{ fontSize: '20px' }}>💙</span>}
          >
            <div style={{ textAlign: 'center' }}>
              Samsung Health と連携
              <br />
              <small style={{ fontSize: '12px', opacity: 0.7 }}>（今後実装予定）</small>
            </div>
          </Button>

          {/* Huawei Health */}
          <Button
            fullWidth
            variant="outlined"
            onClick={handleHuaweiHealthConnect}
            sx={{
              mb: 2,
              py: 2,
              borderColor: isDarkMode ? '#ff6b35' : '#ff6b35',
              color: isDarkMode ? '#ff6b35' : '#ff6b35',
              '&:hover': {
                borderColor: isDarkMode ? '#e55a2b' : '#e55a2b',
                backgroundColor: isDarkMode ? 'rgba(255, 107, 53, 0.1)' : 'rgba(255, 107, 53, 0.1)'
              }
            }}
            startIcon={<span style={{ fontSize: '20px' }}>🧡</span>}
          >
            <div style={{ textAlign: 'center' }}>
              Huawei Health と連携
              <br />
              <small style={{ fontSize: '12px', opacity: 0.7 }}>（今後実装予定）</small>
            </div>
          </Button>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            onClick={() => setHealthAppSelectionOpen(false)}
            sx={{ color: isDarkMode ? '#ffffff' : 'inherit' }}
          >
            キャンセル
          </Button>
        </DialogActions>
      </Dialog>

      {/* デバイス設定案内ダイアログ */}
      <Dialog
        open={settingsDialogOpen}
        onClose={() => setSettingsDialogOpen(false)}
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
            minWidth: '320px',
            width: 'auto'
          }
        }}
      >
        {(() => {
          const settings = getSettingsInstructions();
          return (
            <>
              <DialogTitle sx={{ color: isDarkMode ? '#ffffff' : 'inherit', textAlign: 'center' }}>
                ⚙️ {settings.title}
              </DialogTitle>
              <DialogContent>
                <DialogContentText sx={{ color: isDarkMode ? '#ffffff' : 'inherit', mb: 2 }}>
                  同期を有効にするために、以下の設定を確認してください：
                </DialogContentText>
                {settings.instructions.map((instruction, index) => (
                  <DialogContentText 
                    key={index}
                    sx={{ 
                      color: isDarkMode ? '#ffffff' : 'inherit', 
                      mb: 1,
                      pl: 1,
                      fontSize: '14px',
                      lineHeight: 1.6
                    }}
                  >
                    {instruction}
                  </DialogContentText>
                ))}
                <DialogContentText sx={{ color: isDarkMode ? '#ffffff' : 'inherit', mt: 3, fontWeight: 'bold' }}>
                  代替手段：
                </DialogContentText>
                <DialogContentText sx={{ color: isDarkMode ? '#ffffff' : 'inherit', fontSize: '14px' }}>
                  {settings.alternativeMethod}
                </DialogContentText>
              </DialogContent>
              <DialogActions sx={{ justifyContent: 'center', pb: 3, gap: 2 }}>
                <Button 
                  onClick={() => setSettingsDialogOpen(false)}
                  sx={{ color: isDarkMode ? '#ffffff' : 'inherit' }}
                >
                  閉じる
                </Button>
                {settings.settingsUrl && !getDeviceInfo().isIOS && (
                  <Button 
                    onClick={() => {
                      openSettingsUrl(settings.settingsUrl);
                      setSettingsDialogOpen(false);
                    }}
                    variant="contained"
                    sx={{ 
                      backgroundColor: isDarkMode ? '#ffffff' : '#4CAF50',
                      color: isDarkMode ? '#000000' : '#ffffff',
                      '&:hover': {
                        backgroundColor: isDarkMode ? '#f0f0f0' : '#45a049'
                      }
                    }}
                  >
                    設定を開く
                  </Button>
                )}
              </DialogActions>
            </>
          );
        })()}
      </Dialog>

      {/* 共通トースト */}
      <ToastProvider toast={toast} onClose={hideToast} position="bottom" />
    </Box>
  );
};

export default ExerciseRecord;
