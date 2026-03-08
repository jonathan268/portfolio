import Reveal from "../components/Reveal";
import Image from "../assets/profil.jpeg";

export default function AboutSection() {
  return (
    <section id="about" className="section-pad">
      <div className="container-md">
        <Reveal>
          <span className="label-mono">About me</span>
          <h2 className="section-title">À propos</h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-14 items-start">
          {/* Avatar */}
          <Reveal dir="left">
            <div
              className="w-[200px] h-[200px] rounded-[20px] flex items-center justify-center relative overflow-hidden shrink-0 border border-primary/20"
              style={{ background: "rgba(231,121,193,0.05)" }}
            >
              <div style={{ position:"absolute", inset:0, background:"radial-gradient(circle at 30% 30%, rgba(231,121,193,0.1), transparent 65%)" }} />
              <span className="font-ubuntu font-bold text-[68px] text-primary/20 select-none relative z-10"> <img src={Image} alt="photo de profil jonathan" /></span>
              {/* Corner brackets */}
              <div style={{ position:"absolute", top:14, left:14, width:28, height:28, borderTop:"2px solid #e779c1", borderLeft:"2px solid #e779c1", borderRadius:"4px 0 0 0" }} />
              <div style={{ position:"absolute", bottom:14, right:14, width:28, height:28, borderBottom:"2px solid #58c7f3", borderRight:"2px solid #58c7f3", borderRadius:"0 0 4px 0" }} />
            </div>
          </Reveal>

          {/* Bio */}
          <Reveal delay={100}>
            <p className="font-ubuntu text-base text-base-content/70 leading-[1.85] mb-3.5">
              Je suis développeur web fullstack passionné par la création d'applications utiles.
            </p>
            <p className="font-ubuntu font-light text-[15px] text-base-content/50 leading-[1.85] mb-3.5">
              J'aime construire des <span className="font-medium text-secondary">API robustes</span> et des{" "}
              <span className="font-medium text-primary">interfaces modernes</span> qui résolvent de vrais problèmes.
            </p>
            <p className="font-ubuntu font-light text-[15px] text-base-content/50 leading-[1.85] mb-10">
              Mon objectif est de rejoindre une équipe où je peux contribuer à des produits réels et continuer à progresser techniquement.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4">
              {[
                { label:"Expérience",     value:"2+ ans",       color:"text-primary" },
                { label:"Projets livrés", value:"10+",          color:"text-secondary" },
                { label:"Localisation",   value:"Yaoundé 🇨🇲",  color:"text-accent" },
              ].map(s => (
                <div key={s.label} className="px-4 py-3 rounded-xl border border-white/7 bg-white/[0.025]">
                  <div className={`font-ubuntu font-bold text-[22px] leading-none ${s.color}`}>{s.value}</div>
                  <div className="font-mono text-[11px] text-white/30 mt-1.5 tracking-[0.8px]">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
