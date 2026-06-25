import { useEffect, useState } from "react";
import { useOS } from "../store";

type Node = { name: string; kind: "dir" | "file" | "app"; size?: string; date?: string; appId?: string; children?: Node[]; content?: string };

const FS: Node = {
  name: "/", kind: "dir", children: [
    { name: "Home", kind: "dir", children: [
      { name: "About me.app", kind: "app", appId: "about", size: "—" },
      { name: "Resume.pdf", kind: "file", size: "118 KB", date: "2026-06-12" },
      { name: "Projects", kind: "dir", children: [
        { name: "divyos", kind: "dir" },
        { name: "notes.md", kind: "file", size: "4 KB" },
      ]},
      { name: "Notes", kind: "dir", children: [
        { name: "todo.md", kind: "file", size: "1 KB", content: "# Today\n- ship divyos\n- coffee" },
        { name: "ideas.md", kind: "file", size: "2 KB" },
      ]},
    ]},
    { name: "Applications", kind: "dir" },
    { name: "etc", kind: "dir", children: [
      { name: "divyos", kind: "file", content: "host: divyos.local\nshell: divysh\nversion: 1.0" },
    ]},
  ],
};

export function FilesApp() {
  const open = useOS((s) => s.open);
  const [path, setPath] = useState<string[]>(["Home"]);

  const node = path.reduce<Node | undefined>((n, name) => n?.children?.find(c => c.name === name), FS);
  const items = node?.children ?? [];

  return (
    <div className="h-full flex" style={{ background: "var(--os-bg-2)" }}>
      <aside className="w-44 border-r border-os-hairline p-2 text-[13px] flex-shrink-0">
        <div className="text-os-ink-faint text-[11px] uppercase tracking-[0.15em] px-2 py-1">Locations</div>
        {["Home","Applications","etc"].map(p => (
          <button key={p} onClick={() => setPath([p])} className={`block w-full text-left px-3 py-1.5 rounded-md ${path[0]===p ? "bg-os-iris/15 text-os-ink" : "text-os-ink-dim hover:text-os-ink hover:bg-white/5"}`}>
            {p}
          </button>
        ))}
      </aside>
      <div className="flex-1 flex flex-col">
        <div className="h-9 px-3 flex items-center gap-1 border-b border-os-hairline text-[12px] text-os-ink-dim">
          <button onClick={() => path.length > 1 && setPath(path.slice(0, -1))} className="px-1.5 py-0.5 rounded hover:bg-white/8 disabled:opacity-40" disabled={path.length<=1}>←</button>
          <span className="text-os-ink-faint">/</span>
          {path.map((p,i) => (
            <span key={i} className="flex items-center gap-1">
              <button onClick={() => setPath(path.slice(0, i+1))} className="hover:text-os-ink">{p}</button>
              <span className="text-os-ink-faint">/</span>
            </span>
          ))}
        </div>
        <div className="flex-1 overflow-auto p-4">
          <div className="grid grid-cols-[1fr_100px_120px] text-[11px] uppercase tracking-wider text-os-ink-faint border-b border-os-hairline pb-2 mb-2">
            <span>Name</span><span>Size</span><span>Modified</span>
          </div>
          {items.length === 0 && <div className="text-os-ink-faint text-[13px] py-8 text-center">Empty folder</div>}
          {items.map(it => (
            <button
              key={it.name}
              onDoubleClick={() => {
                if (it.kind === "dir") setPath([...path, it.name]);
                else if (it.kind === "app" && it.appId) open(it.appId);
              }}
              className="grid grid-cols-[1fr_100px_120px] w-full text-left px-1 py-1.5 rounded text-[13px] text-os-ink hover:bg-os-iris/10"
            >
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 inline-block">{it.kind === "dir" ? "📁" : it.kind === "app" ? "▣" : "📄"}</span>
                {it.name}
              </span>
              <span className="text-os-ink-faint">{it.size ?? "—"}</span>
              <span className="text-os-ink-faint">{it.date ?? "—"}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
