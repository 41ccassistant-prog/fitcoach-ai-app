"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import MessageBubble from "./MessageBubble";
import type { Message } from "../lib/types";

interface Props {
  sessionId: string;
  onMessageSent: () => void;
}

const SUGGESTED_PROMPTS = [
  "What's a good beginner 3-day workout split?",
  "How much protein do I need to build muscle?",
  "Best warm-up routine before lifting?",
];

export default function ChatInterface({ sessionId, onMessageSent }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = useCallback(
    async (text?: string) => {
      const content = (text ?? input).trim();
      if (!content || isLoading || !sessionId) return;

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsLoading(true);
      onMessageSent();

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chatInput: content, sessionId }),
        });

        const data = await res.json();
        const coachMsg: Message = {
          id: crypto.randomUUID(),
          role: "coach",
          content: data.response ?? data.error ?? "No response received.",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, coachMsg]);
      } catch {
        const errMsg: Message = {
          id: crypto.randomUUID(),
          role: "coach",
          content: "Connection error — please try again.",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errMsg]);
      } finally {
        setIsLoading(false);
        textareaRef.current?.focus();
      }
    },
    [input, isLoading, sessionId, onMessageSent]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex-shrink-0 px-5 py-4 border-b border-white/8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 bg-accent/10 border border-accent/30 flex items-center justify-center">
              <span className="text-accent text-sm font-bold">FC</span>
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent" />
          </div>
          <div>
            <h1 className="text-foreground font-bold text-sm tracking-wider uppercase">
              Fitness Coach
            </h1>
            <p className="text-white/35 text-xs">Evidence-based · Always on</p>
          </div>
        </div>
        {isLoading && (
          <span className="text-accent text-xs uppercase tracking-widest animate-pulse">
            Thinking...
          </span>
        )}
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-5 space-y-3 min-h-0">
        {messages.length === 0 ? (
          <EmptyState onPrompt={(p) => sendMessage(p)} loading={isLoading} />
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && <TypingIndicator />}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 px-4 pb-4 pt-3 border-t border-white/8">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask your coach anything..."
            rows={1}
            disabled={isLoading}
            className="
              flex-1 bg-card border border-white/12 text-foreground
              placeholder:text-white/25 px-3 py-2.5 text-sm
              resize-none focus:outline-none focus:border-accent/60
              transition-colors duration-150 disabled:opacity-50
              leading-relaxed
            "
            style={{ minHeight: "40px", maxHeight: "120px", overflowY: "auto" }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
            className="
              flex-shrink-0 bg-accent text-black font-bold px-4 h-10
              text-xs uppercase tracking-widest
              disabled:opacity-30 disabled:cursor-not-allowed
              hover:bg-lime-400 active:scale-95
              transition-all duration-100
            "
          >
            Send
          </button>
        </div>
        <p className="text-white/18 text-xs mt-2 pl-0.5">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

function EmptyState({
  onPrompt,
  loading,
}: {
  onPrompt: (p: string) => void;
  loading: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-16 px-4 text-center gap-6">
      <div className="w-16 h-16 border border-accent/30 flex items-center justify-center bg-accent/5">
        <span className="text-3xl">🏋️</span>
      </div>
      <div className="space-y-2">
        <h2 className="text-foreground font-bold text-xl tracking-tight">
          Ready to train?
        </h2>
        <p className="text-white/35 text-sm max-w-xs leading-relaxed">
          Ask about workouts, nutrition, recovery, mobility, or form.
          Your coach is evidence-based and always on.
        </p>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-sm">
        {SUGGESTED_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => onPrompt(p)}
            disabled={loading}
            className="
              text-left text-sm text-white/50 px-3 py-2
              border border-white/8 bg-card
              hover:border-accent/40 hover:text-white/80
              transition-colors duration-150 disabled:opacity-30
            "
          >
            <span className="text-accent/50 mr-2">→</span>
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2.5 w-fit bg-card border border-white/10">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-accent/70 animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}
