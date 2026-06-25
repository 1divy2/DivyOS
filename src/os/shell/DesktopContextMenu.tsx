import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import type { ReactNode } from "react";
import { useOS } from "../store";
import { useWallpaper, WALLPAPERS } from "../services/wallpaper";
import { useSession } from "../services/session";
import { useSettings, type ThemeName } from "../settings";
import { useNotifications } from "../services/notifications";
import { apps } from "../registry";

export function DesktopContextMenu({ children }: { children: ReactNode }) {
  const openApp = useOS((s) => s.open);
  const setWallpaper = useWallpaper((s) => s.setWallpaper);
  const currentWP = useWallpaper((s) => s.wallpaperId);
  const setTheme = useSettings((s) => s.setTheme);
  const theme = useSettings((s) => s.theme);
  const lock = useSession((s) => s.lock);
  const shutdown = useSession((s) => s.shutdown);
  const restart = useSession((s) => s.restart);
  const toggleCenter = useNotifications((s) => s.toggleCenter);

  const themes: ThemeName[] = ["cortex", "retro", "minimal", "blueprint"];

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="font-mono text-[12px] min-w-[210px] bg-os-panel border-os-hairline text-os-text">
        <ContextMenuSub>
          <ContextMenuSubTrigger>open app</ContextMenuSubTrigger>
          <ContextMenuSubContent className="bg-os-panel border-os-hairline text-os-text max-h-[300px] overflow-auto">
            {apps.map((a) => (
              <ContextMenuItem
                key={a.id}
                onSelect={() => openApp(a.id, { title: a.name, size: a.defaultSize })}
              >
                <span className="text-os-signal mr-2 w-3 inline-block">{a.glyph}</span>
                {a.name.toLowerCase()}
              </ContextMenuItem>
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSub>
          <ContextMenuSubTrigger>wallpaper</ContextMenuSubTrigger>
          <ContextMenuSubContent className="bg-os-panel border-os-hairline text-os-text">
            {WALLPAPERS.map((w) => (
              <ContextMenuItem key={w.id} onSelect={() => setWallpaper(w.id)}>
                <span className="text-os-signal mr-2 w-3 inline-block">
                  {currentWP === w.id ? "●" : "○"}
                </span>
                {w.name.toLowerCase()}
              </ContextMenuItem>
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSub>
          <ContextMenuSubTrigger>theme</ContextMenuSubTrigger>
          <ContextMenuSubContent className="bg-os-panel border-os-hairline text-os-text">
            {themes.map((t) => (
              <ContextMenuItem key={t} onSelect={() => setTheme(t)}>
                <span className="text-os-signal mr-2 w-3 inline-block">
                  {theme === t ? "●" : "○"}
                </span>
                {t}
              </ContextMenuItem>
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator className="bg-os-hairline" />
        <ContextMenuItem onSelect={() => openApp("terminal")}>new terminal</ContextMenuItem>
        <ContextMenuItem onSelect={() => openApp("notes")}>new note</ContextMenuItem>
        <ContextMenuItem onSelect={() => toggleCenter(true)}>notification center</ContextMenuItem>

        <ContextMenuSeparator className="bg-os-hairline" />
        <ContextMenuItem onSelect={lock}>
          lock <span className="ml-auto text-os-text-faint">⌘L</span>
        </ContextMenuItem>
        <ContextMenuItem onSelect={restart}>restart</ContextMenuItem>
        <ContextMenuItem onSelect={shutdown} className="text-os-error focus:text-os-error">
          shut down
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
