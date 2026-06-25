import { identity } from "@/content/identity";

export function AboutApp() {
  return (
    <div className="h-full overflow-auto" style={{ background: "linear-gradient(180deg, #11141B 0%, #0B0D12 100%)" }}>
      <div className="max-w-2xl mx-auto px-10 py-12">
        <div className="flex items-start gap-6 mb-10">
          <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 relative" style={{ background: "linear-gradient(135deg,#A8B4FF,#5A6AE0)", boxShadow: "0 12px 32px -8px rgba(168,180,255,0.4)" }}>
            <div className="absolute inset-0 flex items-center justify-center text-white/95" style={{ fontFamily: "Fraunces, serif", fontSize: 44, fontWeight: 600 }}>D</div>
          </div>
          <div className="pt-2">
            <div className="text-os-ink-faint text-[12px] uppercase tracking-[0.18em] mb-1">Personal Operating System</div>
            <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 500, fontSize: 44, lineHeight: 1.05, letterSpacing: "-0.02em" }} className="text-os-ink">{identity.name}</h1>
            <div className="text-os-ink-dim mt-1 text-[15px]">{identity.role}</div>
          </div>
        </div>

        <p className="text-os-ink text-[16px] leading-relaxed max-w-prose mb-8" style={{ fontFamily: "Inter Tight" }}>
          DivyOS isn't a portfolio. It's a desktop environment shaped around how I think — windows, a terminal,
          a few games, the things I've shipped. Pull anything apart, right-click anywhere, talk to the shell.
          It was built one obsessive evening at a time.
        </p>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-[13px] mb-10">
          <Field k="Version" v="DivyOS 1.0 · Sable" />
          <Field k="Built with" v="React · TypeScript · Tailwind" />
          <Field k="Source of truth" v={<a className="text-os-iris hover:underline" target="_blank" rel="noreferrer" href={identity.links.github}>github.com/{identity.handle}</a>} />
          <Field k="Shell" v="divysh" />
        </div>

        <div className="border-t border-os-hairline pt-6">
          <div className="text-os-ink-faint text-[11px] uppercase tracking-[0.18em] mb-3">Try these</div>
          <ul className="space-y-2 text-[14px] text-os-ink-dim">
            <li>· Press <Kbd>⌘K</Kbd> to search apps, projects, and commands</li>
            <li>· Open Terminal and type <code className="text-os-mint font-mono">help</code> · <code className="text-os-mint font-mono">fetch</code> · <code className="text-os-mint font-mono">play snake</code></li>
            <li>· Right-click the desktop to change wallpaper</li>
            <li>· Drag a window to a screen edge to snap</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Field({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div>
      <div className="text-os-ink-faint text-[11px] uppercase tracking-[0.15em]">{k}</div>
      <div className="text-os-ink mt-0.5">{v}</div>
    </div>
  );
}
function Kbd({ children }: { children: React.ReactNode }) {
  return <span className="px-1.5 py-0.5 rounded border border-os-hairline bg-os-panel-2 text-os-ink text-[12px] font-mono">{children}</span>;
}
