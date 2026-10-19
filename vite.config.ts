import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
      "@shared": path.resolve(__dirname),
      "@assets": path.resolve(__dirname),
    },
  },
  root: ".",
  publicDir: "public",
  build: {
    outDir: "dist/public",
    emptyOutDir: true,
  },
});
