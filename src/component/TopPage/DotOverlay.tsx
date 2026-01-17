import React, { useState, useEffect, useCallback } from 'react';

/**
 * DotOverlay - 軽量版
 *
 * 以前は1,120個のDOM要素 + CSSアニメーションで高いCPU負荷がありましたが、
 * CSSグラデーションを使用した静的なドットパターンに変更し、パフォーマンスを大幅に改善。
 *
 * CPU負荷: ~0% (以前は高負荷)
 * DOM要素: 1個 (以前は最大1,120個)
 */
export const DotOverlay: React.FC = () => {
  // レスポンシブなドットサイズとスペーシング
  const getDotConfig = useCallback(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1024;

    if (width <= 430) {
      // スマートフォン
      return { dotSize: 6, spacing: 18 };
    } else if (width < 600) {
      // 小さめのスマホ
      return { dotSize: 8, spacing: 22 };
    } else if (width < 960) {
      // タブレット
      return { dotSize: 10, spacing: 26 };
    } else {
      // デスクトップ
      return { dotSize: 12, spacing: 30 };
    }
  }, []);

  const [dotConfig, setDotConfig] = useState(getDotConfig);

  // ウィンドウリサイズに対応
  useEffect(() => {
    const handleResize = () => {
      setDotConfig(getDotConfig());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getDotConfig]);

  const { dotSize, spacing } = dotConfig;

  // CSSグラデーションでドットパターンを生成（CPU負荷なし）
  const dotPattern = `
    radial-gradient(
      circle ${dotSize}px at ${spacing / 2}px ${spacing / 2}px,
      hsl(220, 80%, 30%) 0%,
      hsl(220, 80%, 30%) 40%,
      transparent 40%
    )
  `;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: 3,
        pointerEvents: 'none',
        overflow: 'hidden',
        // CSSグラデーションでドットパターンを描画
        background: dotPattern,
        backgroundSize: `${spacing}px ${spacing}px`,
        // 半透明で画像が見えるように
        opacity: 0.6,
        // GPUアクセラレーション
        willChange: 'opacity',
        transform: 'translateZ(0)',
      }}
    />
  );
};
