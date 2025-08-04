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

  // スマホ対応を強化したグリッドサイズ調整
  const getGridSize = () => {
    const aspectRatio = window.innerWidth / window.innerHeight;
    const height = window.innerHeight;
    
    // iPhone 14 Pro Max等の大型スマホ - より多くのドットで画像全体をカバー
    if (windowWidth <= 430 && height >= 800) {
      return { rows: 20, cols: 26 }; // 密度を増やして画像全体をカバー
    }
    // 一般的なスマホ
    else if (windowWidth < 480) {
      return { rows: 22, cols: 28 }; // モバイル（密度増加）
    }
    // 小さめのスマホ
    else if (windowWidth < 600) {
      return { rows: 24, cols: 30 }; // モバイル
    } 
    // タブレット
    else if (windowWidth < 960) {
      return { rows: 24, cols: 32 }; // タブレット
    } 
    // 縦長画面
    else if (aspectRatio < 0.7) {
      return { rows: 15, cols: 25 }; // 縦長画面
    } 
    // デスクトップ
    else {
      return { rows: 28, cols: 40 }; // 通常のデスクトップ
    }
  };

  const { rows, cols } = getGridSize();
  
  // スマホ対応を強化したドットサイズ調整
  const getDotSizes = () => {
    const aspectRatio = window.innerWidth / window.innerHeight;
    const height = window.innerHeight;
    
    // iPhone 14 Pro Max等の大型スマホ
    if (windowWidth <= 430 && height >= 800) {
      return { maxDot: 12, minDot: 3 }; // 大型スマホ（さらに小さく）
    }
    // 一般的なスマホ
    else if (windowWidth < 480) {
      return { maxDot: 14, minDot: 3 }; // 小さめスマホ
    }
    // 小さめのスマホ
    else if (windowWidth < 600) {
      return { maxDot: 16, minDot: 4 }; // モバイル
    } 
    // タブレット
    else if (windowWidth < 960) {
      return { maxDot: 20, minDot: 5 }; // タブレット
    } 
    // 縦長画面
    else if (aspectRatio < 0.7) {
      return { maxDot: 20, minDot: 5 }; // 縦長画面
    } 
    // デスクトップ
    else {
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

      // スマホでより完全な画像カバーのため、マージンを最小限に
      const isSmartphone = windowWidth <= 430;
      const marginPercent = isSmartphone ? 1 : 2; // スマホでは1%のマージンで画像全体をカバー
      const maxSize = isSmartphone ? 18 : 24; // スマホでは最大18px
      
      const leftPercent = cols > 1 ? ((x / (cols - 1)) * (100 - marginPercent * 2)) + marginPercent : 50;
      const topPercent = rows > 1 ? ((y / (rows - 1)) * (100 - marginPercent * 2)) + marginPercent : 50;

      dots.push(
        <div
          key={`${x}-${y}`}
          style={{
            position: 'absolute',
            left: `${Math.min(Math.max(leftPercent, marginPercent), 100 - marginPercent)}%`,
            top: `${Math.min(Math.max(topPercent, marginPercent), 100 - marginPercent)}%`,
            width: Math.min(size, maxSize),
            height: Math.min(size, maxSize),
            background: "hsl(220, 80%, 30%)",
            borderRadius: 4,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            animation: `dotWave 3.5s linear infinite`,
            animationDelay: `${delay}s`,
            // より厳格な境界制限
            maxWidth: `${maxSize}px`,
            maxHeight: `${maxSize}px`,
            overflow: 'hidden',
            // スマホでは追加の制限
            ...(isSmartphone && {
              contain: 'layout style size',
              clipPath: 'inset(0)',
            })
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
        height: '100%', // 親コンテナの高さに完全に合わせる
        zIndex: 3,
        pointerEvents: 'none',
        // 完全なオーバーフロー制御
        overflow: 'hidden',
        clipPath: 'inset(0)', // 確実にコンテナ内に制限
        contain: 'layout style paint size', // より厳格な制限
        // ボックスサイジング
        boxSizing: 'border-box',
        // 境界を明確に
        border: '0 solid transparent',
        // 親のサイズを超えないように
        maxWidth: '100%',
        maxHeight: '100%',
        minWidth: '0',
        minHeight: '0',
      }}
    >
      {dots}
    </div>
  );
};
