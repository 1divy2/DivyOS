import { useState } from "react";

type Mark = "X" | "O" | null;
const WIN_LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function winner(b: Mark[]): Mark {
  for (const [a,c,d] of WIN_LINES) if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  return null;
}

export function TicTacToeApp() {
  const [board, setBoard] = useState<Mark[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<Mark>("X");
  const [score, setScore] = useState({ X: 0, O: 0, draw: 0 });
  const w = winner(board);
  const full = board.every(Boolean);
  const done = w || full;

  const play = (i: number) => {
    if (board[i] || done) return;
    const nb = board.slice(); nb[i] = turn; setBoard(nb);
    const nw = winner(nb);
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
      <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl" style={{ background: "rgba(255,255,255,0.04)" }}>
        {board.map((c, i) => (
          <button key={i} onClick={() => play(i)} className="w-20 h-20 rounded-xl bg-white/5 hover:bg-white/10 transition flex items-center justify-center text-4xl font-light"
            style={{ color: c === "X" ? "var(--os-iris)" : c === "O" ? "var(--os-amber)" : "transparent", fontFamily: "Fraunces, serif" }}>
            {c ?? "·"}
          </button>
        ))}
      </div>
      <div className="text-[14px] text-os-ink-dim h-6">
        {w ? <>winner · <span className="text-os-ink">{w}</span></> : full ? "draw" : <>turn · <span className="text-os-ink">{turn}</span></>}
      </div>
      <button onClick={() => { setBoard(Array(9).fill(null)); setTurn("X"); }} className="px-3 py-1 text-[12px] rounded-md border border-os-hairline text-os-ink-dim hover:text-os-ink hover:border-os-iris">New round</button>
    </div>
  );
}
