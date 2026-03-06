import { useState, useEffect } from "react";
import Reveal from "../components/Reveal";
import api from "../api";

const COLOR_MAP = { primary:"#e779c1", secondary:"#58c7f3", accent:"#f3cc30" };

export default function SkillsSection() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    api.get("/skills").then(r => setSkills(r.data.data)).catch(() => {});
  }, []);

  return (
    <section id="skills" className="section-pad" style={{ background:"rgba(231,121,193,0.02)" }}>
      <div className="container-md">
        <Reveal>
          <span className="label-mono">Technologies</span>
          <h2 className="section-title">Ma Stack</h2>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {skills.map((cat, i) => (
            <Reveal key={cat._id} delay={i * 80} dir="up">
              <div className="sw-card-s h-full p-6">
                <div className="flex items-center gap-2.5 mb-5">
                  <span className="text-xl">{cat.icon}</span>
                  <h3 className="font-ubuntu font-bold text-[15px]" style={{ color: COLOR_MAP[cat.color] || "#e779c1" }}>
                    {cat.cat}
                  </h3>
                </div>
                <ul className="flex flex-col gap-2.5">
                  {cat.items.map(item => (
                    <li key={item} className="flex items-center gap-2.5">
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: COLOR_MAP[cat.color], boxShadow: `0 0 5px ${COLOR_MAP[cat.color]}` }}
                      />
                      <span className="font-ubuntu text-[14px] text-base-content/70">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}

          {/* Skeleton loader */}
          {skills.length === 0 && Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="sw-card-s h-full p-6 animate-pulse">
              <div className="h-4 w-2/3 bg-white/10 rounded mb-5" />
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-3 w-1/2 bg-white/5 rounded mb-3" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
