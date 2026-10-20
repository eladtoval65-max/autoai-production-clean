import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLang } from "../../../../shared/i18n";
import { btnPrimary, card } from "../../../../shared/styles";
import { useAdvisorChat, type ChatMessage } from "../../hooks/useAdvisorChat";
import { ChatBubble } from "./ChatBubble";

/** "Have a question?" section: AI advisor chat with suggested questions. */
export function Advisor() {
  const { t, dir } = useLang();
  const { messages, loading, send } = useAdvisorChat();
  const [question, setQuestion] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  // Keep the newest message in view.
  useEffect(() => { const el = listRef.current; if (el && messages.length) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" }); }, [messages, loading]);

  const ask = (text: string) => { setQuestion(""); void send(text); };
  const all: ChatMessage[] = [{ from: "ai", text: t.chatHello, time: "" }, ...messages];

  return (
    <section id="advisor" className="mx-auto grid max-w-[1280px] scroll-mt-20 gap-10 px-4 py-16 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:py-24">
      <div>
        <h2 className="max-w-[14ch] text-[clamp(1.8rem,3.6vw,2.8rem)] leading-[1.1]">{t.chatTitle}</h2>
        <p className="mt-3 max-w-[46ch] text-[17px] text-muted">{t.chatSub}</p>
      </div>
      <div className={`${card} flex min-w-0 flex-col overflow-hidden`}>
        <div ref={listRef} className="flex max-h-[440px] min-h-[280px] flex-col gap-3 overflow-y-auto bg-mist/60 p-4 sm:p-6" aria-live="polite">
          {all.map((m, i) => <ChatBubble key={i} message={m} />)}
          {loading && <div className="flex justify-end"><div className="rounded-2xl border border-line bg-white px-4 py-2.5 text-[15px] text-muted">{t.chatTyping}</div></div>}
        </div>
        <div className="flex flex-wrap gap-2 border-t border-line px-4 pt-4 sm:px-6">
          {t.chatChips.map((c) => (
            <button key={c} onClick={() => ask(c)} disabled={loading} className="min-h-10 rounded-full border border-line bg-white px-3.5 text-[14px] font-semibold hover:border-go hover:text-go-deep disabled:opacity-50">{c}</button>
          ))}
        </div>
        <form className="flex gap-2 p-4 sm:p-6" onSubmit={(e) => { e.preventDefault(); ask(question); }}>
          <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder={t.chatPlaceholder} disabled={loading} aria-label={t.chatPlaceholder}
            className="min-h-12 min-w-0 flex-1 rounded-full border border-line bg-white px-5 text-[16px] outline-none placeholder:text-muted focus:border-go disabled:opacity-60" />
          <button type="submit" disabled={loading || !question.trim()} aria-label={t.chatSend} className={`${btnPrimary} min-h-12 disabled:opacity-40`}>
            <Send className={`h-4 w-4 ${dir === "rtl" ? "-scale-x-100" : ""}`} aria-hidden /><span className="hidden sm:inline">{t.chatSend}</span>
          </button>
        </form>
      </div>
    </section>
  );
}
