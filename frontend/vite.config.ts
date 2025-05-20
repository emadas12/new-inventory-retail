import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
 server: {
  host: "0.0.0.0",
  port: 80,
  proxy: {
    "/api": {
      target: "http://gogo-main-backend-1:5000",
      changeOrigin: true,
    },
  },
},

  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
