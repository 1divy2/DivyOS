import { AppFrame } from "./AppFrame";

export function ResumeApp() {
  const header = (
    <div className="flex items-center justify-between w-full text-[12px]">
      <div className="flex gap-4">
        <a href="/Resume(Official).pdf" target="_blank" className="px-4 py-1.5 rounded-lg bg-os-iris/10 border border-os-iris/30 text-os-iris font-medium hover:bg-os-iris hover:text-white transition-colors flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
          Download Official PDF
        </a>
      </div>
      <div className="text-os-ink-dim font-mono tracking-wider">RESUME // 2026</div>
    </div>
  );

  return (
    <AppFrame header={header} className="bg-black/95">
      <div className="h-full overflow-auto p-6 md:p-12 relative" style={{ fontFamily: "Inter Tight" }}>
        
        {/* Ambient background glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-os-iris/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-os-amber/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-12 relative z-10 pb-20">
          
          {/* Header */}
          <div className="text-center md:text-left border-b border-white/10 pb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight" style={{ fontFamily: "Fraunces, serif" }}>Divy Dadheech</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-os-ink-dim text-sm font-mono uppercase tracking-widest">
              <span>Udaipur, Rajasthan, India</span>
              <span className="hidden md:inline text-white/20">|</span>
              <a href="mailto:dadheech120404@gmail.com" className="hover:text-os-iris transition">dadheech120404@gmail.com</a>
              <span className="hidden md:inline text-white/20">|</span>
              <span>+91 8824799783</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-12">
              {/* Projects */}
              <section>
                <SectionHeader title="Projects" icon="🚀" />
                <div className="space-y-6 mt-6">
                  <ProjectCard 
                    title="Parkinson's Disease Prediction using Machine Learning"
                    tech={["Python", "Scikit-learn", "Pandas", "Librosa", "Flask", "React"]}
                    link="github.com/1divy2/Parkinson-s-Prediction"
                    points={[
                      "Built an end-to-end machine learning pipeline to predict Parkinson's disease using biomedical features.",
                      "Performed data preprocessing, feature extraction, and trained supervised ML models.",
                      "Evaluated models using accuracy, precision, recall, and F1-score metrics.",
                      "Developed a backend API and frontend interface for demonstrating predictions.",
                      "Followed industry practices by separating code and dataset due to size and ethical considerations."
                    ]}
                  />
                  <ProjectCard 
                    title="Medi_frend – Medical Assistant Application"
                    tech={["Java", "Python", "SQL"]}
                    link="github.com/1divy2/Medi_frend"
                    points={[
                      "Designed a medical assistant application to manage doctor schedules and patient appointments.",
                      "Implemented structured backend logic for appointment tracking and data handling.",
                      "Simulated real-world hospital workflows with a focus on modular design."
                    ]}
                  />
                </div>
              </section>

              {/* Experience / Activities */}
              <section>
                <SectionHeader title="Activities" icon="⚡" />
                <div className="mt-6 glass-strong rounded-2xl p-6 border border-white/5 shadow-xl hover:border-white/10 transition-colors">
                  <ul className="space-y-3 text-os-ink/80 text-[15px] leading-relaxed">
                    <li className="flex gap-3"><span className="text-os-iris">▹</span> Developed multiple academic and personal software projects using Java, Python, and Machine Learning.</li>
                    <li className="flex gap-3"><span className="text-os-iris">▹</span> Actively use GitHub for version control and project collaboration.</li>
                    <li className="flex gap-3"><span className="text-os-iris">▹</span> Participated in academic projects and technical coursework involving ML and system design.</li>
                  </ul>
                </div>
              </section>
            </div>

            <div className="space-y-12">
              {/* Education */}
              <section>
                <SectionHeader title="Education" icon="🎓" />
                <div className="space-y-4 mt-6">
                  <div className="glass-strong rounded-2xl p-5 border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-os-amber/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition duration-700" />
                    <div className="text-[10px] text-os-amber uppercase tracking-widest font-mono mb-1">Aug 2022 – Jul 2026</div>
                    <div className="font-semibold text-white text-lg">VIT-AP University</div>
                    <div className="text-sm text-os-ink-dim mt-1">B.Tech in Computer Science Engineering</div>
                    <div className="mt-3 inline-block px-3 py-1 rounded bg-black/40 text-os-amber text-xs font-mono font-medium border border-os-amber/20">CGPA: 8.28</div>
                  </div>

                  <div className="glass-strong rounded-2xl p-5 border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-os-iris/10 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition duration-700" />
                    <div className="text-[10px] text-os-iris uppercase tracking-widest font-mono mb-1">May 2019 – May 2021</div>
                    <div className="font-semibold text-white text-lg">MDS Public School</div>
                    <div className="text-sm text-os-ink-dim mt-1">Higher Secondary (Science)</div>
                    <div className="mt-3 inline-block px-3 py-1 rounded bg-black/40 text-os-iris text-xs font-mono font-medium border border-os-iris/20">Aggregate: 92.8%</div>
                  </div>
                </div>
              </section>

              {/* Skills */}
              <section>
                <SectionHeader title="Technical Skills" icon="🛠️" />
                <div className="mt-6 space-y-6">
                  <SkillGroup title="Languages" items={["Java", "Python", "SQL"]} color="emerald" />
                  <SkillGroup title="Machine Learning" items={["Scikit-learn", "Pandas", "NumPy", "Librosa"]} color="amber" />
                  <SkillGroup title="Web & App" items={["React", "Flask", "Flutter"]} color="iris" />
                  <SkillGroup title="Tools" items={["Git", "GitHub", "AWS"]} color="rose" />
                </div>
              </section>
              
              {/* Certifications */}
              <section>
                <SectionHeader title="Certifications" icon="🏆" />
                <div className="mt-6 flex flex-col gap-3">
                  <div className="glass-strong px-4 py-3 rounded-xl border border-white/5 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    <span className="text-sm font-medium text-white/90">MongoDB DBA Certified</span>
                  </div>
                  <div className="glass-strong px-4 py-3 rounded-xl border border-white/5 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                    <span className="text-sm font-medium text-white/90">Oracle Gen AI Certified</span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

function SectionHeader({ title, icon }: { title: string, icon: string }) {
  return (
    <h2 className="text-xl font-bold text-white flex items-center gap-3 tracking-tight">
      <span className="p-2 rounded-lg bg-white/5 border border-white/10 text-lg shadow-lg">{icon}</span>
      {title}
    </h2>
  );
}

function ProjectCard({ title, tech, points, link }: { title: string, tech: string[], points: string[], link: string }) {
  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8 border border-white/5 hover:border-os-iris/30 transition-colors duration-500 shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-64 h-64 bg-os-iris/5 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      <div className="relative z-10">
        <h3 className="text-2xl font-bold text-white mb-4" style={{ fontFamily: "Fraunces, serif" }}>{title}</h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {tech.map((t) => (
            <span key={t} className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-os-ink-dim uppercase tracking-wider">{t}</span>
          ))}
        </div>
        <ul className="space-y-2 mb-6">
          {points.map((p, i) => (
            <li key={i} className="flex gap-3 text-[15px] text-os-ink/80 leading-relaxed">
              <span className="text-os-iris/50 mt-1">▹</span> {p}
            </li>
          ))}
        </ul>
        <a href={`https://${link}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-os-iris hover:text-white transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
          {link}
        </a>
      </div>
    </div>
  );
}

function SkillGroup({ title, items, color }: { title: string, items: string[], color: "emerald" | "amber" | "iris" | "rose" }) {
  const colorMap = {
    emerald: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5",
    amber: "text-amber-400 border-amber-400/20 bg-amber-400/5",
    iris: "text-os-iris border-os-iris/20 bg-os-iris/5",
    rose: "text-rose-400 border-rose-400/20 bg-rose-400/5"
  };
  
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[0.2em] text-os-ink-dim mb-3 font-semibold">{title}</div>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <span key={item} className={`px-3 py-1.5 rounded-lg text-xs font-medium border shadow-sm ${colorMap[color]}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
