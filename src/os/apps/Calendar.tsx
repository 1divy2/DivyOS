import { useState } from "react";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS = ["S","M","T","W","T","F","S"];

export function CalendarApp() {
  const [cur, setCur] = useState(new Date());
  const today = new Date();
  const y = cur.getFullYear(), m = cur.getMonth();
  const firstDay = new Date(y, m, 1).getDay();
  const lastDate = new Date(y, m + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: lastDate }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);

  return (
    <div className="h-full p-6" style={{ background: "var(--os-bg-2)" }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[24px] font-medium text-os-ink" style={{ fontFamily: "Fraunces, serif" }}>
          {MONTHS[m]} <span className="text-os-ink-dim font-normal">{y}</span>
        </h2>
        <div className="flex gap-1">
          <button onClick={() => setCur(new Date(y, m - 1, 1))} className="w-8 h-8 rounded-md hover:bg-white/8 text-os-ink-dim">‹</button>
          <button onClick={() => setCur(new Date())} className="px-3 h-8 rounded-md hover:bg-white/8 text-os-ink-dim text-[12px]">Today</button>
          <button onClick={() => setCur(new Date(y, m + 1, 1))} className="w-8 h-8 rounded-md hover:bg-white/8 text-os-ink-dim">›</button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-wider text-os-ink-faint mb-2">
        {DAYS.map((d, i) => <div key={i}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          const isToday = d && today.getDate() === d && today.getMonth() === m && today.getFullYear() === y;
          return (
            <div key={i} className={`aspect-square rounded-lg text-[13px] flex items-center justify-center transition ${d ? "text-os-ink hover:bg-white/5 cursor-pointer" : "text-transparent"} ${isToday ? "bg-os-iris text-black font-semibold hover:bg-os-iris" : ""}`}>
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );
}
