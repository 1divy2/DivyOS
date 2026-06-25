import { useCallback, useMemo, useState } from "react";

const W = 9, H = 9, MINES = 10;
type Cell = { mine: boolean; revealed: boolean; flagged: boolean; n: number };

function build(): Cell[][] {
  const g: Cell[][] = Array.from({ length: H }, () => Array.from({ length: W }, () => ({ mine: false, revealed: false, flagged: false, n: 0 })));
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * H), c = Math.floor(Math.random() * W);
    if (!g[r][c].mine) { g[r][c].mine = true; placed++; }
  }
  for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) {
    if (g[r][c].mine) continue;
    let n = 0;
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      const nr = r + dr, nc = c + dc;
      if (nr>=0&&nr<H&&nc>=0&&nc<W&&g[nr][nc].mine) n++;
    }
    g[r][c].n = n;
  }
  return g;
}

const COLOR = ["", "#A8B4FF", "#7BE3B0", "#E89BAE", "#9C7AE0", "#E8B57A", "#7AE0D0", "#E8E6E1", "#E07A4A"];

export function MinesweeperApp() {
  const [grid, setGrid] = useState<Cell[][]>(build);
  const [dead, setDead] = useState(false);

  const won = useMemo(() => grid.flat().every(c => c.mine ? !c.revealed : c.revealed), [grid]);

  const reveal = useCallback((r: number, c: number) => {
    if (dead || won) return;
    setGrid(g => {
      const ng = g.map(row => row.map(c2 => ({ ...c2 })));
      const stack: [number, number][] = [[r, c]];
      while (stack.length) {
        const [cr, cc] = stack.pop()!;
        const cell = ng[cr]?.[cc];
        if (!cell || cell.revealed || cell.flagged) continue;
        cell.revealed = true;
        if (cell.mine) { setDead(true); continue; }
        if (cell.n === 0) {
          for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
            if (dr || dc) stack.push([cr + dr, cc + dc]);
          }
        }
      }
      return ng;
    });
  }, [dead, won]);

  const flag = (r: number, c: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (dead || won) return;
    setGrid(g => g.map((row, ri) => row.map((c2, ci) => ri===r&&ci===c&&!c2.revealed ? { ...c2, flagged: !c2.flagged } : c2)));
  };

  return (
    <div className="h-full flex flex-col items-center justify-center gap-3 p-4" style={{ background: "linear-gradient(180deg,#1A1D26,#0B0D12)" }}>
      <div className="flex items-center gap-4 text-[12px]">
        <span className="text-os-amber font-mono tabular-nums">⚑ {MINES - grid.flat().filter(c => c.flagged).length}</span>
        <button onClick={() => { setGrid(build()); setDead(false); }} className="text-2xl hover:scale-110 transition" title="restart">
          {dead ? "💀" : won ? "★" : "·"}
        </button>
        <span className="text-os-mint font-mono text-[11px] uppercase">{won ? "swept" : dead ? "boom" : "alive"}</span>
      </div>
      <div className="p-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.04)" }}>
        {grid.map((row, r) => (
          <div key={r} className="flex">
            {row.map((cell, c) => (
              <button
                key={c}
                onClick={() => reveal(r, c)}
                onContextMenu={(e) => flag(r, c, e)}
                className="w-7 h-7 m-px rounded text-[12px] font-bold flex items-center justify-center transition"
                style={{
                  background: cell.revealed ? (cell.mine ? "#E07A4A" : "rgba(255,255,255,0.06)") : "rgba(255,255,255,0.12)",
                  color: cell.mine ? "#000" : COLOR[cell.n],
                }}
              >
                {cell.revealed ? (cell.mine ? "●" : cell.n || "") : cell.flagged ? "⚑" : ""}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="text-os-ink-faint text-[11px]">click reveal · right-click flag</div>
    </div>
  );
}
