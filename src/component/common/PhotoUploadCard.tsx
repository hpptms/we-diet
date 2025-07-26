import React, { useRef } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    IconButton,
    Grid,
    Alert
} from '@mui/material';
import {
    PhotoCamera,
    Delete as DeleteIcon
} from '@mui/icons-material';

interface PhotoUploadCardProps {
    title?: string;
    photos: (File | string)[];
    maxPhotos?: number;
    onPhotosChange: (photos: (File | string)[]) => void;
    acceptedFormats?: string;
    helperText?: string;
}

const PhotoUploadCard: React.FC<PhotoUploadCardProps> = ({
    title = "写真をアップロード",
    photos,
    maxPhotos = 3,
    onPhotosChange,
    acceptedFormats = "image/*",
    helperText
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newImages = Array.from(files);
            const totalImages = photos.length + newImages.length;
            
            if (totalImages <= maxPhotos) {
                onPhotosChange([...photos, ...newImages]);
            } else {
                alert(`画像は最大${maxPhotos}枚まで選択できます`);
            }
        }
        // Reset input value to allow selecting the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleImageDelete = (index: number) => {
        const newImages = photos.filter((_, i) => i !== index);
        onPhotosChange(newImages);
    };

    const openFileSelector = () => {
        fileInputRef.current?.click();
    };

    const getImageUrl = (photo: File | string) => {
        if (typeof photo === 'string') {
            return photo;
        }
        return URL.createObjectURL(photo);
    };

    const renderImagePreview = (photo: File | string, index: number) => (
        <Box
            key={index}
            sx={{
                position: 'relative',
                width: '100%',
                paddingTop: '100%', // 1:1 aspect ratio
                border: '1px solid #ddd',
                borderRadius: 1,
                overflow: 'hidden'
            }}
        >
            <img
                src={getImageUrl(photo)}
                alt={`Preview ${index + 1}`}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
            />
            <IconButton
                onClick={() => handleImageDelete(index)}
                sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    },
                    width: 32,
                    height: 32
                }}
                size="small"
            >
                <DeleteIcon fontSize="small" />
            </IconButton>
        </Box>
    );

    return (
        <Card sx={{ mb: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>

                {helperText && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                        {helperText}
                    </Alert>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptedFormats}
                    multiple
                    style={{ display: 'none' }}
                    onChange={handleImageUpload}
                />

                {photos.length > 0 && (
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                        {photos.map((photo, index) => (
                            <Grid item xs={6} sm={4} key={index}>
                                {renderImagePreview(photo, index)}
                            </Grid>
                        ))}
                    </Grid>
                )}

                <Button
                    variant="outlined"
                    startIcon={<PhotoCamera />}
                    onClick={openFileSelector}
                    disabled={photos.length >= maxPhotos}
                    fullWidth
                    sx={{ mb: 1 }}
                >
                    {photos.length >= maxPhotos 
                        ? `画像は最大${maxPhotos}枚まで` 
                        : '画像を選択'
                    }
                </Button>

                <Typography variant="caption" color="text.secondary" display="block">
                    {photos.length}/{maxPhotos}枚選択済み
                    {photos.length > 0 && " • 写真を削除するには×ボタンをクリック"}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default PhotoUploadCard;
