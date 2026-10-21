# data-facts — sourced per-generation facts (one JSON file per make)

Each file `data-facts/<makeId>.json` adds sourced facts to the generations in `src/data/generations.ts`.
Keys MUST match `_manifest.json` (make id → model id → generation `code`). Never invent a model or generation.

```jsonc
{
  "make": "toyota",
  "updated": "2026-10-21",
  "models": {
    "corolla": {                       // model id from _manifest.json
      "E210": {                        // generation code from _manifest.json
        "issues": [                    // 3–5 per generation where sources exist; fewer is fine, never pad
          {
            "he": "משאבת מים עלולה לדלוף אחרי 80–120 אלף ק״מ — לבדוק סימני נוזל קירור",  // Hebrew, concrete, what to check
            "level": "recall",         // recall = official recall | manufacturer = service bulletin / admitted by maker | widely_reported = many owner / reviewer reports
            "scope": "1.2 טורבו, 2019–2021",   // optional: which engines / years
            "source": { "title": "NHTSA recall 21V-123", "url": "https://..." }
          }
        ],
        "engines": [                   // the engines sold in Israel for this generation
          { "name": "1.8 היברידי", "pt": "hybrid", "hp": 122, "cons": 4.9, "unit": "L",   // unit: "L" (L/100km) or "kWh" (kWh/100km)
            "source": { "title": "Spritmonitor — Corolla 1.8 Hybrid (E21)", "url": "https://..." } }
        ],
        "ncap": { "stars": 5, "year": 2019, "url": "https://www.euroncap.com/en/results/toyota/corolla/..." },  // or { "stars": null, "note": "not tested" }
        "launchPrice": { "ils": 129900, "year": 2019, "note": "רמת גימור בסיסית", "source": { "title": "...", "url": "https://..." } }  // or null
      }
    }
  }
}
```

Rules
- Every issue, engine consumption, NCAP result and launch price needs a real source URL you actually saw. No source → leave it out.
- Consumption = REAL-WORLD average (Spritmonitor, Fuelly, ev-database.org real range, long-term tests), not the brochure figure.
- Issues are shown on the site as "דווח בהרחבה" (widely reported) / "קריאת שירות" (recall) / "מוכר ע״י היצרן" — never as a diagnosis.
- Hebrew text: short, practical, tells the buyer what to check. No brand bashing, no guesses.
- Validate: `node data-facts/validate.mjs <makeId>`
