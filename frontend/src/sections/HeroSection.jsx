import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Github } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TITLES = [
  "Fullstack Web Developer",
  "SaaS Builder",
  "API Architect",
  "African Tech Creator",
];

export default function HeroSection() {
  const [idx, setIdx]   = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setIdx(i => (i + 1) % TITLES.length);
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  return (
    <section
      id="hero"
      className="relative flex items-center min-h-screen pt-32 pb-20 overflow-hidden px-[6vw]"
    >
      {/* ── Background Aurora FX ── */}
      <div className="absolute inset-0 z-0 bg-deep-space">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand-800/20 blur-[120px] mix-blend-screen animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-brand-500/20 blur-[120px] mix-blend-screen animate-blob" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] rounded-full bg-brand-300/15 blur-[100px] mix-blend-screen animate-blob" style={{ animationDelay: "4s" }} />
        {/* Subtle grid layer */}
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "64px 64px", maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)", WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)" }} />
      </div>

      <motion.div 
        className="relative z-10 w-full max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        
        {/* Availability Badge */}
        <motion.div variants={itemVariants} className="flex items-center gap-2 mb-8 w-max px-4 py-2 rounded-full border border-brand-500/20 bg-brand-500/5 backdrop-blur-md">
          <span className="relative flex w-2.5 h-2.5">
            <span className="absolute inline-flex w-full h-full rounded-full opacity-75 bg-brand-400 animate-ping"></span>
            <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-brand-400"></span>
          </span>
          <span className="font-mono text-[12px] font-medium tracking-widest uppercase text-brand-400">
            Available for projects
          </span>
        </motion.div>

        {/* Dynamic Titles */}
        <motion.div variants={itemVariants} className="mb-6 min-h-[120px] md:min-h-[140px] flex flex-col justify-center">
          <h1 className="font-display font-black leading-[1.1] tracking-tight" style={{ fontSize: "clamp(32px, 8vw, 84px)" }}>
            <span className="text-white">I am a </span>
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
                  {TITLES[idx]}
                </motion.span>
              </AnimatePresence>
            </div>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p variants={itemVariants} className="max-w-2xl text-lg md:text-xl font-sans text-white/60 mb-12 leading-[1.7]">
          Développeur fullstack basé à Yaoundé. Je conçois et développe des 
          <span className="text-white"> applications web</span>, des 
          <span className="text-white"> API</span> performantes et des 
          <span className="text-white"> interfaces SAAS</span> de classe mondiale avec <span className="text-brand-300">React</span>, <span className="text-brand-500">Node.js</span> et <span className="text-brand-700">Laravel</span>.
        </motion.p>

        {/* Actions */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mb-16">
          <button 
            className="relative group px-8 py-4 rounded-xl font-sans font-semibold text-[15px] overflow-hidden bg-white/5 border border-white/10 hover:border-transparent transition-all"
            onClick={() => go("projects")}
          >
             <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-brand-600 to-brand-800" />
             <span className="relative flex items-center gap-2 text-white z-10 group-hover:text-white transition-colors duration-300">
               <Sparkles size={18} /> Voir mes projets
             </span>
          </button>

          <a 
            href="https://github.com/jonathan268" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-sans font-semibold text-[15px] bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-white/30 transition-all"
          >
            <Github size={18} /> GitHub
          </a>

          <button 
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-sans font-semibold text-[15px] text-white hover:text-brand-400 transition-colors"
            onClick={() => go("contact")}
          >
            Me Contacter <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Tech Stack Pills */}
        <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
          {["React", "Node.js", "Express", "Laravel", "MongoDB", "MySQL", "Docker"].map((tech, i) => (
            <motion.div 
              key={tech}
              whileHover={{ scale: 1.05, y: -2 }}
              className="px-4 py-2 font-mono text-[13px] text-white/50 bg-white/[0.02] border border-white/5 rounded-lg hover:border-brand-500/30 hover:text-brand-200 hover:bg-brand-500/10 transition-colors cursor-default"
            >
              {tech}
            </motion.div>
          ))}
        </motion.div>

      </motion.div>
    </section>
  );
}
