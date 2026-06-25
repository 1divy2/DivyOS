import { useEffect, useState } from "react";
import { useSession } from "../services/session";
import { identity } from "@/content/identity";

const LINES = [
  "DivyOS bootloader v1.0",
  "[ok] mounting /content ........................ JSON/MD",
  "[ok] starting kernel ............................. ready",
  "[ok] window manager .............................. ready",
  "[ok] notification service ........................ ready",
  "[ok] command bus / terminal ...................... ready",
  "[ok] wallpaper engine ............................ ready",
  "[ok] search index ................................ 142 items",
  "[ok] theme: cortex ............................... loaded",
  "",
  identity.bootString,
];

export function Boot() {
  const [shown, setShown] = useState(0);
  const completeBoot = useSession((s) => s.completeBoot);

  useEffect(() => {
    if (shown >= LINES.length) return;
    const t = setTimeout(() => setShown((n) => n + 1), shown === 0 ? 120 : 80);
    return () => clearTimeout(t);
  }, [shown]);

  useEffect(() => {
    const skip = () => completeBoot();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [completeBoot]);

  useEffect(() => {
    if (shown < LINES.length) return;
    const t = setTimeout(() => completeBoot(), 1400);
    return () => clearTimeout(t);
  }, [shown, completeBoot]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-os-bg text-os-text font-mono text-[13px] p-6 sm:p-10 scanline"
      style={{ animation: "os-boot-fade 200ms ease both" }}
    >
      <div className="max-w-2xl">
        {LINES.slice(0, shown).map((l, i) => (
          <div
            key={i}
            className={l.startsWith("[ok]") ? "text-os-text-dim" : l.includes("DivyOS") ? "text-os-signal" : ""}
          >
            {l || "\u00A0"}
          </div>
        ))}
        {shown >= LINES.length && (
          <div className="mt-4 text-os-text-faint">
            press any key to continue <span className="os-cursor" />
          </div>
        )}
      </div>
    </div>
  );
}
