// パフォーマンス最適化ユーティリティ

/**
 * requestAnimationFrameを使用した安全なDOM操作
 * @param callback - 実行するコールバック
 */
export const scheduleLayoutWork = (callback: () => void): void => {
    requestAnimationFrame(callback);
};

/**
 * IntersectionObserverを使用した効率的な要素監視
 * @param elements - 監視する要素
 * @param callback - コールバック関数
 * @param options - オプション
 */
export const createIntersectionObserver = (
    callback: IntersectionObserverCallback,
    options: IntersectionObserverInit = {
        rootMargin: '50px',
        threshold: 0.1,
    }
): IntersectionObserver => {
    return new IntersectionObserver(callback, options);
};

/**
 * ResizeObserverを使用した効率的なリサイズ監視
 * @param callback - リサイズコールバック
 */
export const createResizeObserver = (
    callback: ResizeObserverCallback
): ResizeObserver => {
    return new ResizeObserver(callback);
};

/**
 * DOM読み取り操作をバッチ化してリフローを最小化
 */
export class DOMBatcher {
    private readOperations: (() => void)[] = [];
    private writeOperations: (() => void)[] = [];
    private isScheduled = false;

    /**
     * DOM読み取り操作を追加
     */
    read(operation: () => void): void {
        this.readOperations.push(operation);
        this.schedule();
    }

    /**
     * DOM書き込み操作を追加
     */
    write(operation: () => void): void {
        this.writeOperations.push(operation);
        this.schedule();
    }

    private schedule(): void {
        if (!this.isScheduled) {
            this.isScheduled = true;
            requestAnimationFrame(() => this.flush());
        }
    }

    private flush(): void {
        // 読み取り操作を先に実行
        while (this.readOperations.length > 0) {
            const operation = this.readOperations.shift();
            operation?.();
        }

        // 書き込み操作を後で実行
        while (this.writeOperations.length > 0) {
            const operation = this.writeOperations.shift();
            operation?.();
        }

        this.isScheduled = false;
    }
}

/**
 * デバウンス機能付きリサイズハンドラー
 * @param callback - リサイズコールバック
 * @param delay - デバウンス時間（ms）
 */
export const createDebouncedResizeHandler = (
    callback: () => void,
    delay: number = 100
): (() => void) => {
    let timeoutId: NodeJS.Timeout;

    return () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(callback, delay);
    };
};

/**
 * スクロールパフォーマンス最適化
 * @param callback - スクロールコールバック
 * @param options - オプション
 */
export const createOptimizedScrollHandler = (
    callback: (scrollY: number) => void,
    options: {
        throttle?: number;
        usePassive?: boolean;
    } = {}
): {
    handler: EventListener;
    cleanup: () => void;
} => {
    const { throttle = 16, usePassive = true } = options; // 16ms = 60fps
    let ticking = false;
    let lastScrollY = 0;

    const handler = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScrollY = window.pageYOffset;
                if (currentScrollY !== lastScrollY) {
                    callback(currentScrollY);
                    lastScrollY = currentScrollY;
                }
                ticking = false;
            });
            ticking = true;
        }
    };

    const cleanup = () => {
        window.removeEventListener('scroll', handler);
    };

    // パッシブリスナーを使用してスクロールパフォーマンスを向上
    window.addEventListener('scroll', handler, {
        passive: usePassive,
    });

    return { handler, cleanup };
};

/**
 * 仮想化された長いリストのための最適化
 * @param items - リストアイテム
 * @param containerHeight - コンテナの高さ
 * @param itemHeight - アイテムの高さ
 * @param scrollTop - スクロール位置
 */
export const calculateVirtualizedList = (
    items: any[],
    containerHeight: number,
    itemHeight: number,
    scrollTop: number
) => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
        startIndex + Math.ceil(containerHeight / itemHeight) + 1,
        items.length - 1
    );

    return {
        startIndex: Math.max(0, startIndex),
        endIndex,
        visibleItems: items.slice(startIndex, endIndex + 1),
        totalHeight: items.length * itemHeight,
        offsetY: startIndex * itemHeight,
    };
};

/**
 * CSSトランジションを使用した効率的なアニメーション
 * @param element - アニメーションする要素
 * @param properties - CSSプロパティ
 * @param duration - アニメーション時間
 */
export const animateWithCSS = (
    element: HTMLElement,
    properties: Record<string, string>,
    duration: number = 300
): Promise<void> => {
    return new Promise((resolve) => {
        const originalTransition = element.style.transition;
        element.style.transition = `all ${duration}ms ease-out`;

        // プロパティを適用
        Object.entries(properties).forEach(([key, value]) => {
            (element.style as any)[key] = value;
        });

        // アニメーション完了後にクリーンアップ
        const cleanup = () => {
            element.style.transition = originalTransition;
            element.removeEventListener('transitionend', cleanup);
            resolve();
        };

        element.addEventListener('transitionend', cleanup, { once: true });

        // フォールバック: 指定時間後に強制解決
        setTimeout(cleanup, duration + 100);
    });
};
