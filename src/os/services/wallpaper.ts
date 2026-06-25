import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WallpaperId =
  | "aurora"
  | "constellation"
  | "meridian"
  | "dune"
  | "glass"
  | "paper";

export type Wallpaper = {
  id: WallpaperId;
  name: string;
  description: string;
  palette: [string, string, string];
};

export const WALLPAPERS: Wallpaper[] = [
  { id: "aurora",        name: "Aurora",        description: "Drifting iris light",        palette: ["#0B0D12", "#1A2244", "#A8B4FF"] },
  { id: "constellation", name: "Constellation", description: "Quiet stars and a comet",    palette: ["#070912", "#0F1228", "#E8E6E1"] },
  { id: "meridian",      name: "Meridian",      description: "Minimal gradient horizon",   palette: ["#0E1118", "#2E2A3F", "#E8B57A"] },
  { id: "dune",          name: "Dune",          description: "Procedural sunset dunes",    palette: ["#1A0F0A", "#5A2C1F", "#E89BAE"] },
  { id: "glass",         name: "Glass",         description: "Frosted iridescent shapes",  palette: ["#0B0D12", "#1C2030", "#8EE3B0"] },
  { id: "paper",         name: "Paper",         description: "Light cream — for day",      palette: ["#F2EFE8", "#E5DFD2", "#2A2520"] },
];

type WallpaperState = {
  wallpaperId: WallpaperId;
  setWallpaper: (id: WallpaperId) => void;
};

export const useWallpaper = create<WallpaperState>()(
  persist(
    (set) => ({
      wallpaperId: "aurora",
      setWallpaper: (wallpaperId) => set({ wallpaperId }),
    }),
    {
      name: "divyos:wallpaper:v2",
      migrate: () => ({ wallpaperId: "aurora" as WallpaperId, setWallpaper: () => {} }),
    },
  ),
);

export function wallpaperLabel(id: WallpaperId) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}
