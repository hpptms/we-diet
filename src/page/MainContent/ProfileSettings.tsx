import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  TextField,
  Switch,
  FormGroup,
  FormControlLabel,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Stack,
  CircularProgress
} from '@mui/material';
import { PhotoCamera, Person, Upload, AccountCircle } from '@mui/icons-material';

import { DEFAULT_IMAGES, DefaultImage } from '../../image/DefaultImage';
import { useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { profileSettingsState, GenderType } from '../../recoil/profileSettingsAtom';
import { CreateUserProfileRequest, CreateUserProfileResponse, UploadUserIconResponse } from '../../proto/user_profile_pb';

const ProfileSettings: React.FC = () => {
  const [profile, setProfile] = useRecoilState(profileSettingsState);
  const [loading, setLoading] = useState(false);

  // 旧API経由のプリセットアイコン取得は不要

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

        const uploadResponse = await axios.post(`${import.meta.env.VITE_API_ENDPOINT}upload/user_icon`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        uploadedIconUrl = uploadResponse.data.url;
      }

      // プロトバフリクエストデータを準備
      const requestData: CreateUserProfileRequest = {
        user_id: 1, // TODO: 実際のユーザーIDを取得
        display_name: profile.displayName,
        selected_preset_id: profile.iconType === 'preset' ? profile.selectedPresetId : null,
        icon_type: profile.iconType,
        uploaded_icon: uploadedIconUrl || (profile.iconType === 'upload' ? profile.uploadedIcon : null),
        gender: profile.gender,
        age: profile.age ? parseInt(profile.age) : null,
        activity_level: profile.activityLevel,
        current_weight: profile.currentWeight ? parseFloat(profile.currentWeight) : null,
        target_weight: profile.targetWeight ? parseFloat(profile.targetWeight) : null,
        show_preset: profile.showPreset,
        pr_text: profile.prText,
        is_gender_private: profile.isGenderPrivate,
        is_age_private: profile.isAgePrivate,
        is_activity_private: profile.isActivityPrivate,
        is_current_weight_private: profile.isCurrentWeightPrivate,
        is_target_weight_private: profile.isTargetWeightPrivate,
      };

      // プロトバフエンドポイント呼び出し
      const response = await axios.post<CreateUserProfileResponse>(`${import.meta.env.VITE_API_ENDPOINT}proto/user_profile`, requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('プロフィール保存成功:', response.data);
      alert('プロフィールが保存されました！');
      
    } catch (error) {
      console.error('プロフィール保存エラー:', error);
      alert('プロフィールの保存に失敗しました。');
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
        プロフィール設定
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          {/* 表示名 */}
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="表示名"
              value={profile.displayName}
              onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
              variant="outlined"
            />
          </Box>

          {/* アイコン設定 */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              アイコン設定
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar 
                  sx={{ width: 80, height: 80, mr: 2, fontSize: '2rem' }}
                  src={
                    profile.iconType === 'upload'
                      ? profile.uploadedIcon || undefined
                      : profile.iconType === 'preset' && profile.selectedPresetId
                        ? DEFAULT_IMAGES.find(img => img.id === profile.selectedPresetId)?.url
                        : undefined
                  }
                >
                  {(!profile.selectedPresetId && !profile.uploadedIcon) ? <AccountCircle sx={{ fontSize: '3rem' }} /> : ''}
                </Avatar>
              
              <Box>
                <Button
                  variant={profile.showPreset ? 'contained' : 'outlined'}
                  onClick={() => {
                    setProfile(prev => ({
                      ...prev,
                      iconType: 'preset',
                      showPreset: !prev.showPreset,
                    }));
                  }}
                  sx={{ mr: 1, mb: 1 }}
                >
                  プリセット
                </Button>
                <Button
                  variant={profile.iconType === 'upload' ? 'contained' : 'outlined'}
                  component="label"
                  startIcon={<Upload />}
                  sx={{ mb: 1 }}
                >
                  アップロード
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleIconUpload}
                  />
                </Button>
              </Box>
            </Box>

            {/* プリセットアイコン選択 */}
            {profile.iconType === 'preset' && profile.showPreset && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  プリセットアイコンを選択:
                </Typography>
                <Grid container spacing={1}>
                  {DEFAULT_IMAGES.map((img: DefaultImage) => (
                    <Grid item key={img.id}>
                      <IconButton
                        onClick={() => setProfile(prev => ({ ...prev, selectedPresetId: img.id }))}
                        sx={{
                          border: profile.selectedPresetId === img.id ? '2px solid #1976d2' : '1px solid #ddd',
                          borderRadius: '50%',
                          padding: '4px',
                          width: 60,
                          height: 60
                        }}
                      >
                        <Avatar
                          src={img.url}
                          sx={{ width: 50, height: 50 }}
                        />
                      </IconButton>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>

          {/* 性別 */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ mr: 2 }}>
                  性別
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    variant={profile.gender === 'female' ? 'contained' : 'outlined'}
                    onClick={() => setProfile(prev => ({ ...prev, gender: 'female' }))}
                    sx={{
                      minWidth: 80,
                      backgroundColor: profile.gender === 'female' ? '#e91e63' : 'transparent',
                      color: profile.gender === 'female' ? '#fff' : '#e91e63',
                      borderColor: '#e91e63',
                      '&:hover': {
                        backgroundColor: profile.gender === 'female' ? '#d81b60' : '#f8bbd0',
                        color: '#fff',
                        borderColor: '#e91e63'
                      }
                    }}
                  >
                    女性
                  </Button>
                  <Button
                    variant={profile.gender === 'male' ? 'contained' : 'outlined'}
                    onClick={() => setProfile(prev => ({ ...prev, gender: 'male' }))}
                    sx={{
                      minWidth: 80,
                      backgroundColor: profile.gender === 'male' ? '#1976d2' : 'transparent',
                      color: profile.gender === 'male' ? '#fff' : '#1976d2',
                      borderColor: '#1976d2',
                      '&:hover': {
                        backgroundColor: profile.gender === 'male' ? '#1565c0' : '#bbdefb',
                        color: '#fff',
                        borderColor: '#1976d2'
                      }
                    }}
                  >
                    男性
                  </Button>
                  <Button
                    variant={profile.gender === 'secret' ? 'contained' : 'outlined'}
                    color="success"
                    onClick={() => setProfile(prev => ({ ...prev, gender: 'secret' }))}
                    sx={{
                      minWidth: 80,
                      fontWeight: 'bold',
                      backgroundColor: profile.gender === 'secret' ? '#43a047' : 'transparent',
                      color: profile.gender === 'secret' ? '#fff' : '#43a047',
                      borderColor: '#43a047',
                      '&:hover': {
                        backgroundColor: profile.gender === 'secret' ? '#388e3c' : '#c8e6c9',
                        color: '#fff',
                        borderColor: '#43a047'
                      }
                    }}
                  >
                    秘密☆
                  </Button>
                </Box>
              </Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={profile.isGenderPrivate}
                    onChange={(e) => setProfile(prev => ({ ...prev, isGenderPrivate: e.target.checked }))}
                  />
                }
                label="非公開"
                sx={{ ml: 2 }}
              />
            </Box>
          </Box>

          {/* 年齢 */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                label="年齢"
                type="number"
                value={profile.age}
                onChange={(e) => setProfile(prev => ({ ...prev, age: e.target.value }))}
                sx={{ flex: 1 }}
                InputProps={{
                  endAdornment: <Typography variant="body2">歳</Typography>
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={profile.isAgePrivate}
                    onChange={(e) => setProfile(prev => ({ ...prev, isAgePrivate: e.target.checked }))}
                  />
                }
                label="非公開"
              />
            </Box>
          </Box>

          {/* 活動範囲 */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                label="活動範囲"
                type="text"
                value={profile.activityLevel}
                onChange={(e) => {
                  if (e.target.value.length <= 150) setProfile(prev => ({ ...prev, activityLevel: e.target.value }));
                }}
                sx={{ flex: 1 }}
                inputProps={{ maxLength: 150 }}
                helperText={`${profile.activityLevel.length}/150`}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={profile.isActivityPrivate}
                    onChange={(e) => setProfile(prev => ({ ...prev, isActivityPrivate: e.target.checked }))}
                  />
                }
                label="非公開"
              />
            </Box>
          </Box>

          {/* 現在の体重 */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                label="現在の体重"
                type="number"
                value={profile.currentWeight}
                onChange={(e) => setProfile(prev => ({ ...prev, currentWeight: e.target.value }))}
                sx={{ flex: 1 }}
                InputProps={{
                  endAdornment: <Typography variant="body2">kg</Typography>
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={profile.isCurrentWeightPrivate}
                    onChange={(e) => setProfile(prev => ({ ...prev, isCurrentWeightPrivate: e.target.checked }))}
                  />
                }
                label="非公開"
              />
            </Box>
          </Box>

          {/* 目標体重 */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <TextField
                label="目標体重"
                type="number"
                value={profile.targetWeight}
                onChange={(e) => setProfile(prev => ({ ...prev, targetWeight: e.target.value }))}
                sx={{ flex: 1 }}
                InputProps={{
                  endAdornment: <Typography variant="body2">kg</Typography>
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={profile.isTargetWeightPrivate}
                    onChange={(e) => setProfile(prev => ({ ...prev, isTargetWeightPrivate: e.target.checked }))}
                  />
                }
                label="非公開"
              />
            </Box>
          </Box>

          {/* 自己PR */}
          <Box sx={{ mb: 3 }}>
            <TextField
              label="自己PR"
              type="text"
              value={profile.prText}
              onChange={(e) => {
                if (e.target.value.length <= 300) setProfile(prev => ({ ...prev, prText: e.target.value }));
              }}
              fullWidth
              multiline
              minRows={3}
              maxRows={6}
              inputProps={{ maxLength: 300 }}
              helperText={`${profile.prText.length}/300`}
            />
          </Box>

          {/* セーブボタン・戻るボタン */}
          <Box sx={{ textAlign: 'center', mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSave}
              disabled={loading}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: 2
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'プロフィールを保存'}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/Dashboard')}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: '1.1rem',
                borderRadius: 2
              }}
            >
              戻る
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfileSettings;
