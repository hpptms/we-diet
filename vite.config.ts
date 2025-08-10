import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0',
        port: 3000, // Docker環境での正しいポート
        open: false,
        watch: {
            usePolling: true,
            interval: 300,
        },
        hmr: {
            port: 3000,
            host: 'localhost'
        }
        // プロキシ設定を削除（Nginxでプロキシ処理）
    },
    build: {
        outDir: 'build',
        minify: 'esbuild', // esbuildを使用（より安全）
        sourcemap: false,
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
            output: {
                manualChunks: {
                    // 安全な固定チャンク分割
                    'react-vendor': ['react', 'react-dom'],
                    'mui': ['@mui/material', '@emotion/react', '@emotion/styled'],
                    'mui-icons': ['@mui/icons-material'],
                    'charts': ['chart.js', 'react-chartjs-2'],
                    'router': ['react-router-dom'],
                    'utils': ['axios', 'recoil']
                },
                // ファイル名の最適化
                chunkFileNames: 'assets/[name]-[hash:8].js',
                entryFileNames: 'assets/[name]-[hash:8].js',
                assetFileNames: 'assets/[name]-[hash:8].[ext]'
            }
        }
    },
    // プレビュー設定（SPAサポート）
    preview: {
        port: 3000,
        host: '0.0.0.0'
    }
});
