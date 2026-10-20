import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Google Search Console ownership tag. Set GOOGLE_SITE_VERIFICATION in Vercel to the code Google shows
 * in "HTML tag" (only the content="…" value) and redeploy. Nothing is added when it's unset.
 */
function searchConsoleTag(): Plugin {
  const code = (process.env.GOOGLE_SITE_VERIFICATION ?? "").trim().replace(/[^A-Za-z0-9_-]/g, "");
  return {
    name: "search-console-tag",
    transformIndexHtml: () => (code ? [{ tag: "meta", attrs: { name: "google-site-verification", content: code }, injectTo: "head" }] : []),
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), searchConsoleTag()],
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
