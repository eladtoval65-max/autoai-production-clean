/**
 * Share the top pick: native share sheet on phones, clipboard elsewhere.
 * Returns "copied" when the text went to the clipboard (so the caller can show a toast).
 */
export async function shareText(title: string, text: string): Promise<"shared" | "copied" | "failed"> {
  try {
    if (navigator.share) { await navigator.share({ title, text }); return "shared"; }
    await navigator.clipboard.writeText(text);
    return "copied";
  } catch {
    return "failed"; // user cancelled the share sheet, or clipboard blocked
  }
}
