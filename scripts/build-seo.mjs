// Writes sitemap.xml and robots.txt into the static output (called by build-vercel.mjs).
// Every make and model page under /cars is listed so search engines find the long tail ("עלות החזקה טויוטה קורולה").
// Site URL: SITE_URL env (e.g. https://camaola.co.il), else Vercel's production domain, else none (relative robots only).
import fs from "node:fs";
import path from "node:path";
import { build } from "esbuild";

/** Loads MAKES and PRICES_VERIFIED from the TypeScript data file. */
async function loadMakes(root) {
  const tmp = path.join(root, "node_modules/.cache/seo-gen.mjs");
  fs.mkdirSync(path.dirname(tmp), { recursive: true });
  await build({ entryPoints: [path.join(root, "src/data/generations.ts")], outfile: tmp, format: "esm", bundle: true, logLevel: "error" });
  return import(`${tmp}?t=${Date.now()}`);
}

/** Public pages that should be indexed (admin, API and landing campaigns are not). */
function sitePaths(makes) {
  const paths = ["/", "/cars", "/about", "/privacy", "/terms", "/accessibility"];
  for (const mk of makes) {
    paths.push(`/cars/${mk.id}`);
    for (const m of mk.models) paths.push(`/cars/${mk.id}/${m.id}`);
  }
  return paths;
}

export function siteUrl() {
  const raw = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "");
  return raw.replace(/\/+$/, "");
}

export async function writeSeoFiles(root, staticDir) {
  const { MAKES, PRICES_VERIFIED } = await loadMakes(root);
  const base = siteUrl();
  const robots = ["User-agent: *", "Allow: /", "Disallow: /admin", "Disallow: /api/", "Disallow: /go/"];
  if (base) {
    const urls = sitePaths(MAKES).map((p) => `  <url><loc>${base}${p}</loc><lastmod>${PRICES_VERIFIED}</lastmod></url>`);
    fs.writeFileSync(path.join(staticDir, "sitemap.xml"),
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
    robots.push(`Sitemap: ${base}/sitemap.xml`);
  }
  fs.writeFileSync(path.join(staticDir, "robots.txt"), robots.join("\n") + "\n");
  return { base, count: base ? sitePaths(MAKES).length : 0 };
}
