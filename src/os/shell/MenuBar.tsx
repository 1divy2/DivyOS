import { useEffect, useState } from "react";
import { useOS } from "../store";
import { useSession } from "../services/session";
import { useWallpaper, WALLPAPERS, wallpaperLabel } from "../services/wallpaper";
import * as DM from "@radix-ui/react-dropdown-menu";
import { byId } from "../registry";

function useClock() {
  const [t, setT] = useState<Date | null>(null);
  useEffect(() => {
    setT(new Date());
    const i = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(i);
  }, []);
  return t;
}

export function MenuBar() {
  const windows = useOS((s) => s.windows);
  const openLauncher = useOS((s) => s.openLauncher);
  const open = useOS((s) => s.open);
  const session = useSession();
  const wp = useWallpaper();
  const t = useClock();
  const focused = windows.length ? [...windows].sort((a, b) => b.z - a.z).find(w => !w.minimized) : null;
  const focusedApp = focused ? byId(focused.appId) : null;

  const time = t ? t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false }) : "—";
  const date = t ? t.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }) : "";

  return (
    <div className="absolute top-0 inset-x-0 h-8 z-50 flex items-center px-3 gap-1 text-[13px] bg-[#1C1917] border-b-2 border-black shadow-sm" style={{ fontFamily: "var(--font-mono)" }}>
      {/* Divy menu */}
      <DM.Root>
        <DM.Trigger asChild>
          <button className="px-2 py-1 hover:bg-[#CA8A04] hover:text-[#1C1917] transition flex items-center gap-1.5 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-os-iris shadow-[0_0_6px_var(--os-iris)]" />
            <span className="font-semibold tracking-tight">Divy</span>
          </button>
        </DM.Trigger>
        <DM.Portal>
          <DM.Content sideOffset={0} align="start" className="bg-[#1C1917] border border-black p-1 text-[13px] min-w-[200px] z-[100]" style={{ boxShadow: "var(--shadow-retro-outset)" }}>
            <Item onSelect={() => open("about")}>About DivyOS</Item>
            <Sep />
            <Item onSelect={() => open("settings")}>Settings…</Item>
            <Item onSelect={() => open("monitor")}>System Monitor</Item>
            <Sep />
            <Item onSelect={session.lock}>Lock <Kbd>⌃⌘Q</Kbd></Item>
            <Item onSelect={session.logout}>Log Out…</Item>
            <Sep />
            <Item onSelect={session.restart}>Restart…</Item>
            <Item onSelect={session.shutdown}>Shut Down…</Item>
          </DM.Content>
        </DM.Portal>
      </DM.Root>

      {/* Focused app menu */}
      {focusedApp && (
        <span className="px-2 py-1 text-os-ink-dim">{focusedApp.name}</span>
      )}

      <span className="flex-1" />

      {/* Spotlight */}
      <button
        onClick={() => openLauncher(true)}
        className="px-2.5 py-1 hover:bg-[#CA8A04] hover:text-[#1C1917] transition flex items-center gap-1.5"
        title="Search (⌘K)"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/><line x1="9.5" y1="9.5" x2="12" y2="12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
        <span className="text-[12px] hidden sm:inline">Search</span>
      </button>

      {/* Wallpaper quick pick */}
      <DM.Root>
        <DM.Trigger asChild>
          <button className="px-2 py-1 hover:bg-[#CA8A04] hover:text-[#1C1917] transition" title="Wallpaper">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1.5" y="2.5" width="11" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><circle cx="5" cy="6" r="1" fill="currentColor"/><path d="M2 10 L6 7 L9 9 L12 6 V11 H2 Z" fill="currentColor" opacity="0.7"/></svg>
          </button>
        </DM.Trigger>
        <DM.Portal>
          <DM.Content sideOffset={0} align="end" className="bg-[#1C1917] border border-black p-1 text-[13px] min-w-[180px] z-[100]" style={{ boxShadow: "var(--shadow-retro-outset)" }}>
            {WALLPAPERS.map(w => (
              <Item key={w.id} onSelect={() => wp.setWallpaper(w.id)}>
                <span className="flex items-center gap-2 w-full">
                  <span className="w-4 h-4 rounded" style={{ background: `linear-gradient(135deg, ${w.palette[0]}, ${w.palette[1]} 60%, ${w.palette[2]})` }}/>
                  <span className="flex-1">{wallpaperLabel(w.id)}</span>
                  {wp.wallpaperId === w.id && <span className="text-os-iris">✓</span>}
                </span>
              </Item>
            ))}
          </DM.Content>
        </DM.Portal>
      </DM.Root>

      <div className="flex items-center gap-2.5 ml-1 pl-3 border-l border-black">
        <span className="text-os-ink-dim hidden md:inline">{date}</span>
        <span className="tabular-nums font-medium">{time}</span>
      </div>
    </div>
  );
}

function Item({ children, onSelect }: { children: React.ReactNode; onSelect?: () => void }) {
  return (
    <DM.Item onSelect={onSelect} className="px-3 py-1 outline-none cursor-default hover:bg-[#CA8A04] data-[highlighted]:bg-[#CA8A04] hover:text-[#1C1917] data-[highlighted]:text-[#1C1917] flex items-center gap-2">
      {children}
    </DM.Item>
  );
}
function Sep() { return <DM.Separator className="h-[2px] bg-black my-1" />; }
function Kbd({ children }: { children: React.ReactNode }) {
  return <span className="ml-auto text-os-ink-faint text-[11px]">{children}</span>;
}
