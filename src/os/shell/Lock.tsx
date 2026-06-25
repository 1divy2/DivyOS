import { useEffect, useState } from "react";
import { useSession } from "../services/session";
import { identity } from "@/content/identity";

export function Lock() {
  const unlock = useSession((s) => s.unlock);
  const visitor = useSession((s) => s.visitorName);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") unlock();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearInterval(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [unlock]);

  return (
    <div
      className="fixed inset-0 z-[95] bg-os-bg/95 backdrop-blur-md text-os-text font-mono flex flex-col"
      style={{ animation: "os-boot-fade 200ms ease both" }}
    >
      {/* huge clock */}
      <div className="flex-1 flex flex-col items-center justify-center select-none">
        <div className="text-os-text text-7xl md:text-[8rem] tabular-nums tracking-tight">
          {now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
        </div>
        <div className="text-os-text-dim text-sm mt-2 uppercase tracking-[0.3em]">
          {now.toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "long" })}
        </div>
      </div>

      <div className="pb-16 flex flex-col items-center gap-3">
        <div className="w-12 h-12 border border-os-hairline grid place-items-center text-os-signal bg-os-panel">
          {(visitor ?? identity.handle).slice(0, 2).toUpperCase()}
        </div>
        <div className="text-os-text-faint text-xs">{visitor ?? "guest"} · session locked</div>
        <button
          onClick={unlock}
          className="mt-1 px-4 py-1.5 border border-os-hairline text-[11px] uppercase tracking-wider hover:border-os-signal hover:text-os-signal"
        >
          press enter to unlock
        </button>
      </div>
    </div>
  );
}
