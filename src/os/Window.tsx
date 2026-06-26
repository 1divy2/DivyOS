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

  const radius = 0;

  return (
    <motion.div
      className="absolute flex flex-col overflow-hidden"
      initial={{ opacity: 0, scale: 0.95, y: y + 20 }}
      animate={{ left: x, top: y, width: w, height: h, opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0
      }}
      style={{
        zIndex: win.z,
        borderRadius: radius,
        background: "var(--os-panel)",
        boxShadow: "var(--shadow-window)",
        border: "2px solid #1C1917",
        color: "var(--os-ink)",
      }}
      onPointerDown={() => focus(win.id)}
    >
      <div
        className="h-8 px-2 flex items-center select-none"
        onPointerDown={onDragStart}
        onPointerMove={onDragMove}
        onPointerUp={onDragEnd}
        onDoubleClick={() => toggleMax(win.id, vp)}
        style={{ 
          cursor: isMobile || win.maximized ? "default" : "grab",
          background: "repeating-linear-gradient(to bottom, #CA8A04, #CA8A04 2px, #A16D03 2px, #A16D03 4px)",
          borderBottom: "2px solid #1C1917"
        }}
      >
        <div className="flex items-center gap-2 min-w-0 bg-[#1C1917] px-2 py-0.5 border-2 border-black" style={{ boxShadow: "var(--shadow-retro-inset)" }}>
          <AppIcon id={app.id} size={14} />
          <span className="text-[12px] font-bold text-[#CA8A04] truncate" style={{ fontFamily: "var(--font-display)" }}>{app.name}</span>
          {win.title && win.title !== app.name && (
            <span className="text-[12px] text-os-ink-faint truncate font-mono">— {win.title}</span>
          )}
        </div>
        <span className="flex-1" />
        
        {/* retro square buttons */}
        <div className="flex items-center gap-1">
          <SquareBtn label="_" onClick={() => minimize(win.id)} />
          <SquareBtn label="□" onClick={() => toggleMax(win.id, vp)} />
          <SquareBtn label="X" onClick={() => close(win.id)} />
        </div>
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

function SquareBtn({ label, onClick }: { label: string; onClick: () => void }) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onPointerDown={(e) => { e.stopPropagation(); setPressed(true); }}
      onPointerUp={(e) => { e.stopPropagation(); setPressed(false); onClick(); }}
      onPointerLeave={() => setPressed(false)}
      className="w-5 h-5 flex items-center justify-center bg-[#44403C] text-[#E8E6E1] text-[10px] font-bold border border-black"
      style={{
        boxShadow: pressed ? "var(--shadow-retro-inset)" : "var(--shadow-retro-outset)",
        fontFamily: "var(--font-mono)"
      }}
    >
      {label}
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
