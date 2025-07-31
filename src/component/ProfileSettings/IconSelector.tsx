import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Avatar,
  IconButton,
} from '@mui/material';
import { Upload, AccountCircle } from '@mui/icons-material';
import { DEFAULT_IMAGES, DefaultImage } from '../../image/DefaultImage';

interface IconSelectorProps {
  iconType: 'preset' | 'upload';
  selectedPresetId: number | null;
  uploadedIcon: string | null;
  showPreset: boolean;
  onIconTypeChange: (type: 'preset' | 'upload') => void;
  onPresetSelect: (id: number) => void;
  onIconUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onShowPresetToggle: () => void;
  isDarkMode?: boolean;
}

const IconSelector: React.FC<IconSelectorProps> = ({
  iconType,
  selectedPresetId,
  uploadedIcon,
  showPreset,
  onIconTypeChange,
  onPresetSelect,
  onIconUpload,
  onShowPresetToggle,
  isDarkMode = false,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: isDarkMode ? '#ffffff' : 'inherit' }}>
        アイコン設定
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar 
          sx={{ width: 80, height: 80, mr: 2, fontSize: '2rem' }}
          src={
            iconType === 'upload'
              ? uploadedIcon || undefined
              : iconType === 'preset' && selectedPresetId
                ? DEFAULT_IMAGES.find(img => img.id === selectedPresetId)?.url
                : undefined
          }
        >
          {(!selectedPresetId && !uploadedIcon) ? <AccountCircle sx={{ fontSize: '3rem' }} /> : ''}
        </Avatar>
        
        <Box>
          <Button
            variant={showPreset ? 'contained' : 'outlined'}
            onClick={() => {
              onIconTypeChange('preset');
              onShowPresetToggle();
            }}
            sx={{ mr: 1, mb: 1 }}
          >
            プリセット
          </Button>
          <Button
            variant={iconType === 'upload' ? 'contained' : 'outlined'}
            component="label"
            startIcon={<Upload />}
            sx={{ mb: 1 }}
            onClick={() => onIconTypeChange('upload')}
          >
            アップロード
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={onIconUpload}
            />
          </Button>
        </Box>
      </Box>

      {/* プリセットアイコン選択 */}
      {iconType === 'preset' && showPreset && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom sx={{ color: isDarkMode ? '#ffffff' : 'inherit' }}>
            プリセットアイコンを選択:
          </Typography>
          <Grid container spacing={1}>
            {DEFAULT_IMAGES.map((img: DefaultImage) => (
              <Grid item key={img.id}>
                <IconButton
                  onClick={() => onPresetSelect(img.id)}
                  sx={{
                    border: selectedPresetId === img.id ? '2px solid #1976d2' : '1px solid #ddd',
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
  );
};

export default IconSelector;
