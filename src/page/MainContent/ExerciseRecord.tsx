import React, { useRef } from 'react';
import axios from 'axios';
import { Box, Grid } from '@mui/material';
import { useRecoilState } from 'recoil';
import { exerciseRecordState, ExerciseRecordData } from '../../recoil/exerciseRecordAtom';
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
import PhotoUploadCard from '../../component/ExerciseRecord/PhotoUploadCard';
import ActionButtons from '../../component/ExerciseRecord/ActionButtons';

interface ExerciseRecordProps {
  onBack: () => void;
}

const ExerciseRecord: React.FC<ExerciseRecordProps> = ({ onBack }) => {
  const [exerciseData, setExerciseData] = useRecoilState(exerciseRecordState);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const setWeightRecordedDate = useSetRecoilState(weightRecordedDateAtom);

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
      const totalImages = exerciseData.todayImages.length + newImages.length;
      
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
    try {
      const userId = exerciseData.userId || 1;
      const today = new Date().toISOString().slice(0, 10);

      // 既存データがあるか確認（REST GET）
      let recordExists = false;
      try {
        const checkRes = await axios.get(
          `/api/exercise_record?user_id=${userId}&date=${today}`
        );
        if (checkRes.status === 200 && checkRes.data && checkRes.data.record) {
          recordExists = true;
        }
      } catch (err: any) {
        // 404なら未登録、他はエラー
        if (err.response && err.response.status !== 404) {
          throw err;
        }
      }
      if (recordExists) {
        const overwrite = window.confirm('既に本日の運動記録があります。上書きしますがよろしいですか？');
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

      const res = await axios.post(
        '/api/exercise_record',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

      if (res.status !== 200) throw new Error('保存に失敗しました');
      const caloriesBurned = res.data?.calories_burned ?? 0;

      // 体重記録済みフラグをlocalStorageに保存
      if (exerciseData.hasWeightInput) {
        const todayStr = new Date().toISOString().slice(0, 10);
        localStorage.setItem("weightRecordedDate", todayStr);
        setWeightRecordedDate(todayStr);
      }

      setExerciseData({
        walkingDistance: '',
        walkingTime: '',
        runningDistance: '',
        runningTime: '',
        pushUps: '',
        sitUps: '',
        squats: '',
        otherExerciseTime: '',
        todayWeight: '',
        exerciseNote: '',
        todayImages: [],
        isPublic: false,
        hasWeightInput: exerciseData.hasWeightInput,
      });

      alert(`今日は大体${caloriesBurned}カロリー消費しました！\nおつかれさま！`);
    } catch (error) {
      console.error('保存に失敗しました:', error);
      alert('保存に失敗しました。もう一度お試しください。');
    }
  };

  return (
    <Box 
      sx={{ 
        p: 2, 
        maxWidth: 900, 
        mx: 'auto',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh',
        paddingBottom: 4,
      }}
    >
      {/* ヘッダー */}
      <ExerciseHeader />

      {/* dieterに投稿設定 */}
      <PublicToggle
        isPublic={exerciseData.isPublic}
        onChange={(isPublic) => setExerciseData({ ...exerciseData, isPublic })}
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
      />

      {/* 筋力トレーニング */}
      <StrengthTrainingCard
        pushUps={exerciseData.pushUps}
        sitUps={exerciseData.sitUps}
        squats={exerciseData.squats}
        onPushUpsChange={handleInputChange('pushUps')}
        onSitUpsChange={handleInputChange('sitUps')}
        onSquatsChange={handleInputChange('squats')}
      />

      {/* その他運動 & 体重 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <OtherExerciseCard
            otherExerciseTime={exerciseData.otherExerciseTime}
            onOtherExerciseTimeChange={handleInputChange('otherExerciseTime')}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <WeightInputCard
            todayWeight={exerciseData.todayWeight}
            hasWeightInput={exerciseData.hasWeightInput}
            onTodayWeightChange={handleInputChange('todayWeight')}
          />
        </Grid>
      </Grid>

      {/* どんな運動したの？自由入力欄 */}
      <ExerciseNoteCard
        exerciseNote={exerciseData.exerciseNote}
        onExerciseNoteChange={handleInputChange('exerciseNote')}
      />

      {/* 今日の一枚 */}
      <PhotoUploadCard
        todayImages={exerciseData.todayImages}
        fileInputRef={fileInputRef}
        onImageUpload={handleImageUpload}
        onImageDelete={handleImageDelete}
      />

      {/* ボタン */}
      <ActionButtons
        onSave={handleSave}
        onBack={onBack}
      />
    </Box>
  );
};

export default ExerciseRecord;
