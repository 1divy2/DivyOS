import { useState, useEffect } from "react";
import { useOS } from "../store";
import { apps } from "../registry";
import { AppIcon } from "../icons/AppIcon";

export function MobileShell() {
  const openApp = useOS((s) => s.open);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  
  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  // Dock apps: Settings, Terminal, Notes, GitHub
  const dockAppIds = ["settings", "terminal", "notes", "github"];
  const dockApps = dockAppIds.map(id => apps.find(a => a.id === id)).filter(Boolean);

  // Home screen grid apps
  const gridApps = apps.filter(a => !dockAppIds.includes(a.id) && a.category !== "games" && !a.hidden);

  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Scrollable Area */}
      <div className="flex-1 overflow-y-auto pt-12 pb-32 px-4 no-scrollbar">
        {/* At a Glance Widget */}
        <div className="mt-8 mb-12 flex flex-col items-center">
          <h1 className="text-5xl font-light text-white tracking-tight drop-shadow-md">
            {formattedTime.split(" ")[0]}
          </h1>
          <div className="text-white/80 font-medium tracking-wide mt-2 drop-shadow-sm flex items-center gap-2">
            <span>{formattedDate}</span>
            <span className="text-white/40">•</span>
            <span>Udaipur ☀️ 32°C</span>
          </div>
        </div>

        {/* Grid Apps */}
        <div className="grid grid-cols-4 gap-x-4 gap-y-8 content-start pb-8">
          {gridApps.map(a => (
            <button 
              key={a.id} 
              className="flex flex-col items-center gap-2 group outline-none"
              onClick={() => openApp(a.id, { title: a.name, size: a.defaultSize })}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/10 group-hover:scale-105 transition-transform shrink-0">
                <AppIcon id={a.id} size={32} />
              </div>
              <span className="text-white text-[11px] font-medium drop-shadow-md truncate w-full text-center">
                {a.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Android Dock (Fixed) */}
      <div className="absolute bottom-6 inset-x-6 p-4 rounded-[2rem] bg-black/20 backdrop-blur-xl border border-white/10 flex justify-around items-center z-50 shadow-2xl">
        {dockApps.map(a => (
          <button 
            key={a!.id} 
            className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:scale-110 transition-transform outline-none"
            onClick={() => openApp(a!.id, { title: a!.name, size: a!.defaultSize })}
          >
            <AppIcon id={a!.id} size={26} />
          </button>
        ))}
      </div>
    </div>
  );
}
