import React, { useRef, useEffect, useState } from 'react';
import { Box, Grid, useTheme, useMediaQuery } from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';
import { darkModeState } from '../../recoil/darkModeAtom';
import { exerciseRecordState, ExerciseRecordData, checkAndResetIfDateChanged, isExerciseDataEmpty } from '../../recoil/exerciseRecordAtom';
import { useSetRecoilState } from 'recoil';
import { weightRecordedDateAtom } from '../../recoil/weightRecordedDateAtom';
import { postsApi } from '../../api/postsApi';
import { exerciseRecordApi } from '../../api/exerciseRecordApi';
import { useToast } from '../../hooks/useToast';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setWeightRecordedDate = useSetRecoilState(weightRecordedDateAtom);
  const isDarkMode = useRecoilValue(darkModeState);
  const { toast, hideToast, showSuccess, showError, showWarning } = useToast();
  const theme = useTheme();
  
  // レスポンシブデザイン用のブレークポイント
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down('md')); // 768px以下
  const isPortraitMode = useMediaQuery('(orientation: portrait)');
  const isSmallScreen = useMediaQuery('(max-width: 900px)');

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

  const handleImageDelete = (index: number) => {
    const newImages = exerciseData.todayImages.filter((_, i) => i !== index);
    setExerciseData({
      ...exerciseData,
      todayImages: newImages,  
    });
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
        const overwrite = window.confirm('既に本日の運動記録があります。上書きすると古い写真は自動的に削除され、新しい写真で置き換えられます。よろしいですか？');
        if (!overwrite) {
          setLoading(false);
          return;
        }
      }

      // Protobuf APIで送信
      const response = await exerciseRecordApi.createExerciseRecord({
        userId: userId,
        date: today,
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
        isPublic: exerciseData.isPublic,
        hasWeightInput: exerciseData.hasWeightInput,
      });

      // console.log('サーバーレスポンス:', response);

      if (!response.success) throw new Error(response.message || '保存に失敗しました');
      const caloriesBurned = response.calories_burned || 0;

      // dieterに投稿がチェックされている場合、投稿も作成
      if (exerciseData.isPublic) {
        try {
          // console.log('=== Dieter投稿作成開始 ===');
          const postContent = createExercisePostContent(caloriesBurned);
          // console.log('投稿コンテンツ:', postContent);
          
          const postResult = await postsApi.createPost({
            content: postContent,
            images: exerciseData.todayImages,
            is_sensitive: exerciseData.isSensitive
          });
          
          // console.log('Dieter投稿作成成功:', postResult);
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

      const isUpdate = recordExists;
      const message = isUpdate 
        ? `運動記録を更新しました！古い写真は自動的に削除されました。\n今日は大体${caloriesBurned}カロリー消費しました！\nおつかれさま！`
        : `今日は大体${caloriesBurned}カロリー消費しました！\nおつかれさま！`;
      showSuccess(message);
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
    } finally {
      setLoading(false);
    }
  };

  // レスポンシブスタイル設定
  const containerStyles = {
    p: (isTabletOrMobile || isPortraitMode || isSmallScreen) ? { xs: 0, sm: 1 } : 2,
    maxWidth: (isTabletOrMobile || isPortraitMode || isSmallScreen) ? '100%' : 900,
    width: (isTabletOrMobile || isPortraitMode || isSmallScreen) ? '100%' : 'auto',
    mx: (isTabletOrMobile || isPortraitMode || isSmallScreen) ? 0 : 'auto',
    background: isDarkMode ? '#000000' : '#ffffff',
    minHeight: '100vh',
    color: isDarkMode ? '#ffffff' : 'inherit',
    paddingBottom: (isTabletOrMobile || isPortraitMode || isSmallScreen) ? 'max(1rem, env(safe-area-inset-bottom))' : 4,
    display: 'flex',
    flexDirection: 'column' as const,
    boxSizing: 'border-box' as const,
    overflowX: 'hidden' as const,
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
        runningDistance={exerciseData.runningDistance}
        runningTime={exerciseData.runningTime}
        onWalkingDistanceChange={handleInputChange('walkingDistance')}
        onWalkingTimeChange={handleInputChange('walkingTime')}
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
        onImageDelete={handleImageDelete}
        isDarkMode={isDarkMode}
      />

      {/* ボタン */}
      <ActionButtons
        onSave={handleSave}
        onBack={onBack}
        loading={loading}
        isDarkMode={isDarkMode}
      />
      
      {/* 共通トースト */}
      <ToastProvider toast={toast} onClose={hideToast} />
    </Box>
  );
};

export default ExerciseRecord;
