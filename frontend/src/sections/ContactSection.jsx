import { useState } from "react";
import { toast } from "react-hot-toast";
import Reveal from "../components/Reveal";
import api from "../api";

const LINKS = [
  { icon:"📧", label:"Email",    value:"jonathan@dev.cm",         href:"mailto:jonathan@dev.cm" },
  { icon:"🐙", label:"GitHub",   value:"github.com/jonathan-dev", href:"https://github.com" },
  { icon:"💼", label:"LinkedIn", value:"in/jonathan-dev",          href:"https://linkedin.com" },
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
    <section id="contact" className="section-pad">
      <div className="container-md">
        <Reveal>
          <span className="label-mono">Get in touch</span>
          <h2 className="section-title">Contact</h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-14 items-start">

          {/* Left */}
          <Reveal dir="left" delay={80}>
            <p className="font-ubuntu font-light text-[15px] text-base-content/50 leading-[1.8] mb-9">
              Un projet, une collaboration, ou juste envie d'échanger ? N'hésitez pas.
            </p>

            <div className="flex flex-col gap-3.5">
              {LINKS.map((item, i) => (
                <Reveal key={item.label} delay={160 + i * 70} dir="left">
                  <a
                    href={item.href}
                    target="_blank" rel="noreferrer"
                    className="flex gap-3 items-center no-underline p-3 rounded-xl border border-primary/12 bg-white/[0.02] transition-all duration-200"
                    onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(231,121,193,0.38)"; e.currentTarget.style.background="rgba(231,121,193,0.05)"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(231,121,193,0.12)"; e.currentTarget.style.background="rgba(255,255,255,0.02)"; }}
                  >
                    <div className="w-10 h-10 rounded-[10px] bg-primary/10 flex items-center justify-center text-lg shrink-0">{item.icon}</div>
                    <div>
                      <div className="font-mono text-[10px] text-primary tracking-[1px] mb-0.5">{item.label}</div>
                      <div className="font-ubuntu text-[14px] text-base-content/70">{item.value}</div>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>
          </Reveal>

          {/* Form */}
          <Reveal dir="right" delay={100}>
            <div className="sw-card p-8">
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-3.5">
                  {[{k:"name",l:"Nom",p:"Jonathan..."},{k:"email",l:"Email",p:"you@example.com"}].map(({k,l,p}) => (
                    <div key={k}>
                      <label className="font-mono text-[11px] text-primary tracking-[1px] uppercase block mb-2">{l}</label>
                      <input className="sw-input" placeholder={p} value={form[k]}
                        onChange={e => setForm(f => ({...f, [k]:e.target.value}))} />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="font-mono text-[11px] text-primary tracking-[1px] uppercase block mb-2">Message</label>
                  <textarea
                    className="sw-textarea"
                    rows={5}
                    placeholder="Décrivez votre projet ou votre demande..."
                    value={form.message}
                    onChange={e => setForm(f => ({...f, message:e.target.value}))}
                  />
                </div>

                <button
                  className="btn btn-primary self-start rounded-[10px] gap-2"
                  onClick={submit}
                  disabled={loading}
                >
                  {loading ? <span className="loading loading-spinner loading-sm" /> : "Envoyer le message →"}
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
