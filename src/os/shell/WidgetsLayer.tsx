import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

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

const WEATHER_CODES: Record<number, { text: string; icon: string }> = {
  0: { text: "Clear Sky", icon: "☀️" },
  1: { text: "Mainly Clear", icon: "🌤️" },
  2: { text: "Partly Cloudy", icon: "⛅" },
  3: { text: "Overcast", icon: "☁️" },
  45: { text: "Fog", icon: "🌫️" },
  48: { text: "Rime Fog", icon: "🌫️" },
  51: { text: "Light Drizzle", icon: "🌦️" },
  53: { text: "Drizzle", icon: "🌦️" },
  55: { text: "Heavy Drizzle", icon: "🌧️" },
  61: { text: "Light Rain", icon: "🌦️" },
  63: { text: "Rain", icon: "🌧️" },
  65: { text: "Heavy Rain", icon: "🌧️" },
  71: { text: "Light Snow", icon: "🌨️" },
  73: { text: "Snow", icon: "🌨️" },
  75: { text: "Heavy Snow", icon: "❄️" },
  77: { text: "Snow Grains", icon: "🌨️" },
  80: { text: "Light Showers", icon: "🌦️" },
  81: { text: "Showers", icon: "🌧️" },
  82: { text: "Heavy Showers", icon: "🌧️" },
  95: { text: "Thunderstorm", icon: "⛈️" },
  96: { text: "Light Hail", icon: "⛈️" },
  99: { text: "Heavy Hail", icon: "⛈️" }
};

function WeatherWidget() {
  const [data, setData] = useState<{
    city: string;
    temp: number;
    text: string;
    icon: string;
    high: number;
    low: number;
    hourly: { time: string; temp: string; icon: string }[];
  } | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const geoRes = await fetch('https://ipapi.co/json/');
        const geo = await geoRes.json();
        
        const lat = geo.latitude || 24.5854;
        const lon = geo.longitude || 73.7125;
        const city = geo.city || "Udaipur";

        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&hourly=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`);
        const weather = await weatherRes.json();

        const code = weather.current.weather_code;
        const condition = WEATHER_CODES[code] || { text: "Unknown", icon: "✨" };
        
        const currentHour = new Date().getHours();
        const hourlyData = [];
        for (let i = 1; i <= 6; i++) {
          const idx = currentHour + i;
          const hTemp = Math.round(weather.hourly.temperature_2m[idx]);
          const hCode = weather.hourly.weather_code[idx];
          const hCond = WEATHER_CODES[hCode] || { icon: "✨" };
          let hTime = idx % 24;
          const ampm = hTime >= 12 ? 'pm' : 'am';
          hTime = hTime % 12 || 12;
          
          hourlyData.push({
            time: `${hTime}${ampm}`,
            temp: `${hTemp}°`,
            icon: hCond.icon
          });
        }

        setData({
          city,
          temp: Math.round(weather.current.temperature_2m),
          text: condition.text,
          icon: condition.icon,
          high: Math.round(weather.daily.temperature_2m_max[0]),
          low: Math.round(weather.daily.temperature_2m_min[0]),
          hourly: hourlyData
        });
      } catch (e) {
        console.error("Weather error:", e);
      }
    }
    fetchWeather();
  }, []);

  return (
    <motion.div 
      drag dragMomentum={false}
      className="absolute pointer-events-auto w-72 p-4 rounded-[24px] text-white shadow-2xl flex flex-col justify-between border border-white/10"
      style={{ top: 48, left: 24, background: "rgba(30, 30, 35, 0.4)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="text-sm font-medium opacity-90 flex items-center gap-1">{data?.city || "Udaipur"} <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg></span></div>
          <div className="text-5xl font-light mt-1 tracking-tighter">{data?.temp ?? 33}°</div>
        </div>
        <div className="text-right mt-1">
          <div className="text-2xl mb-1">{data?.icon || "☁️"}</div>
          <div className="text-xs font-medium opacity-90">{data?.text || "Mostly Cloudy"}</div>
          <div className="text-[10px] opacity-75">H:{data?.high ?? 34}° L:{data?.low ?? 25}°</div>
        </div>
      </div>
      
      <div className="flex justify-between items-end mt-4 px-1">
        {(data?.hourly || [
          { time: "1pm", temp: "33°", icon: "☁️" },
          { time: "2pm", temp: "34°", icon: "☁️" },
          { time: "3pm", temp: "33°", icon: "🌧" },
          { time: "4pm", temp: "33°", icon: "🌧" },
          { time: "5pm", temp: "32°", icon: "🌧" },
          { time: "6pm", temp: "32°", icon: "🌧" },
        ]).map(f => (
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
  const [level, setLevel] = useState(90);
  const [charging, setCharging] = useState(false);

  useEffect(() => {
    let battery: any = null;
    const updateBattery = () => {
      if (battery) {
        setLevel(Math.round(battery.level * 100));
        setCharging(battery.charging);
      }
    };

    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((b: any) => {
        battery = b;
        updateBattery();
        b.addEventListener('levelchange', updateBattery);
        b.addEventListener('chargingchange', updateBattery);
      }).catch(() => {});
    }

    return () => {
      if (battery) {
        battery.removeEventListener('levelchange', updateBattery);
        battery.removeEventListener('chargingchange', updateBattery);
      }
    };
  }, []);

  return (
    <motion.div 
      drag dragMomentum={false}
      className="absolute pointer-events-auto w-72 p-5 rounded-[24px] text-white shadow-2xl flex items-center justify-between border border-white/10"
      style={{ top: 250, left: 24, background: "rgba(30, 30, 35, 0.4)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex flex-col items-center">
        <div className="relative w-14 h-14 rounded-full border-[4px] border-white/20 flex items-center justify-center">
          <div 
            className="absolute inset-0 rounded-full border-[4px] border-white transition-all duration-1000" 
            style={{ 
              clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 ${100 - (level * 0.8)}%)`,
              borderColor: level <= 20 ? '#ef4444' : charging ? '#22c55e' : 'white'
            }} 
          />
          {charging ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
          )}
        </div>
        <span className="text-xs font-semibold mt-2">{level}%</span>
      </div>
      
      <div className="flex gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="w-12 h-12 rounded-full border-[2px] border-white/20 flex items-center justify-center bg-white/5" />
        ))}
      </div>
    </motion.div>
  );
}

function FlipDigit({ value }: { value: string }) {
  return (
    <div className="relative w-16 h-20 flex items-center justify-center overflow-hidden [perspective:1000px]">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={value}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.4, type: "spring", bounce: 0 }}
          className="absolute inset-0 flex items-center justify-center transform-gpu"
        >
          <span className="text-6xl font-medium tracking-tighter text-white drop-shadow-md scale-y-[1.35] scale-x-95">
            {value}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
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
      className="absolute pointer-events-auto w-[440px] p-6 rounded-[24px] text-white shadow-2xl flex flex-col items-center justify-center border border-white/10"
      style={{ top: 48, left: "calc(50vw - 220px)", background: "rgba(30, 30, 35, 0.4)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex gap-3 items-center">
        <div className="bg-white/10 backdrop-blur-md px-1 py-1 rounded-2xl border border-white/10 shadow-lg flex flex-col items-center justify-center">
          <FlipDigit value={h} />
        </div>
        <div className="flex flex-col gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
        </div>
        <div className="bg-white/10 backdrop-blur-md px-1 py-1 rounded-2xl border border-white/10 shadow-lg flex flex-col items-center justify-center">
          <FlipDigit value={m} />
        </div>
        <div className="flex flex-col gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
        </div>
        <div className="bg-white/10 backdrop-blur-md px-1 py-1 rounded-2xl border border-white/10 shadow-lg flex flex-col items-center justify-center">
          <FlipDigit value={s} />
        </div>
      </div>
      <div className="text-sm font-semibold mt-4 text-white/90 tracking-widest uppercase">{dateStr}</div>
    </motion.div>
  );
}

function CalendarWidget() {
  return (
    <motion.div 
      drag dragMomentum={false}
      className="absolute pointer-events-auto w-36 h-36 p-3 rounded-[24px] text-white shadow-2xl flex flex-col border border-white/10"
      style={{ top: 48, left: "calc(100vw - 328px)", background: "rgba(30, 30, 35, 0.4)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
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
      className="absolute pointer-events-auto w-36 h-36 rounded-[24px] shadow-2xl flex items-center justify-center border border-white/10"
      style={{ top: 48, left: "calc(100vw - 168px)", background: "rgba(30, 30, 35, 0.4)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="relative w-32 h-32 rounded-full flex items-center justify-center">
        {/* Numbers */}
        {[...Array(12)].map((_, i) => {
          const num = i === 0 ? 12 : i;
          return (
            <div 
              key={i} 
              className="absolute w-6 h-6 flex items-center justify-center text-white/90 font-medium text-[11px]"
              style={{ transform: `rotate(${i * 30}deg) translateY(-46px)` }}
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
  const [sessionSecs, setSessionSecs] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setSessionSecs(s => s + 1);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const hrs = Math.floor(sessionSecs / 3600);
  const mins = Math.floor((sessionSecs % 3600) / 60);
  const secs = sessionSecs % 60;
  
  const timeStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m ${secs}s`;

  return (
    <motion.div 
      drag dragMomentum={false}
      className="absolute pointer-events-auto w-[288px] h-32 p-4 rounded-[24px] text-white shadow-2xl flex flex-col justify-between border border-white/10"
      style={{ top: 200, left: "calc(100vw - 312px)", background: "rgba(30, 30, 35, 0.4)", backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)" }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-between items-start">
        <div className="text-xl font-medium tracking-tight">{timeStr}</div>
        <div className="flex flex-col gap-1.5 text-[9px] font-medium opacity-90 text-right w-16">
          <div className="flex items-center justify-end gap-1"><span>A</span> {hrs > 0 ? hrs : mins}m</div>
          <div className="flex items-center justify-end gap-1"><span>⚙</span> {Math.floor(mins / 2)}m</div>
          <div className="flex items-center justify-end gap-1"><span>💬</span> {secs}s</div>
        </div>
      </div>
      
      <div className="flex items-end h-12 gap-1 w-[70%] border-b border-white/20 pb-1 relative mt-2 ml-4">
        <div className="absolute left-0 bottom-0 w-full flex flex-col justify-between h-full text-[7px] text-white/50 -ml-5">
          <span className="absolute -top-1 -left-1 text-right w-4">60m</span>
          <span className="absolute top-1/2 -left-1 -mt-1 text-right w-4">30m</span>
          <span className="absolute bottom-0 -left-1 text-right w-4">0</span>
        </div>
        {/* Bars */}
        <div className="flex items-end h-full gap-[2px] w-full pl-1">
          <div className="w-1.5 h-[10%] bg-white/40 rounded-t" />
          <div className="w-1.5 h-[5%] bg-white/40 rounded-t" />
          <div className="w-1.5 h-[20%] bg-white/40 rounded-t" />
          <div className="w-1.5 h-0" />
          <div className="w-1.5 h-0" />
          <div className="w-1.5 h-[15%] bg-white/40 rounded-t" />
          <div className="w-1.5 h-[40%] bg-white/40 rounded-t" />
          <div className="w-1.5 h-[10%] bg-white/40 rounded-t" />
          <div className="w-1.5 h-[80%] bg-white rounded-t" />
          <div className="w-1.5 h-[30%] bg-white/70 rounded-t" />
          <div className="w-1.5 h-[50%] bg-white rounded-t transition-all duration-1000" style={{ height: `${Math.min(100, Math.max(5, (mins / 60) * 100))}%` }} />
        </div>
      </div>
      <div className="flex w-[70%] justify-between text-[7px] text-white/50 mt-1 pl-5">
        <span>00</span><span>06</span><span>12</span>
      </div>
    </motion.div>
  );
}
