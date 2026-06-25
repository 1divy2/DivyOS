import { useEffect, useMemo, useState } from "react";
import { useOS } from "../store";
import { apps } from "../registry";
import { projects } from "@/content/projects";

type Item = { id: string; type: "app" | "project" | "cmd"; label: string; sub?: string; run: () => void };

export function Launcher() {
  const open = useOS((s) => s.open);
  const launcherOpen = useOS((s) => s.launcherOpen);
  const setLauncher = useOS((s) => s.openLauncher);
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setLauncher(true); }
      else if (e.key === "Escape" && launcherOpen) setLauncher(false);
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, [launcherOpen, setLauncher]);

  useEffect(() => { if (launcherOpen) { setQ(""); setIdx(0); } }, [launcherOpen]);

  const items = useMemo<Item[]>(() => {
    const all: Item[] = [
      ...apps.map<Item>((a) => ({
        id: `app:${a.id}`, type: "app", label: a.name, sub: a.description,
        run: () => open(a.id, { title: a.name, size: a.defaultSize }),
      })),
      ...projects.map<Item>((p) => ({
        id: `proj:${p.slug}`, type: "project", label: p.name, sub: p.description || p.language,
        run: () => open("projects", { title: p.name, payload: { slug: p.slug } }),
      })),
    ];
    if (!q) return all;
    const Q = q.toLowerCase();
    return all
      .map((it) => ({ it, score: (it.label + " " + (it.sub || "")).toLowerCase().includes(Q) ? 1 : 0 }))
      .filter((x) => x.score > 0)
      .map((x) => x.it);
  }, [q, open]);

  if (!launcherOpen) return null;

  const choose = (it?: Item) => { const x = it ?? items[idx]; if (!x) return; x.run(); setLauncher(false); };

  return (
    <div className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-md flex items-start justify-center pt-[14vh] px-4 animate-in fade-in duration-150" onClick={() => setLauncher(false)}>
      <div className="w-full max-w-xl glass-strong rounded-2xl overflow-hidden shadow-[var(--shadow-medium)] animate-in zoom-in-95 duration-150" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center px-4 py-3 border-b border-os-hairline gap-3">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-os-ink-dim flex-shrink-0">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4"/>
            <line x1="11" y1="11" x2="14" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <input
            autoFocus
            value={q}
            onChange={(e) => { setQ(e.target.value); setIdx(0); }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(items.length - 1, i + 1)); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)); }
              else if (e.key === "Enter") { e.preventDefault(); choose(); }
            }}
            placeholder="Search apps, projects, commands…"
            className="flex-1 bg-transparent outline-none text-os-ink placeholder:text-os-ink-faint text-[15px]"
            style={{ fontFamily: "Inter Tight" }}
          />
          <span className="text-os-ink-faint text-[10px] px-1.5 py-0.5 rounded border border-os-hairline">ESC</span>
        </div>
        <div className="max-h-[52vh] overflow-auto p-1.5">
          {items.length === 0 && <div className="px-4 py-10 text-os-ink-faint text-[13px] text-center">No results for "{q}"</div>}
          {items.slice(0, 30).map((it, i) => (
            <button
              key={it.id}
              onMouseEnter={() => setIdx(i)}
              onClick={() => choose(it)}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 text-[13px] transition ${i===idx?"bg-os-iris/15":""}`}
            >
              <span className={`text-[10px] uppercase tracking-wider w-14 ${it.type === "app" ? "text-os-iris" : it.type === "project" ? "text-os-amber" : "text-os-mint"}`}>{it.type}</span>
              <span className="text-os-ink flex-1 truncate font-medium">{it.label}</span>
              <span className="text-os-ink-faint text-[12px] truncate max-w-[45%]">{it.sub}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
