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
/**
 * index.html is written with https://camaola.co.il as a placeholder origin (canonical, og:url, og:image, JSON-LD).
 * Social previews and Google need the REAL address, so at build time it becomes SITE_URL, else Vercel's production
 * domain. With neither (local builds) the canonical tag is dropped rather than pointing at a domain we don't serve.
 */
function siteOrigin(): Plugin {
  const raw = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "");
  const origin = raw.replace(/\/+$/, "");
  return {
    name: "site-origin",
    transformIndexHtml: (html) => origin
      ? html.replaceAll("https://camaola.co.il", origin)
      : html.replace(/\s*<link rel="canonical"[^>]*>/, ""),
  };
}

function searchConsoleTag(): Plugin {
  const code = (process.env.GOOGLE_SITE_VERIFICATION ?? "").trim().replace(/[^A-Za-z0-9_-]/g, "");
  return {
    name: "search-console-tag",
    transformIndexHtml: () => (code ? [{ tag: "meta", attrs: { name: "google-site-verification", content: code }, injectTo: "head" }] : []),
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteOrigin(), searchConsoleTag()],
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
