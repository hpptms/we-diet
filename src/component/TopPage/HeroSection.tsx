import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DotOverlay } from './DotOverlay';
import { PunchLineSlider } from './PunchLineSlider';
import { useScreenOrientation } from './useScreenOrientation';
import { optimizeCloudinaryImage } from '../../utils/imageOptimization';
import { LanguageProps } from '../../types/language';
import { useTranslation } from '../../hooks/useTranslation';

export const HeroSection: React.FC<LanguageProps> = ({ language }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isPortraitDesktop, isLandscapeDesktop, aspectRatio } = useScreenOrientation();

  // 4枚の画像データ
  const bgImages = [
    "https://res.cloudinary.com/drmyhhtjo/image/upload/v1753593907/afa4835f-e2b4-49f9-b342-1c272be930d3_cngflc.webp",
    "https://res.cloudinary.com/drmyhhtjo/image/upload/v1750225603/Sleeping_emcryh.webp",
    "https://res.cloudinary.com/drmyhhtjo/image/upload/v1750225603/Mountaineering_s7wwxh.webp",
    "https://res.cloudinary.com/drmyhhtjo/image/upload/v1750225603/Eating_h5psox.webp"
  ];

  // 現在の画像インデックスの状態
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 自動的に画像を切り替える
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bgImages.length);
    }, 6000); // 6秒ごとに切り替え

    return () => clearInterval(interval);
  }, [bgImages.length]);

  // スマホ対応を強化した高さ設定
  const getHeroHeight = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // スマホの縦画面（iPhone 14 Pro Max等）
    if (width <= 430 && height >= 800) {
      return '320px'; // スマホ縦画面専用（より小さく）
    }
    // 一般的なスマホ
    else if (width <= 480) {
      return '300px'; // 小さめのスマホ
    }
    // タブレット縦画面
    else if (aspectRatio < 0.8) {
      return '350px'; // タブレット縦画面
    }
    // デスクトップ縦画面
    else if (isPortraitDesktop) {
      return '300px'; // デスクトップ縦画面
    }
    // デスクトップ横画面
    else if (isLandscapeDesktop) {
      return '500px'; // デスクトップ横画面
    }
    // その他
    else {
      return '380px'; // デフォルト
    }
  };

  return (
    <Box
      sx={{
        // 完全固定サイズのコンテナ
        position: 'relative',
        width: '100vw', // ビューポート幅に完全固定
        height: getHeroHeight(), // 固定高さ
        maxWidth: '100vw', // 最大幅制限
        maxHeight: getHeroHeight(), // 最大高さ制限
        minHeight: getHeroHeight(), // 最小高さ制限
        margin: 0, // マージン完全削除
        padding: 0, // パディング完全削除
        overflow: 'hidden', // はみ出し完全防止
        // フレックスボックスで中央揃え
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        // ボックスサイジング
        boxSizing: 'border-box',
        // 確実に境界を作る
        border: '0 solid transparent',
      }}
    >
      {/* LCP最適化: 最初の画像を優先読み込み */}
      <img
        src={optimizeCloudinaryImage(bgImages[0], window.innerWidth, parseInt(getHeroHeight()))}
        alt="Hero background"
        {...({ fetchpriority: "high" } as any)}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          zIndex: 1,
          opacity: currentImageIndex === 0 ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
        }}
      />
      
      {/* 他の画像（遅延読み込み） */}
      {bgImages.slice(1).map((image, index) => (
        <img
          key={index + 1}
          src={optimizeCloudinaryImage(image, window.innerWidth, parseInt(getHeroHeight()))}
          alt={`Hero background ${index + 2}`}
          loading="lazy"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: 1,
            opacity: currentImageIndex === index + 1 ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }}
        />
      ))}
      
      {/* ドットレイヤー（コンテナ内に制限） */}
      <DotOverlay />
      
      {/* ヒーローテキストをドットより上に絶対配置 */}
      <Container
        maxWidth="md"
        sx={{
          position: 'relative',
          zIndex: 4,
          color: 'white',
          textShadow: '0 2px 8px rgba(0,0,0,0.5)',
          pointerEvents: 'auto',
          // レスポンシブパディング（縦画面対応）
          px: isPortraitDesktop ? { xs: 4, sm: 6, md: 8 } : { xs: 2, sm: 3, md: 4 },
          // 縦画面では上下のマージンも調整
          py: isPortraitDesktop ? { xs: 2, sm: 3 } : { xs: 1, sm: 2 },
        }}
      >
        {/* パンチラインスライド表示 */}
        <PunchLineSlider />
        
        <Typography 
          variant="h6" 
          paragraph 
          sx={{ 
            color: 'white', 
            textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            // レスポンシブフォントサイズ
            fontSize: {
              xs: '1rem',    // モバイル
              sm: '1.1rem',  // 小タブレット
              md: '1.25rem', // タブレット
              lg: '1.25rem', // デスクトップ
            },
            px: { xs: 1, sm: 2 },
          }}
        >
          {t('pages', 'topPage.hero.subtitle')}
        </Typography>
        
        <Button
          size="large"
          variant="contained"
          color="primary"
          onClick={() => navigate('/Dieter')}
          sx={{ 
            mt: 2,
            // レスポンシブボタンサイズ
            fontSize: {
              xs: '0.9rem',
              sm: '1rem',
              md: '1.1rem',
            },
            px: { xs: 3, sm: 4, md: 5 },
            py: { xs: 1, sm: 1.5 },
          }}
        >
          {t('pages', 'topPage.hero.loginButton')}
        </Button>
      </Container>
    </Box>
  );
};
