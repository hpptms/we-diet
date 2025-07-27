import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ImageSlider } from './ImageSlider';
import { DotOverlay } from './DotOverlay';
import { PunchLineSlider } from './PunchLineSlider';
import { useScreenOrientation } from './useScreenOrientation';

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { isPortraitDesktop, isLandscapeDesktop, aspectRatio } = useScreenOrientation();

  // 縦画面大型ディスプレイ用の動的スタイル
  const getHeroHeight = () => {
    if (isPortraitDesktop) {
      return '25vh'; // 縦画面で画像の真ん中にテキストが来るよう調整
    } else if (isLandscapeDesktop) {
      return '50vh'; // 横画面では標準
    } else if (aspectRatio < 0.8) {
      return '35vh'; // タブレット縦画面も調整
    } else {
      return '40vh'; // デフォルト（iPhone15対応）
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        py: 0,
        textAlign: 'center',
        // 動的な高さ設定
        minHeight: getHeroHeight(),
        height: getHeroHeight(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* スライドショー画像 */}
      <ImageSlider />
      
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
          一人では続けるのが難しくても、仲間がいれば楽しくなる
        </Typography>
        
        <Button
          size="large"
          variant="contained"
          color="primary"
          onClick={() => navigate('/login')}
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
          ログインページ
        </Button>
      </Container>
    </Box>
  );
};
