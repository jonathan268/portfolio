import Reveal from "../components/Reveal";
import Image from "../assets/profil.jpeg";
import { User, Target, Coffee } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="section-pad relative">
      <div className="absolute top-1/2 left-0 w-[40vw] h-[40vw] bg-neon-cyan/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      
      <div className="container-md relative z-10">
        <Reveal>
          <span className="label-mono flex items-center gap-2">
            <User size={16} /> Insight
          </span>
          <h2 className="section-title">
            À <span className="gradient-text">propos</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-16 items-center">
          {/* ── Avatar Frame ── */}
          <Reveal dir="left">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-neon-cyan to-neon-violet opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-700 rounded-full" />
              
              <div className="relative w-full aspect-square md:w-[350px] md:h-[350px] mx-auto rounded-3xl overflow-hidden glass-panel p-2">
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
              <div className="absolute -right-6 -bottom-6 glass-panel px-6 py-4 rounded-2xl flex items-center gap-4 animate-float shadow-2xl">
                 <div className="w-12 h-12 rounded-full bg-neon-cyan/20 flex items-center justify-center text-neon-cyan">
                   <Coffee size={24} />
                 </div>
                 <div>
                   <div className="font-display font-bold text-2xl text-white">100+</div>
                   <div className="font-mono text-[10px] text-white/50 tracking-widest uppercase">Cafés bus</div>
                 </div>
              </div>
            </div>
          </Reveal>

          {/* ── Bio Text ── */}
          <Reveal delay={100}>
            <div className="flex flex-col gap-6">
              <p className="font-sans text-[18px] md:text-[20px] text-white/90 leading-[1.8] font-light">
                Je suis un développeur fullstack passionné par la création d'expériences numériques immersives et performantes.
              </p>
              <p className="font-sans text-[16px] text-white/60 leading-[1.8]">
                Mon expertise s'articule autour des écosystèmes <span className="text-neon-cyan font-medium">React</span> et <span className="text-neon-pink font-medium">Node.js</span>. J'aime concevoir des architectures frontend élégantes couplées à des backends robustes capables de soutenir des applications SaaS ambitieuses.
              </p>
              
              <div className="glass-divider my-4" />

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: "Expérience", value: "2+ ans", icon: <Target size={16} />, color: "text-neon-cyan" },
                  { label: "Projets livrés", value: "10+", icon: <Coffee size={16} />, color: "text-neon-violet" },
                  { label: "Localisation", value: "Yaoundé", icon: <User size={16} />, color: "text-neon-pink" },
                ].map((s) => (
                  <div key={s.label} className="glass-panel p-5 group cursor-default">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg bg-white/5 ${s.color}`}>
                        {s.icon}
                      </div>
                    </div>
                    <div className="font-display font-bold text-[28px] text-white leading-none mb-1 group-hover:scale-105 transition-transform origin-left">
                      {s.value}
                    </div>
                    <div className="font-mono text-[11px] text-white/40 tracking-wider uppercase">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
