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
  const [localPos, setLocalPos] = useState<{ x: number; y: number } | null>(null);
  const [localSize, setLocalSize] = useState<{ w: number; h: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [snapPreview, setSnapPreview] = useState<"l" | "r" | "f" | null>(null);
  const app = byId(win.appId);
  const isMobile = vp.w < 640;

  const x = isMobile ? 0 : localPos ? localPos.x : win.x;
  const y = isMobile ? 0 : localPos ? localPos.y : win.y;
  const w = isMobile ? vp.w : localSize ? localSize.w : win.w;
  const h = isMobile ? vp.h : localSize ? localSize.h : win.h;

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
    setLocalPos({ x: nx, y: ny });
    
    if (e.clientX <= 12) setSnapPreview("l");
    else if (e.clientX >= vp.w - 12) setSnapPreview("r");
    else if (e.clientY <= LAYOUT.TOP_BAR + 12) setSnapPreview("f");
    else setSnapPreview(null);
  };
  const onDragEnd = (e: RPE<HTMLDivElement>) => {
    if (!drag.current) return;
    const finalPos = localPos || { x: win.x, y: win.y };
    setLocalPos(null);
    move(win.id, finalPos.x, finalPos.y);

    if (e.clientX <= 12) snap(win.id, "l", vp);
    else if (e.clientX >= vp.w - 12) snap(win.id, "r", vp);
    else if (e.clientY <= LAYOUT.TOP_BAR + 12) snap(win.id, "f", vp);
    drag.current = null;
    setIsDragging(false);
    setSnapPreview(null);
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
    setLocalSize({ w: nw, h: nh });
  };
  const onResizeEnd = () => { 
    if (resz.current && localSize) {
      resize(win.id, localSize.w, localSize.h);
    }
    setLocalSize(null);
    resz.current = null; 
    setIsResizing(false);
  };

  const radius = win.maximized ? 0 : 16;

  return (
    <motion.div
      className="absolute flex flex-col overflow-hidden glass-strong"
      initial={{ opacity: 0, scale: 0.95, y: y + 20 }}
      animate={{ left: x, top: y, width: w, height: h, opacity: 1, scale: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      style={{
        zIndex: win.z,
        borderRadius: radius,
        color: "var(--os-ink)",
      }}
      onPointerDown={() => focus(win.id)}
    >
      {isMobile ? (
        <div className="h-14 px-4 flex items-center select-none border-b border-white/5 bg-os-panel-2 sticky top-0 z-10">
          <button 
            onClick={() => close(win.id)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 active:scale-95 transition-all outline-none"
          >
            <span className="text-xl">←</span>
          </button>
          <div className="flex flex-col ml-4">
            <span className="text-[14px] font-medium tracking-wide">{app.name}</span>
            {win.title && win.title !== app.name && (
              <span className="text-[11px] text-os-ink-faint truncate">{win.title}</span>
            )}
          </div>
        </div>
      ) : (
        <div
          className="h-10 px-3 flex items-center select-none border-b border-white/5 relative shrink-0"
          onPointerDown={onDragStart}
          onPointerMove={onDragMove}
          onPointerUp={onDragEnd}
          onDoubleClick={() => toggleMax(win.id, vp)}
          style={{ cursor: win.maximized ? "default" : "grab" }}
        >
          <div className="flex items-center gap-2">
            <AppIcon id={app.id} size={16} />
            <span className="text-[13px] font-medium tracking-wide">{app.name}</span>
            {win.title && win.title !== app.name && (
              <span className="text-[13px] text-os-ink-faint truncate">— {win.title}</span>
            )}
          </div>
          <span className="flex-1" />
          
          {/* elegant circular buttons */}
          <div className="flex items-center gap-2">
            <WindowBtn type="minimize" onClick={() => minimize(win.id)} />
            <WindowBtn type="maximize" onClick={() => toggleMax(win.id, vp)} />
            <WindowBtn type="close" onClick={() => close(win.id)} />
          </div>
        </div>
      )}
      <div className="flex-1 overflow-auto bg-black/20">
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
      
      {/* Snap Preview */}
      {snapPreview && (
        <div 
          className="fixed z-[999] pointer-events-none rounded-2xl border-2 border-os-iris/50 bg-os-iris/10 backdrop-blur-sm transition-all duration-200"
          style={{
            top: LAYOUT.TOP_BAR + 8,
            bottom: LAYOUT.DOCK + 8,
            left: snapPreview === "r" ? vp.w / 2 + 4 : 8,
            right: snapPreview === "l" ? vp.w / 2 + 4 : 8,
          }}
        />
      )}
    </motion.div>
  );
}

function WindowBtn({ type, onClick }: { type: "minimize" | "maximize" | "close"; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const isClose = type === "close";
  return (
    <button
      onPointerDown={(e) => { e.stopPropagation(); }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${isClose && hovered ? "bg-os-error" : "bg-white/10 hover:bg-white/20"}`}
    >
      <span className={`text-[10px] leading-none transition-opacity ${hovered ? "opacity-100" : "opacity-0"} ${isClose && hovered ? "text-white" : "text-white/70"}`}>
        {type === "close" ? "×" : type === "minimize" ? "−" : "+"}
      </span>
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
