import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: '0.0.0.0',
        port: 3001, // Vite開発サーバーを3001に変更（バックエンドは3000を使用）
        open: false,
        watch: {
            usePolling: true,
            interval: 300,
        },
        hmr: {
            port: 3001,
            host: 'localhost'
        },
        proxy: {
            '/api': 'http://localhost:8080'
        }
    },
    build: {
        outDir: 'build',
        // 最も安全な設定：Chart.jsのみ分離
        minify: false, // 全てのminificationを無効化
        sourcemap: false,
        rollupOptions: {
            output: {
                // Chart.jsのみを分離（最もシンプルで安全）
                manualChunks: (id) => {
                    // Chart.js関連のみ分離
                    if (id.includes('chart.js')) {
                        return 'charts';
                    }
                    // その他は全て標準のvendorチャンクに
                    if (id.includes('node_modules')) {
                        return 'vendor';
                    }
                }
            }
        }
    },
    // プレビュー設定（SPAサポート）
    preview: {
        port: 3000,
        host: '0.0.0.0'
    }
});
