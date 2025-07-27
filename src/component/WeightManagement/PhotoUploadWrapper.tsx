import React, { useRef, useState, useEffect } from 'react';
import PhotoUploadCard from '../common/PhotoUploadCard';

interface PhotoUploadWrapperProps {
    title?: string;
    photos: (File | string)[];
    maxPhotos?: number;
    onPhotosChange: (photos: (File | string)[]) => void;
    helperText?: string;
}

const PhotoUploadWrapper: React.FC<PhotoUploadWrapperProps> = ({
    title = "写真をアップロード",
    photos,
    maxPhotos = 3,
    onPhotosChange,
    helperText
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileObjects, setFileObjects] = useState<File[]>([]);

    // (File | string)[]のphotosをFile[]に変換（表示用）
    useEffect(() => {
        const convertToFiles = async () => {
            const files: File[] = [];
            for (const photo of photos) {
                if (typeof photo === 'string') {
                    if (photo.startsWith('data:')) {
                        // base64からFileオブジェクトを作成
                        try {
                            const response = await fetch(photo);
                            const blob = await response.blob();
                            const file = new File([blob], `photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
                            files.push(file);
                        } catch (error) {
                            console.error('Failed to convert base64 to File:', error);
                        }
                    } else {
                        // URL文字列の場合はそのまま表示
                        try {
                            const response = await fetch(photo);
                            const blob = await response.blob();
                            const file = new File([blob], `photo_${Date.now()}.jpg`, { type: blob.type || 'image/jpeg' });
                            files.push(file);
                        } catch (error) {
                            console.error('Failed to fetch image:', error);
                        }
                    }
                } else {
                    // File型の場合はそのまま追加
                    files.push(photo);
                }
            }
            setFileObjects(files);
        };
        
        if (photos.length > 0) {
            convertToFiles();
        } else {
            setFileObjects([]);
        }
    }, [photos]);

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
        const newPhotos = photos.filter((_, i) => i !== index);
        onPhotosChange(newPhotos);
    };

    return (
        <PhotoUploadCard
            title={title}
            todayImages={fileObjects}
            fileInputRef={fileInputRef}
            onImageUpload={handleImageUpload}
            onImageDelete={handleImageDelete}
            maxPhotos={maxPhotos}
            emoji="📊"
            gradient="linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)"
            backgroundColor="#f0f8ff"
            borderColor="#2196F3"
        />
    );
};

export default PhotoUploadWrapper;
