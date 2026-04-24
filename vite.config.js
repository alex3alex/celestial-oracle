import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/app/',
  root: 'webapp',
  build: {
    outDir: '../dist/app',
    emptyOutDir: true
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true
  }
});
