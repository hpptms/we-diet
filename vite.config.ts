import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    // 依存関係の最適化を完全無効化 - 最高レベルの安全性
    optimizeDeps: {
        // Vite 5.1以降の新しい方式で最適化を無効化
        noDiscovery: true,
        include: []
    },
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
        // モジュールプリロード最適化（iOS Safari対応でポリフィル有効化）
        modulePreload: {
            polyfill: true // iOS Safari対応のためポリフィルを有効化
        },
        // 最小化を無効化して安全性を最優先
        minify: false,
        rollupOptions: {
            output: {
                // クリティカルパス最適化のためのチャンク分割
                manualChunks: (id) => {
                    // React関連
                    if (id.includes('react') || id.includes('react-dom')) {
                        return 'react-vendor';
                    }
                    // MUI関連とEmotionを全てvendorチャンクに統合（安全性最優先）
                    if (id.includes('@mui/material') || id.includes('@mui/icons-material') || id.includes('@emotion')) {
                        return 'vendor';
                    }
                    // Chart.js関連をより細分化
                    if (id.includes('chart.js/dist/chart.js')) {
                        return 'chart-core';
                    }
                    if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
                        return 'chart-components';
                    }
                    // Recoil関連
                    if (id.includes('recoil')) {
                        return 'state-management';
                    }
                    // Router関連
                    if (id.includes('react-router')) {
                        return 'routing';
                    }
                    // Utils
                    if (id.includes('axios') || id.includes('protobuf')) {
                        return 'utils';
                    }
                    // Cloudinary関連
                    if (id.includes('cloudinary')) {
                        return 'media';
                    }
                    // 外部ライブラリ
                    if (id.includes('node_modules')) {
                        return 'vendor';
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
        // ターゲット設定でiOSのSafari互換性を向上
        target: ['es2015', 'edge88', 'firefox78', 'chrome87', 'safari14'],
        // ソースマップは本番では無効化してパフォーマンス向上
        sourcemap: false,
        // チャンクサイズの警告を調整
        chunkSizeWarningLimit: 500,
        // Tree Shaking最適化
        terserOptions: {
            compress: {
                drop_console: true, // 本番でconsoleを削除
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.info', 'console.warn']
            }
        },
        // ビルド最適化
        reportCompressedSize: false, // ビルド時間短縮
    },
    // プレビュー設定（SPAサポート）
    preview: {
        port: 3000,
        host: '0.0.0.0'
    }
});
