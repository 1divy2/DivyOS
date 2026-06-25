import { useState } from "react";
import resumeMd from "@/content/resume.md?raw";

export function ResumeApp() {
  const [zoom, setZoom] = useState(1);
  const [q, setQ] = useState("");
  const lines = resumeMd.split("\n");
  const filtered = q ? lines.filter((l) => l.toLowerCase().includes(q.toLowerCase())) : lines;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-3 py-1.5 border-b border-os-hairline text-[11px] bg-os-panel-2">
        <button onClick={() => window.print()} className="text-os-text-dim hover:text-os-signal">[print]</button>
        <a href="/resume.pdf" download className="text-os-text-dim hover:text-os-signal">[download]</a>
        <button onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))} className="text-os-text-dim hover:text-os-signal">[-]</button>
        <span className="text-os-text-faint tabular-nums">{Math.round(zoom*100)}%</span>
        <button onClick={() => setZoom((z) => Math.min(1.6, z + 0.1))} className="text-os-text-dim hover:text-os-signal">[+]</button>
        <span className="flex-1" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="/ search"
          className="bg-os-bg border border-os-hairline px-2 py-0.5 text-os-text outline-none focus:border-os-signal w-32"
        />
      </div>
      <div className="flex-1 overflow-auto p-6 bg-os-panel">
        <pre className="whitespace-pre-wrap font-mono text-os-text" style={{ fontSize: `${13 * zoom}px`, lineHeight: 1.6 }}>
          {filtered.join("\n")}
        </pre>
      </div>
    </div>
  );
}
