import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeName = "cortex" | "retro" | "minimal" | "blueprint";

type SettingsState = {
  theme: ThemeName;
  reducedMotion: boolean;
  density: "comfy" | "compact";
  setTheme: (t: ThemeName) => void;
  setReducedMotion: (v: boolean) => void;
  setDensity: (d: "comfy" | "compact") => void;
};

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "cortex",
      reducedMotion: false,
      density: "comfy",
      setTheme: (theme) => set({ theme }),
      setReducedMotion: (reducedMotion) => set({ reducedMotion }),
      setDensity: (density) => set({ density }),
    }),
    { name: "divyos:settings" },
  ),
);
