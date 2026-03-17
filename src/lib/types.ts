export type Role = "user" | "coach";

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
}

export interface GamificationState {
  messageCount: number;
  sessionId: string;
}

export interface LevelInfo {
  level: number;
  title: string;
  minMessages: number;
  maxMessages: number;
  progressInLevel: number;
  tierSize: number;
  messagesUntilNext: number | null;
}

export interface Milestone {
  id: string;
  label: string;
  threshold: number;
  icon: string;
}
