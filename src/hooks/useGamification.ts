"use client";

import { useState, useEffect, useCallback } from "react";
import {
  loadProgress,
  saveProgress,
  getLevelInfo,
  getUnlockedMilestones,
  didLevelUp,
} from "../lib/gamification";
import type { GamificationState, LevelInfo, Milestone } from "../lib/types";

interface UseGamificationReturn {
  messageCount: number;
  sessionId: string;
  levelInfo: LevelInfo;
  unlockedMilestones: Milestone[];
  showLevelUp: boolean;
  levelUpTitle: string;
  hydrated: boolean;
  incrementMessage: () => void;
  dismissLevelUp: () => void;
}

export function useGamification(): UseGamificationReturn {
  const [state, setState] = useState<GamificationState>({
    messageCount: 0,
    sessionId: "",
  });
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [levelUpTitle, setLevelUpTitle] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadProgress();
    setState(loaded);
    setHydrated(true);
  }, []);

  const incrementMessage = useCallback(() => {
    setState((prev) => {
      const nextCount = prev.messageCount + 1;
      const leveled = didLevelUp(prev.messageCount, nextCount);
      const nextState: GamificationState = { ...prev, messageCount: nextCount };
      saveProgress(nextState);

      if (leveled) {
        const info = getLevelInfo(nextCount);
        setTimeout(() => {
          setLevelUpTitle(info.title);
          setShowLevelUp(true);
        }, 400);
      }

      return nextState;
    });
  }, []);

  const dismissLevelUp = useCallback(() => {
    setShowLevelUp(false);
  }, []);

  return {
    messageCount: state.messageCount,
    sessionId: state.sessionId,
    levelInfo: getLevelInfo(state.messageCount),
    unlockedMilestones: getUnlockedMilestones(state.messageCount),
    showLevelUp,
    levelUpTitle,
    hydrated,
    incrementMessage,
    dismissLevelUp,
  };
}
