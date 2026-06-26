import { useState, useEffect } from "react";
import { motion } from "motion/react";

export function WidgetsLayer() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none p-12">
      <WeatherWidget />
      <BatteryWidget />
      <DigitalClockWidget />
      <CalendarWidget />
      <AnalogClockWidget />
      <UsageWidget />
    </div>
  );
}

function WeatherWidget() {
  return (
    <motion.div 
      drag dragMomentum={false}
      className="absolute pointer-events-auto w-72 p-4 rounded-3xl text-white shadow-2xl flex flex-col justify-between"
      style={{ top: 48, left: 24, background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)" }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm font-medium opacity-90 flex items-center gap-1">Udaipur <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></span></div>
          <div className="text-5xl font-light mt-1 tracking-tighter">33°</div>
        </div>
        <div className="text-right mt-1">
          <div className="text-2xl mb-1">☁️</div>
          <div className="text-xs font-medium opacity-90">Mostly Cloudy</div>
          <div className="text-[10px] opacity-75">H:34° L:25°</div>
        </div>
      </div>
      
      <div className="flex justify-between items-end mt-4 px-1">
        {[
          { time: "12", temp: "33°", icon: "☁️" },
          { time: "13", temp: "34°", icon: "☁️" },
          { time: "14", temp: "33°", icon: "🌧" },
          { time: "15", temp: "33°", icon: "🌧" },
          { time: "16", temp: "32°", icon: "🌧" },
          { time: "17", temp: "32°", icon: "🌧" },
        ].map(f => (
          <div key={f.time} className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-medium opacity-80">{f.time}</span>
            <span className="text-sm">{f.icon}</span>
            <span className="text-[11px] font-semibold">{f.temp}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function BatteryWidget() {
  return (
    <motion.div 
      drag dragMomentum={false}
      className="absolute pointer-events-auto w-72 p-5 rounded-3xl text-white shadow-2xl flex items-center justify-between"
      style={{ top: 220, left: 24, background: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)", backdropFilter: "blur(20px)" }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex flex-col items-center">
        <div className="relative w-14 h-14 rounded-full border-[4px] border-white/20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-[4px] border-white" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 80%)" }} />
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
        </div>
        <span className="text-xs font-semibold mt-2">90%</span>
      </div>
      
      <div className="flex gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="w-12 h-12 rounded-full border-[2px] border-white/20 flex items-center justify-center bg-white/5" />
        ))}
      </div>
    </motion.div>
  );
}

function DigitalClockWidget() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  
  const h = time.getHours().toString().padStart(2, "0");
  const m = time.getMinutes().toString().padStart(2, "0");
  const s = time.getSeconds().toString().padStart(2, "0");
  const dateStr = time.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });

  return (
    <motion.div 
      drag dragMomentum={false}
      className="absolute pointer-events-auto w-[280px] p-6 rounded-[2rem] text-white shadow-2xl flex flex-col items-center justify-center"
      style={{ top: 48, left: "calc(50vw - 140px)", background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)" }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex gap-4 items-baseline">
        <span className="text-5xl font-bold tracking-tight">{h}</span>
        <span className="text-5xl font-bold tracking-tight">{m}</span>
        <span className="text-4xl font-medium tracking-tight opacity-90">{s}</span>
      </div>
      <div className="text-sm font-medium mt-2 opacity-90 tracking-wide">{dateStr}</div>
    </motion.div>
  );
}

function CalendarWidget() {
  return (
    <motion.div 
      drag dragMomentum={false}
      className="absolute pointer-events-auto w-36 h-36 p-3 rounded-[1.5rem] text-white shadow-2xl flex flex-col"
      style={{ top: 48, left: "calc(100vw - 328px)", background: "linear-gradient(135deg, #818cf8 0%, #6366f1 100%)" }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="text-[10px] font-bold uppercase tracking-widest mb-1 text-white/90">June</div>
      <div className="grid grid-cols-7 gap-y-0.5 text-center text-[8px] font-bold text-white/60 mb-1">
        <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
      </div>
      <div className="grid grid-cols-7 gap-y-1 gap-x-0 text-center text-[9px] font-medium">
        <span className="opacity-0">.</span><span className="opacity-0">.</span>
        {[...Array(30)].map((_, i) => (
          <span key={i} className={i + 1 === 26 ? "bg-white text-indigo-500 rounded-full w-4 h-4 flex items-center justify-center mx-auto" : "flex items-center justify-center w-4 h-4 mx-auto"}>
            {i + 1}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function AnalogClockWidget() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);
  const h = time.getHours(); const m = time.getMinutes(); const s = time.getSeconds();

  return (
    <motion.div 
      drag dragMomentum={false}
      className="absolute pointer-events-auto w-36 h-36 rounded-[1.5rem] shadow-2xl flex items-center justify-center"
      style={{ top: 48, left: "calc(100vw - 168px)", background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)" }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="relative w-32 h-32 rounded-full flex items-center justify-center">
        {/* Numbers */}
        {[...Array(12)].map((_, i) => {
          const num = i === 0 ? 12 : i;
          return (
            <div 
              key={i} 
              className="absolute w-6 h-6 flex items-center justify-center text-white font-semibold text-xs"
              style={{ transform: `rotate(${i * 30}deg) translateY(-12px)` }}
            >
              <span style={{ transform: `rotate(${-i * 30}deg)` }}>{num}</span>
            </div>
          );
        })}
        {/* Hands */}
        <div className="absolute w-1 h-8 bg-white rounded-full origin-bottom" style={{ transform: `translateY(-50%) rotate(${h * 30 + m * 0.5}deg)` }} />
        <div className="absolute w-0.5 h-11 bg-white/90 rounded-full origin-bottom" style={{ transform: `translateY(-50%) rotate(${m * 6}deg)` }} />
        <div className="absolute w-[1.5px] h-12 bg-amber-300 rounded-full origin-bottom" style={{ transform: `translateY(-50%) rotate(${s * 6}deg)` }} />
        <div className="absolute w-1.5 h-1.5 bg-amber-300 rounded-full shadow-sm" />
      </div>
    </motion.div>
  );
}

function UsageWidget() {
  return (
    <motion.div 
      drag dragMomentum={false}
      className="absolute pointer-events-auto w-[288px] h-32 p-4 rounded-[1.5rem] text-white shadow-2xl flex flex-col justify-between"
      style={{ top: 200, left: "calc(100vw - 312px)", background: "linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)" }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-between items-start">
        <div className="text-xl font-medium tracking-tight">1h 19m</div>
        <div className="flex flex-col gap-1.5 text-[9px] font-medium opacity-90 text-right w-16">
          <div className="flex items-center justify-end gap-1"><span>A</span> 61m</div>
          <div className="flex items-center justify-end gap-1"><span>⚙</span> 20m</div>
          <div className="flex items-center justify-end gap-1"><span>💬</span> 65s</div>
          <div className="flex items-center justify-end gap-1"><span>🎵</span> 33s</div>
        </div>
      </div>
      
      <div className="flex items-end h-12 gap-1 w-2/3 border-b border-white/20 pb-1 relative">
        <div className="absolute left-0 bottom-0 w-full flex flex-col justify-between h-full text-[7px] text-white/50 -ml-4">
          <span className="absolute -top-1 -right-4">60m</span>
          <span className="absolute top-1/2 -right-4 -mt-1">30m</span>
          <span className="absolute bottom-0 -right-2">0</span>
        </div>
        {/* Bars */}
        <div className="flex items-end h-full gap-[2px] w-full pl-1">
          <div className="w-1.5 h-[10%] bg-white/40 rounded-t" />
          <div className="w-1.5 h-[5%] bg-white/40 rounded-t" />
          <div className="w-1.5 h-[20%] bg-white/40 rounded-t" />
          <div className="w-1.5 h-0" />
          <div className="w-1.5 h-0" />
          <div className="w-1.5 h-0" />
          <div className="w-1.5 h-[15%] bg-white/40 rounded-t" />
          <div className="w-1.5 h-[40%] bg-white/40 rounded-t" />
          <div className="w-1.5 h-[10%] bg-white/40 rounded-t" />
          <div className="w-1.5 h-[80%] bg-white rounded-t" />
          <div className="w-1.5 h-[30%] bg-white/70 rounded-t" />
        </div>
      </div>
      <div className="flex w-2/3 justify-between text-[7px] text-white/50 mt-1 pl-1">
        <span>00</span><span>06</span><span>12</span>
      </div>
    </motion.div>
  );
}
