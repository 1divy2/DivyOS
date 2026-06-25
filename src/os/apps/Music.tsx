import { useState } from "react";

const TRACKS = [
  { title: "Long Drive", artist: "DivyOS · ambient", duration: "3:42" },
  { title: "Late Reply", artist: "DivyOS · lofi",    duration: "4:11" },
  { title: "Greenroom",  artist: "DivyOS · jazz",    duration: "5:08" },
];

export function MusicApp() {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const t = TRACKS[i];
  return (
    <div className="h-full flex flex-col" style={{ background: "linear-gradient(180deg,#1A1226 0%,#0B0D12 100%)" }}>
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
        <div className="w-48 h-48 rounded-2xl shadow-[0_20px_60px_-12px_rgba(232,155,174,0.4)] overflow-hidden relative" style={{ background: "linear-gradient(135deg, #E89BAE 0%, #A8B4FF 100%)" }}>
          <div className="absolute inset-0 flex items-center justify-center text-white/90" style={{ fontFamily: "Fraunces, serif", fontSize: 56 }}>♪</div>
        </div>
        <div className="text-center">
          <div className="text-os-ink text-[20px] font-medium" style={{ fontFamily: "Inter Tight" }}>{t.title}</div>
          <div className="text-os-ink-dim text-[13px] mt-0.5">{t.artist}</div>
        </div>
        <div className="w-full max-w-xs">
          <div className="h-1 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-os-ink/70" style={{ width: playing ? "38%" : "0%", transition: "width 30s linear" }} />
          </div>
          <div className="flex justify-between text-[11px] text-os-ink-faint mt-1 tabular-nums"><span>0:00</span><span>{t.duration}</span></div>
        </div>
        <div className="flex items-center gap-6 text-os-ink">
          <button onClick={() => setI((i - 1 + TRACKS.length) % TRACKS.length)} className="text-2xl opacity-70 hover:opacity-100">⏮</button>
          <button onClick={() => setPlaying(!playing)} className="w-14 h-14 rounded-full bg-os-ink text-black flex items-center justify-center text-2xl hover:scale-105 transition">
            {playing ? "❚❚" : "▶"}
          </button>
          <button onClick={() => setI((i + 1) % TRACKS.length)} className="text-2xl opacity-70 hover:opacity-100">⏭</button>
        </div>
      </div>
      <div className="border-t border-os-hairline p-3 max-h-44 overflow-auto">
        {TRACKS.map((tr, idx) => (
          <button key={idx} onClick={() => { setI(idx); setPlaying(true); }} className={`w-full text-left px-3 py-2 rounded-md flex justify-between text-[13px] ${idx === i ? "bg-white/8 text-os-ink" : "text-os-ink-dim hover:bg-white/5"}`}>
            <span>{tr.title}</span><span className="text-os-ink-faint tabular-nums">{tr.duration}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
