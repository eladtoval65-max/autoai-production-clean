import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": __dirname,
      "@shared": __dirname,
      "@assets": __dirname,
    },
  },
  root: __dirname,
  publicDir: path.join(__dirname, "public"),
  build: {
    outDir: path.join(__dirname, "dist/public"),
    emptyOutDir: true,
  },
});
