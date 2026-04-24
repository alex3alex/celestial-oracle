import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  root: resolve(__dirname, 'webapp'),
  publicDir: resolve(__dirname, 'webapp/public'),
  build: {
    outDir: resolve(__dirname, 'webapp/dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'webapp/index.html')
    }
  },
  server: {
    port: 3000,
    strictPort: true,
    host: true
  }
});
