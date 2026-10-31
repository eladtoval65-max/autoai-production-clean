// Writes sitemap.xml and robots.txt into the static output (called by build-vercel.mjs).
// Every make and model page under /cars is listed so search engines find the long tail ("עלות החזקה טויוטה קורולה").
// Site URL: SITE_URL env (e.g. https://camaola.co.il), else Vercel's production domain, else none (relative robots only).
import fs from "node:fs";
import path from "node:path";
import { build } from "esbuild";

/** Bundles one TypeScript module and imports it (data files and the pure comparison model). */
async function loadTs(root, entry, name) {
  const tmp = path.join(root, `node_modules/.cache/seo-${name}.mjs`);
  fs.mkdirSync(path.dirname(tmp), { recursive: true });
  await build({ entryPoints: [path.join(root, entry)], outfile: tmp, format: "esm", bundle: true, logLevel: "error" });
  return import(`${tmp}?t=${Date.now()}`);
}
/** MAKES and PRICES_VERIFIED, plus every comparison page (same pairs the site shows). */
async function loadMakes(root) {
  const data = await loadTs(root, "src/data/generations.ts", "gen");
  const cmp = await loadTs(root, "src/features/compare/model/pairs.ts", "pairs");
  const comparisons = cmp.comparePairs().map((p) => ({ path: `/compare/${p.slug}`, ...cmp.pairMeta(p) }));
  const guides = (await loadTs(root, "src/features/guides/model/meta.ts", "guides")).GUIDES.map((g) => ({ path: `/guides/${g.slug}`, title: g.title + SUFFIX, description: g.description }));
  return { ...data, comparisons: [...comparisons, { path: "/guides", title: "מדריכים לקונה רכב" + SUFFIX, description: "מדריכים מבוססי נתונים: צ׳קליסט ליד שנייה, בעיות מוכרות, רכבים חסכוניים, היברידי מול בנזין וחשמלי מול בנזין." }, ...guides] };
}

const nf = new Intl.NumberFormat("he-IL");
const shekel = (n) => `₪${nf.format(n)}`;
const SUFFIX = " | כמה עולה";

/**
 * Every public page with its own title and description (admin, API and campaign pages are not indexed).
 * The titles match what each page sets in the browser (document.title), so Google and the browser agree.
 */
function sitePages(makes, comparisons = []) {
  const pages = [
    { path: "/", title: null, description: null }, // home keeps index.html's own tags
    { path: "/cars", title: "כל הדגמים לפי יצרן, משנת 2010" + SUFFIX, description: "כל דגמי הרכב בישראל מאז 2010 לפי יצרן: דורות, מנועים, מה לבדוק ביד שנייה ומחשבון עלות חודשית." },
    { path: "/compare", title: "השוואות רכבים לפי עלות חודשית" + SUFFIX, description: "רכבים באותו טווח מחיר, זה מול זה: דלק, ביטוח (הערכה), טיפולים, ירידת ערך ורישוי — מי עולה פחות בחודש." },
    ...comparisons,
    { path: "/leasing", title: "ליסינג פרטי או קנייה — מה זול יותר? מחשבון" + SUFFIX, description: "מחשבון חינמי: הכניסו את הצעת הליסינג ונשווה לקנייה של אותו רכב — מקדמה, תשלומים, ריבית, ירידת ערך, ביטוח וטיפולים." },
    { path: "/sell", title: "מוכרים רכב? כרטיס ״כמה עולה בחודש״ למודעה" + SUFFIX, description: "צרו בחינם כרטיס שמראה לקונים כמה הרכב שלכם יעלה להם בחודש, והוסיפו אותו למודעה ביד2 או בכל מקום אחר." },
    { path: "/about", title: "איך מחשבים כמה עולה רכב" + SUFFIX, description: "השיטה: דלק או חשמל, ביטוח (הערכה), טיפולים, ירידת ערך ורישוי — המקורות ותאריך העדכון האחרון." },
    { path: "/privacy", title: "מדיניות פרטיות" + SUFFIX, description: "מה נאסף, למה, למי מועבר וכמה זמן נשמר — והזכויות שלכם." },
    { path: "/terms", title: "תנאי שימוש" + SUFFIX, description: "תנאי השימוש באתר כמה עולה: המספרים הם הערכה, ביטוח אינו הצעת מחיר." },
    { path: "/accessibility", title: "הצהרת נגישות" + SUFFIX, description: "מה הותאם באתר, מה עוד לא נגיש במלואו, ואיך פונים אלינו בנושא נגישות." },
  ];
  for (const mk of makes) {
    pages.push({ path: `/cars/${mk.id}`, title: `${mk.he} — כל הדגמים והדורות מ-2010` + SUFFIX,
      description: `כל דגמי ${mk.he} שנמכרו בישראל מאז 2010: דורות, מנועים, מה לבדוק ביד שנייה, ומחשבון עלות חודשית.` });
    for (const m of mk.models) {
      const price = m.price ? `מחיר מחירון ${m.price[0] === m.price[1] ? shekel(m.price[0]) : `${shekel(m.price[0])} עד ${shekel(m.price[1])}`}. ` : "";
      pages.push({ path: `/cars/${mk.id}/${m.id}`, title: `${mk.he} ${m.he} — כל הדורות, מה לבדוק וכמה עולה בחודש` + SUFFIX,
        description: `${mk.he} ${m.he}: ${price}כל הדורות מאז 2010, מה לבדוק לפני קנייה, וכמה יעלה לכם בחודש — דלק, ביטוח (הערכה), טיפולים וירידת ערך.` });
    }
  }
  return pages;
}
const sitePaths = (makes, comparisons) => sitePages(makes, comparisons).map((p) => p.path);

const esc = (t) => t.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** index.html with this page's title, description, canonical and share tags. */
export function pageHtml(template, page, base) {
  const url = `${base}${page.path}`;
  return template
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(page.title)}</title>`)
    .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(page.description)}$2`)
    .replace(/(<meta property="og:title"\s+content=")[^"]*(")/, `$1${esc(page.title)}$2`)
    .replace(/(<meta property="og:description"\s+content=")[^"]*(")/, `$1${esc(page.description)}$2`)
    .replace(/(<meta name="twitter:title"\s+content=")[^"]*(")/, `$1${esc(page.title)}$2`)
    .replace(/(<meta name="twitter:description"\s+content=")[^"]*(")/, `$1${esc(page.description)}$2`)
    .replace(/(<meta property="og:url"\s+content=")[^"]*(")/, base ? `$1${url}$2` : "$1/$2")
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
}

export function siteUrl() {
  const raw = process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "");
  return raw.replace(/\/+$/, "");
}

export async function writeSeoFiles(root, staticDir) {
  const { MAKES, PRICES_VERIFIED, comparisons } = await loadMakes(root);
  const base = siteUrl();
  const robots = ["User-agent: *", "Allow: /", "Disallow: /admin", "Disallow: /api/", "Disallow: /go/"];
  if (base) {
    const urls = sitePaths(MAKES, comparisons).map((p) => `  <url><loc>${base}${p}</loc><lastmod>${PRICES_VERIFIED}</lastmod></url>`);
    fs.writeFileSync(path.join(staticDir, "sitemap.xml"),
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`);
    robots.push(`Sitemap: ${base}/sitemap.xml`);
  }
  fs.writeFileSync(path.join(staticDir, "robots.txt"), robots.join("\n") + "\n");

  // One HTML file per page (cars/toyota/corolla.html …) served at its clean URL through config "overrides".
  const template = fs.readFileSync(path.join(staticDir, "index.html"), "utf8");
  const overrides = {};
  for (const page of sitePages(MAKES, comparisons)) {
    if (!page.title) continue;
    const file = `${page.path.slice(1)}.html`;
    fs.mkdirSync(path.dirname(path.join(staticDir, file)), { recursive: true });
    fs.writeFileSync(path.join(staticDir, file), pageHtml(template, page, base));
    overrides[file] = { path: page.path.slice(1), contentType: "text/html; charset=utf-8" };
  }
  return { base, count: base ? sitePaths(MAKES, comparisons).length : 0, overrides };
}
