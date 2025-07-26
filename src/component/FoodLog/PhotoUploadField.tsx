import React from 'react';
import PhotoUploadCard from '../common/PhotoUploadCard';

interface PhotoUploadFieldProps {
    photos: string[];
    onChange: (photos: string[]) => void;
}

const PhotoUploadField: React.FC<PhotoUploadFieldProps> = ({ photos, onChange }) => {
    // Convert string[] to (File | string)[] for compatibility with PhotoUploadCard
    const handlePhotosChange = (newPhotos: (File | string)[]) => {
        // Convert File objects to base64 strings
        const processPhotos = async () => {
            const processedPhotos: string[] = [];
            
            for (const photo of newPhotos) {
                if (typeof photo === 'string') {
                    processedPhotos.push(photo);
                } else {
                    // Convert File to base64 string
                    const reader = new FileReader();
                    const result = await new Promise<string>((resolve) => {
                        reader.onload = (e) => {
                            resolve(e.target?.result as string);
                        };
                        reader.readAsDataURL(photo);
                    });
                    processedPhotos.push(result);
                }
            }
            
            onChange(processedPhotos);
        };
        
        processPhotos();
    };

    return (
        <PhotoUploadCard
            title="今日の食事の写真"
            photos={photos}
            maxPhotos={5}
            onPhotosChange={handlePhotosChange}
            helperText="食事の写真を追加して記録を充実させましょう。最大5枚まで投稿できます。記録を上書きする場合、古い写真は自動的に削除されます。"
        />
    );
};

export default PhotoUploadField;
