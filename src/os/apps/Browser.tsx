import { useState } from "react";

const LINKS = [
  { name: "GitHub", url: "https://github.com/1divy2", desc: "All the source." },
  { name: "Lovable", url: "https://lovable.dev", desc: "Built with." },
];

export function BrowserApp() {
  const [tab, setTab] = useState(0);
  const t = LINKS[tab];
  return (
    <div className="h-full flex flex-col" style={{ background: "var(--os-bg-2)" }}>
      <div className="h-10 px-3 flex items-center gap-2 border-b border-os-hairline">
        <div className="flex gap-1">
          <button className="w-7 h-7 rounded-md hover:bg-white/8 text-os-ink-dim">‹</button>
          <button className="w-7 h-7 rounded-md hover:bg-white/8 text-os-ink-dim">›</button>
        </div>
        <div className="flex-1 h-7 px-3 rounded-md bg-white/5 text-[12px] text-os-ink-dim flex items-center font-mono truncate">{t.url}</div>
      </div>
      <div className="px-3 h-8 flex items-center gap-1 border-b border-os-hairline">
        {LINKS.map((l, i) => (
          <button key={i} onClick={() => setTab(i)} className={`px-3 h-6 rounded-md text-[12px] ${i === tab ? "bg-white/10 text-os-ink" : "text-os-ink-dim hover:bg-white/5"}`}>{l.name}</button>
        ))}
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
        <div className="text-os-ink text-[28px]" style={{ fontFamily: "Fraunces, serif" }}>{t.name}</div>
        <div className="text-os-ink-dim mt-2 text-[14px]">{t.desc}</div>
        <a href={t.url} target="_blank" rel="noreferrer" className="mt-6 px-4 py-2 rounded-md bg-os-iris/15 text-os-iris text-[13px] hover:bg-os-iris/25">Open in real browser ↗</a>
      </div>
    </div>
  );
}
