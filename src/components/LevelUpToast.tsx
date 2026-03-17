"use client";

import { useEffect } from "react";

interface Props {
  show: boolean;
  levelTitle: string;
  onDismiss: () => void;
}

export default function LevelUpToast({ show, levelTitle, onDismiss }: Props) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timer);
  }, [show, onDismiss]);

  if (!show) return null;

  return (
    <div
      role="alert"
      onClick={onDismiss}
      className="
        fixed bottom-6 right-5 z-50 cursor-pointer
        toast-enter
        border border-accent bg-background
        px-5 py-4 min-w-[180px]
        shadow-[0_0_24px_rgba(132,204,22,0.18)]
      "
    >
      {/* Accent top bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent" />

      <div className="space-y-1">
        <span className="text-accent text-[10px] uppercase tracking-[0.2em] font-bold block">
          Level Up
        </span>
        <span className="text-foreground text-xl font-black uppercase tracking-widest block leading-none">
          {levelTitle}
        </span>
        <span className="text-white/30 text-[10px] block">
          Keep pushing.
        </span>
      </div>

      {/* Dismiss hint */}
      <span className="absolute bottom-2 right-3 text-white/15 text-[9px]">
        tap to close
      </span>
    </div>
  );
}
