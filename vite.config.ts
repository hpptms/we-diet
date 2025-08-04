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
        rollupOptions: {
            output: {
                // クリティカルパス最適化のためのチャンク分割
                manualChunks: {
                    // 重要なライブラリを最優先チャンクに
                    critical: ['react', 'react-dom', 'react-router-dom'],
                    // UI ライブラリを分離
                    ui: ['@mui/material', '@mui/icons-material'],
                    // ユーティリティを分離
                    utils: ['axios', 'recoil'],
                    // フォント関連は軽量化
                    fonts: ['./src/fonts.css']
                },
                // アセットのファイル名設定
                chunkFileNames: 'assets/[name]-[hash].js',
                entryFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]'
            }
        },
        // CSS の最適化設定
        cssCodeSplit: true,
        // CSS inlining の閾値を調整（重要なCSSはインライン化）
        assetsInlineLimit: 2048,
        // ターゲット設定で最新ブラウザに最適化
        target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari13'],
        // ソースマップは本番では無効化してパフォーマンス向上
        sourcemap: false
    }
});
