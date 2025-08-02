import React from 'react';
import {
  Box,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../../../recoil/darkModeAtom';

interface ImagePreviewProps {
  imageUrls: string[];
  onRemoveImage: (index: number) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({
  imageUrls,
  onRemoveImage,
}) => {
  const isDarkMode = useRecoilValue(darkModeState);

  if (imageUrls.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 1.5 }}>
      <Box display="flex" flexWrap="wrap" gap={1}>
        {imageUrls.map((imageUrl, index) => (
          <Box key={index} position="relative">
            <Box
              sx={{
                position: 'relative',
                width: 80,
                height: 80,
                borderRadius: 2,
                overflow: 'hidden',
                border: `2px solid ${isDarkMode ? '#29b6f6' : '#e1f5fe'}`,
                backgroundColor: isDarkMode ? '#1a1a1a' : '#f5f5f5'
              }}
            >
              <img
                src={imageUrl}
                alt={`Preview ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
              <IconButton
                onClick={() => onRemoveImage(index)}
                sx={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  width: 20,
                  height: 20,
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)'
                  }
                }}
              >
                <CloseIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ImagePreview;
