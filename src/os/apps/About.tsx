import { identity } from "@/content/identity";
import { useOS } from "../store";

export function AboutApp() {
  const open = useOS((s) => s.open);

  return (
    <div className="h-full overflow-auto text-os-ink" style={{ background: "linear-gradient(180deg, var(--os-bg-2) 0%, var(--os-bg) 100%)", fontFamily: "Inter Tight" }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="flex flex-col items-center gap-6 mb-12 text-center">
          <div className="w-32 h-32 rounded-3xl overflow-hidden flex-shrink-0 relative shadow-[0_20px_50px_-12px_rgba(168,180,255,0.4)] transition-transform hover:scale-105 duration-500" style={{ background: "linear-gradient(135deg,#A8B4FF,#5A6AE0)" }}>
            <div className="absolute inset-0 flex items-center justify-center text-white/95" style={{ fontFamily: "Fraunces, serif", fontSize: 64, fontWeight: 600 }}>D</div>
          </div>
          <div className="pt-2 flex flex-col items-center">
            <div className="text-os-iris text-[13px] uppercase tracking-[0.2em] font-semibold mb-2">Personal Operating System</div>
            <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 500, fontSize: 52, lineHeight: 1.05, letterSpacing: "-0.02em" }} className="mb-2">
              {identity.name}
            </h1>
            <div className="text-os-ink-dim text-[18px]">{identity.role}</div>
            
            <div className="flex flex-wrap gap-3 mt-6 justify-center">
              <SocialLink href={identity.links.github} icon="GitHub" />
              <SocialLink href={identity.links.linkedin} icon="LinkedIn" />
              <SocialLink href={identity.links.twitter} icon="Twitter" />
            </div>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bio Card */}
          <div className="md:col-span-2 glass-strong rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-os-iris/10 rounded-full blur-[80px] group-hover:bg-os-iris/20 transition-colors duration-1000" />
            <div className="text-[11px] uppercase tracking-[0.2em] text-os-ink-faint font-semibold mb-4">About Me</div>
            <p className="text-[16px] leading-relaxed text-os-ink/90 relative z-10">
              {identity.bio} DivyOS is my personal sandbox — a desktop environment shaped around how I think. 
              It's not just a portfolio, it's an interactive experience featuring window snapping, a functional terminal, 
              live music, and retro games. Pull anything apart, right-click anywhere, and explore.
            </p>
          </div>

          {/* Location Card */}
          <div className="glass-strong rounded-3xl p-8 border border-white/5 flex flex-col justify-between group hover:border-os-amber/30 transition-colors">
            <div className="text-[11px] uppercase tracking-[0.2em] text-os-ink-faint font-semibold">Location</div>
            <div>
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform origin-left">🇮🇳</div>
              <div className="font-medium text-lg leading-tight text-os-amber/90">{identity.location}</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass-strong rounded-3xl p-8 border border-white/5 flex flex-col">
            <div className="text-[11px] uppercase tracking-[0.2em] text-os-ink-faint font-semibold mb-6">Quick Actions</div>
            <div className="flex flex-col gap-3">
              <button onClick={() => open("resume")} className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition flex justify-between items-center group">
                <span className="font-medium">View Resume</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-os-iris">→</span>
              </button>
              <button onClick={() => open("projects")} className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition flex justify-between items-center group">
                <span className="font-medium">View Projects</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-os-iris">→</span>
              </button>
              <button onClick={() => open("terminal")} className="w-full text-left px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition flex justify-between items-center group">
                <span className="font-medium">Open Terminal</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-os-iris">→</span>
              </button>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="md:col-span-2 glass-strong rounded-3xl p-8 border border-white/5">
            <div className="text-[11px] uppercase tracking-[0.2em] text-os-ink-faint font-semibold mb-6">Built With</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <TechBadge name="React" icon="⚛️" />
              <TechBadge name="TypeScript" icon="📘" />
              <TechBadge name="Tailwind" icon="🌊" />
              <TechBadge name="Python" icon="🐍" />
            </div>
            
            <div className="mt-8 pt-6 border-t border-os-hairline grid grid-cols-2 gap-x-8 gap-y-4 text-[13px]">
              <Field k="Version" v="DivyOS 1.0 · Sable" />
              <Field k="Status" v={<span className="text-os-mint flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-os-mint animate-pulse" /> All systems nominal</span>} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SocialLink({ href, icon }: { href: string, icon: string }) {
  if (href === "[placeholder]") return null;
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noreferrer" 
      className="px-4 py-2 rounded-full border border-os-hairline bg-os-panel-2 hover:bg-white/10 transition-colors text-[13px] font-medium flex items-center gap-2"
    >
      {icon}
    </a>
  );
}

function TechBadge({ name, icon }: { name: string, icon: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition cursor-default">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-[12px] font-medium text-os-ink-dim">{name}</div>
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
