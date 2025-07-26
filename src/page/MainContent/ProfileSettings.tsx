import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { profileSettingsState, isProfileDataEmpty } from '../../recoil/profileSettingsAtom';
import { CreateUserProfileRequest, CreateUserProfileResponse } from '../../proto/user_profile_pb';

// Import components
import DisplayNameField from '../../component/ProfileSettings/DisplayNameField';
import IconSelector from '../../component/ProfileSettings/IconSelector';
import GenderSelector from '../../component/ProfileSettings/GenderSelector';
import AgeField from '../../component/ProfileSettings/AgeField';
import HeightField from '../../component/ProfileSettings/HeightField';
import ActivityLevelField from '../../component/ProfileSettings/ActivityLevelField';
import CurrentWeightField from '../../component/ProfileSettings/CurrentWeightField';
import TargetWeightField from '../../component/ProfileSettings/TargetWeightField';
import PRTextField from '../../component/ProfileSettings/PRTextField';
import SaveButtons from '../../component/ProfileSettings/SaveButtons';

const ProfileSettings: React.FC = () => {
  const [profile, setProfile] = useRecoilState(profileSettingsState);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // サーバーからプロフィールデータを取得する関数
  const loadProfileFromServer = async () => {
    try {
      const userId = 1; // TODO: 実際のユーザーIDを取得
      
      const response = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}api/proto/user_profile?user_id=${userId}`);
      
      if (response.status === 200 && response.data) {
        const serverProfile = response.data;
        
        // サーバーから取得したデータでRecoil状態を更新
        setProfile({
          displayName: serverProfile.display_name || '',
          selectedPresetId: serverProfile.selected_preset_id || null,
          iconType: serverProfile.icon_type || 'preset',
          uploadedIcon: serverProfile.uploaded_icon || null,
          uploadedIconPublicId: serverProfile.uploaded_icon_public_id || null,
          gender: serverProfile.gender || 'male',
          age: serverProfile.age ? serverProfile.age.toString() : '',
          height: serverProfile.height ? serverProfile.height.toString() : '',
          activityLevel: serverProfile.activity_level || '',
          currentWeight: serverProfile.current_weight ? serverProfile.current_weight.toString() : '',
          targetWeight: serverProfile.target_weight ? serverProfile.target_weight.toString() : '',
          showPreset: serverProfile.show_preset !== undefined ? serverProfile.show_preset : true,
          prText: serverProfile.pr_text || '',
          isGenderPrivate: serverProfile.is_gender_private || false,
          isAgePrivate: serverProfile.is_age_private || false,
          isHeightPrivate: serverProfile.is_height_private || false,
          isActivityPrivate: serverProfile.is_activity_private || false,
          isCurrentWeightPrivate: serverProfile.is_current_weight_private || false,
          isTargetWeightPrivate: serverProfile.is_target_weight_private || false,
        });
        
        console.log('サーバーからプロフィールデータを読み込みました');
      }
    } catch (error: any) {
      // 404エラー（データが存在しない）は正常なので無視
      if (error.response && error.response.status === 404) {
        console.log('サーバーにプロフィールデータがありません');
      } else {
        console.error('プロフィールデータの取得に失敗しました:', error);
      }
    }
  };

  // コンポーネントマウント時にデータ読み込み
  useEffect(() => {
    // ローカルストレージのデータが空の場合のみサーバーに問い合わせ
    if (isProfileDataEmpty(profile)) {
      console.log('ローカルデータが空のため、サーバーからデータを取得します');
      loadProfileFromServer();
    } else {
      console.log('ローカルストレージからプロフィールデータを復元しました');
    }
  }, []); // 初回マウント時のみ実行

  const handleIconUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfile(prev => ({
          ...prev,
          uploadedIcon: e.target?.result as string,
          iconType: 'upload',
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let uploadedIconUrl = null;

      // アップロード後のPublic IDを取得
      let finalPublicId: string | null = null;

      // アップロード画像がある場合、Cloudinaryにアップロード
      if (profile.iconType === 'upload' && profile.uploadedIcon && profile.uploadedIcon.startsWith('data:')) {
        // base64をBlobに変換
        const base64Data = profile.uploadedIcon.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });
        
        // FormDataを作成してアップロード
        const formData = new FormData();
        formData.append('file', blob, 'profile_icon.jpg');

        const uploadResponse = await axios.post(`${import.meta.env.VITE_API_ENDPOINT}api/proto/upload/user_icon`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        uploadedIconUrl = uploadResponse.data.url;
        
        // 新しくアップロードした画像のPublic IDを直接使用
        const newPublicId = uploadResponse.data.public_id;
        
        // Public IDをプロフィール設定に保存
        setProfile(prev => ({
          ...prev,
          uploadedIconPublicId: newPublicId
        }));
        
        // プロトバフリクエストで新しいPublic IDを使用
        finalPublicId = newPublicId;
      } else {
        // 既存の画像を使用する場合
        finalPublicId = profile.uploadedIconPublicId;
      }

      // プロトバフリクエストデータを準備
      const requestData: CreateUserProfileRequest = {
        user_id: 1, // TODO: 実際のユーザーIDを取得
        display_name: profile.displayName || 'テストユーザー',
        selected_preset_id: profile.iconType === 'preset' ? profile.selectedPresetId : null,
        icon_type: profile.iconType,
        uploaded_icon: uploadedIconUrl || (profile.iconType === 'upload' ? profile.uploadedIcon : null),
        uploaded_icon_public_id: finalPublicId || null,
        gender: profile.gender || 'male',
        age: profile.age ? parseInt(profile.age) : null,
        height: profile.height ? parseFloat(profile.height) : null,
        activity_level: profile.activityLevel || '低い',
        current_weight: profile.currentWeight ? parseFloat(profile.currentWeight) : null,
        target_weight: profile.targetWeight ? parseFloat(profile.targetWeight) : null,
        show_preset: profile.showPreset,
        pr_text: profile.prText || '',
        is_gender_private: profile.isGenderPrivate,
        is_age_private: profile.isAgePrivate,
        is_height_private: profile.isHeightPrivate,
        is_activity_private: profile.isActivityPrivate,
        is_current_weight_private: profile.isCurrentWeightPrivate,
        is_target_weight_private: profile.isTargetWeightPrivate,
      };

      console.log('送信するリクエストデータ:', requestData);

      // プロトバフエンドポイント呼び出し
      const response = await axios.post<CreateUserProfileResponse>(`${import.meta.env.VITE_API_ENDPOINT}api/proto/user_profile`, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('プロフィール保存成功:', response.data);
      alert('プロフィールが保存されました！');
      
    } catch (error: any) {
      console.error('プロフィール保存エラー:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      alert(`プロフィールの保存に失敗しました。詳細: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        プロフィール設定
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          {/* 表示名 */}
          <DisplayNameField
            displayName={profile.displayName}
            onChange={(displayName) => setProfile(prev => ({ ...prev, displayName }))}
          />

          {/* アイコン設定 */}
          <IconSelector
            iconType={profile.iconType}
            selectedPresetId={profile.selectedPresetId}
            uploadedIcon={profile.uploadedIcon}
            showPreset={profile.showPreset}
            onIconTypeChange={(iconType) => setProfile(prev => ({ ...prev, iconType }))}
            onPresetSelect={(selectedPresetId) => setProfile(prev => ({ ...prev, selectedPresetId }))}
            onIconUpload={handleIconUpload}
            onShowPresetToggle={() => setProfile(prev => ({ ...prev, showPreset: !prev.showPreset }))}
          />

          {/* 性別 */}
          <GenderSelector
            gender={profile.gender}
            isGenderPrivate={profile.isGenderPrivate}
            onGenderChange={(gender) => setProfile(prev => ({ ...prev, gender }))}
            onPrivacyChange={(isGenderPrivate) => setProfile(prev => ({ ...prev, isGenderPrivate }))}
          />

          {/* 年齢 */}
          <AgeField
            age={profile.age}
            isAgePrivate={profile.isAgePrivate}
            onAgeChange={(age) => setProfile(prev => ({ ...prev, age }))}
            onPrivacyChange={(isAgePrivate) => setProfile(prev => ({ ...prev, isAgePrivate }))}
          />

          {/* 身長 */}
          <HeightField
            height={profile.height}
            isHeightPrivate={profile.isHeightPrivate}
            onHeightChange={(height) => setProfile(prev => ({ ...prev, height }))}
            onPrivacyChange={(isHeightPrivate) => setProfile(prev => ({ ...prev, isHeightPrivate }))}
          />

          {/* 活動範囲 */}
          <ActivityLevelField
            activityLevel={profile.activityLevel}
            isActivityPrivate={profile.isActivityPrivate}
            onActivityLevelChange={(activityLevel) => setProfile(prev => ({ ...prev, activityLevel }))}
            onPrivacyChange={(isActivityPrivate) => setProfile(prev => ({ ...prev, isActivityPrivate }))}
          />

          {/* 現在の体重 */}
          <CurrentWeightField
            currentWeight={profile.currentWeight}
            isCurrentWeightPrivate={profile.isCurrentWeightPrivate}
            onCurrentWeightChange={(currentWeight) => setProfile(prev => ({ ...prev, currentWeight }))}
            onPrivacyChange={(isCurrentWeightPrivate) => setProfile(prev => ({ ...prev, isCurrentWeightPrivate }))}
          />

          {/* 目標体重 */}
          <TargetWeightField
            targetWeight={profile.targetWeight}
            isTargetWeightPrivate={profile.isTargetWeightPrivate}
            onTargetWeightChange={(targetWeight) => setProfile(prev => ({ ...prev, targetWeight }))}
            onPrivacyChange={(isTargetWeightPrivate) => setProfile(prev => ({ ...prev, isTargetWeightPrivate }))}
          />

          {/* 自己PR */}
          <PRTextField
            prText={profile.prText}
            onPRTextChange={(prText) => setProfile(prev => ({ ...prev, prText }))}
          />

          {/* セーブボタン・戻るボタン */}
          <SaveButtons
            loading={loading}
            onSave={handleSave}
            onBack={() => navigate('/Dashboard')}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfileSettings;
