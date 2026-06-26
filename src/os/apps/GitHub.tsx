import { useEffect, useState } from "react";
import { identity } from "@/content/identity";

type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string;
  language: string;
  stargazers_count: number;
  homepage: string | null;
};

export function GitHubApp() {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://api.github.com/users/${identity.handle}/repos?per_page=100&sort=updated`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setRepos(data.filter(r => !r.fork));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-5 font-mono text-[13px] h-full flex flex-col">
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div>
          <div className="text-os-signal text-xs">github.com/{identity.handle}</div>
          <div className="text-os-text-dim text-[11px]">{loading ? "Fetching..." : `${repos.length} repos · live via api`}</div>
        </div>
        <a href={identity.links.github} target="_blank" rel="noreferrer" className="text-os-signal hover:underline text-xs">open ↗</a>
      </div>
      
      <div className="flex-1 overflow-auto border border-os-hairline bg-os-bg">
        {loading ? (
          <div className="flex items-center justify-center h-full text-os-text-dim text-[11px]">Loading repositories...</div>
        ) : repos.length === 0 ? (
          <div className="flex items-center justify-center h-full text-os-text-dim text-[11px]">No repositories found.</div>
        ) : (
          <div className="divide-y divide-[var(--os-hairline)]">
            {repos.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-3 py-2 hover:bg-os-panel-2 group">
                <span className="text-os-signal w-2">›</span>
                <a href={p.html_url} target="_blank" rel="noreferrer" className="text-os-text flex-1 truncate hover:underline">{p.name}</a>
                <span className="text-os-text-faint text-[11px] hidden sm:inline truncate max-w-[30%]">{p.description}</span>
                
                {p.homepage && (
                  <a href={p.homepage.startsWith('http') ? p.homepage : `https://${p.homepage}`} target="_blank" rel="noreferrer" className="text-[10px] uppercase border border-os-hairline px-1.5 py-0.5 rounded text-os-text-dim hover:text-os-signal hover:border-os-signal transition-colors shrink-0">
                    Live ↗
                  </a>
                )}
                
                <span className="text-os-text-dim text-[11px] w-16 text-right truncate">{p.language || "—"}</span>
                <span className="text-os-text-dim text-[11px] tabular-nums w-8 text-right">★{p.stargazers_count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
