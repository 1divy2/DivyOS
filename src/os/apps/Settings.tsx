import { useSettings, type ThemeName } from "../settings";
import { useOS } from "../store";
import { useSession } from "../services/session";
import { useWallpaper, WALLPAPERS } from "../services/wallpaper";
import { useNotifications } from "../services/notifications";
import { AppFrame } from "./AppFrame";

const THEMES: { id: ThemeName; label: string }[] = [
  { id: "cortex", label: "Sable (default)" },
  { id: "minimal", label: "Minimal" },
  { id: "blueprint", label: "Blueprint" },
  { id: "retro", label: "Retro" },
];

export function SettingsApp() {
  const s = useSettings();
  const wp = useWallpaper();
  const session = useSession();

  const sidebar = (
    <div className="p-3 space-y-0.5">
      <div className="px-3 py-2 mb-2 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-os-iris to-purple-500 flex items-center justify-center text-white text-lg shadow-md font-semibold">
          {session.visitorName?.[0]?.toUpperCase() ?? "G"}
        </div>
        <div>
          <div className="text-os-ink text-[13px] font-medium leading-tight">{session.visitorName ?? "Guest User"}</div>
          <div className="text-os-ink-faint text-[11px]">Administrator</div>
        </div>
      </div>
      
      <div className="text-os-ink-faint text-[10px] uppercase tracking-wider mb-2 px-3 pt-2 font-semibold">Personalization</div>
      {["Appearance", "Wallpaper", "Motion"].map((s, i) => (
        <a key={s} href={`#section-${i}`} className="block px-3 py-1.5 rounded-md text-[13px] text-os-ink hover:bg-os-iris/10 hover:text-os-iris transition-colors">
          {s}
        </a>
      ))}
      
      <div className="text-os-ink-faint text-[10px] uppercase tracking-wider mb-2 px-3 pt-4 font-semibold">System</div>
      {["Session", "Reset"].map((s, i) => (
        <a key={s} href={`#section-${i+3}`} className="block px-3 py-1.5 rounded-md text-[13px] text-os-ink hover:bg-os-iris/10 hover:text-os-iris transition-colors">
          {s}
        </a>
      ))}
    </div>
  );

  return (
    <AppFrame sidebar={sidebar}>
      <div className="p-8 sm:p-12 max-w-3xl space-y-16">

        <section id="section-0" className="scroll-mt-8">
          <H>Appearance</H>
          <div className="grid grid-cols-2 gap-3 max-w-md">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => s.setTheme(t.id)}
                className={`text-left rounded-xl px-4 py-3 border-2 transition-all ${s.theme === t.id ? "border-os-iris bg-os-iris/10 text-os-ink shadow-[0_0_15px_rgba(168,180,255,0.2)]" : "border-os-hairline bg-white/5 text-os-ink-dim hover:text-os-ink hover:border-white/20"}`}
              >
                <div className="font-medium text-[13px]">{t.label}</div>
              </button>
            ))}
          </div>
        </section>

        <section id="section-1" className="scroll-mt-8">
          <H>Wallpaper</H>
          <div className="grid grid-cols-3 gap-3">
            {WALLPAPERS.map((w) => (
              <button
                key={w.id}
                onClick={() => wp.setWallpaper(w.id)}
                className={`group text-left rounded-xl overflow-hidden border-2 transition ${wp.wallpaperId === w.id ? "border-os-iris shadow-[0_0_15px_rgba(168,180,255,0.2)]" : "border-os-hairline hover:border-white/20"}`}
              >
                <div className="aspect-video w-full" style={{ background: `linear-gradient(135deg, ${w.palette[0]} 0%, ${w.palette[1]} 50%, ${w.palette[2]} 100%)` }}/>
                <div className="px-3 py-2 bg-white/5">
                  <div className="text-os-ink text-[13px] font-medium">{w.name}</div>
                  <div className="text-os-ink-faint text-[11px] mt-0.5">{w.description}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section id="section-2">
          <H>Motion</H>
          <Toggle checked={s.reducedMotion} onChange={(v) => s.setReducedMotion(v)} label="Reduce motion" hint="Disables wallpaper animation and window transitions." />
          <div className="mt-4">
            <div className="text-os-ink text-[13px] mb-1.5">Density</div>
            <div className="flex gap-2">
              {(["comfy","compact"] as const).map((d) => (
                <button key={d} onClick={() => s.setDensity(d)}
                  className={`rounded-md px-4 py-1.5 text-[13px] border ${s.density===d?"border-os-iris text-os-ink bg-os-iris/10":"border-os-hairline text-os-ink-dim hover:text-os-ink"}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="section-3" className="scroll-mt-8">
          <H>Session</H>
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-3 flex items-center justify-between">
             <div className="flex items-center gap-4">
               <div className="w-12 h-12 rounded-full bg-os-iris/20 text-os-iris flex items-center justify-center text-xl">👤</div>
               <div>
                 <div className="text-os-ink font-medium text-[14px]">{session.visitorName ?? "Guest"}</div>
                 <div className="text-os-ink-faint text-[12px]">Local Account</div>
               </div>
             </div>
             <Btn onClick={session.logout}>Log out</Btn>
          </div>
          <div className="flex gap-2">
            <Btn onClick={session.lock}>Lock Screen</Btn>
            <Btn onClick={session.restart} tone="warn">Restart</Btn>
            <Btn onClick={session.shutdown} tone="danger">Shut down</Btn>
          </div>
        </section>

        <section id="section-4" className="scroll-mt-8">
          <H>Reset</H>
          <div className="bg-os-error/10 border border-os-error/20 rounded-xl p-5">
            <p className="text-os-ink-dim text-[13px] mb-4 max-w-md">Erase every preference, window position, wallpaper, and saved note. The OS reboots to a clean state.</p>
            <Btn
              tone="danger"
              onClick={() => {
                useOS.persist.clearStorage();
                useSettings.persist.clearStorage();
                useSession.persist.clearStorage();
                useWallpaper.persist.clearStorage();
                useNotifications.persist.clearStorage();
                location.reload();
              }}
            >Erase All Content and Settings…</Btn>
          </div>
        </section>
      </div>
    </AppFrame>
  );
}

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="text-os-ink text-[20px] font-semibold mb-4 tracking-tight" style={{ fontFamily: "Inter Tight" }}>{children}</h2>;
}
function Btn({ children, onClick, tone }: { children: React.ReactNode; onClick: () => void; tone?: "warn" | "danger" }) {
  const c = tone === "danger" ? "border-os-error/40 text-os-error hover:bg-os-error/10" : tone === "warn" ? "border-os-warn/40 text-os-warn hover:bg-os-warn/10" : "border-os-hairline text-os-ink hover:border-os-iris hover:text-os-iris";
  return <button onClick={onClick} className={`rounded-md px-4 py-1.5 text-[13px] border ${c}`}>{children}</button>;
}
function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer select-none">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`mt-0.5 w-9 h-5 rounded-full transition relative ${checked ? "bg-os-iris" : "bg-white/15"}`}
      >
        <span className={`absolute top-0.5 ${checked ? "left-4" : "left-0.5"} w-4 h-4 rounded-full bg-white transition-all`} />
      </button>
      <div>
        <div className="text-os-ink text-[13px]">{label}</div>
        {hint && <div className="text-os-ink-faint text-[12px]">{hint}</div>}
      </div>
    </label>
  );
}
