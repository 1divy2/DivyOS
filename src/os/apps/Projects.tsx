import { useState, useMemo } from "react";
import { projects, type Project } from "@/content/projects";
import { AppFrame } from "./AppFrame";
import { motion, AnimatePresence } from "motion/react";

function ProjectCard({ p, onClick }: { p: Project; onClick: () => void }) {
  return (
    <motion.button
      layoutId={`proj-${p.slug}`}
      onClick={onClick}
      className="text-left bg-os-panel-2 border border-os-hairline rounded-xl p-5 hover:border-os-iris transition-colors group flex flex-col h-[180px]"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-os-ink font-semibold text-[15px] group-hover:text-os-iris transition-colors truncate pr-2">{p.name}</h3>
        <span className="shrink-0 text-os-ink-dim text-[11px] font-mono mt-0.5">★ {p.stars}</span>
      </div>
      <p className="text-os-ink-dim text-[12px] line-clamp-3 mb-4 flex-1 leading-relaxed">{p.description || "No description."}</p>
      <div className="flex items-center gap-2 mt-auto overflow-hidden">
        {p.language && <span className="px-2 py-0.5 rounded bg-white/5 text-os-ink-dim text-[10px] font-mono shrink-0 border border-os-hairline">{p.language}</span>}
        {p.topics.slice(0, 2).map(t => (
          <span key={t} className="px-2 py-0.5 rounded bg-os-iris/10 text-os-iris text-[10px] font-mono shrink-0 border border-os-iris/20">{t}</span>
        ))}
      </div>
    </motion.button>
  );
}

export function ProjectsApp({ payload }: { payload?: any }) {
  const initialSlug = payload?.slug ?? "";
  const [sel, setSel] = useState<string | null>(initialSlug || null);
  const [q, setQ] = useState("");
  const [activeLang, setActiveLang] = useState<string | null>(null);

  const langs = useMemo(() => Array.from(new Set(projects.map(p => p.language).filter(Boolean))) as string[], []);
  
  const list = useMemo(() => {
    return projects.filter((p) => {
      const matchQ = !q || (p.name + " " + p.description + " " + p.topics.join(" ")).toLowerCase().includes(q.toLowerCase());
      const matchL = !activeLang || p.language === activeLang;
      return matchQ && matchL;
    });
  }, [q, activeLang]);

  const current = projects.find((p) => p.slug === sel);

  const sidebar = (
    <>
      <div className="p-4 border-b border-os-hairline shrink-0">
        <input
          value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects..."
          className="w-full bg-black/20 border border-os-hairline rounded-lg px-3 py-2 text-[12px] text-os-ink outline-none focus:border-os-iris focus:ring-1 focus:ring-os-iris transition-all placeholder:text-os-ink-faint"
        />
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-6">
        <div>
          <h4 className="text-os-ink-dim font-medium text-[11px] uppercase tracking-wider mb-3 px-1">Languages</h4>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setActiveLang(null)}
              className={`text-left px-3 py-1.5 rounded-lg text-[12px] transition-all ${!activeLang ? "bg-os-iris/15 text-os-iris font-medium" : "text-os-ink-dim hover:bg-white/5 hover:text-os-ink"}`}
            >
              All Languages
            </button>
            {langs.map(l => (
              <button
                key={l}
                onClick={() => setActiveLang(l)}
                className={`text-left px-3 py-1.5 rounded-lg text-[12px] transition-all ${activeLang === l ? "bg-os-iris/15 text-os-iris font-medium" : "text-os-ink-dim hover:bg-white/5 hover:text-os-ink"}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );

  return (
    <AppFrame sidebar={sidebar}>
      <div className="p-6 relative h-full">
        {sel && current ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto pt-8 pb-12"
          >
            <button onClick={() => setSel(null)} className="text-os-ink-dim hover:text-os-iris mb-6 text-[12px] flex items-center gap-1.5 transition-colors">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Back to Explorer
            </button>
            <motion.div layoutId={`proj-${current.slug}`}>
              <div className="text-os-iris text-[11px] font-mono mb-2">~/projects/{current.slug}</div>
              <h2 className="text-3xl font-bold text-os-ink mb-4 tracking-tight">{current.name}</h2>
              <p className="text-os-ink-dim text-[14px] leading-relaxed mb-8">{current.description || "No description provided."}</p>
              
              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <h4 className="text-os-ink-faint text-[11px] uppercase tracking-wider mb-2">Details</h4>
                  <dl className="grid grid-cols-[80px_1fr] gap-y-2 text-[12px]">
                    <dt className="text-os-ink-dim">Language</dt><dd className="text-os-ink font-mono">{current.language || "—"}</dd>
                    <dt className="text-os-ink-dim">Stars</dt><dd className="text-os-ink font-mono">★ {current.stars}</dd>
                    <dt className="text-os-ink-dim">Created</dt><dd className="text-os-ink">{current.created.slice(0,10)}</dd>
                    <dt className="text-os-ink-dim">Updated</dt><dd className="text-os-ink">{current.updated.slice(0,10)}</dd>
                  </dl>
                </div>
                {current.topics.length > 0 && (
                  <div>
                    <h4 className="text-os-ink-faint text-[11px] uppercase tracking-wider mb-2">Topics</h4>
                    <div className="flex flex-wrap gap-2">
                      {current.topics.map(t => (
                        <span key={t} className="px-2.5 py-1 rounded-md bg-white/5 text-os-ink text-[11px] font-mono border border-os-hairline">{t}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <a href={current.html_url} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-lg bg-os-iris text-os-bg font-medium text-[13px] hover:bg-white transition-colors shadow-[var(--shadow-glow-iris)]">
                  View Source
                </a>
                {current.homepage && (
                  <a href={current.homepage} target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-lg bg-os-panel border border-os-hairline text-os-ink font-medium text-[13px] hover:border-os-iris transition-colors">
                    Live Demo
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {list.map(p => (
              <ProjectCard key={p.slug} p={p} onClick={() => setSel(p.slug)} />
            ))}
            {list.length === 0 && (
              <div className="col-span-full py-12 text-center text-os-ink-dim">
                No projects found matching your criteria.
              </div>
            )}
          </motion.div>
        )}
      </div>
    </AppFrame>
  );
}
