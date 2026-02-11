import { useRef, useEffect, useCallback } from 'react';

interface UseSwipeBackOptions {
  /** スワイプと判定する最小距離(px) */
  threshold?: number;
  /** スワイプ有効かどうか */
  enabled?: boolean;
  /** 右スワイプ時のコールバック */
  onSwipeRight: () => void;
}

/**
 * 右スワイプでダッシュボードに戻るためのフック
 * iOS のエッジスワイプと干渉しないよう、画面左端20px以外の領域で検出
 */
export const useSwipeBack = ({
  threshold = 80,
  enabled = true,
  onSwipeRight,
}: UseSwipeBackOptions) => {
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const isSwiping = useRef(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    const touch = e.touches[0];
    // 画面左端20pxはiOSのネイティブバックジェスチャー領域なので無視
    if (touch.clientX < 20) return;
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    isSwiping.current = true;
  }, [enabled]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!enabled || !isSwiping.current) return;
    isSwiping.current = false;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX.current;
    const deltaY = Math.abs(touch.clientY - touchStartY.current);

    // 右方向にthreshold以上スワイプ、かつ縦方向の移動が横方向より小さい場合
    if (deltaX > threshold && deltaY < deltaX * 0.5) {
      onSwipeRight();
    }
  }, [enabled, threshold, onSwipeRight]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, handleTouchStart, handleTouchEnd]);
};
