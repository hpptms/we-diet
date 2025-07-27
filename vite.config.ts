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
            host: '192.168.1.22'
        },
        proxy: {
            '/api': 'http://192.168.1.22:8080'
        }
    },
    build: {
        outDir: 'build'
    }
});
