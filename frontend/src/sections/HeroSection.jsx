import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Github } from "lucide-react";

const TITLES = [
  "Fullstack Web Developer",
  "SaaS Builder",
  "API Architect",
  "African Tech Creator",
];

export default function HeroSection() {
  const [idx, setIdx]   = useState(0);
  const [vis, setVis]   = useState(true);

  useEffect(() => {
    const iv = setInterval(() => {
      setVis(false);
      setTimeout(() => { setIdx(i => (i + 1) % TITLES.length); setVis(true); }, 400);
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="hero"
      className="relative flex items-center min-h-screen pt-32 pb-20 overflow-hidden px-[6vw]"
    >
      {/* ── Background Aurora FX ── */}
      <div className="absolute inset-0 z-0 bg-deep-space">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-neon-violet/20 blur-[120px] mix-blend-screen animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-neon-cyan/20 blur-[120px] mix-blend-screen animate-blob" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[40%] left-[60%] w-[30vw] h-[30vw] rounded-full bg-neon-pink/15 blur-[100px] mix-blend-screen animate-blob" style={{ animationDelay: "4s" }} />
        {/* Subtle grid layer */}
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize: "64px 64px", maskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)", WebkitMaskImage: "radial-gradient(ellipse at center, black 40%, transparent 80%)" }} />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        
        {/* Availability Badge */}
        <div className="flex items-center gap-2 mb-8 w-max px-4 py-2 rounded-full border border-neon-cyan/20 bg-neon-cyan/5 backdrop-blur-md anim-fade-up" style={{ animationDelay: "0.1s" }}>
          <span className="relative flex w-2.5 h-2.5">
            <span className="absolute inline-flex w-full h-full rounded-full opacity-75 bg-neon-cyan animate-ping"></span>
            <span className="relative inline-flex w-2.5 h-2.5 rounded-full bg-neon-cyan"></span>
          </span>
          <span className="font-mono text-[12px] font-medium tracking-widest uppercase text-neon-cyan">
            Available for projects
          </span>
        </div>

        {/* Dynamic Titles */}
        <div className="mb-6 h-[80px] md:h-[120px] anim-fade-up" style={{ animationDelay: "0.2s" }}>
          <h1
            className="font-display font-black leading-[1.1] tracking-tight"
            style={{
              fontSize: "clamp(48px, 8vw, 96px)",
              opacity: vis ? 1 : 0,
              transform: vis ? "translateY(0) scale(1)" : "translateY(20px) scale(0.98)",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <span className="text-white">I am a </span>
            <span className="gradient-text">{TITLES[idx]}</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p className="max-w-2xl text-lg md:text-xl font-sans text-white/60 mb-12 leading-[1.7] anim-fade-up" style={{ animationDelay: "0.3s" }}>
          Développeur fullstack basé à Yaoundé. Je conçois et développe des 
          <span className="text-white"> applications web</span>, des 
          <span className="text-white"> API</span> performantes et des 
          <span className="text-white"> interfaces SAAS</span> de classe mondiale avec <span className="text-neon-pink">React</span>, <span className="text-neon-cyan">Node.js</span> et <span className="text-neon-violet">Laravel</span>.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mb-16 anim-fade-up" style={{ animationDelay: "0.4s" }}>
          <button 
            className="relative group px-8 py-4 rounded-xl font-sans font-semibold text-[15px] overflow-hidden bg-white/5 border border-white/10 hover:border-transparent transition-all"
            onClick={() => go("projects")}
          >
             <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-neon-cyan to-neon-violet" />
             <span className="relative flex items-center gap-2 text-white z-10 group-hover:text-deep-space">
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
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-sans font-semibold text-[15px] text-white hover:text-neon-cyan transition-colors"
            onClick={() => go("contact")}
          >
            Me Contacter <ArrowRight size={18} />
          </button>
        </div>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-3 anim-fade-up" style={{ animationDelay: "0.5s" }}>
          {["React", "Node.js", "Express", "Laravel", "MongoDB", "MySQL", "Docker"].map((tech) => (
            <div key={tech} className="px-4 py-2 font-mono text-[13px] text-white/50 bg-white/[0.02] border border-white/5 rounded-lg hover:border-white/20 hover:text-white hover:bg-white/[0.05] transition-all cursor-default">
              {tech}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
