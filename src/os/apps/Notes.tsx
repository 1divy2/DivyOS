import { useEffect, useState } from "react";

const KEY = "divyos:notes:scratch";

export function NotesApp() {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState<number | null>(null);

  useEffect(() => {
    setText(localStorage.getItem(KEY) ?? "# scratchpad\n\nstart typing — autosaves to localStorage.\n");
  }, []);

  useEffect(() => {
    if (!text) return;
    const t = setTimeout(() => {
      localStorage.setItem(KEY, text);
      setSaved(Date.now());
    }, 400);
    return () => clearTimeout(t);
  }, [text]);

  return (
    <div className="h-full flex flex-col bg-os-bg">
      <div className="h-7 px-3 flex items-center text-[10px] uppercase tracking-wider text-os-text-faint border-b border-os-hairline">
        <span>~/notes/scratch.md</span>
        <span className="flex-1" />
        <span className="text-os-signal">
          {saved ? `saved ${new Date(saved).toLocaleTimeString("en-GB")}` : "unsaved"}
        </span>
      </div>
      <div className="grid grid-cols-2 flex-1 divide-x divide-os-hairline">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          spellCheck={false}
          className="bg-transparent text-os-text font-mono text-[13px] p-3 outline-none resize-none"
        />
        <div className="p-3 text-[13px] text-os-text overflow-auto font-mono whitespace-pre-wrap leading-relaxed">
          {renderMd(text)}
        </div>
      </div>
    </div>
  );
}

function renderMd(src: string) {
  return src.split("\n").map((line, i) => {
    if (line.startsWith("# "))
      return <div key={i} className="text-os-signal text-base mt-1">{line.slice(2)}</div>;
    if (line.startsWith("## "))
      return <div key={i} className="text-os-text text-sm mt-1">{line.slice(3)}</div>;
    if (line.startsWith("- "))
      return <div key={i} className="text-os-text-dim">  • {line.slice(2)}</div>;
    if (line.startsWith("> "))
      return <div key={i} className="text-os-text-faint border-l-2 border-os-hairline pl-2">{line.slice(2)}</div>;
    return <div key={i} className={line ? "" : "h-3"}>{line}</div>;
  });
}
