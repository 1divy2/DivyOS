import { useState, useMemo } from "react";
import resumeMd from "@/content/resume.md?raw";
import { AppFrame } from "./AppFrame";

function parseText(text: string) {
  const html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-os-ink">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-os-iris hover:underline underline-offset-4">$1</a>')
    .replace(/\[(.*?)\](?!\()/g, '<span class="text-os-ink font-medium">$1</span>'); // plain brackets highlight
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function parseLine(line: string, i: number) {
  if (line.startsWith("# ")) return <h1 key={i} className="text-4xl font-bold text-os-ink mb-8 tracking-tight">{parseText(line.slice(2))}</h1>;
  if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-semibold text-os-ink mt-10 mb-4 tracking-tight pb-2 border-b border-os-hairline">{parseText(line.slice(3))}</h2>;
  if (line.startsWith("### ")) return <h3 key={i} className="text-base font-medium text-os-ink mt-6 mb-2">{parseText(line.slice(4))}</h3>;
  if (line.trim() === "") return <div key={i} className="h-4" />;
  if (line.startsWith("- ") || line.startsWith("* ") && !line.includes("*Placeholder")) return <li key={i} className="ml-5 list-disc text-os-ink-dim marker:text-os-iris mb-1.5">{parseText(line.slice(2))}</li>;
  return <p key={i} className="text-os-ink-dim leading-relaxed mb-1.5">{parseText(line)}</p>;
}

export function ResumeApp() {
  const [zoom, setZoom] = useState(1);
  const [q, setQ] = useState("");
  
  const lines = useMemo(() => resumeMd.split("\n"), []);
  const filtered = useMemo(() => q ? lines.filter((l) => l.toLowerCase().includes(q.toLowerCase())) : lines, [q, lines]);

  const header = (
    <div className="flex items-center gap-4 w-full text-[12px]">
      <button onClick={() => window.print()} className="px-3 py-1.5 rounded bg-white/5 border border-os-hairline text-os-ink-dim hover:text-os-ink hover:border-os-iris transition-colors">
        Print Document
      </button>
      <a href="/resume.pdf" download className="px-3 py-1.5 rounded bg-os-iris text-os-bg font-medium hover:bg-white transition-colors">
        Download PDF
      </a>
      
      <div className="flex items-center gap-2 ml-4 bg-black/20 rounded-lg p-1 border border-os-hairline">
        <button onClick={() => setZoom((z) => Math.max(0.7, z - 0.1))} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 text-os-ink-dim hover:text-os-ink transition-colors">-</button>
        <span className="text-os-ink-dim tabular-nums w-10 text-center font-mono">{Math.round(zoom*100)}%</span>
        <button onClick={() => setZoom((z) => Math.min(1.6, z + 0.1))} className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 text-os-ink-dim hover:text-os-ink transition-colors">+</button>
      </div>

      <span className="flex-1" />
      
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Filter lines..."
        className="bg-black/20 border border-os-hairline rounded-lg px-3 py-1.5 text-os-ink outline-none focus:border-os-iris focus:ring-1 focus:ring-os-iris transition-all placeholder:text-os-ink-faint w-48"
      />
    </div>
  );

  return (
    <AppFrame header={header} className="bg-os-bg">
      <div className="h-full overflow-auto p-8 sm:p-12" style={{ fontSize: `${14 * zoom}px` }}>
        <article className="max-w-3xl mx-auto bg-os-panel-2 border border-os-hairline p-10 sm:p-16 rounded-2xl shadow-[var(--shadow-medium)]">
          {filtered.map(parseLine)}
          {filtered.length === 0 && (
            <div className="text-center text-os-ink-faint py-12">No content matching "{q}".</div>
          )}
        </article>
      </div>
    </AppFrame>
  );
}
