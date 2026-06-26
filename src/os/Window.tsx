import { useEffect, useRef, useState, type PointerEvent as RPE, type ReactNode } from "react";
import { motion, useDragControls } from "motion/react";
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
  const dragControls = useDragControls();
  const resz = useRef<{ ow: number; oh: number; x: number; y: number } | null>(null);
  const [localSize, setLocalSize] = useState<{ w: number; h: number } | null>(null);
  const [snapPreview, setSnapPreview] = useState<"l" | "r" | "f" | null>(null);
  const app = byId(win.appId);
  const isMobile = vp.w < 640;
  const nodeRef = useRef<HTMLDivElement>(null);

  const x = isMobile ? 0 : win.maximized ? 0 : win.x;
  const y = isMobile ? 0 : win.maximized ? LAYOUT.TOP_BAR : win.y;
  const w = isMobile ? vp.w : localSize ? localSize.w : win.w;
  const h = isMobile ? vp.h : localSize ? localSize.h : win.h;

  if (!app || win.minimized) return null;
  const Comp = app.component;

  const onResizeStart = (e: RPE<HTMLDivElement>) => {
    if (isMobile) return;
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    resz.current = { ow: win.w, oh: win.h, x: e.clientX, y: e.clientY };
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
  };

  const radius = win.maximized ? 0 : 16;

  return (
    <motion.div
      ref={nodeRef}
      className="absolute flex flex-col overflow-hidden glass-strong shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_40px_-10px_rgba(0,0,0,0.5)]"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ x, y, width: w, height: h, opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        zIndex: win.z,
        borderRadius: radius,
        color: "var(--os-ink)",
        left: 0,
        top: 0
      }}
      onPointerDown={() => focus(win.id)}
      drag={!isMobile && !win.maximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onDrag={(e, info) => {
        const cx = info.point.x;
        const cy = info.point.y;
        if (cx <= 12) setSnapPreview("l");
        else if (cx >= vp.w - 12) setSnapPreview("r");
        else if (cy <= LAYOUT.TOP_BAR + 12) setSnapPreview("f");
        else setSnapPreview(null);
      }}
      onDragEnd={(e, info) => {
        const cx = info.point.x;
        const cy = info.point.y;
        
        // Save new pos from nodeRef
        const rect = nodeRef.current?.getBoundingClientRect();
        if (rect) move(win.id, rect.x, rect.y);

        if (cx <= 12) snap(win.id, "l", vp);
        else if (cx >= vp.w - 12) snap(win.id, "r", vp);
        else if (cy <= LAYOUT.TOP_BAR + 12) snap(win.id, "f", vp);
        
        setSnapPreview(null);
      }}
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
          className="h-12 px-4 flex items-center select-none border-b border-white/5 relative shrink-0 bg-white/5 backdrop-blur-md"
          onPointerDown={(e) => {
            if (!win.maximized && !isMobile) dragControls.start(e);
          }}
          onDoubleClick={() => toggleMax(win.id, vp)}
          style={{ cursor: win.maximized ? "default" : "grab" }}
        >
          {/* elegant circular buttons - macOS style on the left! */}
          <div className="flex items-center gap-2 mr-4">
            <WindowBtn type="close" onClick={() => close(win.id)} />
            <WindowBtn type="minimize" onClick={() => minimize(win.id)} />
            <WindowBtn type="maximize" onClick={() => toggleMax(win.id, vp)} />
          </div>

          <div className="flex items-center gap-2 justify-center absolute left-1/2 -translate-x-1/2 pointer-events-none">
            <AppIcon id={app.id} size={16} />
            <span className="text-[13px] font-medium tracking-wide text-os-ink/90">{app.name}</span>
            {win.title && win.title !== app.name && (
              <span className="text-[13px] text-os-ink-faint truncate">— {win.title}</span>
            )}
          </div>
          
        </div>
      )}
      <div className="flex-1 overflow-auto">
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
  const isMin = type === "minimize";
  const isMax = type === "maximize";
  
  // Mac-like colors
  const bgColor = isClose ? "bg-[#ff5f56]" : isMin ? "bg-[#ffbd2e]" : "bg-[#27c93f]";
  
  return (
    <button
      onPointerDown={(e) => { e.stopPropagation(); }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${hovered ? bgColor : "bg-white/20"} border border-black/10`}
    >
      <span className={`text-[10px] leading-none transition-opacity font-bold ${hovered ? "opacity-100 text-black/60" : "opacity-0"}`}>
        {isClose ? "×" : isMin ? "−" : "+"}
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
