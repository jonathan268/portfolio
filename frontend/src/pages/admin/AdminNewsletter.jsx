import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Mail } from "lucide-react";
import api from "../../api";

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([]);

  const load = () => api.get("/newsletter").then(r => setSubscribers(r.data.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!confirm("Supprimer cet abonné ?")) return;
    try { await api.delete(`/newsletter/${id}`); toast.success("Abonné supprimé."); load(); }
    catch { toast.error("Erreur lors de la suppression."); }
  };

  return (
    <div className="max-w-3xl">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-10">
        <p className="font-mono text-[12px] text-brand-400 tracking-[3px] uppercase mb-2">Admin</p>
        <h1 className="font-display font-bold text-[36px] text-white tracking-tight leading-none">Newsletter</h1>
        <p className="font-sans text-[14px] text-white/50 mt-2">{subscribers.length} abonné{subscribers.length > 1 ? "s" : ""}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
        <AnimatePresence>
          {subscribers.map((s, i) => (
            <motion.div
              key={s._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-colors group"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center shrink-0">
                <Mail size={18} className="text-brand-400" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-sans text-[15px] text-white block truncate">{s.email}</span>
                <span className="font-mono text-[11px] text-white/40">
                  {new Date(s.createdAt).toLocaleDateString("fr-FR", { year:"numeric", month:"long", day:"numeric" })}
                </span>
              </div>
              <button
                className="p-2 rounded-lg text-red-500/50 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                onClick={() => del(s._id)}
              >
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
        {subscribers.length === 0 && (
          <div className="py-20 text-center text-white/30 bg-white/[0.02] border border-white/5 rounded-2xl">
            <p className="font-mono text-[14px]">Aucun abonné pour le moment.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
