import { useOS } from "../store";
import { apps } from "../registry";
import { AppIcon } from "../icons/AppIcon";

const DESKTOP_APPS = ["about", "projects", "resume", "terminal", "github", "gallery", "notes", "settings", "pong", "breakout", "asteroids", "trash"];

export function DesktopIcons() {
  const open = useOS((s) => s.open);
  const items = DESKTOP_APPS.map(id => apps.find(a => a.id === id)).filter(Boolean);

  return (
    <div className="absolute top-12 right-4 z-10 grid grid-cols-1 gap-1 pointer-events-none">
      {items.map(a => a && (
        <button
          key={a.id}
          onDoubleClick={() => open(a.id, { title: a.name, size: a.defaultSize })}
          onClick={(e) => { if (window.matchMedia("(hover: none)").matches) { e.preventDefault(); open(a.id, { title: a.name, size: a.defaultSize }); } }}
          className="pointer-events-auto group flex flex-col items-center gap-1 w-20 px-2 py-2 rounded-lg hover:bg-white/8 focus-visible:bg-white/10 transition"
        >
          <AppIcon id={a.id} size={44} />
          <span className="text-[11px] text-white/90 text-center leading-tight px-1 rounded" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
            {a.name}
          </span>
        </button>
      ))}
    </div>
  );
}
