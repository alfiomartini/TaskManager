import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all network interfaces
    port: 5173,
    proxy: {
      // Proxy requests starting with '/backend' to your target server
      "/backend": {
        target: "http://api:3000", // Replace with your actual backend server address
        changeOrigin: true, // Changes the origin of the host header to the target URL
        rewrite: (path) => path.replace(/^\/backend/, ""), // Rewrites the path by removing '/backend'
        // Optional: Add other configurations like 'secure', 'ws', 'configure'
      },
    },
  },
});
