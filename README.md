# AutoAI — פריסה עצמאית

AutoAI הוא אתר ייעוץ רכב בעברית וב־RTL. הפרויקט כולל frontend ב־React, backend ב־Express + tRPC, אימות משתמשים ו־MySQL/TiDB דרך Drizzle.

## פריסה ב־Vercel

1. העלה את כל תיקיית הפרויקט ל־repository פרטי בחשבון GitHub שלך.
2. ב־Vercel בחר **Add New → Project**, ייבא את ה־repository והשאר את `pnpm build` כפקודת build ואת `dist/public` כתיקיית output.
3. הוסף ב־Vercel את משתני הסביבה הבאים לכל הסביבות הנדרשות:
   - `DATABASE_URL` — כתובת מסד הנתונים שלך.
   - `JWT_SECRET` — סוד אקראי ארוך לניהול session.
   - `VITE_APP_ID` — מזהה אפליקציית OAuth.
   - `OAUTH_SERVER_URL` — כתובת שרת OAuth.
   - `VITE_OAUTH_PORTAL_URL` — כתובת פורטל ההתחברות.
   - `ANTHROPIC_API_KEY` — מפתח ה־AI, אם מפעילים את היועץ.
4. בצע Deploy ובדוק את `/api/trpc/catalog.list` ואת דף הבית.
5. חבר דומיין אישי דרך **Settings → Domains**.

## מסד נתונים

הסכמה נמצאת ב־`drizzle/schema.ts`. היא כוללת משתמשים, יצרנים, דגמים, גרסאות, מקורות, עובדות רכב, חיפושים ורכבים שמורים. ה־migration הראשון נמצא תחת `drizzle/`.

אין להכניס מפתחות סודיים ל־GitHub. משתני סביבה נשמרים ב־Vercel בלבד.

## בדיקות מקומיות

```bash
pnpm install
pnpm check
pnpm build
pnpm test
```

## מודל עסקי

המערכת מוכנה להרחבה ללידים עבור סוכנויות רכב, מימון, ביטוח וטרייד־אין. לפני פרסום נתוני שוק, יש לחבר מקורות מורשים ולשמור לכל נתון מקור ותאריך עדכון.
