import type { ChatMessage } from "../../hooks/useAdvisorChat";

/** One chat bubble: user messages in green on one side, assistant replies in white on the other. */
export function ChatBubble({ message }: { message: ChatMessage }) {
  const mine = message.from === "user";
  return (
    <div className={`flex ${mine ? "justify-start" : "justify-end"}`}>
      <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-[16px] leading-7 ${mine ? "rounded-ss-md bg-go text-white" : "rounded-se-md border border-line bg-white"}`}>
        {message.text}
        {message.time && <div className={`mt-0.5 text-[12px] ${mine ? "text-[#d4efe4]" : "text-muted"}`}>{message.time}</div>}
      </div>
    </div>
  );
}
