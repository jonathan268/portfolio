import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink, Github, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import api from "../api";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const controller = new AbortController();
    api.get(`/projects/${id}`, { signal: controller.signal })
      .then((r) => setProject(r.data.data))
      .catch(() => { if (!controller.signal.aborted) navigate("/projects", { replace: true }); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    api.get("/categories").then(r => setCategories(r.data.data)).catch(() => {});
    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-deep-space">
        <span className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!project) return null;

  const categoryName = categories.find(c => c.key === project.type)?.name || project.type;

  const screenshots = project.screenshots?.length > 0 ? project.screenshots : (project.imageUrl ? [project.imageUrl] : []);

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-deep-space">
      <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-brand-700/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-[-10%] w-[40vw] h-[40vw] bg-brand-400/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container-md relative z-10 px-[6vw]">

        {/* Back */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={() => navigate("/projects")}
            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors font-mono text-[13px] mb-12"
          >
            <ArrowLeft size={16} /> Retour aux projets
          </button>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 font-mono text-[11px] font-medium tracking-wider text-white uppercase rounded-full bg-white/10 backdrop-blur-md border border-white/20">
              {categoryName}
            </span>
            {project.featured && (
              <span className="flex items-center gap-1 px-3 py-1 font-mono text-[11px] font-medium tracking-wider uppercase rounded-full bg-brand-400/20 text-brand-400 border border-brand-400/30 backdrop-blur-md">
                <Sparkles size={14} /> Featured
              </span>
            )}
          </div>

          <h1 className="font-display font-black text-[44px] md:text-[64px] text-white leading-tight tracking-tight mb-4">
            {project.name}
          </h1>
          <p className="font-sans text-[18px] font-medium text-brand-400 mb-8">
            {project.tagline}
          </p>

          <div className="flex flex-wrap gap-4">
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-400 transition-colors">
                <ExternalLink size={18} /> Voir le projet
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 transition-colors border border-white/10">
                <Github size={18} /> Code source
              </a>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">

            {/* Screenshots Gallery */}
            {screenshots.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="font-display font-bold text-[22px] text-white mb-6">Captures d'écran</h2>
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
                  <img
                    src={screenshots[imgIndex]}
                    alt={`Capture ${imgIndex + 1}`}
                    loading="lazy"
                    className="w-full aspect-video object-cover"
                  />
                  {screenshots.length > 1 && (
                    <>
                      <button onClick={() => setImgIndex(i => (i - 1 + screenshots.length) % screenshots.length)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#010214]/60 text-white hover:bg-[#010214]/80 transition-colors backdrop-blur-sm">
                        <ChevronLeft size={20} />
                      </button>
                      <button onClick={() => setImgIndex(i => (i + 1) % screenshots.length)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#010214]/60 text-white hover:bg-[#010214]/80 transition-colors backdrop-blur-sm">
                        <ChevronRight size={20} />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {screenshots.map((_, i) => (
                          <button key={i} onClick={() => setImgIndex(i)}
                            className={`w-2 h-2 rounded-full transition-all ${i === imgIndex ? 'bg-brand-400 w-6' : 'bg-white/40 hover:bg-white/70'}`} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
                {/* Thumbnails */}
                {screenshots.length > 1 && (
                  <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                    {screenshots.map((url, i) => (
                      <button key={i} onClick={() => setImgIndex(i)}
                        className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === imgIndex ? 'border-brand-400 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'}`}>
                        <img src={url} alt={`Miniature ${i + 1}`} loading="lazy" className="object-cover w-full h-full" />
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Résumé complet */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="font-display font-bold text-[22px] text-white mb-4">Résumé</h2>
              <div className="font-sans text-[16px] text-white/70 leading-[1.9] space-y-4">
                {(project.summary || project.description || "").split("\n").map((p, i) => (
                  <p key={i}>{p || "\u00A0"}</p>
                ))}
              </div>
            </motion.div>

            {/* Fonctionnalités détaillées */}
            {project.featureDetails?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="font-display font-bold text-[22px] text-white mb-6">Fonctionnalités</h2>
                <div className="flex flex-col gap-4">
                  {project.featureDetails.map((fd, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-colors">
                      <h3 className="font-display font-semibold text-[18px] text-white mb-2">{fd.name}</h3>
                      <p className="font-sans text-[15px] text-white/60 leading-[1.8]">{fd.description}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Liste simple des fonctionnalités */}
            {(!project.featureDetails?.length && project.features?.length > 0) && (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="font-display font-bold text-[22px] text-white mb-6">Fonctionnalités</h2>
                <ul className="space-y-3">
                  {project.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 font-sans text-[15px] text-white/70">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">

            {/* Stack */}
            {project.stack?.length > 0 && (
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
                <h3 className="font-mono text-[11px] text-brand-400 tracking-[2px] uppercase mb-4">Langages & Outils</h3>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map((s) => (
                    <span key={s} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 text-[13px]">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Détails */}
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10">
              <h3 className="font-mono text-[11px] text-brand-400 tracking-[2px] uppercase mb-4">Détails</h3>
              <div className="space-y-3 font-sans text-[14px]">
                <div className="flex justify-between">
                  <span className="text-white/40">Type</span>
                  <span className="text-white capitalize">{categoryName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Captures</span>
                  <span className="text-white">{screenshots.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Fonctionnalités</span>
                  <span className="text-white">{project.featureDetails?.length || project.features?.length || 0}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
