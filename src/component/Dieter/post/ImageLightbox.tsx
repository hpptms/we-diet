import React from 'react';
import { createPortal } from 'react-dom';
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
  clickPosition?: {x: number, y: number} | null;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  open,
  onClose,
  images,
  currentIndex,
  onNext,
  onPrevious,
  clickPosition,
}) => {
  const isDarkMode = useRecoilValue(darkModeState);
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);
  // PCでの表示位置問題を解決するため、より確実な方法を使用
  React.useEffect(() => {
    if (open) {
      // モーダル表示時の処理
      document.body.style.overflow = 'hidden';
      
      // モーダル要素が確実にレンダリングされるまで待機
      setTimeout(() => {
        const modalElement = document.querySelector('.image-lightbox-modal') as HTMLElement;
        if (modalElement) {
          // position: absoluteで現在のスクロール位置を基準に配置
          const scrollY = window.scrollY;
          modalElement.style.setProperty('position', 'absolute', 'important');
          modalElement.style.setProperty('top', `${scrollY}px`, 'important');
          modalElement.style.setProperty('left', '0', 'important');
          modalElement.style.setProperty('width', '100vw', 'important');
          modalElement.style.setProperty('height', '100vh', 'important');
          modalElement.style.setProperty('z-index', '10000', 'important');
          modalElement.style.setProperty('display', 'flex', 'important');
          modalElement.style.setProperty('align-items', 'center', 'important');
          modalElement.style.setProperty('justify-content', 'center', 'important');
          modalElement.style.setProperty('margin', '0', 'important');
          modalElement.style.setProperty('padding', '0', 'important');
          
          // 詳細なデバッグ情報を出力
          const rect = modalElement.getBoundingClientRect();
          const computedStyles = window.getComputedStyle(modalElement);
          
          console.log('🖼️ モーダル表示位置の詳細情報:', {
            boundingRect: rect,
            position: computedStyles.position,
            top: computedStyles.top,
            left: computedStyles.left,
            width: computedStyles.width,
            height: computedStyles.height,
            zIndex: computedStyles.zIndex,
            transform: computedStyles.transform,
            viewport: {
              width: window.innerWidth,
              height: window.innerHeight
            },
            scroll: {
              x: window.scrollX,
              y: window.scrollY
            },
            modalVisible: rect.top >= 0 && rect.left >= 0
          });
        }
      }, 50);
      
      console.log('モーダル表示: スクロール無効化 & 位置固定');
    } else {
      // モーダル非表示時の処理
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

  // クリック位置を中心としたモーダル表示のスタイル計算
  const getModalStyles = () => {
    const baseStyles = {
      backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.85)' : 'rgba(0, 0, 0, 0.75)',
    };

    if (clickPosition) {
      // クリック位置を中心にモーダルを表示
      console.log('📍 クリック位置を中心にモーダル表示:', clickPosition);
      return {
        ...baseStyles,
        // 画像コンテナの位置をクリック位置中心に調整
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed' as const,
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 10000,
      };
    }

    return baseStyles;
  };

  // React Portalを使用してdocument.bodyに直接レンダリング
  return createPortal(
    <div
      className="image-lightbox-modal"
      style={getModalStyles()}
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
        <div
          style={{
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
        </div>
    </div>,
    document.body
  );
};

export default ImageLightbox;
