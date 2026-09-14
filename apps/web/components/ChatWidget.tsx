"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { sendChatMessage } from "@/lib/api";
import ReactMarkdown from "react-markdown";
import { AssistantIcon } from "@/components/icons";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export function ChatWidget() {
  const { token } = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Ciao! Sono l'assistente di CoSpace. Posso rispondere a domande su orari e regole, o aiutarti a prenotare uno spazio. Come posso aiutarti?" },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !input.trim() || sending) return;

    const userMessage = input.trim();
    setMessages((m) => [...m, { role: "user", content: userMessage }]);
    setInput("");
    setSending(true);

    try {
      const reply = await sendChatMessage(token, userMessage);
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: "Mi dispiace, si è verificato un errore. Riprova." }]);
    } finally {
      setSending(false);
    }
  }

  if (!token) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {open && (
        <div className="mb-3 w-90 h-120 bg-bg-card border border-border rounded-2xl shadow-lg flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <span className="font-heading font-bold text-text">Assistente</span>
            <button
              onClick={() => setOpen(false)}
              className="text-text-secondary text-lg leading-none px-1"
              aria-label="Chiudi"
            >
              ×
            </button>
          </div>

          <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                  m.role === "user"
                    ? "self-end bg-accent text-white whitespace-pre-wrap"
                    : "self-start bg-bg-page text-text"
                }`}
              >
                {m.role === "assistant" ? (
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                ) : (
                  m.content
                )}
              </div>
            ))}
            {sending && (
              <div className="self-start bg-bg-page text-text-secondary rounded-2xl px-4 py-2 text-sm">
                Sto scrivendo…
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSend} className="flex gap-2 p-3 border-t border-border">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Scrivi un messaggio…"
              className="flex-1 rounded-lg border border-border bg-bg-page px-3 py-2 text-sm text-text"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="rounded-lg bg-accent text-white px-4 py-2 text-sm font-semibold disabled:opacity-60"
            >
              Invia
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center shadow-lg"
        aria-label="Apri assistente"
      >
        <AssistantIcon className="w-6 h-6" />
      </button>
    </div>
  );
}