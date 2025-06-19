import React, { useRef, useEffect, useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Container, Typography, Button, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../component/Header';
import Footer from '../component/Footer';

const punchLines = ['運動⇒記録⇒共有', '😊', '食事⇒記録⇒共有', '🙄'];

const PunchLineSlider: React.FC = () => {
  const [punchIndex, setPunchIndex] = useState(0);
  useEffect(() => {
    // 0〜2秒のランダムディレイを設けてからインターバル開始
    const initialDelay = Math.random() * 2000;
    let intervalId: NodeJS.Timeout;
    const timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        setPunchIndex((prev) => (prev + 1) % punchLines.length);
      }, 3000);
    }, initialDelay);
    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);
  return (
    <Typography
      variant="h3"
      gutterBottom
      sx={{ color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.5)', minHeight: '1.5em' }}
    >
      {punchLines[punchIndex]}
    </Typography>
  );
};

export const TopPage = () => {
  const navigate = useNavigate();
  // Cloudinary画像URL配列
  const bgImages = [
    "https://res.cloudinary.com/drmyhhtjo/image/upload/v1750225603/Sleeping_emcryh.webp",
    "https://res.cloudinary.com/drmyhhtjo/image/upload/v1750225603/Mountaineering_s7wwxh.webp",
    "https://res.cloudinary.com/drmyhhtjo/image/upload/v1750225603/Eating_h5psox.webp",
    "https://res.cloudinary.com/drmyhhtjo/image/upload/v1750225603/running_qypk3k.webp"
  ];
  // react-slick用設定
  const sliderSettings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500, // 0.5秒
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000, // 6秒周期
    pauseOnHover: false,
    cssEase: "cubic-bezier(0.4,0,0.2,1)",
    draggable: false,
    swipe: false,
  };

  // ドットレイヤーコンポーネント
  // ドットレイヤー（アニメーション付き）
  const DotOverlay = () => {
    // グリッドサイズ
    const rows: number = 28;
    const cols: number = 40;
    // ドットの最大・最小サイズ
    const maxDot = 24;
    const minDot = 6;

    // 中心座標
    const centerX = cols / 2;
    const centerY = rows / 2;
    // 最大距離
    const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

    // CSS keyframesをグローバルに追加
    useEffect(() => {
      const styleId = "dot-wave-keyframes";
      if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.innerHTML = `
        @keyframes dotWave {
          0%   { background: hsl(220, 80%, 30%); }
          50%  { background: hsl(220, 34.30%, 73.70%); }
          100% { background: hsl(220, 78.30%, 9.00%); }
        }
        `;
        document.head.appendChild(style);
      }
    }, []);

    const dots = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // 中心からの距離
        const dx = x + 0.5 - centerX;
        const dy = y + 0.5 - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        // 距離に応じてサイズを線形補間
        const size = minDot + (maxDot - minDot) * (dist / maxDist);

        // アニメーションディレイを座標ごとにずらす
        const delay = ((x + y) / (rows + cols)) * 2; // 0〜2秒

        dots.push(
          <div
            key={`${x}-${y}`}
            style={{
              position: 'absolute',
              left: `${cols > 1 ? (x / (cols - 1)) * 100 : 50}%`,
              top: `${rows > 1 ? (y / (rows - 1)) * 100 : 50}%`,
              width: size,
              height: size,
              background: "hsl(220, 80%, 30%)",
              borderRadius: 4,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              animation: `dotWave 3.5s linear infinite`,
              animationDelay: `${delay}s`,
            }}
          />
        );
      }
    }
    return (
      <div
        style={{
          position: 'absolute',
          left: 0, top: 0, width: '100%', height: '100%',
          zIndex: 3,
          pointerEvents: 'none',
          willChange: 'auto',
          transform: 'none',
          transition: 'none',
        }}
      >
        {dots}
      </div>
    );
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ナビゲーションバー */}
      <Header />

      <div style={{ flex: 1 }}>
        {/* ヒーローセクション */}
        <Box
          sx={{
            position: 'relative',
            py: 0,
            textAlign: 'center',
            minHeight: '70vh',
            height: '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {/* スライドショー画像 */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 2,
            }}
          >
            <Slider {...sliderSettings}>
              {bgImages.map((url, idx) => (
                <div key={url} style={{ height: '70vh' }}>
                  <img
                    src={url}
                    alt={`slide${idx}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      background: '#000',
                      userSelect: 'none',
                      pointerEvents: 'none',
                      display: 'block',
                    }}
                    draggable={false}
                  />
                </div>
              ))}
            </Slider>
          </div>
          {/* ドットレイヤー（動かさない） */}
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
            }}
          >
            {/* パンチラインスライド表示 */}
            <PunchLineSlider />
            <Typography variant="h6" paragraph sx={{ color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
              一人では続けるのが難しくても、仲間がいれば楽しくなる
            </Typography>
            <Button
              size="large"
              variant="contained"
              color="primary"
              onClick={() => navigate('/login')}
              sx={{ mt: 2 }}
            >
              ログインページ
            </Button>
          </Container>
        </Box>

        {/* 製品詳細セクション */}
        <Container maxWidth="lg" sx={{ my: 5 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                sx={{
                  width: '50%',
                  borderRadius: 2,
                }}
                alt="SNS"
                src="https://res.cloudinary.com/drmyhhtjo/image/upload/v1750312461/SNS_brbmkp.webp" // ここに画像URLを追加
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                ダイエットサポート
              </Typography>
              <Typography variant="body1" paragraph>
                運動の記録、健康、食べ物を中心にしたSNS型アプリです。
                現在開発中です。たまたま見つけた方、もう少々お待ちください😂
              </Typography>
              {/* <Button size="large" variant="outlined" color="secondary">
                どんなサイト？
              </Button> */}
            </Grid>
          </Grid>
        </Container>
      </div>

      {/* フッターセクション */}
      <Footer />
    </div>
  );
};
