import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve('./src'),
    },
  },
  optimizeDeps: {
    include: ['@chakra-ui/react', 'ethers'],
  },
  define: {
    'process.env': {}
  },
  server: {
    port: 3000,
    open: true,
  },
});
