import { useState, useEffect } from "react";
import { Sparkles, ArrowUpRight, Github, Code2 } from "lucide-react";
import Reveal from "../components/Reveal";
import TechIcon from "../components/TechIcon";
import api from "../api";

const FILTERS = [
  { key: "all", label: "Tous" },
  { key: "saas", label: "SaaS" },
  { key: "web", label: "Web App" },
  { key: "api", label: "API" },
];

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/projects")
      .then((r) => setProjects(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? projects : projects.filter((p) => p.type === filter);
  const count = (k) => (k === "all" ? projects.length : projects.filter((p) => p.type === k).length);

  return (
    <section id="projects" className="section-pad">
      <div className="container-md">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div>
              <span className="label-mono flex items-center gap-2">
                <Code2 size={16} /> Portfolio
              </span>
              <h2 className="section-title">
                Featured <span className="gradient-text">Work</span>
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {FILTERS.map((f) => (
                <button
                  key={f.key}
                  className={`neo-pill ${filter === f.key ? "active" : ""}`}
                  onClick={() => setFilter(f.key)}
                >
                  {f.label}
                  <span className="neo-count">{count(f.key)}</span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {loading && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-panel animate-pulse min-h-[400px]">
              <div className="w-full h-56 bg-white/5" />
              <div className="p-8">
                <div className="w-2/3 h-8 bg-white/10 rounded mb-4" />
                <div className="w-full h-4 bg-white/5 rounded mb-2" />
                <div className="w-4/5 h-4 bg-white/5 rounded" />
              </div>
            </div>
          ))}

          {!loading && filtered.map((p, i) => (
            <Reveal key={`${filter}-${p._id}`} delay={i * 80} dir="up">
              <div className="bento-card">
                {/* ── Image Header ── */}
                <div className="relative w-full h-64 overflow-hidden rounded-t-[24px]">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
                      onError={(e) => { e.currentTarget.parentElement.style.display = "none"; }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/[0.02]" />
                  )}
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent opacity-90" />

                  {/* Badges */}
                  <div className="absolute top-5 left-5 flex gap-2">
                    <span className="px-3 py-1 font-mono text-[10px] font-medium tracking-wider text-white uppercase rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                      {p.type}
                    </span>
                    {p.featured && (
                      <span className="flex items-center gap-1 px-3 py-1 font-mono text-[10px] font-medium tracking-wider uppercase rounded-full bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30 backdrop-blur-md">
                        <Sparkles size={12} /> Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* ── Content ── */}
                <div className="relative flex flex-col flex-1 p-8 pt-0 outline-none">
                  {/* Lifted content area over gradient */}
                  <div className="-mt-12 mb-6">
                     <h3 className="font-display font-bold text-[28px] text-white leading-tight mb-2">
                       {p.name}
                     </h3>
                     <p className="font-sans text-[15px] font-medium text-neon-violet">
                       {p.tagline}
                     </p>
                  </div>

                  <p className="font-sans text-[15px] text-white/50 leading-[1.8] mb-8">
                    {p.description}
                  </p>

                  {/* Tech stack */}
                  {p.stack?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-3 mb-8">
                      {p.stack.map((s) => (
                         <div key={s} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 text-[13px] hover:text-white transition-colors cursor-default">
                           {s}
                         </div>
                      ))}
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="flex gap-4 mt-auto pt-6 border-t border-white/10">
                    {p.live && (
                      <a href={p.live} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-medium text-[14px] text-white hover:text-neon-cyan transition-colors">
                        View Live <ArrowUpRight size={16} />
                      </a>
                    )}
                    {p.github && (
                      <a href={p.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-medium text-[14px] text-white/50 hover:text-white transition-colors ml-auto">
                        <Github size={16} /> Source
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-mono text-[14px] text-white/40">No projects found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
}