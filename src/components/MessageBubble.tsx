"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Message } from "../lib/types";

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-6 h-6 bg-accent/10 border border-accent/20 flex items-center justify-center mr-2 mt-0.5">
          <span className="text-accent text-xs font-bold">C</span>
        </div>
      )}
      <div
        className={`
          max-w-[78%] text-sm leading-relaxed
          ${isUser
            ? "bg-accent text-black px-3 py-2.5 font-medium"
            : "bg-card border border-white/10 px-3 py-2.5 text-foreground"
          }
        `}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose-fitness">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="text-accent font-bold text-base mb-2 mt-3 first:mt-0 uppercase tracking-wide">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-accent font-bold text-sm mb-1.5 mt-3 first:mt-0 uppercase tracking-wide">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-foreground font-semibold text-sm mb-1 mt-2 first:mt-0">
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="mb-1.5 last:mb-0 text-white/85 leading-relaxed">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="mb-1.5 space-y-0.5 pl-1">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="mb-1.5 space-y-0.5 pl-1 list-decimal list-inside">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="text-white/80 flex gap-2">
                    <span className="text-accent mt-0.5 flex-shrink-0">·</span>
                    <span>{children}</span>
                  </li>
                ),
                strong: ({ children }) => (
                  <strong className="text-foreground font-semibold">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="text-white/60 not-italic">{children}</em>
                ),
                code: ({ children }) => (
                  <code className="bg-black/40 border border-white/10 px-1 py-0.5 text-accent text-xs font-mono">
                    {children}
                  </code>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-accent/40 pl-3 text-white/50 my-2">
                    {children}
                  </blockquote>
                ),
                hr: () => <hr className="border-white/10 my-2" />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
