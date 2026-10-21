// Regenerates data-facts/_manifest.json from src/data/generations.ts and prints coverage per make.
// Run: npx tsx scripts/facts-manifest.ts   (the facts agents use the manifest as their exact key list)
import fs from "node:fs";
import path from "node:path";
import { MAKES } from "../src/data/generations";

const root = path.resolve(import.meta.dirname, "..");
const out = MAKES.map((mk) => ({ make: mk.id, name: mk.name, models: mk.models.map((m) => ({ id: m.id, model: m.model, he: m.he, status: m.status, price: m.price,
  gens: m.gens.map((g) => ({ code: g.code, from: g.from, to: g.to, engines: g.engines, pt: g.pt, cons: g.cons, ncap: g.ncap, checks: g.checks.length })) })) }));
fs.writeFileSync(path.join(root, "data-facts/_manifest.json"), JSON.stringify(out, null, 1));

// Coverage: a generation counts as "done" when it has ≥1 sourced issue AND ≥1 engine with real-world consumption.
let all = 0, done = 0;
const rows = out.map((mk) => {
  const file = path.join(root, `data-facts/${mk.make}.json`);
  const facts = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")).models ?? {} : {};
  let n = 0, d = 0;
  for (const m of mk.models) for (const g of m.gens) { n++; const f = facts[m.id]?.[g.code]; if (f?.issues?.length && f?.engines?.length) d++; }
  all += n; done += d;
  return { make: mk.make, done: d, total: n };
}).sort((a, b) => a.done / a.total - b.done / b.total);
for (const r of rows) console.log(`${r.make.padEnd(12)} ${r.done}/${r.total}`);
console.log(`TOTAL ${done}/${all} generations complete (${Math.round((done / all) * 100)}%)`);
