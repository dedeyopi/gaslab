import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' membuat build dapat di-deploy di GitHub Pages (sub-path),
// Netlify, maupun Vercel tanpa perubahan konfigurasi.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});