// Validates data-facts/<make>.json against _manifest.json. Usage: node data-facts/validate.mjs [makeId ...]
import fs from "node:fs"; import path from "node:path"; import { fileURLToPath } from "node:url";
const dir = path.dirname(fileURLToPath(import.meta.url));
const manifest = JSON.parse(fs.readFileSync(path.join(dir, "_manifest.json"), "utf8"));
const ids = process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(dir).filter((f) => f.endsWith(".json") && !f.startsWith("_")).map((f) => f.slice(0, -5));
const isUrl = (u) => typeof u === "string" && /^https:\/\/[^\s]+\.[^\s]+/.test(u);
const src = (s, where, errs) => { if (!s || !s.title || !isUrl(s.url)) errs.push(`${where}: source needs title + https url`); };
let total = 0;
for (const id of ids) {
  const errs = []; const mk = manifest.find((m) => m.make === id);
  const file = path.join(dir, `${id}.json`);
  if (!mk) { console.log(`✗ ${id}: unknown make`); total++; continue; }
  if (!fs.existsSync(file)) { console.log(`✗ ${id}: no file`); total++; continue; }
  let data; try { data = JSON.parse(fs.readFileSync(file, "utf8")); } catch (e) { console.log(`✗ ${id}: bad JSON ${e.message}`); total++; continue; }
  let gens = 0, withIssues = 0, issues = 0, eng = 0, ncap = 0, price = 0, maint = 0;
  for (const [modelId, byGen] of Object.entries(data.models ?? {})) {
    const m = mk.models.find((x) => x.id === modelId); if (!m) { errs.push(`unknown model ${modelId}`); continue; }
    for (const [code, f] of Object.entries(byGen)) {
      const where = `${modelId}/${code}`;
      if (!m.gens.some((g) => g.code === code)) { errs.push(`unknown generation ${where}`); continue; }
      gens++;
      for (const [i, it] of (f.issues ?? []).entries()) {
        if (!it.he || it.he.length < 10) errs.push(`${where} issue ${i}: Hebrew text missing/short`);
        if (!["recall", "manufacturer", "widely_reported"].includes(it.level)) errs.push(`${where} issue ${i}: bad level`);
        src(it.source, `${where} issue ${i}`, errs); issues++;
      }
      if ((f.issues ?? []).length) withIssues++;
      for (const [i, e] of (f.engines ?? []).entries()) {
        if (!e.name || typeof e.cons !== "number" || e.cons <= 0 || e.cons > 40 || !["L", "kWh"].includes(e.unit)) errs.push(`${where} engine ${i}: name/cons/unit`);
        src(e.source, `${where} engine ${i}`, errs); eng++;
      }
      if (f.ncap) { if (f.ncap.stars != null) { if (![0,1,2,3,4,5].includes(f.ncap.stars) || !isUrl(f.ncap.url)) errs.push(`${where}: ncap stars/url`); else ncap++; } }
      for (const [i, it] of (f.maintenance ?? []).entries()) {
        const w = `${where} maintenance ${i}`;
        if (!it.he || it.he.length < 6) errs.push(`${w}: Hebrew text missing/short`);
        if (!["scheduled", "wear", "risk"].includes(it.kind)) errs.push(`${w}: bad kind`);
        if (!Array.isArray(it.costIls) || it.costIls.length !== 2 || !(it.costIls[0] > 0) || it.costIls[1] < it.costIls[0] || it.costIls[1] > 200000) errs.push(`${w}: costIls must be [min, max] in ₪`);
        if (it.kind !== "risk" && !(it.intervalKm > 0) && !(it.intervalYears > 0)) errs.push(`${w}: scheduled/wear items need intervalKm or intervalYears`);
        if (it.intervalKm != null && !(it.intervalKm >= 5000 && it.intervalKm <= 400000)) errs.push(`${w}: intervalKm out of range`);
        if (it.intervalYears != null && !(it.intervalYears >= 1 && it.intervalYears <= 20)) errs.push(`${w}: intervalYears out of range`);
        src(it.source, w, errs); maint++;
      }
      if (f.launchPrice) { if (!(f.launchPrice.ils > 20000 && f.launchPrice.ils < 3000000)) errs.push(`${where}: launchPrice.ils`); src(f.launchPrice.source, `${where} launchPrice`, errs); price++; }
    }
  }
  const allGens = mk.models.reduce((a, m) => a + m.gens.length, 0);
  console.log(`${errs.length ? "✗" : "✓"} ${id}: ${gens}/${allGens} generations, ${withIssues} with issues (${issues} issues), ${eng} engines, ${ncap} NCAP, ${price} launch prices, ${maint} maintenance items`);
  errs.slice(0, 20).forEach((e) => console.log("   - " + e)); total += errs.length;
}
process.exit(total ? 1 : 0);
