import { useState } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  };

  const formVariants = {
    hidden: { opacity: 0, x: 30 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 20, delay: 0.4 } },
  };

  return (
    <section id="contact" className="section-pad relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-[20%] left-0 w-[40vw] h-[40vw] bg-brand-300/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <span className="label-mono flex items-center gap-2">
            <MessageSquare size={16} /> Get in touch
          </span>
          <h2 className="section-title">
            Let's <span className="gradient-text">Talk</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 items-start">

          {/* ── Left Links ── */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.p variants={itemVariants} className="font-sans text-[16px] text-white/50 leading-[1.8] mb-10">
              Un projet SaaS ambitieux ? Une API à concevoir ou juste envie d'échanger ? Laissez-moi un message ou contactez-moi directement via mes réseaux.
            </motion.p>

            <div className="flex flex-col gap-4">
              {LINKS.map((item, i) => (
                <motion.a
                  variants={itemVariants}
                  key={item.label}
                  href={item.href}
                  target="_blank" rel="noreferrer"
                  whileHover={{ scale: 1.02 }}
                  className="flex gap-4 items-center p-4 rounded-2xl glass-panel group"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/80 group-hover:text-brand-400 group-hover:bg-brand-400/10 transition-colors border border-white/5 group-hover:border-brand-400/30">
                     {item.icon}
                  </div>
                  <div>
                    <div className="font-mono text-[11px] text-white/40 tracking-wider uppercase mb-1">{item.label}</div>
                    <div className="font-sans font-medium text-[15px] text-white/80 group-hover:text-white transition-colors">{item.value}</div>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* ── Form ── */}
          <motion.div 
            variants={formVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="p-8 md:p-10 glass-panel"
          >
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
                  className="relative group px-8 py-4 rounded-xl font-sans font-semibold text-[15px] overflow-hidden bg-white/10 hover:bg-transparent border border-white/10 hover:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                  onClick={submit}
                  disabled={loading}
                >
                   {!loading && <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-brand-500 to-brand-700" />}
                   <span className="relative flex items-center justify-center gap-2 text-white z-10">
                     {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> Envoyer</>}
                   </span>
                </button>
              </div>
              
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
