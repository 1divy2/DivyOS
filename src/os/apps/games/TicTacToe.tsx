import { useState } from "react";

type Mark = "X" | "O" | null;
const WIN_LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function getWinner(b: Mark[]) {
  for (const line of WIN_LINES) {
    const [a,c,d] = line;
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return { w: b[a], line };
  }
  return { w: null, line: null };
}

export function TicTacToeApp() {
  const [board, setBoard] = useState<Mark[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<Mark>("X");
  const [score, setScore] = useState({ X: 0, O: 0, draw: 0 });
  
  const { w, line: winLine } = getWinner(board);
  const full = board.every(Boolean);
  const done = w || full;

  const play = (i: number) => {
    if (board[i] || done) return;
    const nb = board.slice(); nb[i] = turn; setBoard(nb);
    const { w: nw } = getWinner(nb);
    if (nw) setScore(s => ({ ...s, [nw]: s[nw] + 1 } as typeof s));
    else if (nb.every(Boolean)) setScore(s => ({ ...s, draw: s.draw + 1 }));
    else setTurn(turn === "X" ? "O" : "X");
  };

  return (
    <div className="h-full flex flex-col items-center justify-center gap-5 p-6" style={{ background: "linear-gradient(180deg,#2A1F0E,#0B0D12)" }}>
      <div className="flex gap-8 text-[12px] text-os-ink-faint uppercase tracking-wider">
        <span>X <span className="text-os-iris font-mono ml-1.5 text-[15px]">{score.X}</span></span>
        <span>Draws <span className="text-os-ink font-mono ml-1.5 text-[15px]">{score.draw}</span></span>
        <span>O <span className="text-os-amber font-mono ml-1.5 text-[15px]">{score.O}</span></span>
      </div>
      
      <div className="relative grid grid-cols-3 gap-2 p-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)" }}>
        {board.map((c, i) => (
          <button key={i} onClick={() => play(i)} className="w-20 h-20 rounded-xl bg-white/5 hover:bg-white/10 transition flex items-center justify-center text-4xl font-light"
            style={{ color: c === "X" ? "var(--os-iris)" : c === "O" ? "var(--os-amber)" : "transparent", fontFamily: "Fraunces, serif" }}>
            {c ?? "·"}
          </button>
        ))}
        {winLine && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] z-10" viewBox="0 0 280 280">
            <line 
              x1={52 + (winLine[0] % 3) * 88} y1={52 + Math.floor(winLine[0] / 3) * 88}
              x2={52 + (winLine[2] % 3) * 88} y2={52 + Math.floor(winLine[2] / 3) * 88}
              stroke="white" strokeWidth="4" strokeLinecap="round"
              className="animate-in fade-in duration-300 zoom-in-50"
            />
          </svg>
        )}
      </div>

      <div className="text-[14px] text-os-ink-dim h-6 mt-2">
        {w ? <>winner · <span className="text-os-ink font-medium">{w}</span></> : full ? "draw" : <>turn · <span className="text-os-ink">{turn}</span></>}
      </div>
      <button onClick={() => { setBoard(Array(9).fill(null)); setTurn("X"); }} className="px-3 py-1 text-[12px] rounded-md border border-os-hairline text-os-ink-dim hover:text-os-ink hover:border-os-iris transition-colors">New round</button>
    </div>
  );
}
