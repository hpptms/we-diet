import React, { useRef, useState, useEffect } from 'react';
import PhotoUploadCard from '../common/PhotoUploadCard';

interface PhotoUploadFieldProps {
    photos: string[];
    onChange: (photos: string[]) => void;
}

const PhotoUploadField: React.FC<PhotoUploadFieldProps> = ({ photos, onChange }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileObjects, setFileObjects] = useState<File[]>([]);

    // string[]のphotosをFile[]に変換（表示用）
    useEffect(() => {
        const convertToFiles = async () => {
            const files: File[] = [];
            for (const photo of photos) {
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
            
            if (totalImages <= 3) {
                // FileオブジェクトをBase64に変換してstring[]として保存
                const convertToBase64 = async () => {
                    const newPhotos: string[] = [];
                    for (const file of newImages) {
                        const reader = new FileReader();
                        const result = await new Promise<string>((resolve) => {
                            reader.onload = (e) => {
                                resolve(e.target?.result as string);
                            };
                            reader.readAsDataURL(file);
                        });
                        newPhotos.push(result);
                    }
                    onChange([...photos, ...newPhotos]);
                };
                convertToBase64();
            } else {
                alert('画像は最大3枚まで選択できます');
            }
        }
        // Reset input value to allow selecting the same file again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleImageDelete = (index: number) => {
        const newPhotos = photos.filter((_, i) => i !== index);
        onChange(newPhotos);
    };

    return (
        <PhotoUploadCard
            title="今日の食事の写真"
            todayImages={fileObjects}
            fileInputRef={fileInputRef}
            onImageUpload={handleImageUpload}
            onImageDelete={handleImageDelete}
            maxPhotos={3}
            emoji="🍽️"
            gradient="linear-gradient(45deg, #FF6B6B 30%, #FFE66D 90%)"
            backgroundColor="#fff8f0"
            borderColor="#FF6B6B"
        />
    );
};

export default PhotoUploadField;
