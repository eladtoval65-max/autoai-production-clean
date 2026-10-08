# AutoAI — פריסה נקייה ל־Vercel אחרי שגיאות Build

## מה גרם לשגיאות

העלאות קוד דרך ממשק GitHub **מחליפות קבצים באותו נתיב, אבל אינן מוחקות קבצים ישנים** שלא קיימים בחבילת העדכון. לכן נשאר בפרויקט קובץ ישן בשם:

```text
server/_core/vite.ts
```

הקובץ הזה התנגש עם חבילת `vite` בזמן Vercel build.

## מה למחוק ב־GitHub — רק קובץ אחד

בתוך ה־Repository של AutoAI:

1. פתחו `server`.
2. פתחו `_core`.
3. פתחו את הקובץ `vite.ts`.
4. לחצו על `...` ואז **Delete file** / סמל פח.
5. לחצו **Commit changes**.

> **לא למחוק** את `vite.config.ts` שנמצא בשורש ה־Repository. זה קובץ אחר ונדרש לבניית האתר.

## מה להעלות לאחר מכן

חלצו את `autoai-vercel-clean-2026-10-08.zip` והעלו ל־GitHub את **כל התוכן שבתיקייה שחולצה**, כאשר אתם נמצאים בשורש ה־Repository.

ודאו שקיימים:

```text
package.json
vite.config.ts
vercel.json
api/chat.ts
api/index.ts
server/_core/dev-vite.ts
```

ודאו שאינו קיים:

```text
server/_core/vite.ts
```

אם GitHub מבקש להחליף קבצים קיימים, אשרו את ההחלפה. עשו Commit ישירות ל־`main`.

## מה צפוי להופיע ב־Vercel

Vercel יתחיל פריסה חדשה אוטומטית. בתוך Build Logs צריך להופיע:

```text
> vite build
```

ולא צריך להופיע:

```text
esbuild server/_core/index.ts
```

אם מופיע `esbuild server/_core/index.ts`, משמעות הדבר היא ש־`package.json` הישן עדיין נשאר ב־GitHub ולא הוחלף. חזרו לשורש ה־Repository והחליפו את `package.json` מתוך החבילה החדשה.

## אחרי שה־Build הוא Ready

1. פתחו את כתובת ה־Production מה־Deployment החדש.
2. בצעו רענון מלא: `Ctrl + Shift + R`.
3. שאלו בצ׳אט שאלה חדשה.
4. ודאו שב־Vercel קיים משתנה Production פרטי בשם `ANTHROPIC_API_KEY`.

אין צורך לשנות את `DATABASE_URL` או להריץ שוב את SQL/TiDB עבור תיקון build זה.
