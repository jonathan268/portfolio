import { useState, useEffect, useMemo } from "react";
import { Sparkles, ArrowUpRight, Github, ArrowLeft, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api";
import useSEO from "../hooks/useSEO";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useSEO({
    title: "Projets — Portfolio Fullstack",
    description: "Explorez mes projets web : applications React, API Node.js, SaaS Laravel et plus. Développeur fullstack basé à Yaoundé, Cameroun.",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const controller = new AbortController();
    api.get("/projects", { signal: controller.signal })
      .then((r) => setProjects(r.data.data))
      .catch(() => {})
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    api.get("/categories").then(r => setCategories(r.data.data)).catch(() => {});
    return () => controller.abort();
  }, []);

  const FILTERS = useMemo(() => [
    { key: "all", label: "Tous" },
    ...categories.map(c => ({ key: c.key, label: c.name })),
  ], [categories]);

  const filtered = useMemo(
    () => filter === "all" ? projects : projects.filter((p) => p.type === filter),
    [filter, projects]
  );
  const count = useMemo(
    () => (k) => (k === "all" ? projects.length : projects.filter((p) => p.type === k).length),
    [projects]
  );

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-deep-space">
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-brand-700/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] left-[-10%] w-[40vw] h-[40vw] bg-brand-400/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 px-[6vw]">

        <div className="container-md mx-auto">
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
        </div>

        {/* ── Bento Grid ── */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 auto-rows-[minmax(280px,auto)]">
          <AnimatePresence mode="popLayout">
            {loading && Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`glass-panel animate-pulse ${i === 0 ? "md:col-span-2 md:row-span-2 min-h-[520px]" : "min-h-[280px]"}`}
              >
                <div className="w-full h-full bg-white/5 rounded-2xl" />
              </motion.div>
            ))}

            {!loading && filtered.map((p, i) => {
              const isHero = i % 4 === 0;
              const isTall = i % 4 === 3;
              return (
                <motion.div
                  key={p._id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.45, delay: i * 0.04 }}
                  className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] cursor-pointer
                    ${isHero ? "md:col-span-2 md:row-span-2 min-h-[360px] md:min-h-[520px]" : "min-h-[220px] md:min-h-[280px]"}
                  `}
                  onClick={() => navigate(`/projects/${p._id}`)}
                >
                  {/* Image */}
                  <div className="absolute inset-0">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={`Capture d'écran du projet ${p.name}`}
                        loading="lazy"
                        className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brand-400/10 to-brand-600/10" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#010214] via-[#010214]/60 to-transparent" />
                    {isHero && (
                      <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    )}
                  </div>

                  {/* Badges */}
                  <div className="absolute top-5 left-5 flex gap-2 z-10">
                    <span className="px-3 py-1 font-mono text-[10px] font-medium tracking-wider text-white uppercase rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                      {categories.find(c => c.key === p.type)?.name || p.type}
                    </span>
                    {p.featured && (
                      <span className="flex items-center gap-1 px-3 py-1 font-mono text-[10px] font-medium tracking-wider uppercase rounded-full bg-brand-400/20 text-brand-400 border border-brand-400/30 backdrop-blur-md">
                        <Sparkles size={12} /> Featured
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`absolute bottom-0 left-0 right-0 z-10 ${isHero ? "p-8 md:p-10" : "p-6"}`}>
                    {isHero && (
                      <p className="font-mono text-[11px] text-brand-400 tracking-[2px] uppercase mb-3">
                        {p.stack?.[0] || "Projet"}
                      </p>
                    )}
                    <h3 className={`font-display font-bold text-white leading-tight group-hover:text-brand-400 transition-colors ${isHero ? "text-[28px] md:text-[36px] mb-2" : "text-[20px] mb-1"}`}>
                      {p.name}
                    </h3>
                    <p className={`font-sans text-white/60 ${isHero ? "text-[15px] mb-6" : "text-[13px] mb-4"}`}>
                      {p.tagline}
                    </p>
                    {isHero && (
                      <>
                        <p className="font-sans text-[14px] text-white/40 leading-[1.7] mb-6 line-clamp-2 max-w-xl">
                          {p.description}
                        </p>
                        {p.stack?.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-6">
                            {p.stack.slice(0, 4).map((s) => (
                              <span key={s} className="px-3 py-1 rounded-lg bg-white/10 border border-white/10 text-white/70 text-[12px]">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 font-medium text-[13px] text-brand-400 hover:text-white transition-colors">
                        Détails <ExternalLink size={14} />
                      </span>
                      {p.live && (
                        <a href={p.live} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1.5 font-medium text-[13px] text-white/70 hover:text-white transition-colors">
                          Live <ArrowUpRight size={14} />
                        </a>
                      )}
                      {p.github && (
                        <a href={p.github} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                          className="flex items-center gap-1.5 font-medium text-[13px] text-white/50 hover:text-white transition-colors ml-auto">
                          <Github size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
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
