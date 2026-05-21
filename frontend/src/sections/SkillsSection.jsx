import { useState, useEffect, useMemo, useRef } from "react";
import { Cpu } from "lucide-react";
import { motion, useInView } from "framer-motion";
import TechIcon from "../components/TechIcon";
import api from "../api";

const COLOR_MAP = {
  primary: "#00b4d8",
  secondary: "#0096c7",
  accent: "#48cae4",
};

function MarqueeRow({ items, reverse = false, duration = 40 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="flex w-max"
      animate={inView ? { x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] } : { x: "0%" }}
      transition={inView ? { repeat: Infinity, ease: "linear", duration } : {}}
    >
      {[...items, ...items].map((tech, i) => (
        <div
          key={`${tech.name}-${i}`}
          className="flex items-center gap-4 px-6 py-4 mx-3 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-brand-500/30 hover:bg-white/5 transition-all group shrink-0"
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform shadow-inner">
            <TechIcon
              name={tech.name}
              size={24}
              accentColor={tech.color}
            />
          </div>
          <div>
            <div className="font-display font-bold text-[18px] text-white/90 group-hover:text-white transition-colors">{tech.name}</div>
            <div className="font-mono text-[10px] uppercase tracking-wider" style={{ color: tech.color }}>{tech.catName}</div>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export default function SkillsSection() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    api.get("/skills", { signal: controller.signal })
      .then((r) => setSkills(r.data.data))
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const allTechs = useMemo(() =>
    skills.flatMap((cat) =>
      (cat.items || []).map((item) => ({
        name: item,
        color: COLOR_MAP[cat.color] || "#00b4d8",
        catName: cat.cat
      }))
    ),
    [skills]
  );

  const isLoading = skills.length === 0;

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[20vw] bg-brand-600/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="container-md px-[6vw] relative z-10 mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="label-mono flex items-center gap-2 justify-center md:justify-start">
            <Cpu size={16} /> Compétences
          </span>
          <h2 className="section-title text-center md:text-left">
            <span className="gradient-text">Technologies</span> & Stack
          </h2>
        </motion.div>
      </div>

      <div className="relative z-10 w-full overflow-hidden flex" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
        
        {isLoading ? (
           <div className="flex gap-6 px-4 py-8 animate-pulse">
             {Array.from({ length: 10 }).map((_, i) => (
               <div key={i} className="w-[180px] h-[72px] rounded-2xl bg-white/5 border border-white/10 shrink-0" />
             ))}
           </div>
        ) : (
          <MarqueeRow items={allTechs} duration={40} />
        )}
      </div>

      {!isLoading && allTechs.length > 5 && (
        <div className="relative z-10 w-full overflow-hidden flex mt-6" style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)", WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}>
          <MarqueeRow items={[...allTechs].reverse()} reverse duration={50} />
        </div>
      )}
    </section>
  );
}
