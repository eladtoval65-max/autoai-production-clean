// Packages the Vite build + API functions into Vercel's Build Output API (v3).
// Vercel uses .vercel/output when the build command creates it, so routing and
// functions are fully defined here instead of being inferred by the platform.
import { build } from "esbuild";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, ".vercel/output");
const staticSrc = path.join(root, "dist/public");

if (!fs.existsSync(path.join(staticSrc, "index.html"))) {
  console.error("[build-vercel] dist/public/index.html missing — run vite build first");
  process.exit(1);
}

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.cpSync(staticSrc, path.join(out, "static"), { recursive: true });

const functions = [
  { name: "chat", entry: "api/chat.ts", maxDuration: 30, helpers: true },
  { name: "plate", entry: "api/plate.ts", maxDuration: 15, helpers: true },
  { name: "admin", entry: "api/admin.ts", maxDuration: 30, helpers: true },
  { name: "trpc", entry: "api-src/trpc.ts", maxDuration: 30, helpers: false },
];

for (const fn of functions) {
  const dir = path.join(out, "functions/api", `${fn.name}.func`);
  fs.mkdirSync(dir, { recursive: true });
  await build({
    entryPoints: [path.join(root, fn.entry)],
    outfile: path.join(dir, "index.mjs"),
    bundle: true,
    platform: "node",
    target: "node22",
    format: "esm",
    logLevel: "warning",
    alias: { "@shared": root, "@": root },
    loader: { ".sql": "text" },
    // Some bundled CommonJS deps call require() at runtime.
    banner: { js: "import { createRequire as __cr } from 'module'; const require = __cr(import.meta.url);" },
  });
  fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify({ type: "module" }));
  fs.writeFileSync(
    path.join(dir, ".vc-config.json"),
    JSON.stringify({ runtime: "nodejs22.x", handler: "index.mjs", launcherType: "Nodejs", shouldAddHelpers: fn.helpers, maxDuration: fn.maxDuration }, null, 2),
  );
}

fs.writeFileSync(
  path.join(out, "config.json"),
  JSON.stringify(
    {
      version: 3,
      routes: [
        { src: "^/api/chat/?$", dest: "/api/chat" },
        { src: "^/api/plate/?$", dest: "/api/plate" },
        { src: "^/api/admin/?$", dest: "/api/admin" },
        { src: "^/api/((?:trpc|oauth)(?:/.*)?)$", dest: "/api/trpc?__p=$1" },
        { src: "^/api(/.*)?$", status: 404 },
        { src: "^/assets/[^/]+-[A-Za-z0-9_-]{8}\\.(?:js|css)$", headers: { "cache-control": "public, max-age=31536000, immutable" }, continue: true },
        { handle: "filesystem" },
        { src: "^/(.*)$", dest: "/index.html" },
      ],
    },
    null,
    2,
  ),
);

console.log("[build-vercel] wrote .vercel/output (static + api/chat + api/plate + api/admin + api/trpc)");
