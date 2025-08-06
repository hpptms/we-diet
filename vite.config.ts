import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    // esbuildの設定を分離（トップレベルで定義）
    esbuild: {
        minifyIdentifiers: false, // 変数名の難読化を無効化
        minifySyntax: true,       // 構文の最小化のみ有効
        minifyWhitespace: true,   // 空白の除去は有効
        keepNames: true          // 関数名・変数名を保持
    },
    // ローカルテスト用：段階的最適化設定
    optimizeDeps: {
        // 安全な基本ライブラリを拡張
        include: [
            'react',
            'react-dom',
            'react-router-dom',
            'axios',
            'recoil'
        ]
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
        // ローカルテスト用：段階的最適化設定（方法1: esbuildの設定を弱める）
        minify: 'esbuild',
        sourcemap: false,
        rollupOptions: {
            output: {
                // より詳細なチャンク分離（安全な範囲で）
                manualChunks: (id) => {
                    // React関連
                    if (id.includes('react') || id.includes('react-dom')) {
                        return 'react-vendor';
                    }
                    // Chart.js関連
                    if (id.includes('chart.js')) {
                        return 'charts';
                    }
                    // Recoil関連
                    if (id.includes('recoil')) {
                        return 'state-management';
                    }
                    // Router関連
                    if (id.includes('react-router')) {
                        return 'routing';
                    }
                    // Utils（axios等）
                    if (id.includes('axios')) {
                        return 'utils';
                    }
                    // その他のnode_modulesは標準のvendorチャンクに
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
