import React, { useRef, useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Grid, useTheme, useMediaQuery } from '@mui/material';
import { useRecoilState, useRecoilValue } from 'recoil';
import { darkModeState } from '../../recoil/darkModeAtom';
import { exerciseRecordState, ExerciseRecordData, checkAndResetIfDateChanged, isExerciseDataEmpty } from '../../recoil/exerciseRecordAtom';
import { useSetRecoilState } from 'recoil';
import { weightRecordedDateAtom } from '../../recoil/weightRecordedDateAtom';

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
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_ENDPOINT}exercise_record?user_id=${userId}&date=${today}`
      );
      
      if (response.status === 200 && response.data && response.data.record) {
        const record = response.data.record;
        
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
        
        console.log('本日の運動記録データを読み込みました');
      }
    } catch (error: any) {
      // 404エラー（データが存在しない）は正常なので無視
      if (error.response && error.response.status === 404) {
        console.log('本日の運動記録データはありません');
      } else {
        console.error('運動記録データの取得に失敗しました:', error);
      }
    }
  };

  // コンポーネントマウント時に日付チェックとデータ読み込み
  useEffect(() => {
    const resetData = checkAndResetIfDateChanged();
    if (resetData) {
      setExerciseData(resetData);
      console.log('日付が変わったため、運動記録データをリセットしました');
      return; // リセットした場合は、サーバーへの問い合わせは不要
    }
    
    // 現在のRecoil状態（ローカルストレージから復元済み）をチェック
    if (isExerciseDataEmpty(exerciseData)) {
      // データが空の場合のみサーバーに問い合わせ
      console.log('ローカルデータが空のため、サーバーからデータを取得します');
      loadTodayData();
    } else {
      console.log('ローカルストレージからデータを復元しました');
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
        alert('画像は最大3枚まで選択できます');
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

  const handleSave = async () => {
    setLoading(true);
    try {
      const userId = exerciseData.userId || 1;
      const today = new Date().toISOString().slice(0, 10);

      console.log('=== 運動記録保存開始 ===');
      console.log('userId:', userId);
      console.log('date:', today);

      // 既存データがあるか確認（REST GET）
      let recordExists = false;
      try {
        console.log('既存データをチェック中...');
        const checkRes = await axios.get(
          `${import.meta.env.VITE_API_ENDPOINT}exercise_record?user_id=${userId}&date=${today}`
        );
        console.log('既存データチェック結果:', checkRes.data);
        if (checkRes.status === 200 && checkRes.data && checkRes.data.record) {
          recordExists = true;
        }
      } catch (err: any) {
        console.log('既存データチェックエラー:', err.response?.status, err.message);
        // 404なら未登録、他はエラー
        if (err.response && err.response.status !== 404) {
          throw err;
        }
      }
      if (recordExists) {
        const overwrite = window.confirm('既に本日の運動記録があります。上書きすると古い写真は自動的に削除され、新しい写真で置き換えられます。よろしいですか？');
        if (!overwrite) {
          return;
        }
      }

      // multipart/form-dataで送信
      const formData = new FormData();
      formData.append('user_id', userId.toString());
      formData.append('date', today);
      formData.append('walking_distance', exerciseData.walkingDistance || '');
      formData.append('walking_time', exerciseData.walkingTime || '');
      formData.append('running_distance', exerciseData.runningDistance || '');
      formData.append('running_time', exerciseData.runningTime || '');
      formData.append('push_ups', exerciseData.pushUps || '');
      formData.append('sit_ups', exerciseData.sitUps || '');
      formData.append('squats', exerciseData.squats || '');
      formData.append('other_exercise_time', exerciseData.otherExerciseTime || '');
      formData.append('today_weight', exerciseData.todayWeight || '');
      formData.append('exercise_note', exerciseData.exerciseNote || '');
      formData.append('is_public', exerciseData.isPublic ? 'true' : 'false');
      formData.append('has_weight_input', exerciseData.hasWeightInput ? 'true' : 'false');
      exerciseData.todayImages.forEach((img, idx) => {
        formData.append('images', img, img.name || `image${idx}.jpg`);
      });

      console.log('=== FormData内容 ===');
      formData.forEach((value, key) => {
        console.log(key, ':', value);
      });

      console.log('運動記録をサーバーに送信中...');
      const res = await axios.post(
        `${import.meta.env.VITE_API_ENDPOINT}exercise_record`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      console.log('サーバーレスポンス:', res.data);

      if (res.status !== 200) throw new Error('保存に失敗しました');
      const caloriesBurned = res.data?.calories_burned ?? 0;

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
      alert(message);
    } catch (error: any) {
      console.error('=== 保存エラー詳細 ===');
      console.error('Error object:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
      }
      console.error('=== エラー詳細終了 ===');
      
      let errorMessage = '保存に失敗しました。もう一度お試しください。';
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = `保存に失敗しました: ${error.response.data.error}`;
      }
      alert(errorMessage);
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
    background: isDarkMode ? '#000000' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh',
    color: isDarkMode ? '#ffffff' : 'inherit',
    paddingBottom: (isTabletOrMobile || isPortraitMode || isSmallScreen) ? 1 : 4,
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
    </Box>
  );
};

export default ExerciseRecord;
