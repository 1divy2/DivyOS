import type { CSSProperties } from "react";

/**
 * DivyOS icon system. Each app has a unique squircle with gradient + glyph.
 * No emoji, no stock icons. All vector.
 */

type IconDef = { from: string; to: string; ink: string; glyph: (s: number) => React.ReactNode };

const ICONS: Record<string, IconDef> = {
  about: {
    from: "#A8B4FF", to: "#5A6AE0", ink: "#0B0D12",
    glyph: (s) => <circle cx={s/2} cy={s/2} r={s*0.18} fill="#0B0D12" />,
  },
  terminal: {
    from: "#1F2330", to: "#0B0D12", ink: "#7BE3B0",
    glyph: (s) => (<>
      <path d={`M${s*0.28} ${s*0.35} L${s*0.46} ${s*0.5} L${s*0.28} ${s*0.65}`} stroke="#7BE3B0" strokeWidth={s*0.06} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x={s*0.5} y={s*0.6} width={s*0.22} height={s*0.06} fill="#7BE3B0" rx={s*0.02} />
    </>),
  },
  projects: {
    from: "#E8B57A", to: "#B07840", ink: "#0B0D12",
    glyph: (s) => (<>
      <path d={`M${s*0.22} ${s*0.32} h${s*0.22} l${s*0.06} ${s*0.08} h${s*0.28} v${s*0.32} h-${s*0.56} z`} fill="#0B0D12" opacity={0.85}/>
    </>),
  },
  resume: {
    from: "#F2EFE8", to: "#C9C2B0", ink: "#2A2520",
    glyph: (s) => (<>
      <rect x={s*0.3} y={s*0.22} width={s*0.4} height={s*0.56} fill="#FFFDF6" rx={s*0.03}/>
      <rect x={s*0.36} y={s*0.32} width={s*0.28} height={s*0.04} fill="#2A2520"/>
      <rect x={s*0.36} y={s*0.42} width={s*0.22} height={s*0.025} fill="#7A736A"/>
      <rect x={s*0.36} y={s*0.48} width={s*0.26} height={s*0.025} fill="#7A736A"/>
      <rect x={s*0.36} y={s*0.54} width={s*0.18} height={s*0.025} fill="#7A736A"/>
    </>),
  },
  skills: {
    from: "#8EE3B0", to: "#3C9D6A", ink: "#0B0D12",
    glyph: (s) => (<>
      {[0,1,2,3,4,5].map(i => {
        const a = (Math.PI*2/6)*i - Math.PI/2;
        return <circle key={i} cx={s/2 + Math.cos(a)*s*0.2} cy={s/2 + Math.sin(a)*s*0.2} r={s*0.05} fill="#0B0D12"/>;
      })}
      <circle cx={s/2} cy={s/2} r={s*0.06} fill="#0B0D12"/>
    </>),
  },
  experience: {
    from: "#E89BAE", to: "#9C4F66", ink: "#0B0D12",
    glyph: (s) => (<>
      <rect x={s*0.25} y={s*0.46} width={s*0.5} height={s*0.04} fill="#0B0D12"/>
      <circle cx={s*0.32} cy={s*0.48} r={s*0.05} fill="#0B0D12"/>
      <circle cx={s*0.5} cy={s*0.48} r={s*0.05} fill="#0B0D12"/>
      <circle cx={s*0.68} cy={s*0.48} r={s*0.05} fill="#0B0D12"/>
    </>),
  },
  education: {
    from: "#A8B4FF", to: "#3A4A8E", ink: "#0B0D12",
    glyph: (s) => (<>
      <path d={`M${s*0.2} ${s*0.46} L${s*0.5} ${s*0.32} L${s*0.8} ${s*0.46} L${s*0.5} ${s*0.6} z`} fill="#0B0D12"/>
      <path d={`M${s*0.65} ${s*0.5} v${s*0.12}`} stroke="#0B0D12" strokeWidth={s*0.025}/>
    </>),
  },
  certificates: {
    from: "#E8B57A", to: "#8E5E2C", ink: "#0B0D12",
    glyph: (s) => (<>
      <circle cx={s/2} cy={s*0.42} r={s*0.13} fill="#FFD89B" stroke="#0B0D12" strokeWidth={s*0.02}/>
      <path d={`M${s*0.43} ${s*0.52} L${s*0.4} ${s*0.7} L${s*0.5} ${s*0.62} L${s*0.6} ${s*0.7} L${s*0.57} ${s*0.52}`} fill="#9C4F66"/>
    </>),
  },
  gallery: {
    from: "#8EE3B0", to: "#2E6BA0", ink: "#0B0D12",
    glyph: (s) => (<>
      <rect x={s*0.22} y={s*0.28} width={s*0.56} height={s*0.44} fill="#0B0D12" opacity={0.4}/>
      <circle cx={s*0.36} cy={s*0.4} r={s*0.04} fill="#FFD89B"/>
      <path d={`M${s*0.22} ${s*0.62} L${s*0.38} ${s*0.48} L${s*0.52} ${s*0.58} L${s*0.68} ${s*0.42} L${s*0.78} ${s*0.52} V${s*0.72} H${s*0.22} z`} fill="#A8B4FF"/>
    </>),
  },
  contact: {
    from: "#E89BAE", to: "#7A3450", ink: "#0B0D12",
    glyph: (s) => (<>
      <rect x={s*0.24} y={s*0.34} width={s*0.52} height={s*0.32} rx={s*0.04} fill="#FFFDF6"/>
      <path d={`M${s*0.24} ${s*0.34} L${s*0.5} ${s*0.54} L${s*0.76} ${s*0.34}`} stroke="#9C4F66" strokeWidth={s*0.025} fill="none"/>
    </>),
  },
  github: {
    from: "#1F2330", to: "#0B0D12", ink: "#E8E6E1",
    glyph: (s) => (<>
      <path d={`M${s/2} ${s*0.22} a${s*0.28} ${s*0.28} 0 0 0 -${s*0.09} ${s*0.546} c${s*0.014} ${0.0028*s} ${s*0.02} -${s*0.006} ${s*0.02} -${s*0.014} v-${s*0.05} c-${s*0.078} ${s*0.017} -${s*0.094} -${s*0.038} -${s*0.094} -${s*0.038} c-${s*0.013} -${s*0.032} -${s*0.031} -${s*0.041} -${s*0.031} -${s*0.041} c-${s*0.025} -${s*0.017} ${s*0.002} -${s*0.017} ${s*0.002} -${s*0.017} c${s*0.028} ${s*0.002} ${s*0.043} ${s*0.029} ${s*0.043} ${s*0.029} c${s*0.025} ${s*0.043} ${s*0.066} ${s*0.031} ${s*0.082} ${s*0.023} c${s*0.003} -${s*0.018} ${s*0.01} -${s*0.031} ${s*0.018} -${s*0.038} c-${s*0.063} -${s*0.007} -${s*0.129} -${s*0.031} -${s*0.129} -${s*0.14} c0 -${s*0.031} ${s*0.011} -${s*0.057} ${s*0.029} -${s*0.077} c-${s*0.003} -${s*0.007} -${s*0.013} -${s*0.036} ${s*0.003} -${s*0.076} c0 0 ${s*0.024} -${s*0.008} ${s*0.077} ${s*0.029} c${s*0.022} -${s*0.006} ${s*0.046} -${s*0.009} ${s*0.07} -${s*0.009} c${s*0.024} 0 ${s*0.048} ${s*0.003} ${s*0.07} ${s*0.009} c${s*0.054} -${s*0.037} ${s*0.077} -${s*0.029} ${s*0.077} -${s*0.029} c${s*0.016} ${s*0.04} ${s*0.006} ${s*0.069} ${s*0.003} ${s*0.076} c${s*0.018} ${s*0.02} ${s*0.029} ${s*0.046} ${s*0.029} ${s*0.077} c0 ${s*0.109} -${s*0.066} ${s*0.133} -${s*0.129} ${s*0.14} c${s*0.01} ${s*0.009} ${s*0.019} ${s*0.026} ${s*0.019} ${s*0.053} v${s*0.078} c0 ${s*0.008} ${s*0.005} ${s*0.017} ${s*0.02} ${s*0.014} a${s*0.28} ${s*0.28} 0 0 0 -${s*0.09} -${s*0.546} z`} fill="#E8E6E1"/>
    </>),
  },
  notes: {
    from: "#F2C779", to: "#9C7430", ink: "#2A2520",
    glyph: (s) => (<>
      <rect x={s*0.28} y={s*0.24} width={s*0.44} height={s*0.52} fill="#FFFDF6" rx={s*0.02}/>
      <rect x={s*0.34} y={s*0.34} width={s*0.32} height={s*0.02} fill="#9C7430"/>
      <rect x={s*0.34} y={s*0.42} width={s*0.28} height={s*0.02} fill="#9C7430"/>
      <rect x={s*0.34} y={s*0.50} width={s*0.30} height={s*0.02} fill="#9C7430"/>
      <rect x={s*0.34} y={s*0.58} width={s*0.20} height={s*0.02} fill="#9C7430"/>
    </>),
  },
  monitor: {
    from: "#3A4A8E", to: "#0B0D12", ink: "#8EE3B0",
    glyph: (s) => (<>
      <polyline points={`${s*0.22},${s*0.58} ${s*0.35},${s*0.5} ${s*0.45},${s*0.62} ${s*0.58},${s*0.36} ${s*0.7},${s*0.48} ${s*0.78},${s*0.42}`} fill="none" stroke="#8EE3B0" strokeWidth={s*0.04} strokeLinejoin="round" strokeLinecap="round"/>
    </>),
  },
  settings: {
    from: "#A0A4B0", to: "#3A3D48", ink: "#E8E6E1",
    glyph: (s) => (<>
      {[0,1,2,3,4,5,6,7].map(i => {
        const a = (Math.PI*2/8)*i;
        const x1 = s/2 + Math.cos(a)*s*0.2, y1 = s/2 + Math.sin(a)*s*0.2;
        const x2 = s/2 + Math.cos(a)*s*0.28, y2 = s/2 + Math.sin(a)*s*0.28;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#E8E6E1" strokeWidth={s*0.05} strokeLinecap="round"/>;
      })}
      <circle cx={s/2} cy={s/2} r={s*0.13} fill="none" stroke="#E8E6E1" strokeWidth={s*0.04}/>
      <circle cx={s/2} cy={s/2} r={s*0.05} fill="#E8E6E1"/>
    </>),
  },
  calculator: {
    from: "#2A2D38", to: "#0B0D12", ink: "#E8B57A",
    glyph: (s) => (<>
      <rect x={s*0.26} y={s*0.26} width={s*0.48} height={s*0.16} fill="#1A1D26" rx={s*0.02}/>
      <text x={s*0.7} y={s*0.39} fontSize={s*0.1} fill="#7BE3B0" textAnchor="end" fontFamily="JetBrains Mono">42</text>
      {[0,1,2,3].map(r=>[0,1,2].map(c=>(
        <circle key={`${r}-${c}`} cx={s*0.32+c*s*0.13} cy={s*0.52+r*s*0.08} r={s*0.03} fill="#E8E6E1" opacity={0.6}/>
      )))}
    </>),
  },
  calendar: {
    from: "#E89BAE", to: "#7A3450", ink: "#FFFDF6",
    glyph: (s) => (<>
      <rect x={s*0.24} y={s*0.28} width={s*0.52} height={s*0.48} fill="#FFFDF6" rx={s*0.03}/>
      <rect x={s*0.24} y={s*0.28} width={s*0.52} height={s*0.1} fill="#7A3450"/>
      <text x={s*0.5} y={s*0.6} fontSize={s*0.22} fill="#7A3450" textAnchor="middle" fontFamily="Inter Tight" fontWeight="700">12</text>
    </>),
  },
  music: {
    from: "#E89BAE", to: "#A8B4FF", ink: "#0B0D12",
    glyph: (s) => (<>
      <circle cx={s/2} cy={s/2} r={s*0.26} fill="#0B0D12"/>
      <circle cx={s/2} cy={s/2} r={s*0.06} fill="#E89BAE"/>
      <circle cx={s/2} cy={s/2} r={s*0.18} fill="none" stroke="#A8B4FF" strokeWidth={s*0.012}/>
    </>),
  },
  browser: {
    from: "#8EE3B0", to: "#2E6BA0", ink: "#FFFDF6",
    glyph: (s) => (<>
      <circle cx={s/2} cy={s/2} r={s*0.26} fill="none" stroke="#FFFDF6" strokeWidth={s*0.02}/>
      <ellipse cx={s/2} cy={s/2} rx={s*0.12} ry={s*0.26} fill="none" stroke="#FFFDF6" strokeWidth={s*0.02}/>
      <line x1={s*0.24} y1={s/2} x2={s*0.76} y2={s/2} stroke="#FFFDF6" strokeWidth={s*0.02}/>
    </>),
  },
  files: {
    from: "#A8B4FF", to: "#3A4A8E", ink: "#0B0D12",
    glyph: (s) => (<>
      <path d={`M${s*0.22} ${s*0.32} h${s*0.2} l${s*0.06} ${s*0.06} h${s*0.3} v${s*0.32} h-${s*0.56} z`} fill="#FFFDF6"/>
      <path d={`M${s*0.22} ${s*0.42} h${s*0.56} v${s*0.28} h-${s*0.56} z`} fill="#E8E6E1"/>
    </>),
  },
  trash: {
    from: "#3A3D48", to: "#1A1D26", ink: "#E8E6E1",
    glyph: (s) => (<>
      <rect x={s*0.32} y={s*0.34} width={s*0.36} height={s*0.04} fill="#E8E6E1" rx={s*0.01}/>
      <path d={`M${s*0.34} ${s*0.4} L${s*0.38} ${s*0.74} h${s*0.24} L${s*0.66} ${s*0.4} z`} fill="none" stroke="#E8E6E1" strokeWidth={s*0.025}/>
    </>),
  },
  snake: {
    from: "#2E6BA0", to: "#0E1228", ink: "#8EE3B0",
    glyph: (s) => (<>
      <rect x={s*0.3} y={s*0.4} width={s*0.08} height={s*0.08} fill="#8EE3B0"/>
      <rect x={s*0.38} y={s*0.4} width={s*0.08} height={s*0.08} fill="#8EE3B0"/>
      <rect x={s*0.46} y={s*0.4} width={s*0.08} height={s*0.08} fill="#8EE3B0"/>
      <rect x={s*0.46} y={s*0.48} width={s*0.08} height={s*0.08} fill="#8EE3B0"/>
      <rect x={s*0.54} y={s*0.48} width={s*0.08} height={s*0.08} fill="#8EE3B0"/>
      <rect x={s*0.62} y={s*0.48} width={s*0.08} height={s*0.08} fill="#E89BAE"/>
    </>),
  },
  tictactoe: {
    from: "#F2C779", to: "#9C7430", ink: "#0B0D12",
    glyph: (s) => (<>
      <line x1={s*0.42} y1={s*0.26} x2={s*0.42} y2={s*0.74} stroke="#0B0D12" strokeWidth={s*0.025}/>
      <line x1={s*0.58} y1={s*0.26} x2={s*0.58} y2={s*0.74} stroke="#0B0D12" strokeWidth={s*0.025}/>
      <line x1={s*0.26} y1={s*0.42} x2={s*0.74} y2={s*0.42} stroke="#0B0D12" strokeWidth={s*0.025}/>
      <line x1={s*0.26} y1={s*0.58} x2={s*0.74} y2={s*0.58} stroke="#0B0D12" strokeWidth={s*0.025}/>
      <text x={s*0.34} y={s*0.4} fontSize={s*0.14} fill="#0B0D12" fontWeight="700" textAnchor="middle">×</text>
      <circle cx={s*0.66} cy={s*0.5} r={s*0.05} fill="none" stroke="#0B0D12" strokeWidth={s*0.025}/>
    </>),
  },
  t2048: {
    from: "#E8B57A", to: "#B07840", ink: "#FFFDF6",
    glyph: (s) => (<>
      <rect x={s*0.26} y={s*0.26} width={s*0.22} height={s*0.22} fill="#FFFDF6" rx={s*0.02}/>
      <rect x={s*0.52} y={s*0.26} width={s*0.22} height={s*0.22} fill="#E8E6E1" rx={s*0.02}/>
      <rect x={s*0.26} y={s*0.52} width={s*0.22} height={s*0.22} fill="#E8E6E1" rx={s*0.02}/>
      <rect x={s*0.52} y={s*0.52} width={s*0.22} height={s*0.22} fill="#FFFDF6" rx={s*0.02}/>
      <text x={s*0.5} y={s*0.56} fontSize={s*0.12} fill="#0B0D12" textAnchor="middle" fontWeight="700">2048</text>
    </>),
  },
  minesweeper: {
    from: "#A0A4B0", to: "#3A3D48", ink: "#0B0D12",
    glyph: (s) => (<>
      <circle cx={s/2} cy={s/2} r={s*0.18} fill="#0B0D12"/>
      {[[0.5,0.28],[0.72,0.5],[0.5,0.72],[0.28,0.5]].map(([x,y],i)=>(
        <rect key={i} x={s*(x as number)-s*0.02} y={s*(y as number)-s*0.08} width={s*0.04} height={s*0.16} fill="#0B0D12" transform={`rotate(${i*45} ${s*(x as number)} ${s*(y as number)})`}/>
      ))}
    </>),
  },
  flappy: {
    from: "#A8B4FF", to: "#2E6BA0", ink: "#F2C779",
    glyph: (s) => (<>
      <circle cx={s*0.42} cy={s*0.5} r={s*0.13} fill="#F2C779"/>
      <circle cx={s*0.48} cy={s*0.46} r={s*0.025} fill="#0B0D12"/>
      <path d={`M${s*0.55} ${s*0.5} l${s*0.08} -${s*0.02} l-${s*0.04} ${s*0.06} z`} fill="#E89BAE"/>
      <rect x={s*0.7} y={s*0.22} width={s*0.08} height={s*0.18} fill="#8EE3B0"/>
      <rect x={s*0.7} y={s*0.6} width={s*0.08} height={s*0.18} fill="#8EE3B0"/>
    </>),
  },
  spotlight: {
    from: "#E8E6E1", to: "#A0A4B0", ink: "#0B0D12",
    glyph: (s) => (<>
      <circle cx={s*0.44} cy={s*0.44} r={s*0.16} fill="none" stroke="#0B0D12" strokeWidth={s*0.04}/>
      <line x1={s*0.56} y1={s*0.56} x2={s*0.72} y2={s*0.72} stroke="#0B0D12" strokeWidth={s*0.05} strokeLinecap="round"/>
    </>),
  },
  pong: {
    from: "#8EE3B0", to: "#3C9D6A", ink: "#0B0D12",
    glyph: (s) => (<>
      <line x1={s*0.3} y1={s*0.3} x2={s*0.3} y2={s*0.7} stroke="#0B0D12" strokeWidth={s*0.08} strokeLinecap="round" />
      <line x1={s*0.7} y1={s*0.3} x2={s*0.7} y2={s*0.7} stroke="#0B0D12" strokeWidth={s*0.08} strokeLinecap="round" />
      <circle cx={s/2} cy={s/2} r={s*0.06} fill="#0B0D12"/>
    </>),
  },
  breakout: {
    from: "#E89BAE", to: "#9C4F66", ink: "#0B0D12",
    glyph: (s) => (<>
      {[0,1,2].map(r => [0,1,2,3].map(c => (
        <rect key={`${r}-${c}`} x={s*0.2 + c*s*0.16} y={s*0.25 + r*s*0.1} width={s*0.14} height={s*0.08} fill="#0B0D12" rx={s*0.02} opacity={1 - r*0.2} />
      )))}
      <circle cx={s/2} cy={s*0.65} r={s*0.05} fill="#0B0D12"/>
      <rect x={s*0.35} y={s*0.75} width={s*0.3} height={s*0.06} fill="#0B0D12" rx={s*0.02} />
    </>),
  },
  asteroids: {
    from: "#E8B57A", to: "#B07840", ink: "#0B0D12",
    glyph: (s) => (<>
      <path d={`M${s/2} ${s*0.3} L${s*0.65} ${s*0.7} L${s/2} ${s*0.6} L${s*0.35} ${s*0.7} z`} fill="#0B0D12" stroke="#0B0D12" strokeWidth={s*0.04} strokeLinejoin="round" />
      <circle cx={s*0.25} cy={s*0.35} r={s*0.05} fill="#0B0D12" opacity={0.6}/>
      <circle cx={s*0.75} cy={s*0.45} r={s*0.04} fill="#0B0D12" opacity={0.8}/>
      <circle cx={s*0.65} cy={s*0.25} r={s*0.03} fill="#0B0D12" opacity={0.5}/>
    </>),
  },
};

const FALLBACK: IconDef = { from: "#3A3D48", to: "#1A1D26", ink: "#E8E6E1", glyph: () => null };

export function AppIcon({ id, size = 44, style, className }: { id: string; size?: number; style?: CSSProperties; className?: string }) {
  const def = ICONS[id] ?? FALLBACK;
  const gid = `g-${id}`;
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className={className} style={style} aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={def.from}/>
          <stop offset="1" stopColor={def.to}/>
        </linearGradient>
        <filter id={`s-${id}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation={size*0.04}/>
          <feOffset dy={size*0.02}/>
          <feComponentTransfer><feFuncA type="linear" slope="0.45"/></feComponentTransfer>
          <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect x="1" y="1" width={size-2} height={size-2} rx={size*0.26} fill={`url(#${gid})`} filter={`url(#s-${id})`} />
      <rect x="1" y="1" width={size-2} height={size-2} rx={size*0.26} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
      <rect x="2" y="2" width={size-4} height={size*0.45} rx={size*0.24} fill="rgba(255,255,255,0.08)"/>
      {def.glyph(size)}
    </svg>
  );
}
