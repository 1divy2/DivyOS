import { useEffect, useRef } from "react";
import { useWallpaper } from "../services/wallpaper";
import { useSettings } from "../settings";

export function Wallpaper() {
  const id = useWallpaper((s) => s.wallpaperId);
  const reduced = useSettings((s) => s.reducedMotion);

  return (
    <div className="absolute inset-0 -z-0 overflow-hidden pointer-events-none" style={{ background: "#0B0D12" }}>
      {id === "aurora" && <Aurora reduced={reduced} />}
      {id === "constellation" && <Constellation reduced={reduced} />}
      {id === "meridian" && <Meridian reduced={reduced} />}
      {id === "dune" && <Dune reduced={reduced} />}
      {id === "glass" && <Glass reduced={reduced} />}
      {id === "paper" && <Paper />}
      {/* subtle global vignette + grain */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(140% 100% at 50% 0%, transparent 40%, rgba(0,0,0,0.45) 100%)" }} />
      <div className="absolute inset-0 pointer-events-none opacity-[0.025] mix-blend-overlay" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }} />
    </div>
  );
}

function useCanvas(draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void, deps: unknown[] = []) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext("2d", { alpha: true })!;
    let raf = 0;
    let start = performance.now();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      cv.width = cv.clientWidth * dpr;
      cv.height = cv.clientHeight * dpr;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);
    const loop = (now: number) => {
      draw(ctx, cv.width, cv.height, (now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onVis = () => { if (document.hidden) cancelAnimationFrame(raf); else { start = performance.now() - 0; raf = requestAnimationFrame(loop); } };
    document.addEventListener("visibilitychange", onVis);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); document.removeEventListener("visibilitychange", onVis); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}

/* ───── Aurora ───── */
function Aurora({ reduced }: { reduced: boolean }) {
  const ref = useCanvas((ctx, W, H, t) => {
    const time = reduced ? 0 : t * 0.06;
    // base dark slate
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#0B0D14");
    bg.addColorStop(1, "#0A0C12");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const blobs = [
      { x: 0.25, y: 0.35, r: 0.55, c: [168, 180, 255], a: 0.35, sp: 1.0 },
      { x: 0.75, y: 0.55, r: 0.50, c: [232, 155, 174], a: 0.22, sp: 0.6 },
      { x: 0.50, y: 0.85, r: 0.60, c: [142, 227, 176], a: 0.18, sp: 0.8 },
      { x: 0.85, y: 0.15, r: 0.40, c: [232, 181, 122], a: 0.18, sp: 1.2 },
    ];
    blobs.forEach((b, i) => {
      const ox = Math.sin(time * b.sp + i) * 0.08;
      const oy = Math.cos(time * b.sp * 0.7 + i * 1.7) * 0.08;
      const cx = (b.x + ox) * W;
      const cy = (b.y + oy) * H;
      const r = b.r * Math.max(W, H);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},${b.a})`);
      g.addColorStop(1, `rgba(${b.c[0]},${b.c[1]},${b.c[2]},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });
  }, [reduced]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
}

/* ───── Constellation ───── */
function Constellation({ reduced }: { reduced: boolean }) {
  const starsRef = useRef<{ x: number; y: number; r: number; tw: number }[]>([]);
  const cometRef = useRef<{ x: number; y: number; vx: number; vy: number; life: number } | null>(null);
  const ref = useCanvas((ctx, W, H, t) => {
    if (starsRef.current.length === 0) {
      const N = Math.floor((W * H) / 18000);
      starsRef.current = Array.from({ length: N }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.2,
        tw: Math.random() * Math.PI * 2,
      }));
    }
    const bg = ctx.createRadialGradient(W * 0.5, H * 1.1, 0, W * 0.5, H * 1.1, Math.max(W, H));
    bg.addColorStop(0, "#0E1228");
    bg.addColorStop(1, "#06080F");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);
    const dpr = window.devicePixelRatio || 1;
    starsRef.current.forEach((s) => {
      const a = reduced ? 0.8 : 0.5 + 0.5 * Math.sin(t * 2 + s.tw);
      ctx.fillStyle = `rgba(232,230,225,${0.3 + a * 0.6})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * dpr, 0, Math.PI * 2);
      ctx.fill();
    });
    // occasional comet
    if (!reduced) {
      if (!cometRef.current && Math.random() < 0.003) {
        cometRef.current = { x: Math.random() * W * 0.3, y: Math.random() * H * 0.3, vx: 6 + Math.random() * 4, vy: 2 + Math.random() * 2, life: 1 };
      }
      if (cometRef.current) {
        const c = cometRef.current;
        c.x += c.vx; c.y += c.vy; c.life -= 0.01;
        const grad = ctx.createLinearGradient(c.x, c.y, c.x - c.vx * 30, c.y - c.vy * 30);
        grad.addColorStop(0, `rgba(255,255,255,${Math.max(0, c.life)})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.4 * dpr;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        ctx.lineTo(c.x - c.vx * 30, c.y - c.vy * 30);
        ctx.stroke();
        if (c.life <= 0 || c.x > W || c.y > H) cometRef.current = null;
      }
    }
  }, [reduced]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
}

/* ───── Meridian (parallax gradient mesh) ───── */
function Meridian({ reduced }: { reduced: boolean }) {
  const ref = useCanvas((ctx, W, H, t) => {
    const time = reduced ? 0 : t * 0.1;
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, "#1A1726");
    sky.addColorStop(0.6, "#2E2A3F");
    sky.addColorStop(1, "#0E1118");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);
    // sun
    const sx = W * (0.5 + Math.sin(time) * 0.15);
    const sy = H * 0.55;
    const sr = Math.min(W, H) * 0.18;
    const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr * 3);
    sg.addColorStop(0, "rgba(232,181,122,0.95)");
    sg.addColorStop(0.3, "rgba(232,155,174,0.35)");
    sg.addColorStop(1, "rgba(232,155,174,0)");
    ctx.fillStyle = sg;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#E8B57A";
    ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
    // horizon line + reflection
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, H * 0.62, W, H);
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = `rgba(232,181,122,${0.12 - i * 0.012})`;
      ctx.fillRect(0, H * 0.62 + i * (H * 0.05), W, 2);
    }
  }, [reduced]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
}

/* ───── Dune ───── */
function Dune({ reduced }: { reduced: boolean }) {
  const ref = useCanvas((ctx, W, H, t) => {
    const time = reduced ? 0 : t * 0.2;
    const sky = ctx.createLinearGradient(0, 0, 0, H * 0.7);
    sky.addColorStop(0, "#5A2C1F");
    sky.addColorStop(0.6, "#C45A3F");
    sky.addColorStop(1, "#E89BAE");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);
    // sun
    const sx = W * 0.7, sy = H * 0.4, sr = Math.min(W, H) * 0.13;
    const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr * 4);
    sg.addColorStop(0, "rgba(255,210,150,0.6)");
    sg.addColorStop(1, "rgba(255,210,150,0)");
    ctx.fillStyle = sg; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#FFD089";
    ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
    // dunes - 4 layers
    const dunes = [
      { y: 0.55, amp: 30, freq: 0.004, c: "#3A1810" },
      { y: 0.68, amp: 45, freq: 0.003, c: "#28100A" },
      { y: 0.80, amp: 55, freq: 0.0025, c: "#1A0A06" },
      { y: 0.92, amp: 35, freq: 0.005, c: "#0E0604" },
    ];
    dunes.forEach((d, i) => {
      ctx.fillStyle = d.c;
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 4) {
        const y = d.y * H + Math.sin(x * d.freq + time * (i + 1) * 0.2) * d.amp + Math.sin(x * d.freq * 2.3 + time) * d.amp * 0.3;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
    });
  }, [reduced]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
}

/* ───── Glass ───── */
function Glass({ reduced }: { reduced: boolean }) {
  const ref = useCanvas((ctx, W, H, t) => {
    const time = reduced ? 0 : t * 0.15;
    ctx.fillStyle = "#0B0D14";
    ctx.fillRect(0, 0, W, H);
    const shapes = [
      { x: 0.3, y: 0.4, r: 0.25, c: [168, 180, 255] },
      { x: 0.7, y: 0.6, r: 0.30, c: [142, 227, 176] },
      { x: 0.5, y: 0.2, r: 0.20, c: [232, 181, 122] },
    ];
    shapes.forEach((s, i) => {
      const cx = (s.x + Math.sin(time + i) * 0.05) * W;
      const cy = (s.y + Math.cos(time * 0.8 + i) * 0.05) * H;
      const r = s.r * Math.max(W, H);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, `rgba(${s.c[0]},${s.c[1]},${s.c[2]},0.55)`);
      g.addColorStop(1, `rgba(${s.c[0]},${s.c[1]},${s.c[2]},0)`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    });
    // frosted overlay
    ctx.fillStyle = "rgba(11,13,18,0.55)";
    ctx.fillRect(0, 0, W, H);
  }, [reduced]);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
}

/* ───── Paper ───── */
function Paper() {
  return (
    <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,#F2EFE8 0%,#E5DFD2 100%)" }}>
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")" }} />
    </div>
  );
}

