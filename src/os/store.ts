import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WindowState = {
  id: string;
  appId: string;
  title: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
  prev?: { x: number; y: number; w: number; h: number };
  payload?: Record<string, unknown>;
};

type OSState = {
  windows: WindowState[];
  zCounter: number;
  bootDone: boolean;
  launcherOpen: boolean;
  setBootDone: (v: boolean) => void;
  openLauncher: (v?: boolean) => void;
  open: (appId: string, opts?: { title?: string; payload?: Record<string, unknown>; singleton?: boolean; size?: { w: number; h: number } }) => string;
  close: (id: string) => void;
  focus: (id: string) => void;
  move: (id: string, x: number, y: number) => void;
  resize: (id: string, w: number, h: number) => void;
  minimize: (id: string) => void;
  toggleMax: (id: string, viewport: { w: number; h: number }) => void;
  snap: (id: string, side: "l" | "r" | "f" | "c", viewport: { w: number; h: number }) => void;
};

const TOP_BAR = 32;
const DOCK = 56;

export const useOS = create<OSState>()(
  persist(
    (set, get) => ({
      windows: [],
      zCounter: 10,
      bootDone: false,
      launcherOpen: false,
      setBootDone: (v) => set({ bootDone: v }),
      openLauncher: (v) => set((s) => ({ launcherOpen: v ?? !s.launcherOpen })),
      open: (appId, opts = {}) => {
        const { singleton = true, title, payload, size } = opts;
        const state = get();
        if (singleton) {
          const existing = state.windows.find((w) => w.appId === appId && JSON.stringify(w.payload) === JSON.stringify(payload));
          if (existing) {
            get().focus(existing.id);
            if (existing.minimized) set({ windows: state.windows.map((w) => (w.id === existing.id ? { ...w, minimized: false } : w)) });
            return existing.id;
          }
        }
        const id = `${appId}-${Math.random().toString(36).slice(2, 8)}`;
        const w = size?.w ?? 720;
        const h = size?.h ?? 480;
        const vw = typeof window !== "undefined" ? window.innerWidth : 1280;
        const vh = typeof window !== "undefined" ? window.innerHeight : 800;
        const offset = (state.windows.length % 6) * 24;
        const x = Math.max(8, Math.round((vw - w) / 2) + offset);
        const y = Math.max(TOP_BAR + 8, Math.round((vh - h) / 2) - 40 + offset);
        const z = state.zCounter + 1;
        set({
          zCounter: z,
          windows: [...state.windows, { id, appId, title: title ?? appId, x, y, w, h, z, minimized: false, maximized: false, payload }],
        });
        return id;
      },
      close: (id) => set((s) => ({ windows: s.windows.filter((w) => w.id !== id) })),
      focus: (id) => {
        const s = get();
        const z = s.zCounter + 1;
        set({ zCounter: z, windows: s.windows.map((w) => (w.id === id ? { ...w, z } : w)) });
      },
      move: (id, x, y) => set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, x, y } : w)) })),
      resize: (id, w, h) => set((s) => ({ windows: s.windows.map((win) => (win.id === id ? { ...win, w, h } : win)) })),
      minimize: (id) => set((s) => ({ windows: s.windows.map((w) => (w.id === id ? { ...w, minimized: !w.minimized } : w)) })),
      toggleMax: (id, viewport) =>
        set((s) => ({
          windows: s.windows.map((w) => {
            if (w.id !== id) return w;
            if (w.maximized && w.prev) return { ...w, ...w.prev, maximized: false, prev: undefined };
            return { ...w, prev: { x: w.x, y: w.y, w: w.w, h: w.h }, x: 0, y: TOP_BAR, w: viewport.w, h: viewport.h - TOP_BAR - DOCK, maximized: true };
          }),
        })),
      snap: (id, side, viewport) =>
        set((s) => ({
          windows: s.windows.map((w) => {
            if (w.id !== id) return w;
            const innerH = viewport.h - TOP_BAR - DOCK;
            if (side === "l") return { ...w, x: 0, y: TOP_BAR, w: Math.floor(viewport.w / 2), h: innerH };
            if (side === "r") return { ...w, x: Math.ceil(viewport.w / 2), y: TOP_BAR, w: Math.floor(viewport.w / 2), h: innerH };
            if (side === "f") return { ...w, x: 0, y: TOP_BAR, w: viewport.w, h: innerH, maximized: true };
            return { ...w, x: Math.round((viewport.w - w.w) / 2), y: Math.round((viewport.h - w.h) / 2) };
          }),
        })),
    }),
    {
      name: "divyos:windows",
      partialize: (s) => ({ windows: s.windows, zCounter: s.zCounter, bootDone: s.bootDone }),
    },
  ),
);

export const LAYOUT = { TOP_BAR, DOCK };
