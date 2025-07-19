import React from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Chip,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import DeleteIcon from '@mui/icons-material/Delete';

interface PhotoUploadCardProps {
  todayImages: File[];
  fileInputRef: React.RefObject<HTMLInputElement>;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageDelete: (index: number) => void;
}

const PhotoUploadCard: React.FC<PhotoUploadCardProps> = ({
  todayImages,
  fileInputRef,
  onImageUpload,
  onImageDelete,
}) => {
  return (
    <Card sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ 
        background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
        p: 2,
      }}>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          📸 今日の一枚
        </Typography>
      </Box>
      <CardContent sx={{ background: '#f0fff4' }}>
        <Box sx={{ mb: 2 }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={onImageUpload}
            style={{ display: 'none' }}
          />
          <Button
            variant="outlined"
            startIcon={<AddPhotoAlternateIcon />}
            onClick={() => fileInputRef.current?.click()}
            disabled={todayImages.length >= 3}
            sx={{
              borderColor: '#4CAF50',
              color: '#4CAF50',
              '&:hover': {
                borderColor: '#388E3C',
                backgroundColor: 'rgba(76, 175, 80, 0.04)',
              },
            }}
          >
            写真を追加 ({todayImages.length}/3)
          </Button>
        </Box>

        {todayImages.length > 0 && (
          <ImageList sx={{ width: '100%', height: 200 }} cols={3} rowHeight={164}>
            {todayImages.map((image, index) => (
              <ImageListItem key={index}>
                <img
                  src={URL.createObjectURL(image)}
                  alt={`今日の写真 ${index + 1}`}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <ImageListItemBar
                  sx={{
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
                  }}
                  position="top"
                  actionIcon={
                    <IconButton
                      sx={{ color: 'white' }}
                      onClick={() => onImageDelete(index)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                />
              </ImageListItem>
            ))}
          </ImageList>
        )}

        {todayImages.length > 0 && (
          <Chip 
            label={`${todayImages.length}枚の写真を追加しました 📷`} 
            color="success" 
            sx={{ mt: 2 }} 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PhotoUploadCard;
