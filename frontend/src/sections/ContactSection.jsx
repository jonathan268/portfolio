import { useState } from "react";
import { toast } from "react-hot-toast";
import Reveal from "../components/Reveal";
import api from "../api";
import { Mail, Github, Linkedin, Send, MessageSquare } from "lucide-react";

const LINKS = [
  { icon: <Mail size={18} />, label: "Email", value: "darrenjonathan97@gmail", href: "mailto:darrenjonathan97@gmail" },
  { icon: <Github size={18} />, label: "GitHub", value: "github.com/jonathan268", href: "https://github.com/jonathan268" },
  { icon: <Linkedin size={18} />, label: "LinkedIn", value: "in/jonathan-dev", href: "https://linkedin.com" },
];

export default function ContactSection() {
  const [form, setForm]   = useState({ name:"", email:"", message:"" });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.name || !form.email || !form.message) {
      toast.error("Tous les champs sont requis.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/messages", form);
      toast.success("Message envoyé ! Je reviens vers vous sous 24h.");
      setForm({ name:"", email:"", message:"" });
    } catch {
      toast.error("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-pad relative">
      {/* Background Glow */}
      <div className="absolute top-[20%] left-0 w-[40vw] h-[40vw] bg-neon-pink/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container-md relative z-10">
        <Reveal>
          <span className="label-mono flex items-center gap-2">
            <MessageSquare size={16} /> Get in touch
          </span>
          <h2 className="section-title">
            Let's <span className="gradient-text">Talk</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 items-start">

          {/* ── Left Links ── */}
          <Reveal dir="left" delay={80}>
            <p className="font-sans text-[16px] text-white/50 leading-[1.8] mb-10">
              Un projet SaaS ambitieux ? Une API à concevoir ou juste envie d'échanger ? Laissez-moi un message ou contactez-moi directement via mes réseaux.
            </p>

            <div className="flex flex-col gap-4">
              {LINKS.map((item, i) => (
                <Reveal key={item.label} delay={160 + i * 70} dir="left">
                  <a
                    href={item.href}
                    target="_blank" rel="noreferrer"
                    className="flex gap-4 items-center p-4 rounded-2xl glass-panel group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/80 group-hover:text-neon-cyan group-hover:bg-neon-cyan/10 transition-colors border border-white/5 group-hover:border-neon-cyan/30">
                       {item.icon}
                    </div>
                    <div>
                      <div className="font-mono text-[11px] text-white/40 tracking-wider uppercase mb-1">{item.label}</div>
                      <div className="font-sans font-medium text-[15px] text-white/80 group-hover:text-white transition-colors">{item.value}</div>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </Reveal>

          {/* ── Form ── */}
          <Reveal dir="right" delay={100}>
            <div className="p-8 md:p-10 glass-panel">
              <div className="flex flex-col gap-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[{k:"name",l:"Nom",p:"Jonathan"},{k:"email",l:"Email",p:"hello@example.com"}].map(({k,l,p}) => (
                    <div key={k}>
                      <label className="font-mono text-[11px] text-white/60 tracking-wider uppercase block mb-3">{l}</label>
                      <input 
                        className="glass-input" 
                        placeholder={p} 
                        value={form[k]}
                        onChange={e => setForm(f => ({...f, [k]:e.target.value}))} 
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="font-mono text-[11px] text-white/60 tracking-wider uppercase block mb-3">Message</label>
                  <textarea
                    className="glass-textarea"
                    placeholder="Parlez-moi de votre projet..."
                    value={form.message}
                    onChange={e => setForm(f => ({...f, message:e.target.value}))}
                  />
                </div>

                <div className="mt-2">
                  <button
                    className="relative group px-8 py-4 rounded-xl font-sans font-semibold text-[15px] overflow-hidden bg-white/10 hover:bg-transparent border border-white/10 hover:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={submit}
                    disabled={loading}
                  >
                     {!loading && <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-neon-pink to-neon-violet" />}
                     <span className="relative flex items-center gap-2 text-white z-10">
                       {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={18} /> Envoyer</>}
                     </span>
                  </button>
                </div>
                
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
