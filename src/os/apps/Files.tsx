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
        { name: "notes.md", kind: "file", size: "4 KB", content: "## DivyOS\nBuilding the future of web OS." },
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
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

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
        <div className="h-10 px-3 flex items-center gap-2 border-b border-os-hairline text-[12px] text-os-ink-dim bg-white/5">
          <button onClick={() => path.length > 1 && setPath(path.slice(0, -1))} className="px-2 py-1 rounded-md hover:bg-white/10 disabled:opacity-40 transition-colors" disabled={path.length<=1}>←</button>
          <div className="flex items-center gap-1.5 flex-1 bg-black/20 px-3 py-1 rounded-md border border-white/5">
            {path.map((p,i) => (
              <span key={i} className="flex items-center gap-1.5">
                <button onClick={() => setPath(path.slice(0, i+1))} className="hover:text-os-ink font-medium">{p}</button>
                {i < path.length - 1 && <span className="text-os-ink-faint">/</span>}
              </span>
            ))}
          </div>
          <div className="flex gap-1 ml-2 bg-black/20 p-0.5 rounded-md border border-white/5">
            <button onClick={() => setViewMode("list")} className={`p-1.5 rounded ${viewMode === "list" ? "bg-white/15 text-os-ink shadow-sm" : "text-os-ink-dim hover:text-os-ink"}`}>
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
            </button>
            <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded ${viewMode === "grid" ? "bg-white/15 text-os-ink shadow-sm" : "text-os-ink-dim hover:text-os-ink"}`}>
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4 bg-os-bg/50">
          {viewMode === "list" && (
            <div className="grid grid-cols-[1fr_100px_120px] text-[11px] uppercase tracking-wider text-os-ink-faint border-b border-os-hairline pb-2 mb-2 px-2">
              <span>Name</span><span>Size</span><span>Modified</span>
            </div>
          )}
          {items.length === 0 && <div className="text-os-ink-faint text-[13px] py-8 text-center flex flex-col items-center gap-2"><span className="text-4xl opacity-20">📁</span> Folder is empty</div>}
          
          <div className={viewMode === "grid" ? "grid grid-cols-4 gap-4" : "flex flex-col"}>
            {items.map(it => (
              <button
                key={it.name}
                onDoubleClick={() => {
                  if (it.kind === "dir") setPath([...path, it.name]);
                  else if (it.kind === "app" && it.appId) open(it.appId);
                  else if (it.kind === "file") {
                    if (it.name.endsWith(".md") || it.name.endsWith(".txt")) {
                      open("notes", { payload: { initialContent: it.content ?? `# ${it.name}\nEmpty file.` }, title: it.name });
                    } else if (it.name.endsWith(".pdf") || it.name.endsWith(".png") || it.name.endsWith(".jpg")) {
                      open("gallery", { title: it.name });
                    } else {
                      open("notes", { payload: { initialContent: it.content ?? `Cannot open ${it.name}` }, title: it.name });
                    }
                  }
                }}
                className={viewMode === "list" ? "grid grid-cols-[1fr_100px_120px] w-full text-left px-2 py-2 rounded-lg text-[13px] text-os-ink hover:bg-os-iris/15 transition-colors items-center" : "flex flex-col items-center justify-start gap-2 p-3 rounded-xl text-[13px] text-os-ink hover:bg-os-iris/15 transition-colors text-center"}
              >
                {viewMode === "list" ? (
                  <>
                    <span className="flex items-center gap-3">
                      <span className="w-5 h-5 flex items-center justify-center text-lg">{it.kind === "dir" ? "📁" : it.kind === "app" ? "▣" : "📄"}</span>
                      <span className="font-medium">{it.name}</span>
                    </span>
                    <span className="text-os-ink-faint text-[12px]">{it.size ?? "—"}</span>
                    <span className="text-os-ink-faint text-[12px]">{it.date ?? "—"}</span>
                  </>
                ) : (
                  <>
                    <span className="w-12 h-12 flex items-center justify-center text-4xl drop-shadow-md">{it.kind === "dir" ? "📁" : it.kind === "app" ? "▣" : "📄"}</span>
                    <span className="font-medium leading-tight max-w-[80px] break-words">{it.name}</span>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
