"use client";

import ChatInterface from "../components/ChatInterface";
import GamificationPanel from "../components/GamificationPanel";
import LevelUpToast from "../components/LevelUpToast";
import { useGamification } from "../hooks/useGamification";

export default function Home() {
  const {
    messageCount,
    sessionId,
    levelInfo,
    unlockedMilestones,
    showLevelUp,
    levelUpTitle,
    hydrated,
    incrementMessage,
    dismissLevelUp,
  } = useGamification();

  return (
    <main className="flex flex-col md:flex-row h-screen overflow-hidden bg-background">
      {/* Chat panel — full width on mobile, 65% on desktop */}
      <section className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <ChatInterface
          sessionId={sessionId}
          onMessageSent={incrementMessage}
        />
      </section>

      {/* Gamification sidebar — 220px strip on mobile, fixed width on desktop */}
      <aside
        className="
          w-full md:w-80 lg:w-96
          h-[220px] md:h-full
          flex-shrink-0
          border-t md:border-t-0 md:border-l border-white/10
          overflow-y-auto custom-scrollbar
        "
      >
        <GamificationPanel
          messageCount={messageCount}
          levelInfo={levelInfo}
          unlockedMilestones={unlockedMilestones}
          hydrated={hydrated}
        />
      </aside>

      <LevelUpToast
        show={showLevelUp}
        levelTitle={levelUpTitle}
        onDismiss={dismissLevelUp}
      />
    </main>
  );
}
