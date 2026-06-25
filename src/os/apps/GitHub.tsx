import { projects } from "@/content/projects";
import { identity } from "@/content/identity";

export function GitHubApp() {
  return (
    <div className="p-5 font-mono text-[13px]">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-os-signal text-xs">github.com/{identity.handle}</div>
          <div className="text-os-text-dim text-[11px]">{projects.length} repos · seeded at build</div>
        </div>
        <a href={identity.links.github} target="_blank" rel="noreferrer" className="text-os-signal hover:underline text-xs">open ↗</a>
      </div>
      <div className="border border-os-hairline divide-y divide-[var(--os-hairline)]">
        {projects.map((p) => (
          <a key={p.slug} href={p.html_url} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-3 py-2 hover:bg-os-panel-2">
            <span className="text-os-signal w-2">›</span>
            <span className="text-os-text flex-1 truncate">{p.name}</span>
            <span className="text-os-text-faint text-[11px] hidden sm:inline truncate max-w-[40%]">{p.description}</span>
            <span className="text-os-text-dim text-[11px]">{p.language || "—"}</span>
            <span className="text-os-text-dim text-[11px] tabular-nums">★{p.stars}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
