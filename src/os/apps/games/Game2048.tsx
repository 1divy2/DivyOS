import { useCallback, useEffect, useState } from "react";

type Grid = number[][];
const N = 4;

const empty = (): Grid => Array.from({ length: N }, () => Array(N).fill(0));

function addRandom(g: Grid): Grid {
  const empties: [number, number][] = [];
  g.forEach((row, r) => row.forEach((v, c) => v === 0 && empties.push([r, c])));
  if (!empties.length) return g;
  const [r, c] = empties[Math.floor(Math.random() * empties.length)];
  const ng = g.map(row => row.slice());
  ng[r][c] = Math.random() < 0.9 ? 2 : 4;
  return ng;
}

function slide(row: number[]): { row: number[]; gain: number } {
  const f = row.filter(v => v);
  let gain = 0;
  for (let i = 0; i < f.length - 1; i++) {
    if (f[i] === f[i + 1]) { f[i] *= 2; gain += f[i]; f.splice(i + 1, 1); }
  }
  while (f.length < N) f.push(0);
  return { row: f, gain };
}

function move(g: Grid, dir: "l" | "r" | "u" | "d"): { g: Grid; gain: number; moved: boolean } {
  let gain = 0;
  let ng = g.map(r => r.slice());
  const rotate = (m: Grid) => m[0].map((_, i) => m.map(r => r[i]).reverse());
  const rotateBack = (m: Grid) => m[0].map((_, i) => m.map(r => r[i])).reverse();
  if (dir === "u") ng = rotate(ng);
  if (dir === "d") ng = rotateBack(ng);
  if (dir === "r") ng = ng.map(r => r.slice().reverse());
  ng = ng.map(r => { const { row, gain: gg } = slide(r); gain += gg; return row; });
  if (dir === "r") ng = ng.map(r => r.slice().reverse());
  if (dir === "u") ng = rotateBack(ng);
  if (dir === "d") ng = rotate(ng);
  const moved = JSON.stringify(g) !== JSON.stringify(ng);
  return { g: ng, gain, moved };
}

const COLORS: Record<number, string> = {
  0: "rgba(255,255,255,0.04)", 2: "#F2EFE8", 4: "#E8DFC8", 8: "#F2B879", 16: "#E89B5E",
  32: "#E07A4A", 64: "#D45A38", 128: "#E8D060", 256: "#E8C840", 512: "#E8BC28",
  1024: "#E8B010", 2048: "#A8B4FF",
};
const FG = (n: number) => (n <= 4 ? "#2A2520" : n >= 1024 ? "#0B0D12" : "#FFFDF6");

export function Game2048App() {
  const [grid, setGrid] = useState<Grid>(() => addRandom(addRandom(empty())));
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => Number(localStorage.getItem("divyos:2048:best") ?? 0));

  const reset = useCallback(() => { setGrid(addRandom(addRandom(empty()))); setScore(0); }, []);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const map: Record<string, "l"|"r"|"u"|"d"> = { ArrowLeft:"l", ArrowRight:"r", ArrowUp:"u", ArrowDown:"d", a:"l", d:"r", w:"u", s:"d" };
      const dir = map[e.key];
      if (!dir) return;
      e.preventDefault();
      setGrid(g => {
        const { g: ng, gain, moved } = move(g, dir);
        if (!moved) return g;
        setScore(s => {
          const ns = s + gain;
          setBest(b => { const nb = Math.max(b, ns); localStorage.setItem("divyos:2048:best", String(nb)); return nb; });
          return ns;
        });
        return addRandom(ng);
      });
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 gap-3" style={{ background: "linear-gradient(180deg,#1F1A12,#0B0D12)" }}>
      <div className="flex gap-3 items-center">
        <div className="text-os-ink-faint text-[11px] uppercase tracking-wider">2048</div>
        <Stat label="Score" v={score} />
        <Stat label="Best" v={best} />
        <button onClick={reset} className="ml-2 px-3 py-1 text-[12px] rounded-md border border-os-hairline text-os-ink-dim hover:text-os-ink">New</button>
      </div>
      <div className="p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.04)" }}>
        <div className="grid grid-cols-4 gap-2">
          {grid.flat().map((v, i) => (
            <div key={i} className="w-16 h-16 rounded-lg flex items-center justify-center font-semibold tabular-nums transition"
              style={{ background: COLORS[v] ?? "#A8B4FF", color: FG(v), fontFamily: "Inter Tight", fontSize: v >= 1024 ? 18 : v >= 128 ? 22 : 28 }}>
              {v > 0 ? v : ""}
            </div>
          ))}
        </div>
      </div>
      <div className="text-os-ink-faint text-[11px]">arrows or WASD</div>
    </div>
  );
}
function Stat({ label, v }: { label: string; v: number }) {
  return <div className="px-3 py-1 rounded-md bg-white/5 text-center"><div className="text-os-ink-faint text-[10px] uppercase">{label}</div><div className="text-os-ink font-semibold tabular-nums">{v}</div></div>;
}
