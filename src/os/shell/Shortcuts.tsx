import { useEffect, useState } from "react";
import { useOS } from "../store";
import { useSession } from "../services/session";
import { useNotifications } from "../services/notifications";

const SHORTCUTS: { keys: string; label: string }[] = [
  { keys: "⌘K", label: "open launcher" },
  { keys: "⌘L", label: "lock session" },
  { keys: "⌘⇧T", label: "new terminal" },
  { keys: "⌘`", label: "cycle windows" },
  { keys: "⌘W", label: "close focused window" },
  { keys: "⌘M", label: "minimize focused window" },
  { keys: "⌘,", label: "open settings" },
  { keys: "⌘N", label: "toggle notifications" },
  { keys: "?", label: "this cheatsheet" },
  { keys: "Esc", label: "close overlay" },
];

export function ShortcutsLayer() {
  const [openSheet, setOpenSheet] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      const target = e.target as HTMLElement | null;
      const inField =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      // ? cheatsheet (only when not typing)
      if (e.key === "?" && !inField) {
        e.preventDefault();
        setOpenSheet((v) => !v);
        return;
      }
      if (e.key === "Escape" && openSheet) {
        setOpenSheet(false);
        return;
      }

      if (!meta) return;
      const os = useOS.getState();
      const session = useSession.getState();
      const notif = useNotifications.getState();
      const focused = [...os.windows].sort((a, b) => b.z - a.z)[0];

      if (e.key.toLowerCase() === "k") {
        e.preventDefault();
        os.openLauncher(true);
      } else if (e.key.toLowerCase() === "l" && !e.shiftKey) {
        e.preventDefault();
        session.lock();
      } else if (e.key.toLowerCase() === "t" && e.shiftKey) {
        e.preventDefault();
        os.open("terminal", { title: "terminal", singleton: false });
      } else if (e.key === "`") {
        e.preventDefault();
        const wins = os.windows.filter((w) => !w.minimized);
        if (wins.length < 2) return;
        const sorted = [...wins].sort((a, b) => b.z - a.z);
        os.focus(sorted[sorted.length - 1].id);
      } else if (e.key.toLowerCase() === "w" && focused) {
        e.preventDefault();
        os.close(focused.id);
      } else if (e.key.toLowerCase() === "m" && focused) {
        e.preventDefault();
        os.minimize(focused.id);
      } else if (e.key === ",") {
        e.preventDefault();
        os.open("settings");
      } else if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        notif.toggleCenter();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openSheet]);

  if (!openSheet) return null;

  return (
    <div
      className="fixed inset-0 z-[88] bg-black/50 backdrop-blur-sm grid place-items-center font-mono"
      onClick={() => setOpenSheet(false)}
    >
      <div
        className="bg-os-panel border border-os-hairline w-[440px] max-w-[92vw] animate-[notif-in_180ms_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-9 px-3 flex items-center border-b border-os-hairline text-[11px] uppercase tracking-wider text-os-text-faint">
          keyboard shortcuts
          <span className="flex-1" />
          <button onClick={() => setOpenSheet(false)} className="hover:text-os-error">×</button>
        </div>
        <div className="p-4 text-[12px] divide-y divide-os-hairline">
          {SHORTCUTS.map((s) => (
            <div key={s.keys} className="flex items-center py-1.5">
              <span className="text-os-text-dim">{s.label}</span>
              <span className="flex-1" />
              <kbd className="px-2 py-0.5 border border-os-hairline text-os-signal bg-os-bg text-[11px]">{s.keys}</kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
