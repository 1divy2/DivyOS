import { useState } from "react";
import { projects, type Project } from "@/content/projects";

function ProjectDetail({ p }: { p: Project }) {
  return (
    <div className="p-5 font-mono text-[13px]">
      <div className="text-os-signal text-xs mb-1">~/projects/{p.slug}</div>
      <h2 className="text-xl font-bold text-os-text mb-1">{p.name}</h2>
      <p className="text-os-text-dim mb-4">{p.description || "no description."}</p>
      <dl className="grid grid-cols-[100px_1fr] gap-y-1 text-os-text-dim mb-4">
        <dt>language</dt><dd className="text-os-text">{p.language || "—"}</dd>
        <dt>stars</dt><dd className="text-os-text">★ {p.stars}</dd>
        <dt>created</dt><dd className="text-os-text">{p.created.slice(0,10)}</dd>
        <dt>updated</dt><dd className="text-os-text">{p.updated.slice(0,10)}</dd>
        {p.topics.length > 0 && (<><dt>topics</dt><dd className="text-os-text">{p.topics.join(" · ")}</dd></>)}
      </dl>
      <div className="flex gap-3 text-os-signal text-xs">
        <a href={p.html_url} target="_blank" rel="noreferrer" className="hover:underline">[github ↗]</a>
        {p.homepage && <a href={p.homepage} target="_blank" rel="noreferrer" className="hover:underline">[live ↗]</a>}
      </div>
    </div>
  );
}

export function ProjectsApp() {
  const [sel, setSel] = useState<string>(projects[0]?.slug ?? "");
  const [q, setQ] = useState("");
  const list = q ? projects.filter((p) => (p.name + " " + p.description + " " + p.language).toLowerCase().includes(q.toLowerCase())) : projects;
  const current = projects.find((p) => p.slug === sel) ?? projects[0];

  return (
    <div className="flex h-full">
      <aside className="w-56 shrink-0 border-r border-os-hairline bg-os-panel-2 flex flex-col">
        <div className="p-2 border-b border-os-hairline">
          <input
            value={q} onChange={(e) => setQ(e.target.value)} placeholder="/ filter"
            className="w-full bg-os-bg border border-os-hairline px-2 py-1 text-[12px] text-os-text outline-none focus:border-os-signal"
          />
        </div>
        <div className="flex-1 overflow-auto">
          {list.map((p) => (
            <button
              key={p.slug}
              onClick={() => setSel(p.slug)}
              className={`w-full text-left px-3 py-1.5 text-[12px] font-mono border-l-2 ${sel === p.slug ? "border-os-signal bg-os-panel text-os-text" : "border-transparent text-os-text-dim hover:text-os-text"}`}
            >
              <div className="truncate">{p.name}</div>
              <div className="text-os-text-faint text-[10px] truncate">{p.language || "—"} · ★{p.stars}</div>
            </button>
          ))}
          {!projects.length && <div className="p-3 text-os-text-faint text-xs">no repos loaded.</div>}
        </div>
      </aside>
      <div className="flex-1 overflow-auto">
        {current ? <ProjectDetail p={current} /> : <div className="p-6 text-os-text-faint">no project selected.</div>}
      </div>
    </div>
  );
}
