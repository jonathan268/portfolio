import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Github, Target, Coffee, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";
import defaultImage from "../assets/profil.jpeg";

const ICON_MAP = { Target, Coffee, User };
const FALLBACK_TITLES = ["Fullstack Web Developer", "SaaS Builder", "API Architect", "African Tech Creator"];
const FALLBACK_STACK = ["React", "Node.js", "Express", "Laravel", "MongoDB", "MySQL", "Docker"];
const FALLBACK_STATS = [
  { label: "Expérience", value: "2+ ans" },
  { label: "Projets livrés", value: "10+" },
  { label: "Localisation", value: "Yaoundé" },
];

function getIcon(name) {
  const icon = ICON_MAP[name];
  return icon ? <icon size={16} /> : <Target size={16} />;
}

export default function HeroSection() {
  const [profile, setProfile] = useState(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    api.get("/profile")
      .then(r => setProfile(r.data.data))
      .catch(() => {});
  }, []);

  const titles = profile?.titles?.length ? profile.titles : FALLBACK_TITLES;
  const stack = profile?.techStack?.length ? profile.techStack : FALLBACK_STACK;
  const stats = profile?.stats?.length ? profile.stats : FALLBACK_STATS;
  const bio = profile?.bio || "Développeur fullstack basé à Yaoundé, passionné par la création d'expériences numériques immersives et performantes.";
  const tagline = profile?.tagline || "Développeur fullstack basé à Yaoundé";

  useEffect(() => {
    const iv = setInterval(() => setIdx(i => (i + 1) % titles.length), 3000);
    return () => clearInterval(iv);
  }, [titles.length]);

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  const socialLinks = profile?.socialLinks || {};

  return (
    <section id="hero" className="relative flex items-center min-h-screen pt-32 pb-20 overflow-hidden px-[6vw]">
      <div className="absolute inset-0 z-0 bg-deep-space">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-800/20 blur-[120px] mix-blend-screen animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-brand-500/20 blur-[120px] mix-blend-screen animate-blob" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] rounded-full bg-brand-300/15 blur-[100px] mix-blend-screen animate-blob" style={{ animationDelay: "4s" }} />
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "64px 64px", maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)", WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)" }} />
      </div>

      <motion.div className="relative z-10 w-full max-w-6xl mx-auto" variants={containerVariants} initial="hidden" animate="show">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-center">

          {/* ── Left ── */}
          <div className="flex flex-col">
            {profile?.available !== false && (
              <motion.div variants={itemVariants} className="flex items-center gap-2 mb-8 w-max px-4 py-2 rounded-full border border-brand-500/20 bg-brand-500/5 backdrop-blur-md">
                <span className="relative flex w-2.5 h-2.5">
                  <span className="absolute inline-flex w-full h-full rounded-full opacity-75 bg-brand-400 animate-ping" />
                  <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-brand-400" />
                </span>
                <span className="font-mono text-[12px] font-medium tracking-widest uppercase text-brand-400">
                  Available for projects
                </span>
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="mb-6 min-h-[100px] md:min-h-[120px] flex flex-col justify-center">
              <h1 className="font-display font-black leading-[1.1] tracking-tight" style={{ fontSize: "clamp(28px, 7vw, 72px)" }}>
                {profile?.name ? (
                  <><span className="text-white">{profile.name} &mdash; </span></>
                ) : (
                  <><span className="text-white">I am a </span></>
                )}
                <br className="md:hidden" />
                <div className="inline-block relative h-[1.2em] w-full md:w-auto align-bottom">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={idx}
                      initial={{ y: 40, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -40, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "anticipate" }}
                      className="inline-block gradient-text whitespace-nowrap"
                    >
                      {titles[idx]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </h1>
            </motion.div>

            <motion.p variants={itemVariants} className="font-sans text-[16px] md:text-[18px] text-white/70 leading-[1.8] mb-6 max-w-xl">
              {bio}
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mb-8">
              <button className="relative group px-8 py-4 rounded-xl font-sans font-semibold text-[15px] overflow-hidden bg-white/5 border border-white/10 hover:border-transparent transition-all" onClick={() => go("projects")}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-brand-600 to-brand-800" />
                <span className="relative flex items-center gap-2 text-white z-10 group-hover:text-white transition-colors duration-300">
                  <Sparkles size={18} /> Voir mes projets
                </span>
              </button>

              {socialLinks.github && (
                <a href={socialLinks.github} target="_blank" rel="noreferrer"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl font-sans font-semibold text-[15px] bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/30 transition-all">
                  <Github size={18} /> GitHub
                </a>
              )}

              <button className="flex items-center gap-2 px-8 py-4 rounded-xl font-sans font-semibold text-[15px] text-white hover:text-brand-400 transition-colors" onClick={() => go("contact")}>
                Me Contacter <ArrowRight size={18} />
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-8">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label || i}
                  whileHover={{ y: -4 }}
                  className="glass-panel px-5 py-4 rounded-xl flex items-center gap-4 cursor-default transition-all duration-300 flex-1 min-w-[130px]"
                >
                  <div className="p-2.5 rounded-lg bg-brand-500/10 text-brand-400">
                    {getIcon(s.label)}
                  </div>
                  <div>
                    <div className="font-display font-bold text-[22px] text-white leading-none mb-1">{s.value}</div>
                    <div className="font-mono text-[10px] text-white/40 tracking-wider uppercase">{s.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
              {stack.map((tech) => (
                <motion.span
                  key={tech}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="px-3 py-1.5 font-mono text-[12px] text-white/50 bg-white/[0.02] border border-white/5 rounded-lg hover:border-brand-500/30 hover:text-brand-200 hover:bg-brand-500/10 transition-colors cursor-default"
                >
                  {tech}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Photo ── */}
          <motion.div variants={itemVariants} className="relative hidden lg:flex items-center justify-center">
            <div className="absolute w-[400px] h-[400px] rounded-full bg-brand-500/10 blur-[80px]" />

            <motion.div
              className="relative"
              animate={{ y: [0, -14, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            >
              <div className="relative w-[360px] h-[420px] rounded-[32px] overflow-hidden border border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
                <div className="absolute inset-0 bg-gradient-to-t from-[#010214]/60 via-transparent to-transparent z-10" />
                <img
                  src={profile?.profileImage || defaultImage}
                  alt={profile?.name || "Jonathan"}
                  className="object-cover w-full h-full"
                />
              </div>

              {stats[0] && (
                <motion.div
                  className="absolute -top-6 -right-6 w-16 h-16 rounded-2xl glass-panel flex items-center justify-center border border-brand-500/20"
                  animate={{ y: [0, -8, 0], rotate: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
                >
                  <span className="font-display font-bold text-[24px] text-brand-400">{stats[0].value}</span>
                </motion.div>
              )}

              <motion.div
                className="absolute -bottom-4 -left-6 px-5 py-3 rounded-2xl glass-panel flex items-center gap-3 border border-white/10"
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 }}
              >
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="font-mono text-[12px] text-white/70">{tagline}</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
