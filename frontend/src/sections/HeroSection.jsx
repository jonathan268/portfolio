import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Github, Target, Coffee, User, ChevronDown } from "lucide-react";
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
  const Icon = ICON_MAP[name];
  return Icon ? <Icon size={16} /> : <Target size={16} />;
}

function useTypewriter(words) {
  const [displayed, setDisplayed] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!words.length) return;
    const current = words[wordIdx];
    let timeout;

    if (!deleting) {
      if (charIdx < current.length) {
        timeout = setTimeout(() => {
          setDisplayed(current.slice(0, charIdx + 1));
          setCharIdx(c => c + 1);
        }, 60 + Math.random() * 40);
      } else {
        timeout = setTimeout(() => setDeleting(true), 2000);
      }
    } else {
      if (charIdx > 0) {
        timeout = setTimeout(() => {
          setDisplayed(current.slice(0, charIdx - 1));
          setCharIdx(c => c - 1);
        }, 30);
      } else {
        setDeleting(false);
        setWordIdx(i => (i + 1) % words.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [words, wordIdx, charIdx, deleting]);

  return displayed;
}

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 22 } },
};

const fadeUpSlow = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export default function HeroSection() {
  const [profile, setProfile] = useState(null);

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
  const socialLinks = profile?.socialLinks || {};
  const typedTitle = useTypewriter(titles);

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="hero" className="relative flex items-center min-h-screen overflow-hidden">
      {/* ── Background layers ── */}
      <div className="absolute inset-0 bg-deep-space">
              <div className="absolute inset-0 opacity-40 animate-aurora" style={{
          background: "radial-gradient(ellipse 80% 55% at 0% 15%, rgba(0,180,216,0.12), transparent 60%), radial-gradient(ellipse 55% 45% at 100% 85%, rgba(2,62,138,0.18), transparent 60%), radial-gradient(ellipse 50% 50% at 50% 50%, rgba(3,4,94,0.12), transparent 60%)",
          backgroundSize: "200% 200%",
        }} />

        <div className="absolute top-[-15%] left-[-8%] w-[45vw] h-[45vw] rounded-full bg-brand-700/20 blur-[130px] mix-blend-screen animate-blob" />
        <div className="absolute bottom-[-12%] right-[-8%] w-[38vw] h-[38vw] rounded-full bg-brand-500/12 blur-[120px] mix-blend-screen animate-blob" style={{ animationDelay: "2.5s" }} />
        <div className="absolute top-[35%] left-[55%] w-[25vw] h-[25vw] rounded-full bg-brand-600/8 blur-[100px] mix-blend-screen animate-blob" style={{ animationDelay: "5s" }} />

        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(ellipse at 40% 50%, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at 40% 50%, black 30%, transparent 75%)",
        }} />
      </div>

      <div className="relative z-10 w-full px-[6vw] py-32">
        <motion.div
          className="max-w-7xl mx-auto"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-16 lg:gap-20 items-center">

            {/* ── Left: Content ── */}
            <div className="flex flex-col">

              <motion.div variants={fadeUp} className="flex items-center gap-3 mb-10">
                <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-brand-500/20 bg-brand-500/[0.04] backdrop-blur-md">
                  <span className="relative flex w-2 h-2">
                    <span className="absolute inline-flex w-full h-full rounded-full opacity-75 bg-brand-400 animate-ping" />
                    <span className="relative inline-flex w-2 h-2 rounded-full bg-brand-400 shadow-[0_0_6px_rgba(0,180,216,0.5)]" />
                  </span>
                  <span className="font-mono text-[11px] font-medium tracking-[3px] uppercase text-brand-400/90">
                    {profile?.available !== false ? "Disponible" : "Occupé"}
                  </span>
                </div>
              </motion.div>

              <motion.div variants={fadeUpSlow} className="mb-3">
                <div className="flex items-center gap-2 mb-4 font-mono text-[13px] text-white/30">
                  <span className="text-brand-400/60">$</span>
                  <span className="text-white/40">whoami</span>
                  <span className="text-brand-400/60 animate-pulse">▍</span>
                </div>

                <h1 className="font-display font-black leading-[0.92] tracking-[-0.03em]"
                    style={{ fontSize: "clamp(48px, 11vw, 100px)" }}>
                  <span className="text-white">Jonathan</span>
                  <span className="text-brand-400">.</span>
                </h1>
              </motion.div>

              <motion.div variants={fadeUp} className="mb-3">
                <div className="flex items-center gap-2 font-display font-semibold text-[clamp(18px,3.5vw,32px)] text-white/80 min-h-[48px]">
                  <span>{typedTitle}</span>
                  <span className="inline-block w-[3px] h-[1.2em] bg-brand-400/80 animate-pulse rounded-full" />
                </div>
              </motion.div>

              <motion.p variants={fadeUp}
                className="font-sans text-[16px] md:text-[17px] text-white/50 leading-[1.9] mb-10 max-w-xl"
              >
                {bio}
              </motion.p>

              <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4 mb-12">
                <button
                  onClick={() => go("projects")}
                  className="group relative px-9 py-4 rounded-2xl font-sans font-semibold text-[15px] overflow-hidden bg-gradient-to-r from-brand-600 to-brand-800 text-white shadow-[0_8px_32px_rgba(0,180,216,0.2)] hover:shadow-[0_12px_48px_rgba(0,180,216,0.35)] transition-all duration-500 hover:scale-[1.03] active:scale-[0.97]"
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-brand-500 to-brand-700" />
                  <span className="relative flex items-center gap-2 z-10">
                    <Sparkles size={18} /> Voir mes projets
                  </span>
                </button>

                {socialLinks.github && (
                  <a href={socialLinks.github} target="_blank" rel="noreferrer"
                    className="group flex items-center gap-2.5 px-6 py-4 rounded-2xl border border-white/[0.06] text-white/60 hover:text-white hover:border-white/20 hover:bg-white/[0.03] transition-all duration-300">
                    <Github size={18} />
                    <span className="font-sans font-medium text-[14px]">GitHub</span>
                  </a>
                )}

                <button onClick={() => go("contact")}
                  className="group flex items-center gap-2 px-5 py-4 rounded-2xl text-white/40 hover:text-brand-400 transition-all duration-300">
                  <span className="font-sans font-medium text-[14px]">Contact</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-10">
                {stats.map((s, i) => (
                  <motion.div
                    key={s.label || i}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="glass-panel px-5 py-4 rounded-2xl flex items-center gap-4 cursor-default transition-all duration-300 flex-1 min-w-[140px] border border-white/[0.06]"
                  >
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-brand-500/15 to-brand-700/10 text-brand-400">
                      {getIcon(s.label)}
                    </div>
                    <div>
                      <div className="font-display font-bold text-[22px] text-white leading-none mb-1">{s.value}</div>
                      <div className="font-mono text-[10px] text-white/35 tracking-[2px] uppercase">{s.label}</div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              <motion.div variants={fadeUp} className="flex flex-wrap gap-2">
                {stack.map((tech) => (
                  <motion.span
                    key={tech}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="px-3 py-1.5 font-mono text-[11px] text-white/35 bg-white/[0.02] border border-white/[0.04] rounded-lg hover:border-brand-500/30 hover:text-brand-300 hover:bg-brand-500/[0.06] transition-all duration-300 cursor-default"
                  >
                    {tech}
                  </motion.span>
                ))}
              </motion.div>
            </div>

            {/* ── Right: Photo ── */}
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.92, x: 40 },
                show: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
              }}
              className="relative hidden lg:flex items-center justify-center"
            >
              <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-brand-500/12 via-brand-700/8 to-brand-900/15 blur-[120px] animate-blob" style={{ animationDelay: "1s" }} />
              <div className="absolute w-[320px] h-[320px] rounded-full bg-brand-400/8 blur-[90px] animate-blob" style={{ animationDelay: "3.5s" }} />

              <motion.div
                className="relative"
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              >
                <div className="relative w-[380px] h-[450px] rounded-[32px] overflow-hidden border border-white/[0.06] shadow-[0_30px_100px_rgba(0,0,0,0.6)] group">
                  <div className="absolute -inset-[2px] rounded-[34px] bg-gradient-to-b from-brand-400/20 via-brand-600/10 to-brand-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 blur-[3px]" />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#010214]/80 via-transparent to-transparent z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-500/5 to-transparent z-10" />

                  <img
                    src={profile?.profileImage || defaultImage}
                    alt={profile?.name || "Jonathan"}
                    className="object-cover w-full h-full scale-105 group-hover:scale-100 transition-transform duration-700"
                  />
                </div>

                {stats[0] && (
                  <motion.div
                    className="absolute -top-4 -right-4 px-4 py-3 rounded-2xl border border-white/[0.06] shadow-lg backdrop-blur-2xl bg-white/[0.04]"
                    animate={{ y: [0, -8, 0], rotate: [0, 3, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.5 }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="text-brand-400">{getIcon(stats[0].label)}</div>
                      <span className="font-display font-bold text-[20px] text-white">{stats[0].value}</span>
                    </div>
                  </motion.div>
                )}

                <motion.div
                  className="absolute -bottom-3 -left-5 px-5 py-3 rounded-2xl border border-white/[0.06] shadow-lg backdrop-blur-2xl bg-white/[0.04]"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="relative flex w-2.5 h-2.5">
                      <span className="absolute inline-flex w-full h-full rounded-full opacity-75 bg-green-400 animate-ping" />
                      <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-green-400" />
                    </span>
                    <span className="font-mono text-[11px] text-white/50 whitespace-nowrap">
                      {profile?.available !== false ? "Open to work" : tagline}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
      >
        <span className="font-mono text-[10px] tracking-[4px] uppercase text-white/15">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown size={16} className="text-white/15" />
        </motion.div>
      </motion.div>
    </section>
  );
}
