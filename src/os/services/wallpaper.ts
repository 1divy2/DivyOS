import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WallpaperId =
  | "teal"
  | "crimson"
  | "obsidian"
  | "matrix"
  | "amber"
  | "navy";

export type Wallpaper = {
  id: WallpaperId;
  name: string;
  description: string;
  palette: [string, string, string];
};

export const WALLPAPERS: Wallpaper[] = [
  { id: "teal",     name: "Deep Teal",     description: "Classic retro desktop",   palette: ["#004b4b", "#004b4b", "#004b4b"] },
  { id: "crimson",  name: "Crimson",       description: "Dark red operation",      palette: ["#4b0000", "#4b0000", "#4b0000"] },
  { id: "obsidian", name: "Obsidian",      description: "Pitch black terminal",    palette: ["#0a0a0a", "#0a0a0a", "#0a0a0a"] },
  { id: "matrix",   name: "Matrix",        description: "Hacker green grid",       palette: ["#001a00", "#001a00", "#001a00"] },
  { id: "amber",    name: "Amber",         description: "Vintage phosphor glow",   palette: ["#2b1a00", "#2b1a00", "#2b1a00"] },
  { id: "navy",     name: "Midnight",      description: "Deep blue sea",           palette: ["#001133", "#001133", "#001133"] },
];

type WallpaperState = {
  wallpaperId: WallpaperId;
  setWallpaper: (id: WallpaperId) => void;
};

export const useWallpaper = create<WallpaperState>()(
  persist(
    (set) => ({
      wallpaperId: "teal",
      setWallpaper: (wallpaperId) => set({ wallpaperId }),
    }),
    {
      name: "divyos:wallpaper:v3",
      migrate: () => ({ wallpaperId: "teal" as WallpaperId, setWallpaper: () => {} }),
    },
  ),
);

export function wallpaperLabel(id: WallpaperId) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}
