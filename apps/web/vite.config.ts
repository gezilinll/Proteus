import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@proteus/core': path.resolve(__dirname, '../../packages/core/src'),
      '@proteus/react': path.resolve(__dirname, '../../packages/react/src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});

