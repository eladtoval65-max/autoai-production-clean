import { Link } from "wouter";

/** Shown when the slug doesn't exist or the owner switched the page off (e.g. campaign ended). */
export function LandingUnavailable() {
  return (
    <main className="mx-auto max-w-[680px] px-4 py-24 text-center sm:px-8">
      <h1 className="text-3xl">הדף הזה לא זמין</h1>
      <p className="mt-3 text-[17px] text-muted">ייתכן שהקמפיין הסתיים. אפשר להשוות רכבים לפי עלות חודשית אמיתית בעמוד הראשי.</p>
      <Link href="/" className="mt-8 inline-flex min-h-12 items-center rounded-full bg-go px-7 text-[17px] font-bold text-white no-underline hover:bg-go-deep">לעמוד הראשי</Link>
    </main>
  );
}
