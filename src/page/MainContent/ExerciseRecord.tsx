import React, { useRef, useEffect, useState } from 'react';
import { Box, Grid, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';
import { darkModeState } from '../../recoil/darkModeAtom';
import { exerciseRecordState, ExerciseRecordData, checkAndResetIfDateChanged, isExerciseDataEmpty } from '../../recoil/exerciseRecordAtom';
import { useSetRecoilState } from 'recoil';
import { weightRecordedDateAtom } from '../../recoil/weightRecordedDateAtom';
import { postsApi } from '../../api/postsApi';
import { exerciseRecordApi } from '../../api/exerciseRecordApi';
import { useToast } from '../../hooks/useToast';
import { useResponsive } from '../../hooks/useResponsive';
import ToastProvider from '../../component/ToastProvider';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setWeightRecordedDate = useSetRecoilState(weightRecordedDateAtom);
  const isDarkMode = useRecoilValue(darkModeState);
  const { toast, hideToast, showSuccess, showError, showWarning } = useToast();
  // レスポンシブデザイン用のブレークポイント
  const { isTabletOrMobile, isPortraitMode, isSmallScreen } = useResponsive();

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
  }, [setExerciseData]);

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
        showWarning('画像は最大3枚まで選択できます');
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
          既存データの上書き確認
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
              '既に本日の運動記録があります。上書きしますか？'
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
      
      {/* 共通トースト */}
      <ToastProvider toast={toast} onClose={hideToast} />
    </Box>
  );
};

export default ExerciseRecord;
