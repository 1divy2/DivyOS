import { skills } from "@/content/skills";

export function SkillsApp() {
  return (
    <div className="p-6 font-mono text-[13px]">
      <div className="text-os-signal text-xs mb-3">$ cat /skills</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {skills.map((g) => (
          <div key={g.group}>
            <div className="text-os-text-dim text-[11px] uppercase tracking-widest mb-2">{g.group}</div>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((s) => (
                <span key={s} className="border border-os-hairline px-2 py-0.5 text-os-text hover:border-os-signal hover:text-os-signal transition">
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
