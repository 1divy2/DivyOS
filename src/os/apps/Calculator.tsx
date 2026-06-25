import { useState } from "react";

const BTNS: [string, string?][][] = [
  [["AC","fn"], ["±","fn"], ["%","fn"], ["÷","op"]],
  [["7"], ["8"], ["9"], ["×","op"]],
  [["4"], ["5"], ["6"], ["−","op"]],
  [["1"], ["2"], ["3"], ["+","op"]],
  [["0","wide"], [".",], ["=","eq"]],
];

export function CalculatorApp() {
  const [display, setDisplay] = useState("0");
  const [acc, setAcc] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [reset, setReset] = useState(false);

  const press = (k: string) => {
    if ("0123456789".includes(k)) {
      setDisplay(reset || display === "0" ? k : display + k);
      setReset(false);
    } else if (k === ".") {
      if (!display.includes(".")) setDisplay(display + ".");
    } else if (k === "AC") {
      setDisplay("0"); setAcc(null); setOp(null);
    } else if (k === "±") {
      setDisplay(display.startsWith("-") ? display.slice(1) : "-" + display);
    } else if (k === "%") {
      setDisplay(String(parseFloat(display) / 100));
    } else if ("+−×÷".includes(k)) {
      setAcc(parseFloat(display));
      setOp(k);
      setReset(true);
    } else if (k === "=" && op !== null && acc !== null) {
      const b = parseFloat(display);
      const r = op === "+" ? acc + b : op === "−" ? acc - b : op === "×" ? acc * b : acc / b;
      setDisplay(String(Math.round(r * 1e10) / 1e10));
      setAcc(null); setOp(null); setReset(true);
    }
  };

  return (
    <div className="h-full flex flex-col p-4 gap-3" style={{ background: "linear-gradient(180deg,#1A1D26,#0B0D12)" }}>
      <div className="flex-1 flex items-end justify-end px-2 text-os-ink text-[44px] font-light tabular-nums truncate" style={{ fontFamily: "Inter Tight", letterSpacing: "-0.02em" }}>
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {BTNS.flatMap((row, ri) => row.map(([k, kind], ci) => {
          const wide = kind === "wide";
          const color = kind === "op" ? "bg-os-amber/90 text-black hover:bg-os-amber" : kind === "eq" ? "bg-os-iris text-black hover:bg-os-iris/90" : kind === "fn" ? "bg-white/15 text-os-ink hover:bg-white/20" : "bg-white/8 text-os-ink hover:bg-white/12";
          return (
            <button
              key={`${ri}-${ci}`}
              onClick={() => press(k)}
              className={`h-12 rounded-full text-[18px] font-medium transition ${color} ${wide ? "col-span-2" : ""}`}
            >{k}</button>
          );
        }))}
      </div>
    </div>
  );
}
