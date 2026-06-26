import { useRef, useState, useEffect } from "react";
import { apps } from "../registry";
import { useOS } from "../store";
import { AppIcon } from "../icons/AppIcon";
import * as CM from "@radix-ui/react-context-menu";

export function Dock() {
  const open = useOS((s) => s.open);
  const windows = useOS((s) => s.windows);
  const focus = useOS((s) => s.focus);
  const minimize = useOS((s) => s.minimize);
  const close = useOS((s) => s.close);
  const dockApps = apps.filter((a) => a.inDock);
  const [mx, setMx] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => { setIsTouch(window.matchMedia("(hover: none)").matches); }, []);

  const baseSize = isTouch ? 48 : 44;
  const maxBoost = 22;
  const influence = 90;

  return (
    <div className="absolute bottom-4 inset-x-0 z-50 flex items-center justify-center pointer-events-none">
      <div
        ref={ref}
        onPointerMove={(e) => setMx(e.clientX)}
        onPointerLeave={() => setMx(null)}
        className="pointer-events-auto flex items-end gap-3 px-4 h-16 glass-strong rounded-2xl relative"
      >
        {dockApps.map((a, idx) => {
          const w = windows.find((w) => w.appId === a.id);
          const running = !!w;
          const node = ref.current?.children[idx] as HTMLElement | undefined;
          let size = baseSize;
          if (mx !== null && node && !isTouch) {
            const r = node.getBoundingClientRect();
            const cx = r.left + r.width / 2;
            const d = Math.abs(mx - cx);
            if (d < influence) size = baseSize + maxBoost * (1 - d / influence);
          }
          return (
            <CM.Root key={a.id}>
              <CM.Trigger asChild>
                <button
                  title={a.name}
                  onClick={() => {
                    if (w) {
                      if (w.minimized) { minimize(w.id); focus(w.id); } else focus(w.id);
                    } else {
                      open(a.id, { title: a.name, size: a.defaultSize });
                    }
                  }}
                  className="relative group flex flex-col items-center justify-center rounded-xl hover:bg-white/5 pb-2 transition-colors"
                  style={{ width: size, height: size }}
                >
                  <AppIcon id={a.id} size={size - 12} />
                  <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full transition-all duration-300 ${running ? "bg-os-amber shadow-[0_0_6px_var(--os-amber)]" : "bg-transparent scale-0"}`} />
                </button>
              </CM.Trigger>
              <CM.Portal>
                <CM.Content className="glass-strong rounded-xl border border-white/10 p-1.5 text-[13px] min-w-[160px] z-[100] animate-in fade-in zoom-in-95 duration-200">
                  <CMI onSelect={() => open(a.id, { title: a.name, size: a.defaultSize })}>Open</CMI>
                  {w && <CMI onSelect={() => minimize(w.id)}>{w.minimized ? "Restore" : "Minimize"}</CMI>}
                  {w && <CMI onSelect={() => close(w.id)} danger>Quit</CMI>}
                </CM.Content>
              </CM.Portal>
            </CM.Root>
          );
        })}
      </div>
    </div>
  );
}

function CMI({ children, onSelect, danger }: { children: React.ReactNode; onSelect: () => void; danger?: boolean }) {
  return (
    <CM.Item onSelect={onSelect} className={`px-3 py-1.5 rounded-md outline-none cursor-default flex items-center gap-2 transition-colors ${danger ? "text-os-error hover:bg-os-error/20 data-[highlighted]:bg-os-error/20" : "hover:bg-white/10 data-[highlighted]:bg-white/10"}`}>
      {children}
    </CM.Item>
  );
}
