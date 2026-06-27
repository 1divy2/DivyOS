import { useEffect, useState } from "react";
import { useOS } from "../store";
import { useSession } from "../services/session";

/** Real metrics only. Honest system monitor — no fake CPU/RAM. */
export function SystemMonitorApp() {
  const windows = useOS((s) => s.windows);
  const session = useSession();
  const [fps, setFps] = useState(0);
  const [mem, setMem] = useState<number | null>(null);
  const [fpsHist, setFpsHist] = useState<number[]>([]);
  const [info, setInfo] = useState<{ ua: string; conn: string; lang: string; cores: number | string }>({ ua: "", conn: "—", lang: "", cores: "—" });

  useEffect(() => {
    let frames = 0;
    let last = performance.now();
    let raf = 0;
    const tick = () => {
      frames++;
      const now = performance.now();
      if (now - last >= 1000) {
        const elapsed = now - last;
        const actualFps = Math.round((frames * 1000) / elapsed);
        setFps(actualFps);
        setFpsHist((h) => [...h.slice(-39), actualFps]);
        frames = 0;
        last = now;
        const m = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory;
        if (m) setMem(Math.round(m.usedJSHeapSize / 1024 / 1024));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const c = (navigator as unknown as { connection?: { effectiveType?: string } }).connection;
    setInfo({
      ua: navigator.platform || "—",
      conn: c?.effectiveType ?? "online",
      lang: navigator.language,
      cores: navigator.hardwareConcurrency ?? "—",
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="h-full overflow-auto p-6 space-y-6" style={{ background: "var(--os-bg-2)" }}>
      <div>
        <div className="text-os-ink-faint text-[11px] uppercase tracking-[0.18em] mb-2">Performance</div>
        <div className="grid grid-cols-2 gap-3">
          <Card label="Frame rate" value={`${fps} fps`} accent={fps < 50 ? "warn" : "ok"}>
            <Spark data={fpsHist} max={60} />
          </Card>
          <Card label="JS heap" value={mem !== null ? `${mem} MB` : "n/a"} />
        </div>
      </div>

      <div>
        <div className="text-os-ink-faint text-[11px] uppercase tracking-[0.18em] mb-2">Device</div>
        <Row k="Platform" v={info.ua} />
        <Row k="Cores" v={String(info.cores)} />
        <Row k="Language" v={info.lang} />
        <Row k="Connection" v={info.conn} />
        <Row k="Viewport" v={typeof window !== "undefined" ? `${window.innerWidth} × ${window.innerHeight}` : "—"} />
        <Row k="Pixel ratio" v={typeof window !== "undefined" ? String(window.devicePixelRatio) : "—"} />
      </div>

      <div>
        <div className="text-os-ink-faint text-[11px] uppercase tracking-[0.18em] mb-2">Session</div>
        <Row k="Visitor" v={session.visitorName ?? "guest"} />
        <Row k="Boots" v={String(session.bootCount)} />
        <Row k="Up" v={`${Math.floor((Date.now() - session.sessionStartedAt) / 1000)}s`} />
      </div>

      <div>
        <div className="text-os-ink-faint text-[11px] uppercase tracking-[0.18em] mb-2">Windows ({windows.length})</div>
        <div className="rounded-lg border border-os-hairline overflow-hidden">
          <div className="grid grid-cols-[1fr_80px_70px] text-[10px] uppercase text-os-ink-faint border-b border-os-hairline px-3 py-1.5 bg-white/3">
            <span>App</span><span>z</span><span>State</span>
          </div>
          {windows.length === 0 && <div className="px-3 py-3 text-os-ink-faint text-[12px]">No windows open</div>}
          {windows.map((w) => (
            <div key={w.id} className="grid grid-cols-[1fr_80px_70px] px-3 py-1.5 text-[12px] border-b border-os-hairline last:border-b-0 text-os-ink">
              <span>{w.appId}</span>
              <span className="text-os-iris tabular-nums">{w.z}</span>
              <span className="text-os-ink-faint">{w.minimized ? "min" : w.maximized ? "max" : "open"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ label, value, accent, children }: { label: string; value: string; accent?: "ok" | "warn"; children?: React.ReactNode }) {
  const c = accent === "warn" ? "text-os-warn" : "text-os-mint";
  return (
    <div className="rounded-xl border border-os-hairline p-4 bg-white/2">
      <div className="text-os-ink-faint text-[11px] uppercase tracking-[0.15em]">{label}</div>
      <div className={`text-2xl font-semibold tabular-nums mt-1 ${c}`} style={{ fontFamily: "Inter Tight" }}>{value}</div>
      {children}
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between py-1 border-b border-os-hairline/60 text-[13px]">
      <span className="text-os-ink-faint">{k}</span>
      <span className="text-os-ink font-mono">{v}</span>
    </div>
  );
}
function Spark({ data, max }: { data: number[]; max: number }) {
  if (data.length < 2) return <div className="h-8 mt-2" />;
  const W = 200, H = 32;
  const pts = data.map((d, i) => `${(i / (data.length - 1)) * W},${H - (Math.min(d, max) / max) * H}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-8 mt-2" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke="var(--os-mint)" strokeWidth="1.2" />
    </svg>
  );
}
