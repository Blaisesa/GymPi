import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        changeOrigin: true,
        target: "http://localhost:5080",
      },
    },
  },
  test: {
    environment: "jsdom",
    restoreMocks: true,
    setupFiles: "./src/test/setup.ts",
  },
});
