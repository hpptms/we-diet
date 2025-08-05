// パフォーマンス監視ユーティリティ

export interface PerformanceMetrics {
    FCP: number; // First Contentful Paint
    LCP: number; // Largest Contentful Paint
    FID: number; // First Input Delay
    CLS: number; // Cumulative Layout Shift
    TTFB: number; // Time to First Byte
}

class PerformanceMonitor {
    private metrics: Partial<PerformanceMetrics> = {};
    private observers: { [key: string]: PerformanceObserver } = {};

    constructor() {
        this.initializeObservers();
    }

    private initializeObservers(): void {
        // FCP と LCP の監視
        if ('PerformanceObserver' in window) {
            try {
                const paintObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.name === 'first-contentful-paint') {
                            this.metrics.FCP = entry.startTime;
                            console.log('FCP:', entry.startTime);
                        }
                    }
                });
                paintObserver.observe({ entryTypes: ['paint'] });
                this.observers.paint = paintObserver;
            } catch (error) {
                console.warn('Paint observer not supported:', error);
            }

            // LCP の監視
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.metrics.LCP = lastEntry.startTime;
                    console.log('LCP:', lastEntry.startTime);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
                this.observers.lcp = lcpObserver;
            } catch (error) {
                console.warn('LCP observer not supported:', error);
            }

            // FID の監視
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        this.metrics.FID = (entry as any).processingStart - entry.startTime;
                        console.log('FID:', this.metrics.FID);
                    }
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
                this.observers.fid = fidObserver;
            } catch (error) {
                console.warn('FID observer not supported:', error);
            }

            // CLS の監視
            try {
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!(entry as any).hadRecentInput) {
                            clsValue += (entry as any).value;
                        }
                    }
                    this.metrics.CLS = clsValue;
                    console.log('CLS:', clsValue);
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
                this.observers.cls = clsObserver;
            } catch (error) {
                console.warn('CLS observer not supported:', error);
            }
        }

        // TTFB の計算
        this.calculateTTFB();
    }

    private calculateTTFB(): void {
        if ('performance' in window && 'getEntriesByType' in performance) {
            const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
            if (navigationEntries.length > 0) {
                const entry = navigationEntries[0];
                this.metrics.TTFB = entry.responseStart - entry.requestStart;
                console.log('TTFB:', this.metrics.TTFB);
            }
        }
    }

    public getMetrics(): Partial<PerformanceMetrics> {
        return { ...this.metrics };
    }

    public reportMetrics(): void {
        console.table(this.metrics);

        // パフォーマンススコアの計算
        const score = this.calculatePerformanceScore();
        console.log('Performance Score:', score);
    }

    private calculatePerformanceScore(): string {
        const { FCP, LCP, FID, CLS } = this.metrics;

        let score = 100;

        // FCP の評価 (1.8秒以下が良好)
        if (FCP && FCP > 1800) score -= 20;
        else if (FCP && FCP > 3000) score -= 40;

        // LCP の評価 (2.5秒以下が良好)
        if (LCP && LCP > 2500) score -= 30;
        else if (LCP && LCP > 4000) score -= 50;

        // FID の評価 (100ms以下が良好)
        if (FID && FID > 100) score -= 20;
        else if (FID && FID > 300) score -= 40;

        // CLS の評価 (0.1以下が良好)
        if (CLS && CLS > 0.1) score -= 20;
        else if (CLS && CLS > 0.25) score -= 40;

        if (score >= 90) return 'Excellent';
        if (score >= 70) return 'Good';
        if (score >= 50) return 'Needs Improvement';
        return 'Poor';
    }

    public disconnect(): void {
        Object.values(this.observers).forEach(observer => {
            if (observer) observer.disconnect();
        });
    }
}

// リソース読み込み監視
export const monitorResourceLoading = (): void => {
    if ('PerformanceObserver' in window) {
        const resourceObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                const resource = entry as PerformanceResourceTiming;

                // 大きなリソースの警告
                if (resource.transferSize > 1024 * 1024) { // 1MB以上
                    console.warn(`Large resource detected: ${resource.name} (${Math.round(resource.transferSize / 1024)}KB)`);
                }

                // 遅いリソースの警告
                if (resource.duration > 2000) { // 2秒以上
                    console.warn(`Slow resource: ${resource.name} (${Math.round(resource.duration)}ms)`);
                }
            }
        });

        resourceObserver.observe({ entryTypes: ['resource'] });
    }
};

// メモリ使用量監視
export const monitorMemoryUsage = (): void => {
    if ('memory' in performance) {
        const memory = (performance as any).memory;
        console.log('Memory Usage:', {
            used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`,
            total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB`,
            limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)}MB`
        });
    }
};

// ページの読み込み完了時の自動レポート
export const initPerformanceMonitoring = (): PerformanceMonitor => {
    const monitor = new PerformanceMonitor();

    // リソース監視開始
    monitorResourceLoading();

    // ページ読み込み完了後にレポート
    window.addEventListener('load', () => {
        setTimeout(() => {
            monitor.reportMetrics();
            monitorMemoryUsage();
        }, 3000); // 3秒後にレポート（すべてのメトリクスが取得されるまで待機）
    });

    return monitor;
};

// 個別メトリクス取得関数
export const measureLCP = (): Promise<number> => {
    return new Promise((resolve) => {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                resolve(lastEntry.startTime);
                observer.disconnect();
            });
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } else {
            resolve(0);
        }
    });
};

export const measureCLS = (): Promise<number> => {
    return new Promise((resolve) => {
        if ('PerformanceObserver' in window) {
            let clsValue = 0;
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!(entry as any).hadRecentInput) {
                        clsValue += (entry as any).value;
                    }
                }
            });
            observer.observe({ entryTypes: ['layout-shift'] });

            // 5秒後に結果を返す
            setTimeout(() => {
                observer.disconnect();
                resolve(clsValue);
            }, 5000);
        } else {
            resolve(0);
        }
    });
};
