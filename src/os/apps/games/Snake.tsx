import { useEffect, useRef, useState, useCallback } from "react";

const SIZE = 20;
const TICK = 110;

type Pt = { x: number; y: number };

function spawn(snake: Pt[]): Pt {
  while (true) {
    const p = { x: Math.floor(Math.random() * SIZE), y: Math.floor(Math.random() * SIZE) };
    if (!snake.some(s => s.x === p.x && s.y === p.y)) return p;
  }
}

export function SnakeApp() {
  const [snake, setSnake] = useState<Pt[]>([{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]);
  const [dir, setDir] = useState<Pt>({ x: 1, y: 0 });
  const [food, setFood] = useState<Pt>({ x: 14, y: 10 });
  const [dead, setDead] = useState(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem("divyos:snake:best") ?? 0));
  const dirRef = useRef(dir); dirRef.current = dir;

  const reset = useCallback(() => {
    setSnake([{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }]);
    setDir({ x: 1, y: 0 });
    setFood({ x: 14, y: 10 });
    setDead(false);
    setScore(0);
  }, []);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const d = dirRef.current;
      if ((e.key === "ArrowUp" || e.key === "w") && d.y === 0) setDir({ x: 0, y: -1 });
      if ((e.key === "ArrowDown" || e.key === "s") && d.y === 0) setDir({ x: 0, y: 1 });
      if ((e.key === "ArrowLeft" || e.key === "a") && d.x === 0) setDir({ x: -1, y: 0 });
      if ((e.key === "ArrowRight" || e.key === "d") && d.x === 0) setDir({ x: 1, y: 0 });
      if (e.key === " " && dead) reset();
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [dead, reset]);

  useEffect(() => {
    if (dead) return;
    const i = setInterval(() => {
      setSnake(prev => {
        const head = { x: prev[0].x + dirRef.current.x, y: prev[0].y + dirRef.current.y };
        if (head.x < 0 || head.x >= SIZE || head.y < 0 || head.y >= SIZE || prev.some(s => s.x === head.x && s.y === head.y)) {
          setDead(true);
          setBest(b => {
            const nb = Math.max(b, score);
            localStorage.setItem("divyos:snake:best", String(nb));
            return nb;
          });
          return prev;
        }
        const ate = head.x === food.x && head.y === food.y;
        const next = ate ? [head, ...prev] : [head, ...prev.slice(0, -1)];
        if (ate) {
          setFood(spawn(next));
          setScore(s => s + 1);
        }
        return next;
      });
    }, TICK);
    return () => clearInterval(i);
  }, [dead, food, score]);

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 gap-3" style={{ background: "linear-gradient(180deg,#0E1228,#0B0D12)" }}>
      <div className="flex gap-6 text-[12px] tabular-nums">
        <span className="text-os-ink-faint">SCORE <span className="text-os-mint font-mono ml-1">{score}</span></span>
        <span className="text-os-ink-faint">BEST <span className="text-os-amber font-mono ml-1">{best}</span></span>
      </div>
      <div className="relative rounded-xl overflow-hidden border border-os-hairline" style={{ background: "#0B0D12" }}>
        <svg width={SIZE * 18} height={SIZE * 18} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          {snake.map((s, i) => (
            <rect key={i} x={s.x + 0.08} y={s.y + 0.08} width={0.84} height={0.84} rx={0.18} fill={i === 0 ? "#A8FFD0" : "#7BE3B0"} opacity={1 - i * 0.012} />
          ))}
          <circle cx={food.x + 0.5} cy={food.y + 0.5} r={0.35} fill="#E89BAE" />
        </svg>
        {dead && (
          <div className="absolute inset-0 backdrop-blur-md bg-black/40 flex flex-col items-center justify-center gap-2">
            <div className="text-os-ink text-[20px]" style={{ fontFamily: "Fraunces, serif" }}>game over</div>
            <button onClick={reset} className="px-4 py-1.5 rounded-md bg-os-iris text-black text-[13px]">Play again · space</button>
          </div>
        )}
      </div>
      <div className="text-os-ink-faint text-[11px]">arrows or WASD</div>
    </div>
  );
}
