import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WallpaperId =
  | "aurora"
  | "glass"
  | "constellation"
  | "meridian"
  | "dune"
  | "paper";

export type Wallpaper = {
  id: WallpaperId;
  name: string;
  description: string;
  palette: [string, string, string];
};

export const WALLPAPERS: Wallpaper[] = [
  { id: "aurora",        name: "Aurora",        description: "Fluid neon lights",       palette: ["#0B0D14", "#2E2A3F", "#A8B4FF"] },
  { id: "glass",         name: "Liquid Glass",  description: "Frosted ambient spheres", palette: ["#0B0D14", "#1E293B", "#14B8A6"] },
  { id: "constellation", name: "Deep Space",    description: "Starfield and comets",    palette: ["#06080F", "#0E1228", "#E8E6E1"] },
  { id: "meridian",      name: "Meridian",      description: "Synthetic sunset",        palette: ["#1A1726", "#0E1118", "#E8B57A"] },
  { id: "dune",          name: "Dune",          description: "Martian desert",          palette: ["#5A2C1F", "#1A0A06", "#C45A3F"] },
  { id: "paper",         name: "Paper",         description: "Textured parchment",      palette: ["#F2EFE8", "#E5DFD2", "#D6CFC0"] },
];

type WallpaperState = {
  wallpaperId: WallpaperId;
  setWallpaper: (id: WallpaperId) => void;
};

export const useWallpaper = create<WallpaperState>()(
  persist(
    (set) => ({
      wallpaperId: "glass",
      setWallpaper: (wallpaperId) => set({ wallpaperId }),
    }),
    {
      name: "divyos:wallpaper:v4",
      migrate: () => ({ wallpaperId: "glass" as WallpaperId, setWallpaper: () => {} }),
    },
  ),
);

export function wallpaperLabel(id: WallpaperId) {
  return id.charAt(0).toUpperCase() + id.slice(1);
}
