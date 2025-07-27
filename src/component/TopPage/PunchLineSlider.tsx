import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

const punchLines = ['運動⇒記録⇒共有', '😊', '食事⇒記録⇒共有', '🙄'];

export const PunchLineSlider: React.FC = () => {
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
      sx={{ 
        color: 'white', 
        textShadow: '0 2px 8px rgba(0,0,0,0.5)', 
        minHeight: '1.5em',
        // レスポンシブフォントサイズ（縦画面対応）
        fontSize: {
          xs: '1.8rem',  // モバイル
          sm: '2.2rem',  // 小タブレット
          md: '2.8rem',  // タブレット
          lg: '3rem',    // デスクトップ
          xl: '2.5rem',  // 縦画面大型ディスプレイ
        },
        // テキストの配置を調整
        textAlign: 'center',
        px: { xs: 2, sm: 3, md: 4 },
      }}
    >
      {punchLines[punchIndex]}
    </Typography>
  );
};
