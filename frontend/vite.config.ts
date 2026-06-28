import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    server: {
      port: 5173,
      // Proxy /api to a real backend in dev. Only relevant when
      // VITE_USE_MOCK=false; the app ships with a localStorage mock otherwise.
      proxy: {
        "/api": {
          target: env.VITE_API_PROXY || "http://localhost:8080",
          changeOrigin: true,
        },
      },
    },
  };
});
