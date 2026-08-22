import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: './',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        },
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.json']
      },
      build: {
        chunkSizeWarningLimit: 1500,
        rollupOptions: {
          // Explicitly pin the single frontend entry point. Without this,
          // some environments have been observed pulling stray root-level
          // Node.js entry shims (app.js / server.js) into the frontend
          // build graph, which fails because they reference files
          // (dist/server.cjs) that don't exist until the build finishes.
          input: path.resolve(__dirname, 'index.html'),
          output: {
            manualChunks: {
              'vendor-react': ['react', 'react-dom', 'react-router-dom'],
              'vendor-icons': ['lucide-react'],
              'vendor-motion': ['motion']
            }
          }
        }
      }
    };
});
