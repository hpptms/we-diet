import React from 'react';
import {
  Dialog,
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
  const [scrollPosition, setScrollPosition] = React.useState<{ top: number; left: number }>({ top: 0, left: 0 });

  // スクロール位置を記録してモーダルが現在のビューポート内に表示されるようにする
  React.useEffect(() => {
    if (open) {
      const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
      const currentScrollLeft = window.scrollX || document.documentElement.scrollLeft;
      setScrollPosition({ top: currentScrollTop, left: currentScrollLeft });
      
      // 現在のスクロール位置を固定するため、bodyの位置を調整
      document.body.style.position = 'fixed';
      document.body.style.top = `-${currentScrollTop}px`;
      document.body.style.left = `-${currentScrollLeft}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
    } else {
      // モーダルが閉じられたら元の位置に戻す
      const scrollTop = scrollPosition.top;
      const scrollLeft = scrollPosition.left;
      
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      
      // 元のスクロール位置に戻す
      window.scrollTo(scrollLeft, scrollTop);
    }

    return () => {
      // クリーンアップ
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
    };
  }, [open, scrollPosition.top, scrollPosition.left]);

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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      disableScrollLock={true}
      PaperProps={{
        sx: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          margin: 0,
          maxHeight: '100vh',
          maxWidth: '100vw',
          borderRadius: 0,
          position: 'fixed',
          top: scrollPosition.top,
          left: scrollPosition.left,
          width: '100vw',
          height: '100vh',
        }
      }}
      sx={{
        position: 'fixed',
        top: scrollPosition.top,
        left: scrollPosition.left,
        width: '100vw',
        height: '100vh',
        zIndex: 1300,
        '& .MuiBackdrop-root': {
          backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.75)',
          position: 'fixed',
          top: scrollPosition.top,
          left: scrollPosition.left,
          width: '100vw',
          height: '100vh',
        },
        '& .MuiDialog-container': {
          position: 'fixed',
          top: scrollPosition.top,
          left: scrollPosition.left,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          margin: 0,
        }
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          backgroundColor: 'transparent',
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
    </Dialog>
  );
};

export default ImageLightbox;
