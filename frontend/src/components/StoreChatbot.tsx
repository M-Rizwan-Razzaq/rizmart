"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, LoaderCircle, MessageCircle, Send, Sparkles, X } from "lucide-react";
import api from "@/lib/api";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content: "Hi! I can help with RizMart bags, prices, delivery, and store policies. What would you like to know?",
};

const SUGGESTED_QUESTIONS = ["How much is delivery?", "Do you offer cash on delivery?", "Show me travel bags"];

export function StoreChatbot() {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    inputRef.current?.focus();
  }, [open, messages, loading]);

  const ask = async (value: string) => {
    const text = value.trim();
    if (!text || loading) return;

    const history = messages.slice(-8);
    setMessages((current) => [...current, { role: "user", content: text }]);
    setQuestion("");
    setLoading(true);

    try {
      const { data } = await api.post<{ reply: string }>("/chatbot/ask", {
        question: text,
        history: history.map(({ role, content }) => ({ role, content })),
      });
      setMessages((current) => [...current, { role: "assistant", content: data.reply }]);
    } catch (error) {
      const message =
        error instanceof Error && error.message
          ? error.message
          : "I could not answer that just now. Please try again or contact us on WhatsApp.";
      setMessages((current) => [...current, { role: "assistant", content: message }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void ask(question);
  };

  return (
    <div className="fixed bottom-24 right-6 z-[60]">
      {open ? (
        <section
          aria-label="RizMart AI assistant"
          className="fixed inset-x-3 bottom-[5.5rem] flex max-h-[min(72dvh,38rem)] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:inset-x-auto sm:bottom-24 sm:right-6 sm:w-[min(24rem,calc(100vw-3rem))]"
        >
          <header className="flex items-center justify-between gap-3 bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/12 text-gold">
                <Bot className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold text-white">RizMart Assistant</h2>
                <p className="text-[11px] text-white/75">Product and order help</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </header>

          <div className="min-h-40 flex-1 space-y-3 overflow-y-auto bg-secondary/70 p-3 sm:p-4">
            {messages.map((message, index) => (
              <div
                key={`${index}-${message.role}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "rounded-br-md bg-primary text-white"
                      : "rounded-bl-md border border-border bg-card text-foreground shadow-xs"
                  }`}
                >
                  {message.content}
                </p>
              </div>
            ))}

            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTED_QUESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => void ask(suggestion)}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-primary transition hover:border-primary/40 hover:bg-primary/5"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-border bg-card px-3.5 py-2.5 text-xs text-muted-foreground">
                  <LoaderCircle className="h-4 w-4 animate-spin text-gold" />
                  Checking store information…
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form onSubmit={handleSubmit} className="border-t border-border bg-card p-3">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-3 py-1.5 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10">
              <input
                ref={inputRef}
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                maxLength={500}
                placeholder="Ask about a bag or policy…"
                aria-label="Your message"
                className="min-w-0 flex-1 bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
              <button
                type="submit"
                disabled={!question.trim() || loading}
                aria-label="Send message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-muted-foreground">
              Store info only · <a className="text-primary hover:underline" href="https://wa.me/923186592403" target="_blank" rel="noreferrer">WhatsApp support</a>
            </p>
          </form>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open RizMart AI assistant"
          aria-expanded={open}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-lg ring-1 ring-white/20 transition hover:scale-105 hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
        >
          <MessageCircle className="h-6 w-6" />
          <Sparkles className="absolute right-2 top-2 h-3 w-3 text-gold" />
        </button>
      )}
    </div>
  );
}
