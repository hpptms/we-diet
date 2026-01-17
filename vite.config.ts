import { defineConfig, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }): UserConfig => {
    const isProd = mode === 'production';

    return {
        plugins: [react()],
        server: {
            host: '0.0.0.0',
            port: 3000,
            open: false,
            watch: {
                usePolling: true,
                interval: 300,
            },
            hmr: {
                port: 3000,
                host: 'localhost'
            }
        },
        build: {
            outDir: 'build',
            minify: 'esbuild',
            sourcemap: false,
            chunkSizeWarningLimit: 1000,
            target: 'es2020',
            rollupOptions: {
                output: {
                    manualChunks: {
                        'react-vendor': ['react', 'react-dom'],
                        'mui': ['@mui/material', '@emotion/react', '@emotion/styled'],
                        'mui-icons': ['@mui/icons-material'],
                        'charts': ['chart.js', 'react-chartjs-2'],
                        'router': ['react-router-dom'],
                        'utils': ['axios', 'recoil']
                    },
                    chunkFileNames: 'assets/[name]-[hash:8].js',
                    entryFileNames: 'assets/[name]-[hash:8].js',
                    assetFileNames: 'assets/[name]-[hash:8].[ext]'
                }
            }
        },
        // 本番ビルドでのみconsole.logとdebuggerを削除
        esbuild: isProd ? {
            drop: ['console', 'debugger'],
        } : undefined,
        preview: {
            port: 3000,
            host: '0.0.0.0'
        }
    };
});
