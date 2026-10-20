import type { ReactNode } from "react";
import { Link } from "wouter";
import { BrandMark } from "./BrandMark";

/** Light page frame (seller tools, comparisons): header with brand and a link to the car browser. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div dir="rtl" lang="he" className="min-h-screen bg-mist text-ink">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-[980px] items-center justify-between gap-3 px-4 py-4 sm:px-8">
          <BrandMark href="/" />
          <Link href="/cars" className="text-[15px] font-semibold text-muted no-underline hover:text-ink">כל הדגמים</Link>
        </div>
      </header>
      <main className="mx-auto max-w-[980px] px-4 py-8 sm:px-8 sm:py-12">{children}</main>
    </div>
  );
}
