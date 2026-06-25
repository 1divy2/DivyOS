import { useEffect, useRef, useState } from "react";

const W = 320, H = 440;
const GRAV = 0.5, JUMP = -7.2;
const GAP = 130, PIPE_W = 52, PIPE_SPEED = 2.1;

type Pipe = { x: number; topH: number; scored?: boolean };

export function FlappyApp() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem("divyos:flappy:best") ?? 0));
  const [running, setRunning] = useState(false);
  const [dead, setDead] = useState(false);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d"); if (!ctx) return;

    let y = H / 2, vy = 0;
    let pipes: Pipe[] = [];
    let frame = 0, localScore = 0, raf = 0, alive = false;

    const reset = () => {
      y = H / 2; vy = 0; pipes = []; frame = 0; localScore = 0; alive = true;
      setScore(0); setDead(false);
    };

    const jump = () => {
      if (!running) { setRunning(true); reset(); }
      else if (dead) { reset(); setRunning(true); }
      else vy = JUMP;
    };

    const onKey = (e: KeyboardEvent) => { if (e.key === " " || e.key === "ArrowUp") { e.preventDefault(); jump(); } };
    c.addEventListener("pointerdown", jump);
    window.addEventListener("keydown", onKey);

    const draw = () => {
      // sky
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#A8B4FF"); g.addColorStop(1, "#5A6AE0");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // ground
      ctx.fillStyle = "#3C9D6A"; ctx.fillRect(0, H - 30, W, 30);
      ctx.fillStyle = "#2F7E54"; ctx.fillRect(0, H - 30, W, 4);

      if (running && alive) {
        vy += GRAV; y += vy;
        if (frame % 90 === 0) pipes.push({ x: W, topH: 50 + Math.random() * (H - GAP - 130) });
        pipes.forEach(p => p.x -= PIPE_SPEED);
        pipes = pipes.filter(p => p.x + PIPE_W > 0);
      }

      // pipes
      pipes.forEach(p => {
        ctx.fillStyle = "#3C9D6A";
        ctx.fillRect(p.x, 0, PIPE_W, p.topH);
        ctx.fillRect(p.x, p.topH + GAP, PIPE_W, H - p.topH - GAP - 30);
        ctx.fillStyle = "#2F7E54";
        ctx.fillRect(p.x - 2, p.topH - 12, PIPE_W + 4, 12);
        ctx.fillRect(p.x - 2, p.topH + GAP, PIPE_W + 4, 12);
      });

      // bird
      const bx = 90;
      ctx.save();
      ctx.translate(bx, y);
      ctx.rotate(Math.max(-0.6, Math.min(1.2, vy * 0.08)));
      ctx.fillStyle = "#F2C779"; ctx.beginPath(); ctx.arc(0, 0, 13, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#FFFDF6"; ctx.beginPath(); ctx.arc(4, -3, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#0B0D12"; ctx.beginPath(); ctx.arc(5, -3, 2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#E89B5E"; ctx.beginPath(); ctx.moveTo(10, 1); ctx.lineTo(18, 0); ctx.lineTo(10, 5); ctx.fill();
      ctx.restore();

      // collision + score
      if (running && alive) {
        if (y + 13 > H - 30 || y - 13 < 0) alive = false;
        pipes.forEach(p => {
          if (bx + 12 > p.x && bx - 12 < p.x + PIPE_W && (y - 12 < p.topH || y + 12 > p.topH + GAP)) alive = false;
          if (!p.scored && p.x + PIPE_W < bx) { p.scored = true; localScore++; setScore(localScore); }
        });
        if (!alive) {
          setDead(true);
          setBest(b => { const nb = Math.max(b, localScore); localStorage.setItem("divyos:flappy:best", String(nb)); return nb; });
        }
        frame++;
      }

      // overlay text
      ctx.fillStyle = "rgba(0,0,0,0.4)";
      ctx.font = "600 28px Inter Tight, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(String(localScore), W / 2, 60);
      ctx.fillStyle = "#FFFDF6";
      ctx.fillText(String(localScore), W / 2, 58);

      if (!running || !alive) {
        ctx.fillStyle = "rgba(0,0,0,0.5)"; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#FFFDF6";
        ctx.font = "500 22px Fraunces, serif";
        ctx.fillText(!alive ? "flap fail" : "tap to fly", W / 2, H / 2 - 6);
        ctx.font = "400 12px JetBrains Mono, monospace";
        ctx.fillStyle = "rgba(255,253,246,0.7)";
        ctx.fillText("space · click · tap", W / 2, H / 2 + 18);
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); c.removeEventListener("pointerdown", jump); window.removeEventListener("keydown", onKey); };
  }, [running, dead]);

  return (
    <div className="h-full flex flex-col items-center justify-center gap-3 p-4" style={{ background: "linear-gradient(180deg,#1A2A4A,#0B0D12)" }}>
      <div className="flex gap-6 text-[12px]">
        <span className="text-os-ink-faint">SCORE <span className="text-os-amber font-mono ml-1">{score}</span></span>
        <span className="text-os-ink-faint">BEST <span className="text-os-mint font-mono ml-1">{best}</span></span>
      </div>
      <canvas ref={ref} width={W} height={H} className="rounded-xl border border-os-hairline cursor-pointer" />
    </div>
  );
}
