import React, { useEffect, useState } from 'react';

export const DotOverlay: React.FC = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // グリッドサイズをレスポンシブに調整（縦画面対応）
  const getGridSize = () => {
    const aspectRatio = window.innerWidth / window.innerHeight;
    
    if (windowWidth < 600) {
      return { rows: 20, cols: 25 }; // モバイル
    } else if (windowWidth < 960) {
      return { rows: 24, cols: 32 }; // タブレット
    } else if (aspectRatio < 0.7) {
      // 縦長画面では大幅に行数を減らして上部のみに表示
      return { rows: 15, cols: 25 }; 
    } else {
      return { rows: 28, cols: 40 }; // 通常のデスクトップ
    }
  };

  const { rows, cols } = getGridSize();
  
  // ドットの最大・最小サイズもレスポンシブに（縦画面対応）
  const getDotSizes = () => {
    const aspectRatio = window.innerWidth / window.innerHeight;
    
    if (windowWidth < 600) {
      return { maxDot: 16, minDot: 4 }; // モバイル
    } else if (windowWidth < 960) {
      return { maxDot: 20, minDot: 5 }; // タブレット
    } else if (aspectRatio < 0.7) {
      // 縦長画面では少し小さめのドット
      return { maxDot: 20, minDot: 5 };
    } else {
      return { maxDot: 24, minDot: 6 }; // 通常のデスクトップ
    }
  };

  const { maxDot, minDot } = getDotSizes();

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

  // 縦画面では画像全体にドットオーバーレイをかける
  const getContainerHeight = () => {
    const aspectRatio = window.innerWidth / window.innerHeight;
    if (aspectRatio < 0.7) {
      return '100%'; // 縦画面では画像全体にドットオーバーレイ
    }
    return '100%'; // 通常画面では全体
  };

  return (
    <div
      style={{
        position: 'absolute',
        left: 0, 
        top: 0, 
        width: '100%', 
        height: getContainerHeight(),
        zIndex: 3,
        pointerEvents: 'none',
        willChange: 'auto',
        transform: 'none',
        transition: 'none',
        // オーバーフローを防ぐ
        overflow: 'hidden',
      }}
    >
      {dots}
    </div>
  );
};
