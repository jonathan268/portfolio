import { useState, useEffect } from "react";

const TITLES = [
  "Fullstack Web Developer",
  "SaaS Builder",
  "API Architect",
  "African Tech Creator ",
];

const IconGrid = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const IconGithub = () => (
  <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

export default function HeroSection() {
  const [idx, setIdx]   = useState(0);
  const [vis, setVis]   = useState(true);

  useEffect(() => {
    const iv = setInterval(() => {
      setVis(false);
      setTimeout(() => { setIdx(i => (i + 1) % TITLES.length); setVis(true); }, 350);
    }, 2700);
    return () => clearInterval(iv);
  }, []);

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="hero"
      className="sw-grid-bg min-h-screen flex items-center pt-[110px] pb-20 px-[6vw] relative overflow-hidden"
    >
      {/* Ambient blobs — subtils, pas de gros dégradés */}
      <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", background:"rgba(231,121,193,0.06)", filter:"blur(100px)", top:-250, left:-250, pointerEvents:"none" }} />
      <div style={{ position:"absolute", width:450, height:450, borderRadius:"50%", background:"rgba(88,199,243,0.05)", filter:"blur(90px)", bottom:-180, right:-180, pointerEvents:"none" }} />

      <div className="relative z-10 w-full max-w-5xl">

        {/* Available */}
        <div className="flex items-center gap-2 mb-6 hero-1">
          <span className="pulse-dot" />
          <span className="font-mono text-[12px] text-secondary tracking-[1.5px]">
            Disponible pour des projets
          </span>
        </div>

        {/* Rotating headline */}
        <div className="mb-2 overflow-hidden hero-2" style={{ height: 56 }}>
          <h1
            className="font-bold font-ubuntu text-primary"
            style={{
              fontSize: "clamp(28px,4.5vw,52px)",
              lineHeight: 1.15,
              opacity: vis ? 1 : 0,
              transform: vis ? "none" : "translateY(10px)",
              transition: "opacity .35s, transform .35s",
            }}
          >
            {TITLES[idx]}
          </h1>
        </div>

        <p className="hero-3 font-ubuntu text-base-content/70 mb-2 max-w-[560px]" style={{ fontSize:"clamp(14px,1.9vw,18px)", lineHeight:1.6 }}>
          I build modern web applications using{" "}
          <span className="font-medium text-secondary">React</span>,{" "}
          <span className="font-medium text-primary">Node.js</span> and{" "}
          <span className="font-medium text-accent">Laravel</span>.
        </p>
        <p className="hero-4 font-ubuntu font-light text-[15px] text-base-content/40 max-w-[500px] mb-11" style={{ lineHeight: 1.75 }}>
          Développeur fullstack basé à Yaoundé, spécialisé dans la création d'applications web, d'API et de dashboards modernes.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3 hero-5 mb-14">
          <button className="btn btn-primary rounded-[10px] gap-2" onClick={() => go("projects")}>
            <IconGrid /> Voir mes projets
          </button>
          <a href="https://github.com" target="_blank" rel="noreferrer"
            className="btn btn-outline btn-ghost rounded-[10px] gap-2"
            style={{ border:"1px solid rgba(231,121,193,0.3)", color:"#c0bbd8" }}>
            <IconGithub /> GitHub
          </a>
          <button className="btn btn-outline btn-secondary rounded-[10px]" onClick={() => go("contact")}>
            Contact
          </button>
        </div>

        {/* Stack pills */}
        <div className="flex flex-wrap gap-2 hero-6">
          {["React","Node.js","Laravel","MongoDB","MySQL","Docker"].map(t => (
            <span key={t} className="badge badge-outline badge-ghost font-mono text-[11px] text-white/30 border-white/10">{t}</span>
          ))}
        </div>
      </div>

      {/* Floating code — desktop only */}
      <div
        className="absolute right-[6vw] top-1/2 -translate-y-1/2 font-mono text-[12px] text-white/20 leading-[2.1] select-none hidden xl:block"
        style={{ opacity: 0.4 }}
      >
        {`const dev = {\n  name: "Jonathan",\n  location: "Yaoundé 🇨🇲",\n  stack: ["React","Node"],\n  available: true\n}`.split("\n").map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </section>
  );
}
