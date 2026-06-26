import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SessionPhase =
  | "boot"
  | "login"
  | "desktop"
  | "locked"
  | "shutting-down"
  | "restarting"
  | "off";

type SessionState = {
  phase: SessionPhase;
  visitorName: string | null;
  sessionStartedAt: number;
  bootCount: number;

  setPhase: (p: SessionPhase) => void;
  completeBoot: () => void;
  login: (name: string) => void;
  logout: () => void;
  lock: () => void;
  unlock: () => void;
  shutdown: () => void;
  restart: () => void;
  powerOn: () => void;
};

export const useSession = create<SessionState>()(
  persist(
    (set, get) => ({
      phase: "boot",
      visitorName: null,
      sessionStartedAt: Date.now(),
      bootCount: 0,

      setPhase: (phase) => set({ phase }),

      completeBoot: () => {
        const s = get();
        // returning visitor → go straight to desktop, fresh visitor → login
        set({
          phase: s.visitorName ? "desktop" : "login",
          sessionStartedAt: Date.now(),
          bootCount: s.bootCount + 1,
        });
      },

      login: (name) => {
        const clean = name.trim().slice(0, 24) || "guest";
        set({ visitorName: clean, phase: "desktop", sessionStartedAt: Date.now() });
      },

      logout: () => set({ visitorName: null, phase: "login" }),

      lock: () => {
        if (get().phase === "desktop") {
          if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
          }
          set({ phase: "locked" });
        }
      },
      unlock: () => {
        if (get().phase === "locked") set({ phase: "desktop" });
      },

      shutdown: () => set({ phase: "shutting-down" }),
      restart: () => set({ phase: "restarting" }),
      powerOn: () => set({ phase: "boot" }),
    }),
    {
      name: "divyos:session",
      partialize: (s) => ({ visitorName: s.visitorName, bootCount: s.bootCount }),
    },
  ),
);
