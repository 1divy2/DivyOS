import { useRef, useState, useEffect } from "react";
import { apps } from "../registry";
import { useOS } from "../store";
import { AppIcon } from "../icons/AppIcon";
import * as CM from "@radix-ui/react-context-menu";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "motion/react";

export function Dock() {
  const dockApps = apps.filter((a) => a.inDock);
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => { setIsTouch(window.matchMedia("(hover: none)").matches); }, []);

  const mouseX = useMotionValue(Infinity);

  return (
    <div className="absolute bottom-4 inset-x-0 z-50 flex items-center justify-center pointer-events-none">
      <div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="pointer-events-auto flex items-end gap-3 px-4 h-16 glass-strong rounded-2xl relative will-change-transform"
      >
        {dockApps.map((a) => {
          return <DockItem key={a.id} a={a} mouseX={mouseX} isTouch={isTouch} />
        })}
      </div>
    </div>
  );
}

function DockItem({ a, mouseX, isTouch }: any) {
  const open = useOS((s) => s.open);
  const focus = useOS((s) => s.focus);
  const minimize = useOS((s) => s.minimize);
  const close = useOS((s) => s.close);
  const w = useOS((s) => s.windows.find((win) => win.appId === a.id));
  const running = !!w;
  
  const ref = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);
  
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-100, 0, 100], [48, 80, 48]);
  const targetWidth = isTouch ? 48 : widthSync;
  const width = useSpring(targetWidth, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <CM.Root>
      <CM.Trigger asChild>
        <motion.button
          ref={ref}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => {
            if (w) {
              if (w.minimized) { minimize(w.id); focus(w.id); } else focus(w.id);
            } else {
              open(a.id, { title: a.name, size: a.defaultSize });
            }
          }}
          className="relative group flex flex-col items-center justify-center rounded-xl hover:bg-white/5 pb-2 transition-colors origin-bottom will-change-transform"
          style={{ width, height: width }}
        >
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/60 backdrop-blur-md text-white/90 text-[11px] font-medium tracking-wide rounded-lg whitespace-nowrap shadow-lg border border-white/10 pointer-events-none will-change-transform"
              >
                {a.name}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="w-full h-full flex items-center justify-center pointer-events-none">
            <AppIcon id={a.id} size={48} />
          </div>
          <span className={`absolute bottom-1 w-1.5 h-1.5 rounded-full transition-all duration-300 ${running ? "bg-os-amber shadow-[0_0_6px_var(--os-amber)]" : "bg-transparent scale-0"}`} />
        </motion.button>
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
}

function CMI({ children, onSelect, danger }: { children: React.ReactNode; onSelect: () => void; danger?: boolean }) {
  return (
    <CM.Item onSelect={onSelect} className={`px-3 py-1.5 rounded-md outline-none cursor-default flex items-center gap-2 transition-colors ${danger ? "text-os-error hover:bg-os-error/20 data-[highlighted]:bg-os-error/20" : "hover:bg-white/10 data-[highlighted]:bg-white/10"}`}>
      {children}
    </CM.Item>
  );
}
