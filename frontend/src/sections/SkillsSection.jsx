import { useState, useEffect } from "react";
import { Cpu } from "lucide-react";
import { motion } from "framer-motion";
import TechIcon from "../components/TechIcon";
import api from "../api";

const COLOR_MAP = {
  primary: "#00b4d8",   // brand-500
  secondary: "#0096c7", // brand-600
  accent: "#48cae4",    // brand-400
};

export default function SkillsSection() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    api
      .get("/skills")
      .then((r) => setSkills(r.data.data))
      .catch(() => {});
  }, []);

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
    <section id="skills" className="section-pad relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-0 w-[50vw] h-[50vw] bg-brand-700/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2" />
      
      <div className="container-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="label-mono flex items-center gap-2">
            <Cpu size={16} /> Compétences
          </span>
          <h2 className="section-title">
            <span className="gradient-text">Technologies</span> & Stack
          </h2>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {skills.map((cat, i) => (
            <motion.div 
              key={cat._id} 
              variants={itemVariants}
              className="h-full p-8 glass-panel group transition-transform duration-300"
            >
              <div className="flex items-center gap-4 mb-8">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)] transition-colors"
                  style={{ color: COLOR_MAP[cat.color] || "#00b4d8" }}
                >
                   <span className="text-2xl drop-shadow-[0_0_8px_currentColor]">{cat.icon}</span>
                </div>
                <h3
                  className="font-display font-bold text-[18px] tracking-wide"
                  style={{ color: COLOR_MAP[cat.color] || "#00b4d8" }}
                >
                  {cat.cat}
                </h3>
              </div>
              
              <ul className="flex flex-col gap-4">
                {cat.items.map((item) => (
                  <motion.li 
                    key={item} 
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-default"
                  >
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
                  </motion.li>
                ))}
              </ul>
            </motion.div>
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
        </motion.div>
      </div>
    </section>
  );
}
