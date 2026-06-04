import { useState } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Mail, Send, Sparkles } from "lucide-react";
import api from "../api";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error("Veuillez entrer votre email."); return; }
    setLoading(true);
    try {
      const res = await api.post("/newsletter", { email });
      toast.success(res.data.message);
      setEmail("");
    } catch {
      toast.error("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section-pad relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-brand-400/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container-md relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="max-w-2xl mx-auto text-center"
        >
          <span className="label-mono flex items-center justify-center gap-2 mb-4">
            <Sparkles size={16} /> Newsletter
          </span>
          <h2 className="font-display font-black text-[32px] md:text-[42px] text-white leading-tight tracking-tight mb-4">
            Restez <span className="gradient-text">connecté</span>
          </h2>
          <p className="font-sans text-[16px] text-white/50 leading-[1.8] mb-10 max-w-lg mx-auto">
            Recevez mes derniers projets, articles et réflexions tech directement dans votre boîte mail.
          </p>

          <form onSubmit={submit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                placeholder="votre@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white text-[14px] outline-none focus:border-brand-500/50 transition-colors"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-400 transition-colors disabled:opacity-50 shrink-0"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Send size={16} /> S'abonner</>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
