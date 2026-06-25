import { useEffect, useRef, useState, type PointerEvent as RPE, type ReactNode } from "react";
import { motion } from "motion/react";
import { useOS, LAYOUT, type WindowState } from "./store";
import { byId } from "./registry";
import { AppIcon } from "./icons/AppIcon";

function useViewport() {
  const [vp, setVp] = useState({ w: typeof window !== "undefined" ? window.innerWidth : 1280, h: typeof window !== "undefined" ? window.innerHeight : 800 });
  useEffect(() => {
    const on = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  return vp;
}

export function WindowFrame({ win }: { win: WindowState }) {
  const { focus, close, minimize, toggleMax, move, resize, snap } = useOS();
  const vp = useViewport();
  const drag = useRef<{ ox: number; oy: number; x: number; y: number } | null>(null);
  const resz = useRef<{ ow: number; oh: number; x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const app = byId(win.appId);
  const isMobile = vp.w < 640;

  const x = isMobile ? 0 : win.x;
  const y = isMobile ? LAYOUT.TOP_BAR : win.y;
  const w = isMobile ? vp.w : win.w;
  const h = isMobile ? vp.h - LAYOUT.TOP_BAR - LAYOUT.DOCK : win.h;

  if (!app || win.minimized) return null;
  const Comp = app.component;

  const onDragStart = (e: RPE<HTMLDivElement>) => {
    if (isMobile || win.maximized) return;
    focus(win.id);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { ox: e.clientX, oy: e.clientY, x: win.x, y: win.y };
    setIsDragging(true);
  };
  const onDragMove = (e: RPE<HTMLDivElement>) => {
    if (!drag.current) return;
    const nx = Math.max(0, Math.min(vp.w - 80, drag.current.x + (e.clientX - drag.current.ox)));
    const ny = Math.max(LAYOUT.TOP_BAR, Math.min(vp.h - 40, drag.current.y + (e.clientY - drag.current.oy)));
    move(win.id, nx, ny);
  };
  const onDragEnd = (e: RPE<HTMLDivElement>) => {
    if (!drag.current) return;
    if (e.clientX <= 4) snap(win.id, "l", vp);
    else if (e.clientX >= vp.w - 4) snap(win.id, "r", vp);
    else if (e.clientY <= LAYOUT.TOP_BAR + 4) snap(win.id, "f", vp);
    drag.current = null;
    setIsDragging(false);
  };

  const onResizeStart = (e: RPE<HTMLDivElement>) => {
    if (isMobile) return;
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    resz.current = { ow: win.w, oh: win.h, x: e.clientX, y: e.clientY };
    setIsResizing(true);
  };
  const onResizeMove = (e: RPE<HTMLDivElement>) => {
    if (!resz.current) return;
    const nw = Math.max(320, resz.current.ow + (e.clientX - resz.current.x));
    const nh = Math.max(220, resz.current.oh + (e.clientY - resz.current.y));
    resize(win.id, nw, nh);
  };
  const onResizeEnd = () => { 
    resz.current = null; 
    setIsResizing(false);
  };

  const radius = isMobile ? 0 : 14;

  return (
    <motion.div
      className="absolute flex flex-col overflow-hidden"
      initial={{ opacity: 0, scale: 0.95, y: y + 20 }}
      animate={{ left: x, top: y, width: w, height: h, opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: isDragging || isResizing ? 1000 : 300,
        damping: isDragging || isResizing ? 40 : 25,
        mass: 0.8,
      }}
      style={{
        zIndex: win.z,
        borderRadius: radius,
        background: "var(--os-panel)",
        backdropFilter: "blur(28px) saturate(160%)",
        boxShadow: win.z > 100 ? "0 24px 48px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1) inset" : "var(--shadow-window)",
        color: "var(--os-ink)",
      }}
      onPointerDown={() => focus(win.id)}
    >
      <div
        className="h-10 px-3 flex items-center gap-3 select-none border-b border-os-hairline"
        onPointerDown={onDragStart}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
        onDoubleClick={() => toggleMax(win.id, vp)}
        style={{ cursor: isMobile || win.maximized ? "default" : "grab" }}
      >
        {/* traffic lights */}
        <div className="flex items-center gap-1.5">
          <TLight color="#F26D6D" hover="×" onClick={() => close(win.id)} />
          <TLight color="#F2C779" hover="–" onClick={() => minimize(win.id)} />
          <TLight color="#8EE3B0" hover="+" onClick={() => toggleMax(win.id, vp)} />
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <AppIcon id={app.id} size={18} />
          <span className="text-[13px] font-medium text-os-ink truncate" style={{ fontFamily: "var(--font-sans)" }}>{app.name}</span>
          {win.title && win.title !== app.name && (
            <span className="text-[12px] text-os-ink-faint truncate">— {win.title}</span>
          )}
        </div>
        <span className="flex-1" />
      </div>
      <div className="flex-1 overflow-auto" style={{ background: "var(--os-bg-2)" }}>
        <Comp payload={win.payload} />
      </div>
      {!isMobile && !win.maximized && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize opacity-0 hover:opacity-100"
          style={{ background: "linear-gradient(135deg, transparent 50%, rgba(255,255,255,0.15) 50%)" }}
          onPointerDown={onResizeStart}
          onPointerMove={onResizeMove}
          onPointerUp={onResizeEnd}
        />
      )}
    </motion.div>
  );
}

function TLight({ color, hover, onClick }: { color: string; hover: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group w-3 h-3 rounded-full flex items-center justify-center transition"
      style={{ background: color, boxShadow: `0 0 0 0.5px rgba(0,0,0,0.3) inset` }}
    >
      <span className="opacity-0 group-hover:opacity-70 text-[9px] leading-none text-black font-bold">{hover}</span>
    </button>
  );
}

export function WindowLayer({ children }: { children?: ReactNode }) {
  const windows = useOS((s) => s.windows);
  return (
    <div className="absolute inset-0 pointer-events-none [&>*]:pointer-events-auto">
      {windows.map((w) => <WindowFrame key={w.id} win={w} />)}
      {children}
    </div>
  );
}
