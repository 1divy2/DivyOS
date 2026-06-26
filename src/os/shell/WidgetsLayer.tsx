import { useState, useEffect } from "react";
import { motion } from "motion/react";

export function WidgetsLayer() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none p-12 flex flex-col gap-6 items-end justify-start">
      <ClockWidget />
      <SystemWidget />
    </div>
  );
}

function ClockWidget() {
  const [time, setTime] = useState(new Date());
  
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const h = time.getHours();
  const m = time.getMinutes();
  const s = time.getSeconds();
  
  return (
    <motion.div 
      drag 
      dragMomentum={false}
      className="pointer-events-auto w-64 h-64 rounded-[40px] glass-strong border border-white/10 shadow-2xl flex items-center justify-center relative overflow-hidden backdrop-blur-2xl"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50" />
      {/* Clock Face */}
      <div className="relative w-48 h-48 rounded-full border-[6px] border-white/5 flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
        {/* Markers */}
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className="absolute w-1 h-3 bg-white/20 rounded-full"
            style={{ transform: `rotate(${i * 30}deg) translateY(-20px)` }}
          />
        ))}
        {/* Hands */}
        <div 
          className="absolute w-1.5 h-16 bg-white rounded-full origin-bottom"
          style={{ transform: `translateY(-50%) rotate(${h * 30 + m * 0.5}deg)` }}
        />
        <div 
          className="absolute w-1 h-20 bg-white/80 rounded-full origin-bottom"
          style={{ transform: `translateY(-50%) rotate(${m * 6}deg)` }}
        />
        <div 
          className="absolute w-0.5 h-22 bg-os-amber rounded-full origin-bottom"
          style={{ transform: `translateY(-50%) rotate(${s * 6}deg)` }}
        />
        {/* Center dot */}
        <div className="absolute w-3 h-3 bg-os-amber rounded-full shadow-[0_0_10px_var(--os-amber)]" />
      </div>
    </motion.div>
  );
}

function SystemWidget() {
  return (
    <motion.div 
      drag 
      dragMomentum={false}
      className="pointer-events-auto w-64 p-6 rounded-[32px] glass-strong border border-white/10 shadow-2xl flex flex-col gap-4 relative overflow-hidden backdrop-blur-2xl"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent" />
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-os-iris/20 flex items-center justify-center text-os-iris">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>
          </div>
          <span className="font-semibold text-sm">System</span>
        </div>
        <span className="text-[10px] uppercase text-os-ink-faint font-semibold tracking-wider">Online</span>
      </div>
      
      <div className="relative z-10 space-y-3">
        <div>
          <div className="flex justify-between text-[11px] mb-1.5 font-medium">
            <span className="text-os-ink-dim">CPU</span>
            <span>24%</span>
          </div>
          <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
            <div className="h-full bg-os-iris w-[24%]" />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-[11px] mb-1.5 font-medium">
            <span className="text-os-ink-dim">Memory</span>
            <span>4.2 GB</span>
          </div>
          <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 w-[60%]" />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-[11px] mb-1.5 font-medium">
            <span className="text-os-ink-dim">Storage</span>
            <span>180 GB free</span>
          </div>
          <div className="h-1.5 bg-black/40 rounded-full overflow-hidden">
            <div className="h-full bg-amber-400 w-[35%]" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
