# AutoAI — חבילת מסירה לבדיקה

תאריך חבילה: 2026-10-04

## מה יש בפרויקט

AutoAI הוא אתר ייעוץ למציאת רכב בעברית וב־RTL, עם שפה עיצובית כהה ופרימיום.

- Hero editorial בסגנון automotive-tech
- שאלון התאמה רב-שלבי
- תמיכה במצב Quick ובמצב Advanced
- בחירת תקציב, שימוש, סדרי עדיפויות, סוג הנעה וצרכים משפחתיים
- מנוע התאמה מקומי ודירוג רכבים
- מסך Recommendations עם סינון ומיון
- שמירת רכבים והשוואה בין רכבים
- מסך Vehicle Details
- מסך Analysis עם מדדי אמינות, בטיחות, חסכון ועלות בעלות
- כלי עלות חודשית, checklist לבדיקה, מאמן משא ומתן ו־Trade-in
- צ׳אט AI דרך `/api/chat`
- מסד נתונים MySQL/TiDB באמצעות Drizzle
- API מסוג tRPC
- אימות Manus OAuth בתשתית Full-Stack
- 7 תמונות רכב אחידות ומותאמות לדגמים
- בדיקות Vitest
- תצורת Vercel

## מבנה חשוב

```text
client/src/pages/Home.tsx  — הממשק המרכזי וכל מסכי המוצר
client/src/index.css       — מערכת העיצוב והטיפוגרפיה
client/public/assets/      — תמונות Hero, תמונות אווירה ותמונות הרכבים
server/routers.ts           — API tRPC
server/db.ts               — שאילתות למסד הנתונים
drizzle/schema.ts          — סכמת מסד הנתונים
drizzle/*.sql              — migrations
api/chat.ts                — פונקציית צ׳אט AI עבור Vercel
api/index.ts               — entrypoint serverless
vercel.json                — הגדרות Vercel
package.json               — פקודות ותלויות
```

## הפעלה מקומית

דרישות: Node.js 20+, pnpm 10+

```bash
pnpm install
pnpm check
pnpm build
pnpm test
pnpm dev
```

## משתני סביבה

אין בחבילה קובץ `.env` ואין בה מפתחות סודיים. יש להגדיר בסביבה המתאימה:

```text
DATABASE_URL=...
ANTHROPIC_API_KEY=...
JWT_SECRET=...
VITE_APP_ID=...
OAUTH_SERVER_URL=...
VITE_OAUTH_PORTAL_URL=...
OWNER_OPEN_ID=...
OWNER_NAME=...
BUILT_IN_FORGE_API_URL=...
BUILT_IN_FORGE_API_KEY=...
VITE_FRONTEND_FORGE_API_URL=...
VITE_FRONTEND_FORGE_API_KEY=...
```

לא מחזירים מפתחות API ל־GitHub ולא מכניסים אותם לקוד.

## פריסה ב־Vercel

1. פותחים Repository חדש ב־GitHub.
2. מעלים את **תוכן** התיקייה כך ש־`package.json`, `client/`, `server/`, `drizzle/`, `api/` ו־`vercel.json` נמצאים בשורש. אסור לקבל מבנה כמו `autoai/autoai/api`.
3. ב־Vercel בוחרים **Add New → Project** ומייבאים את ה־Repository.
4. משאירים את Framework על **Vite** ומגדירים Build Command ל־`pnpm build`; Output Directory צריך להיות `dist/public`.
5. מוסיפים את משתני הסביבה ב־**Project Settings → Environment Variables** עבור Production, Preview ו־Development לפי הצורך.
6. מבצעים **Redeploy** לאחר שמירת המשתנים.
7. בודקים את `https://DOMAIN/api/chat` באמצעות הצ׳אט באתר. את `api/chat.ts` אסור להעביר לתוך `api/api/`.

### נתיבי API חשובים

- `api/chat.ts` הוא פונקציית AI נפרדת ונגישה ב־`/api/chat`.
- `api/index.ts` מטפל ב־tRPC וב־OAuth.
- `vercel.json` מנתב רק את `/api/trpc/*` ואת `/api/oauth/*` ל־`api/index.ts`, כדי לא לשבור את הצ׳אט.

## הערות חשובות לבדיקה

- התמונות החדשות הן JPEG באיכות גבוהה, 1600×1067, ומותאמות לשימוש בכרטיסי רכבים.
- נתוני ביטוח, מחירים ועלויות הם אומדנים למוצר הדגמה ויש לאמת אותם לפני שימוש מסחרי.
- יש להשלים בהמשך מקור נתונים רשמי/מסחרי לדגמים, רמות גימור, מחירי שוק וביטוח בישראל.
- קובץ `api/chat.ts` דורש `ANTHROPIC_API_KEY` כדי להחזיר תשובות AI אמיתיות.
