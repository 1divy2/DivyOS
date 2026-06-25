import { useEffect, useState } from "react";
import { useSession } from "../services/session";

export function PowerOverlay() {
  const phase = useSession((s) => s.phase);
  const powerOn = useSession((s) => s.powerOn);
  const [progress, setProgress] = useState(0);

  const isShutdown = phase === "shutting-down";
  const isRestart = phase === "restarting";
  const active = isShutdown || isRestart;

  useEffect(() => {
    if (!active) return;
    setProgress(0);
    const lines = isRestart ? RESTART_LINES : SHUTDOWN_LINES;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setProgress(i);
      if (i >= lines.length) {
        clearInterval(t);
        setTimeout(() => {
          if (isRestart) powerOn();
          else useSession.setState({ phase: "off" });
        }, 900);
      }
    }, 220);
    return () => clearInterval(t);
  }, [active, isRestart, powerOn]);

  if (phase === "off") {
    return (
      <div className="fixed inset-0 z-[120] bg-black grid place-items-center text-os-text-faint font-mono">
        <button
          onClick={powerOn}
          className="group flex flex-col items-center gap-3"
          aria-label="Power on"
        >
          <div className="w-16 h-16 rounded-full border border-os-hairline grid place-items-center group-hover:border-os-signal group-hover:text-os-signal transition-colors">
            <span className="text-2xl">⏻</span>
          </div>
          <span className="text-[11px] uppercase tracking-[0.3em]">power on</span>
        </button>
      </div>
    );
  }

  if (!active) return null;
  const lines = isRestart ? RESTART_LINES : SHUTDOWN_LINES;

  return (
    <div className="fixed inset-0 z-[110] bg-os-bg text-os-text font-mono flex items-center justify-center">
      {/* CRT collapse on shutdown */}
      <div
        className="absolute inset-x-0 bg-os-bg pointer-events-none"
        style={
          isShutdown && progress >= lines.length - 1
            ? {
                top: 0,
                bottom: 0,
                animation: "os-crt-collapse 700ms 300ms cubic-bezier(.6,0,.2,1) forwards",
              }
            : { display: "none" }
        }
      />
      <div className="w-full max-w-md px-6">
        <div className="text-[11px] uppercase tracking-[0.3em] text-os-text-faint mb-4">
          {isRestart ? "restarting" : "shutting down"}
        </div>
        <div className="space-y-1 text-[13px]">
          {lines.slice(0, progress).map((l, i) => (
            <div key={i} className="text-os-text-dim">
              <span className="text-os-signal">[ok]</span> {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const SHUTDOWN_LINES = [
  "saving window layout",
  "flushing terminal history",
  "persisting clipboard",
  "stopping window manager",
  "stopping command bus",
  "halting kernel",
  "powering off",
];

const RESTART_LINES = [
  "saving session state",
  "stopping services",
  "rebooting kernel",
];
