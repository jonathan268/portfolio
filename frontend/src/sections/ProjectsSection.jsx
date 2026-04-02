import { useState, useEffect } from "react";
import { Sparkles, Star } from "lucide-react";
import Reveal from "../components/Reveal";
import TechIcon from "../components/TechIcon";
import api from "../api";

const FILTERS = [
  { key:"all",  label:"Tous" },
  { key:"saas", label:"SaaS" },
  { key:"web",  label:"Web App" },
  { key:"api",  label:"API" },
];

const ACCENT = { saas:"#e779c1", web:"#58c7f3", api:"#f3cc30" };
const BADGE  = { saas:"badge-primary", web:"badge-secondary", api:"badge-accent" };

const IconExternal = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);
const IconGithub = () => (
  <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

export default function ProjectsSection() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter]     = useState("all");
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    api.get("/projects")
      .then(r => setProjects(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? projects : projects.filter(p => p.type === filter);
  const count = (k) => k === "all" ? projects.length : projects.filter(p => p.type === k).length;

  return (
    <section id="projects" className="section-pad">
      <div className="container-md">

        <Reveal>
          <span className="label-mono">Work</span>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <h2 className="font-bold leading-tight font-ubuntu" style={{ fontSize:"clamp(30px,5vw,48px)", marginBottom:0 }}>
              Mes Projets
            </h2>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map(f => (
                <button key={f.key} className={`filter-pill${filter === f.key ? " active" : ""}`} onClick={() => setFilter(f.key)}>
                  {f.label}
                  <span className="filter-count">{count(f.key)}</span>
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {loading && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="sw-card animate-pulse">
              <div className="w-full h-44 bg-white/10 rounded-t-2xl" />
              <div className="p-6">
                <div className="w-1/2 h-5 mb-4 rounded bg-white/10" />
                <div className="w-full h-3 mb-2 rounded bg-white/5" />
                <div className="w-3/4 h-3 rounded bg-white/5" />
              </div>
            </div>
          ))}

          {!loading && filtered.map((p, i) => (
            <Reveal key={`${filter}-${p._id}`} delay={i * 80} dir="up">
              <div className={`sw-card h-full relative overflow-hidden flex flex-col${p.featured ? " border-primary/40" : ""}`}>

                {/* Image ou barre couleur */}
                {p.imageUrl ? (
                  <div className="relative w-full overflow-hidden shrink-0" style={{ height: 180 }}>
                    <img src={p.imageUrl} alt={`Aperçu ${p.name}`}
                      className="object-cover w-full h-full"
                      style={{ transition:"transform 0.5s ease" }}
                      onMouseOver={e => e.currentTarget.style.transform="scale(1.05)"}
                      onMouseOut={e => e.currentTarget.style.transform="scale(1)"}
                      onError={e => { e.currentTarget.parentElement.style.display="none"; }}
                    />
                    <div style={{
                      position:"absolute", inset:0,
                      background:"linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(18,10,46,0.88) 100%)",
                    }} />
                    <div style={{ position:"absolute", bottom:0, left:0, right:0, height:3, background:ACCENT[p.type]||"#e779c1" }} />
                  </div>
                ) : (
                  <div style={{ height:3, background:ACCENT[p.type]||"#e779c1" }} />
                )}

                {/* Badges position */}
                <div className="absolute flex gap-2" style={{ top: p.imageUrl ? 10 : 16, right: p.imageUrl ? 10 : 16 }}>
                  {p.featured && (
                    <span className="badge badge-primary text-[10px]"
                      style={ p.imageUrl ? { backdropFilter:"blur(6px)", background:"rgba(0,0,0,0.45)" } : {} }>
                      <Sparkles className="w-4 h-4" /> Nouveau
                    </span>
                  )}
                  <span className={`badge ${BADGE[p.type]||"badge-primary"} badge-outline font-mono text-[10px]`}
                    style={ p.imageUrl ? { backdropFilter:"blur(6px)", background:"rgba(0,0,0,0.45)" } : {} }>
                    {p.type?.toUpperCase()}
                  </span>
                </div>

                <div className={`p-6 flex flex-col flex-1 ${p.imageUrl ? "pt-5" : "pt-7"}`}>
                  <h3 className="font-ubuntu font-bold text-[20px] text-base-content/90 mb-1">{p.name}</h3>
                  <p className="font-mono text-[11px] tracking-[0.5px] mb-3.5" style={{ color:ACCENT[p.type] }}>{p.tagline}</p>
                  <p className="font-ubuntu font-light text-[14px] text-base-content/50 leading-[1.7] mb-4">{p.description}</p>

                  <ul className="flex flex-col gap-1.5 mb-5">
                    {p.features?.map(f => (
                      <li key={f} className="flex items-start gap-2 font-ubuntu font-light text-[13px] text-base-content/60">
                        <span className="font-bold shrink-0 mt-0.5" style={{ color:ACCENT[p.type] }}>→</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* ── Tech icons ─────────────────── */}
                  {p.stack?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 mb-5">
                      {p.stack.map(s => (
                        <TechIcon key={s} name={s} size={18} accentColor={ACCENT[p.type]} />
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 mt-auto">
                    {p.live && (
                      <a href={p.live} target="_blank" rel="noreferrer"
                        className="btn btn-primary btn-sm rounded-[9px] gap-1.5 flex-1 justify-center">
                        <IconExternal /> Live demo
                      </a>
                    )}
                    {p.github && (
                      <a href={p.github} target="_blank" rel="noreferrer"
                        className="btn btn-sm btn-outline rounded-[9px] gap-1.5 flex-1 justify-center"
                        style={{ border:"1px solid rgba(231,121,193,0.3)", color:"#c0bbd8" }}>
                        <IconGithub /> GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="py-16 text-center text-white/30">
            <div className="mb-3 text-4xl"></div>
            <p className="font-mono text-[13px]">Aucun projet dans cette catégorie.</p>
          </div>
        )}
      </div>
    </section>
  );
}