import { useState, useEffect } from "react";
import { Cpu } from "lucide-react";
import Reveal from "../components/Reveal";
import TechIcon from "../components/TechIcon";
import api from "../api";

const COLOR_MAP = {
  primary: "#ec4899",   // neon-pink
  secondary: "#00f2fe", // neon-cyan
  accent: "#4facfe",    // neon-violet
};

export default function SkillsSection() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    api
      .get("/skills")
      .then((r) => setSkills(r.data.data))
      .catch(() => {});
  }, []);

  return (
    <section id="skills" className="section-pad relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-0 w-[50vw] h-[50vw] bg-neon-violet/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2" />
      
      <div className="container-md relative z-10">
        <Reveal>
          <span className="label-mono flex items-center gap-2">
            <Cpu size={16} /> Compétences
          </span>
          <h2 className="section-title">
            <span className="gradient-text">Technologies</span> & Stack
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {skills.map((cat, i) => (
            <Reveal key={cat._id} delay={i * 80} dir="up">
              <div className="h-full p-8 glass-panel group transition-transform hover:-translate-y-2">
                <div className="flex items-center gap-4 mb-8">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] transition-colors"
                    style={{ color: COLOR_MAP[cat.color] || "#ec4899" }}
                  >
                     <span className="text-2xl drop-shadow-[0_0_8px_currentColor]">{cat.icon}</span>
                  </div>
                  <h3
                    className="font-display font-bold text-[18px] tracking-wide"
                    style={{ color: COLOR_MAP[cat.color] || "#ec4899" }}
                  >
                    {cat.cat}
                  </h3>
                </div>
                
                <ul className="flex flex-col gap-4">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-default">
                      <div className="p-1.5 rounded-md bg-white/5 border border-white/5 shadow-inner">
                        <TechIcon
                          name={item}
                          size={18}
                          accentColor={COLOR_MAP[cat.color]}
                        />
                      </div>
                      <span className="font-sans text-[15px] font-medium text-white/80 group-hover:text-white transition-colors">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}

          {/* Skeleton loader */}
          {skills.length === 0 &&
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-full p-8 glass-panel animate-pulse">
                <div className="flex gap-4 mb-8 items-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/10" />
                  <div className="w-1/2 h-6 rounded bg-white/10" />
                </div>
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="flex gap-3 mb-4 items-center">
                    <div className="w-8 h-8 rounded bg-white/5" />
                    <div className="w-3/4 h-4 rounded bg-white/5" />
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
