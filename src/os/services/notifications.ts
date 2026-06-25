import { create } from "zustand";
import { persist } from "zustand/middleware";
import { playNotifSound } from "./audio";

export type Notification = {
  id: string;
  source: string; // app id or "system"
  title: string;
  body?: string;
  level: "info" | "success" | "warn" | "error";
  createdAt: number;
  read: boolean;
  /** Auto-dismiss timeout in ms; 0 = sticky */
  ttl?: number;
  action?: { label: string; appId?: string; payload?: Record<string, unknown> };
};

type NotifState = {
  items: Notification[];
  centerOpen: boolean;
  push: (n: Omit<Notification, "id" | "createdAt" | "read">) => string;
  dismiss: (id: string) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clearAll: () => void;
  toggleCenter: (v?: boolean) => void;
};

const MAX = 80;

export const useNotifications = create<NotifState>()(
  persist(
    (set, get) => ({
      items: [],
      centerOpen: false,
      push: (n) => {
        const id = `n-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
        const item: Notification = {
          id,
          createdAt: Date.now(),
          read: false,
          ttl: n.level === "error" || n.level === "warn" ? 6000 : 4000,
          ...n,
        };
        const items = [item, ...get().items].slice(0, MAX);
        set({ items });
        
        // Don't play sound for quiet system notifications
        if (n.source !== "system-quiet") {
          playNotifSound();
        }
        
        return id;
      },
      dismiss: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      markRead: (id) =>
        set({ items: get().items.map((i) => (i.id === id ? { ...i, read: true } : i)) }),
      markAllRead: () => set({ items: get().items.map((i) => ({ ...i, read: true })) }),
      clearAll: () => set({ items: [] }),
      toggleCenter: (v) => set((s) => ({ centerOpen: v ?? !s.centerOpen })),
    }),
    {
      name: "divyos:notifications",
      partialize: (s) => ({ items: s.items.slice(0, 30) }),
    },
  ),
);

/** Convenience for non-component code */
export const notify = (n: Omit<Notification, "id" | "createdAt" | "read">) =>
  useNotifications.getState().push(n);
