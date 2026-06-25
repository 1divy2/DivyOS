import { experience, education } from "@/content/experience";

export function ExperienceApp() {
  return (
    <div className="p-6 font-mono text-[13px]">
      <div className="text-os-signal text-xs mb-3">$ tail -f /experience</div>
      <div className="space-y-4 border-l border-os-hairline pl-5">
        {experience.map((e, i) => (
          <div key={i} className="relative">
            <span className="absolute -left-[26px] top-1.5 w-2 h-2 bg-os-signal" />
            <div className="text-os-text-faint text-[11px]">{e.from} — {e.to}</div>
            <div className="text-os-text font-bold">{e.role}</div>
            <div className="text-os-text-dim">{e.org}</div>
            <div className="text-os-text-dim mt-1">{e.summary}</div>
          </div>
        ))}
      </div>
      <div className="text-os-signal text-xs mt-8 mb-3">$ cat /education</div>
      <div className="space-y-2">
        {education.map((e, i) => (
          <div key={i}>
            <div className="text-os-text">{e.degree}</div>
            <div className="text-os-text-dim">{e.school} · {e.from}—{e.to}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
