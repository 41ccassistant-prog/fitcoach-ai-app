"use client";

import type { LevelInfo, Milestone } from "../lib/types";
import { MILESTONES, getNextLevelTitle } from "../lib/gamification";

interface Props {
  messageCount: number;
  levelInfo: LevelInfo;
  unlockedMilestones: Milestone[];
  hydrated: boolean;
}

export default function GamificationPanel({
  messageCount,
  levelInfo,
  unlockedMilestones,
  hydrated,
}: Props) {
  const progressPct = Math.min(
    (levelInfo.progressInLevel / levelInfo.tierSize) * 100,
    100
  );
  const isMaxLevel = levelInfo.messagesUntilNext === null;
  const nextTitle = isMaxLevel ? null : getNextLevelTitle(levelInfo.level);

  if (!hydrated) {
    return (
      <div className="h-full flex items-center justify-center">
        <span className="text-white/20 text-xs uppercase tracking-widest">Loading...</span>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-0 divide-y divide-white/8">
      {/* Level Badge */}
      <div className="px-4 py-4 flex flex-col gap-1">
        <span className="text-white/30 text-[10px] uppercase tracking-widest font-medium">
          Current Level
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-accent font-black text-2xl tracking-widest uppercase leading-none">
            {levelInfo.title}
          </span>
          <span className="text-white/25 text-xs font-mono">
            LV.{levelInfo.level}
          </span>
        </div>
        {isMaxLevel ? (
          <span className="text-accent/60 text-[10px] uppercase tracking-widest font-bold mt-0.5">
            Max Level — Elite Status
          </span>
        ) : (
          <span className="text-white/25 text-[10px] mt-0.5">
            Next: {nextTitle}
          </span>
        )}
      </div>

      {/* XP Bar */}
      <div className="px-4 py-3">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-white/30 text-[10px] uppercase tracking-widest">
            Progress
          </span>
          <span className="text-white/35 text-[10px] font-mono">
            {levelInfo.progressInLevel} / {levelInfo.tierSize}
          </span>
        </div>
        <div className="w-full h-1 bg-white/8 overflow-hidden">
          <div
            className="h-full bg-accent transition-all duration-700 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {!isMaxLevel && (
          <p className="text-white/20 text-[10px] mt-1.5">
            {levelInfo.messagesUntilNext} msg{levelInfo.messagesUntilNext !== 1 ? "s" : ""} to unlock{" "}
            <span className="text-accent/60">{nextTitle}</span>
          </p>
        )}
      </div>

      {/* Message Count */}
      <div className="px-4 py-3 flex items-center justify-between">
        <span className="text-white/30 text-[10px] uppercase tracking-widest">
          Total Messages
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-foreground text-lg font-black font-mono leading-none">
            {messageCount}
          </span>
          <span className="text-white/25 text-[10px]">sent</span>
        </div>
      </div>

      {/* Milestones */}
      <div className="px-4 py-3 flex-1">
        <span className="text-white/30 text-[10px] uppercase tracking-widest block mb-2.5">
          Achievements
        </span>
        <div className="grid grid-cols-5 gap-1.5">
          {MILESTONES.map((milestone) => {
            const unlocked = unlockedMilestones.some((m) => m.id === milestone.id);
            return (
              <div
                key={milestone.id}
                title={unlocked ? milestone.label : `Unlock at ${milestone.threshold} messages`}
                className={`
                  flex flex-col items-center gap-1 py-2 px-1
                  border transition-colors duration-300
                  ${unlocked
                    ? "border-accent/25 bg-accent/5"
                    : "border-white/6 opacity-25"
                  }
                `}
              >
                <span className={`text-lg ${!unlocked && "grayscale opacity-40"}`}>
                  {milestone.icon}
                </span>
                <span
                  className={`text-[9px] text-center leading-tight ${
                    unlocked ? "text-white/40" : "text-white/15"
                  }`}
                >
                  {unlocked ? milestone.label : "???"}
                </span>
              </div>
            );
          })}
        </div>
        {unlockedMilestones.length === 0 && (
          <p className="text-white/15 text-[10px] mt-2">
            Send your first message to start earning achievements.
          </p>
        )}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-3">
        <p className="text-white/12 text-[10px] leading-relaxed">
          Progress is saved locally. Keep the streak alive.
        </p>
      </div>
    </div>
  );
}
