import type { GamificationState, LevelInfo, Milestone } from "./types";

export const LEVELS = [
  { level: 1, title: "Rookie",   min: 0,  max: 5  },
  { level: 2, title: "Active",   min: 5,  max: 10 },
  { level: 3, title: "Athlete",  min: 10, max: 15 },
  { level: 4, title: "Champion", min: 15, max: 20 },
  { level: 5, title: "Elite",    min: 20, max: Infinity },
] as const;

export const MILESTONES: Milestone[] = [
  { id: "first",   label: "First Rep",   threshold: 1,  icon: "💪" },
  { id: "five",    label: "Warm Up",     threshold: 5,  icon: "🔥" },
  { id: "ten",     label: "In The Zone", threshold: 10, icon: "⚡" },
  { id: "fifteen", label: "No Days Off", threshold: 15, icon: "🏆" },
  { id: "twenty",  label: "Elite Mode",  threshold: 20, icon: "🌟" },
];

export const STORAGE_KEY = "fitness-coach-progress";

export function getLevelInfo(messageCount: number): LevelInfo {
  const found = LEVELS.find(
    (l) => messageCount >= l.min && messageCount < l.max
  );
  const levelDef = found ?? LEVELS[LEVELS.length - 1];

  const isMax = levelDef.max === Infinity;
  const tierSize = isMax ? 5 : levelDef.max - levelDef.min;
  const progressInLevel = Math.min(messageCount - levelDef.min, tierSize);
  const messagesUntilNext = isMax ? null : levelDef.max - messageCount;

  return {
    level: levelDef.level,
    title: levelDef.title,
    minMessages: levelDef.min,
    maxMessages: isMax ? levelDef.min + 5 : levelDef.max,
    progressInLevel,
    tierSize,
    messagesUntilNext,
  };
}

export function getUnlockedMilestones(messageCount: number): Milestone[] {
  return MILESTONES.filter((m) => messageCount >= m.threshold);
}

export function didLevelUp(prevCount: number, nextCount: number): boolean {
  const prev = LEVELS.find((l) => prevCount >= l.min && prevCount < l.max);
  const next = LEVELS.find((l) => nextCount >= l.min && nextCount < l.max);
  return prev?.level !== next?.level;
}

export function getNextLevelTitle(currentLevel: number): string {
  const next = LEVELS.find((l) => l.level === currentLevel + 1);
  return next?.title ?? "Elite";
}

export function loadProgress(): GamificationState {
  if (typeof window === "undefined") {
    return { messageCount: 0, sessionId: "" };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("empty");
    const parsed = JSON.parse(raw) as GamificationState;
    if (typeof parsed.messageCount !== "number" || !parsed.sessionId) {
      throw new Error("invalid");
    }
    return parsed;
  } catch {
    const fresh: GamificationState = {
      messageCount: 0,
      sessionId: crypto.randomUUID(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }
}

export function saveProgress(state: GamificationState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
