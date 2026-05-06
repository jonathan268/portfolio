import { useState, useEffect } from "react";
import { Sparkles, ArrowUpRight, Github, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api";

const FILTERS = [
  { key: "all", label: "Tous" },
  { key: "saas", label: "SaaS" },
  { key: "web", label: "Web App" },
  { key: "api", label: "API" },
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
    api.get("/projects")
      .then((r) => setProjects(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? projects : projects.filter((p) => p.type === filter);
  const count = (k) => (k === "all" ? projects.length : projects.filter((p) => p.type === k).length);

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-deep-space">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-brand-700/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-10%] w-[40vw] h-[40vw] bg-brand-400/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-md relative z-10 px-[6vw]">
        
        {/* Navigation & Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors font-mono text-[13px] mb-8"
          >
            <ArrowLeft size={16} /> Retour à l'accueil
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <h1 className="font-display font-black text-[40px] md:text-[56px] text-white leading-tight tracking-tight mb-4">
                Tous mes <span className="gradient-text">Projets</span>
              </h1>
              <p className="font-sans text-[16px] text-white/60 max-w-xl leading-relaxed">
                Explorez l'ensemble de mes réalisations, des applications web interactives aux architectures d'API robustes.
              </p>
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
        </motion.div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          <AnimatePresence mode="popLayout">
            {loading && Array.from({ length: 6 }).map((_, i) => (
              <motion.div 
                key={`skeleton-${i}`} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass-panel animate-pulse min-h-[400px]"
              >
                <div className="w-full h-56 bg-white/5" />
                <div className="p-8">
                  <div className="w-2/3 h-8 bg-white/10 rounded mb-4" />
                  <div className="w-full h-4 bg-white/5 rounded mb-2" />
                  <div className="w-4/5 h-4 bg-white/5 rounded" />
                </div>
              </motion.div>
            ))}

            {!loading && filtered.map((p) => (
              <motion.div 
                key={p._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="bento-card group"
              >
                {/* ── Image Header ── */}
                <div className="relative w-full h-64 overflow-hidden rounded-t-[24px]">
                  {p.imageUrl ? (
                    <img
                      src={p.imageUrl}
                      alt={p.name}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => { e.currentTarget.parentElement.style.display = "none"; }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-white/5 to-white/[0.02]" />
                  )}
                  
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#010214] via-[#010214]/40 to-transparent opacity-90" />

                  {/* Badges */}
                  <div className="absolute top-5 left-5 flex gap-2">
                    <span className="px-3 py-1 font-mono text-[10px] font-medium tracking-wider text-white uppercase rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                      {p.type}
                    </span>
                    {p.featured && (
                      <span className="flex items-center gap-1 px-3 py-1 font-mono text-[10px] font-medium tracking-wider uppercase rounded-full bg-brand-400/20 text-brand-400 border border-brand-400/30 backdrop-blur-md shadow-[0_0_10px_rgba(72,202,228,0.2)]">
                        <Sparkles size={12} /> Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* ── Content ── */}
                <div className="relative flex flex-col flex-1 p-8 pt-0 outline-none">
                  {/* Lifted content area over gradient */}
                  <div className="-mt-12 mb-6">
                     <h3 className="font-display font-bold text-[28px] text-white leading-tight mb-2 group-hover:text-brand-400 transition-colors">
                       {p.name}
                     </h3>
                     <p className="font-sans text-[15px] font-medium text-brand-600">
                       {p.tagline}
                     </p>
                  </div>

                  <p className="font-sans text-[15px] text-white/50 leading-[1.8] mb-8">
                    {p.description}
                  </p>

                  {/* Tech stack */}
                  {p.stack?.length > 0 && (
                    <div className="flex flex-wrap items-center gap-3 mb-8 mt-auto">
                      {p.stack.map((s) => (
                         <div key={s} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 text-[13px] hover:text-white transition-colors cursor-default hover:bg-white/10">
                           {s}
                         </div>
                      ))}
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="flex gap-4 pt-6 border-t border-white/10 mt-auto">
                    {p.live && (
                      <a href={p.live} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-medium text-[14px] text-white hover:text-brand-400 transition-colors">
                        View Live <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </a>
                    )}
                    {p.github && (
                      <a href={p.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-medium text-[14px] text-white/50 hover:text-white transition-colors ml-auto">
                        <Github size={16} /> Source
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {!loading && filtered.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="py-24 text-center"
          >
            <p className="font-mono text-[14px] text-white/40">Aucun projet trouvé dans cette catégorie.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
