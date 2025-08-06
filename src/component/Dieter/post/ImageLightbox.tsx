import React from 'react';
import {
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Close,
  ArrowBackIos,
  ArrowForwardIos,
} from '@mui/icons-material';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../../recoil/darkModeAtom';

interface ImageLightboxProps {
  open: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  open,
  onClose,
  images,
  currentIndex,
  onNext,
  onPrevious,
}) => {
  const isDarkMode = useRecoilValue(darkModeState);
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);
  // シンプルにスクロールを無効化するだけで位置は変更しない
  React.useEffect(() => {
    if (open) {
      // モーダル表示時はスクロールを無効化
      document.body.style.overflow = 'hidden';
      console.log('モーダル表示: スクロール無効化');
    } else {
      // モーダル非表示時はスクロールを復元
      document.body.style.overflow = '';
      console.log('モーダル非表示: スクロール復元');
    }

    return () => {
      // クリーンアップ
      document.body.style.overflow = '';
    };
  }, [open]);

  // キーボードナビゲーション
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!open) return;
      
      switch (event.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (images.length > 1) onPrevious();
          break;
        case 'ArrowRight':
          if (images.length > 1) onNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [open, images.length, onClose, onNext, onPrevious]);

  // タッチスワイプ処理
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (images.length > 1) {
      if (isLeftSwipe) {
        onNext();
      } else if (isRightSwipe) {
        onPrevious();
      }
    }
  };

  // ナビゲーションボタンのクリックハンドラー
  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPrevious();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNext();
  };

  if (!open || !images.length) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999, // より高いz-indexで確実に最前面に表示
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        margin: 0,
        // ビューポート全体に確実に表示されるようにする
        inset: 0, // top: 0, right: 0, bottom: 0, left: 0 の省略記法
      }}
      onClick={onClose}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
        {/* 閉じるボタン */}
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            width: 48,
            height: 48,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }
          }}
        >
          <Close sx={{ fontSize: '1.5rem' }} />
        </IconButton>

        {/* 画像とナビゲーションボタンを含むコンテナ */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
            maxWidth: '85vw',
            maxHeight: '85vh',
          }}
        >
          {/* 前の画像ボタン */}
          {images.length > 1 && (
            <IconButton
              onClick={handlePrevious}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                width: 48,
                height: 48,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
                flexShrink: 0,
              }}
            >
              <ArrowBackIos sx={{ fontSize: '1.5rem' }} />
            </IconButton>
          )}

          {/* 画像表示 */}
          <Box
            sx={{
              maxWidth: '65vw',
              maxHeight: '65vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={images[currentIndex]}
              alt={`画像 ${currentIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </Box>

          {/* 次の画像ボタン */}
          {images.length > 1 && (
            <IconButton
              onClick={handleNext}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                width: 48,
                height: 48,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.3s ease',
                flexShrink: 0,
              }}
            >
              <ArrowForwardIos sx={{ fontSize: '1.5rem' }} />
            </IconButton>
          )}
        </Box>

        {/* 画像インジケーター */}
        {images.length > 1 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: '20px',
              padding: '8px 16px',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: 'white',
                fontWeight: 500,
              }}
            >
              {currentIndex + 1} / {images.length}
            </Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {images.map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: index === currentIndex ? 'white' : 'rgba(255, 255, 255, 0.5)',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* 操作ヒント */}
        <Box
          sx={{
            position: 'absolute',
            top: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '12px',
            padding: '8px 16px',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'white',
              fontSize: '0.75rem',
            }}
          >
            {images.length > 1 
              ? 'ESC: 閉じる  ←→: 前後の画像  スワイプ: 移動' 
              : 'ESC: 閉じる'
            }
          </Typography>
        </Box>
    </Box>
  );
};

export default ImageLightbox;
