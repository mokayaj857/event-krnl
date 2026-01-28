import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ['@chakra-ui/react', '@privy-io/react-auth', '@krnl-dev/sdk-react-7702'],
    exclude: ['@privy-io/react-auth/iframe'],
  },
  // Handle wallet extension conflicts
  server: {
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
    },
    // Increase timeout for Privy iframe loading
    middlewareMode: false,
  },
});