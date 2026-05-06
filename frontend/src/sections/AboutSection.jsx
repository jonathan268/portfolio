import { User, Target, Coffee } from "lucide-react";
import { motion } from "framer-motion";
import Image from "../assets/profil.jpeg";

export default function AboutSection() {
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
    <section id="about" className="section-pad relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[40vw] h-[40vw] bg-brand-500/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      
      <div className="container-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="label-mono flex items-center gap-2">
            <User size={16} /> Insight
          </span>
          <h2 className="section-title">
            À <span className="gradient-text">propos</span>
          </h2>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* ── Avatar Frame ── */}
          <motion.div variants={itemVariants} className="relative group mx-auto lg:mx-0 w-full max-w-[400px]">
            <div className="absolute -inset-4 bg-gradient-to-tr from-brand-400 to-brand-700 opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-700 rounded-full" />
            
            <div className="relative w-full aspect-square rounded-3xl overflow-hidden glass-panel p-2">
              <div className="w-full h-full rounded-2xl overflow-hidden relative">
                 <div className="absolute inset-0 bg-blend-overlay bg-deep-space/20 z-10 mix-blend-color" />
                 <img 
                   src={Image} 
                   alt="Jonathan Dev" 
                   className="object-cover w-full h-full scale-100 group-hover:scale-105 transition-transform duration-700"
                 />
              </div>
            </div>

            {/* Floating Element */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -right-4 -bottom-4 lg:-right-8 lg:-bottom-8 glass-panel px-6 py-4 rounded-2xl flex items-center gap-4 shadow-2xl"
            >
               <div className="w-12 h-12 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400">
                 <Coffee size={24} />
               </div>
               <div>
                 <div className="font-display font-bold text-2xl text-white">100+</div>
                 <div className="font-mono text-[10px] text-white/50 tracking-widest uppercase">Cafés bus</div>
               </div>
            </motion.div>
          </motion.div>

          {/* ── Bio Text ── */}
          <motion.div variants={itemVariants} className="flex flex-col gap-6">
            <p className="font-sans text-[18px] md:text-[20px] text-white/90 leading-[1.8] font-light">
              Je suis un développeur fullstack passionné par la création d'expériences numériques immersives et performantes.
            </p>
            <p className="font-sans text-[16px] text-white/60 leading-[1.8]">
              Mon expertise s'articule autour des écosystèmes <span className="text-brand-400 font-medium">React</span> et <span className="text-brand-600 font-medium">Node.js</span>. J'aime concevoir des architectures frontend élégantes couplées à des backends robustes capables de soutenir des applications SaaS ambitieuses.
            </p>
            
            <div className="glass-divider my-4" />

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Expérience", value: "2+ ans", icon: <Target size={16} />, color: "text-brand-400", bg: "bg-brand-400/10" },
                { label: "Projets livrés", value: "10+", icon: <Coffee size={16} />, color: "text-brand-500", bg: "bg-brand-500/10" },
                { label: "Localisation", value: "Yaoundé", icon: <User size={16} />, color: "text-brand-700", bg: "bg-brand-700/10" },
              ].map((s, i) => (
                <motion.div 
                  key={s.label} 
                  whileHover={{ y: -5 }}
                  className="glass-panel p-5 group cursor-default transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${s.bg} ${s.color}`}>
                      {s.icon}
                    </div>
                  </div>
                  <div className="font-display font-bold text-[28px] text-white leading-none mb-2">
                    {s.value}
                  </div>
                  <div className="font-mono text-[11px] text-white/40 tracking-wider uppercase">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
