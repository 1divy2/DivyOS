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
    <div className="p-4 space-y-1">
      <div className="text-os-ink-faint text-[11px] uppercase tracking-wider mb-3 px-2 font-medium">Settings</div>
      {["Wallpaper", "Appearance", "Motion", "Session", "Reset"].map((s, i) => (
        <a key={s} href={`#section-${i}`} className="block px-3 py-2 rounded-lg text-os-ink-dim hover:text-os-ink hover:bg-white/5 transition-colors font-medium">
          {s}
        </a>
      ))}
    </div>
  );

  return (
    <AppFrame sidebar={sidebar}>
      <div className="p-8 sm:p-12 max-w-3xl space-y-16">
        <section id="section-0" className="scroll-mt-8">
          <H>Wallpaper</H>
          <div className="grid grid-cols-3 gap-3">
            {WALLPAPERS.map((w) => (
              <button
                key={w.id}
                onClick={() => wp.setWallpaper(w.id)}
                className={`group text-left rounded-xl overflow-hidden border-2 transition ${wp.wallpaperId === w.id ? "border-os-iris" : "border-os-hairline hover:border-white/15"}`}
              >
                <div className="aspect-video w-full" style={{ background: `linear-gradient(135deg, ${w.palette[0]} 0%, ${w.palette[1]} 50%, ${w.palette[2]} 100%)` }}/>
                <div className="px-3 py-2">
                  <div className="text-os-ink text-[13px] font-medium">{w.name}</div>
                  <div className="text-os-ink-faint text-[11px] mt-0.5">{w.description}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section id="section-1">
          <H>Appearance</H>
          <div className="grid grid-cols-2 gap-2 max-w-md">
            {THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => s.setTheme(t.id)}
                className={`text-left rounded-lg px-4 py-3 border ${s.theme === t.id ? "border-os-iris text-os-ink bg-os-iris/10" : "border-os-hairline text-os-ink-dim hover:text-os-ink"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p className="text-os-ink-faint text-[12px] mt-3">More themes ship with Theme Studio.</p>
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

        <section id="section-3">
          <H>Session</H>
          <div className="text-os-ink-dim text-[13px] mb-3">Signed in as <span className="text-os-ink font-medium">{session.visitorName ?? "guest"}</span></div>
          <div className="flex gap-2 flex-wrap">
            <Btn onClick={session.lock}>Lock</Btn>
            <Btn onClick={session.logout}>Log out</Btn>
            <Btn onClick={session.restart} tone="warn">Restart</Btn>
            <Btn onClick={session.shutdown} tone="danger">Shut down</Btn>
          </div>
        </section>

        <section id="section-4">
          <H>Reset</H>
          <p className="text-os-ink-dim text-[13px] mb-3 max-w-md">Erase every preference, window position, wallpaper, and saved note. The OS reboots to a clean state.</p>
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
          >Factory reset</Btn>
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
