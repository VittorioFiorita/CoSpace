"use client";

import { useState, useRef, useEffect } from "react";
import { useRequireAuth } from "@/lib/useRequireAuth";
import { sendChatMessage } from "@/lib/api";
import ReactMarkdown from "react-markdown"

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function AssistantPage() {
  const { token, ready } = useRequireAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Ciao! Sono l'assistente di CoSpace. Posso rispondere a domande su orari e regole, o aiutarti a prenotare uno spazio. Come posso aiutarti?" },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  if (!ready) {
    return (
      <div className="p-9 text-text">Caricamento…</div>
    );
  }

  return (
      <div className="flex-1 flex flex-col p-9 max-w-2xl">
        <div className="font-heading text-2xl font-bold text-text mb-1">Assistente</div>
        <div className="text-sm text-text-secondary mb-6">
          Chiedi informazioni sul coworking o prenota uno spazio.
        </div>

        <div
          className="flex-1 bg-bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 overflow-y-auto mb-4"
          style={{ minHeight: 400, maxHeight: 500 }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
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

        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Scrivi un messaggio…"
            className="flex-1 rounded-lg border border-border bg-bg-card px-3 py-2 text-text"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="rounded-lg bg-accent text-white px-5 py-2 text-sm font-semibold disabled:opacity-60"
          >
            Invia
          </button>
        </form>
      </div>
  );
}