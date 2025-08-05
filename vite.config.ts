import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0',
        port: 3000,
        open: false,
        watch: {
            usePolling: true,
            interval: 100,
        },
        hmr: {
            port: 3000,
            host: 'localhost'
        },
        proxy: {
            '/api': 'http://localhost:8080'
        }
    },
    build: {
        outDir: 'build',
        // モジュールプリロード最適化
        modulePreload: {
            polyfill: false // ポリフィルを無効化してバンドルサイズ削減
        },
        // バンドルサイズ最適化（esbuildを使用）
        minify: 'esbuild',
        rollupOptions: {
            output: {
                // クリティカルパス最適化のためのチャンク分割
                manualChunks: (id) => {
                    // node_modules を適切に分割
                    if (id.includes('node_modules')) {
                        // React関連（最優先）
                        if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                            return 'react-vendor';
                        }
                        // MUI関連（遅延読み込み可能）
                        if (id.includes('@mui') || id.includes('@emotion')) {
                            return 'mui-vendor';
                        }
                        // その他のベンダー
                        return 'vendor';
                    }
                    // ページ別のコード分割
                    if (id.includes('/page/')) {
                        if (id.includes('TopPage')) return 'top-page';
                        if (id.includes('LoginPage')) return 'login-page';
                        if (id.includes('DashboardPage')) return 'dashboard-page';
                        return 'pages';
                    }
                    // コンポーネント別の分割
                    if (id.includes('/component/')) {
                        if (id.includes('TopPage')) return 'top-components';
                        return 'components';
                    }
                    // ユーティリティ
                    if (id.includes('/utils/')) {
                        return 'utils';
                    }
                },
                // アセットのファイル名設定（バージョニング強化）
                chunkFileNames: 'assets/js/[name]-[hash].js',
                entryFileNames: 'assets/js/[name]-[hash].js',
                assetFileNames: (assetInfo) => {
                    if (!assetInfo.name) {
                        return `assets/[name]-[hash].[ext]`;
                    }
                    const info = assetInfo.name.split('.');
                    const ext = info[info.length - 1];
                    if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
                        return `assets/images/[name]-[hash].[ext]`;
                    }
                    if (/css/i.test(ext)) {
                        return `assets/css/[name]-[hash].[ext]`;
                    }
                    if (/woff2?|eot|ttf|otf/i.test(ext)) {
                        return `assets/fonts/[name]-[hash].[ext]`;
                    }
                    return `assets/[name]-[hash].[ext]`;
                }
            }
        },
        // CSS の最適化設定
        cssCodeSplit: true,
        // CSS inlining の閾値を調整（重要なCSSはインライン化）
        assetsInlineLimit: 1024, // 1KB以下は inline化
        // ターゲット設定で最新ブラウザに最適化
        target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari13'],
        // ソースマップは本番では無効化してパフォーマンス向上
        sourcemap: false,
        // チャンクサイズの警告を調整
        chunkSizeWarningLimit: 1000,
        // ビルド最適化
        reportCompressedSize: false, // ビルド時間短縮
    }
});
