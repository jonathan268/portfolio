import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import api from "../../api";

const EMPTY = { name: "", key: "", order: 0, color: "#00b4d8" };

function Modal({ category, onClose, onSave }) {
  const [form, setForm] = useState(category ? { ...category } : { ...EMPTY });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name || !form.key) {
      toast.error("Nom et identifiant sont requis."); return;
    }
    setLoading(true);
    try {
      if (category?._id) {
        await api.put(`/categories/${category._id}`, form);
        toast.success("Catégorie mise à jour !");
      } else {
        await api.post("/categories", form);
        toast.success("Catégorie créée !");
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#010214]/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-[#03045e]/20 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display font-bold text-[24px] text-white">
            {category ? "Modifier la catégorie" : "Nouvelle catégorie"}
          </h2>
          <button className="text-white/50 hover:text-white transition-colors" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <label className="font-mono text-[11px] text-brand-400 tracking-[1px] uppercase block mb-2">Nom</label>
            <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500/50 transition-colors"
              placeholder="SaaS" value={form.name} onChange={e => set("name", e.target.value)} />
          </div>
          <div>
            <label className="font-mono text-[11px] text-brand-400 tracking-[1px] uppercase block mb-2">Identifiant (slug)</label>
            <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500/50 transition-colors"
              placeholder="saas" value={form.key} onChange={e => set("key", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-[11px] text-brand-400 tracking-[1px] uppercase block mb-2">Ordre</label>
              <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500/50 transition-colors"
                value={form.order} onChange={e => set("order", Number(e.target.value))} />
            </div>
            <div>
              <label className="font-mono text-[11px] text-brand-400 tracking-[1px] uppercase block mb-2">Couleur</label>
              <div className="flex gap-3 items-center">
                <input type="color" className="w-12 h-12 rounded-xl border border-white/10 bg-transparent cursor-pointer"
                  value={form.color} onChange={e => set("color", e.target.value)} />
                <span className="font-mono text-[12px] text-white/50">{form.color}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-white/10">
            <button className="px-6 py-2.5 rounded-xl font-medium text-white/70 hover:bg-white/5 transition-colors" onClick={onClose}>Annuler</button>
            <button className="px-6 py-2.5 rounded-xl font-medium bg-brand-500 text-white hover:bg-brand-400 transition-colors flex items-center justify-center min-w-[120px]" onClick={save} disabled={loading}>
              {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Sauvegarder"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [modal, setModal] = useState(null);

  const load = () => api.get("/categories").then(r => setCategories(r.data.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!confirm("Supprimer cette catégorie ? Les projets utilisant cette catégorie ne seront pas affectés.")) return;
    try { await api.delete(`/categories/${id}`); toast.success("Catégorie supprimée."); load(); }
    catch { toast.error("Erreur lors de la suppression."); }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-end justify-between mb-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <p className="font-mono text-[12px] text-brand-400 tracking-[3px] uppercase mb-2">Admin</p>
          <h1 className="font-display font-bold text-[36px] text-white tracking-tight leading-none">Catégories</h1>
        </motion.div>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-400 transition-colors shadow-[0_0_15px_rgba(0,180,216,0.2)]"
          onClick={() => setModal("new")}
        >
          <Plus size={18} /> Nouvelle
        </motion.button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
        <AnimatePresence>
          {categories.map((c, i) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-5 p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-colors group"
            >
              <div className="w-5 h-5 rounded-full shrink-0" style={{ background: c.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <span className="font-display font-bold text-[18px] text-white">{c.name}</span>
                  <span className="font-mono text-[11px] text-white/40 bg-white/5 border border-white/10 rounded-full px-3 py-1">{c.key}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors" onClick={() => setModal(c)}>
                  <Edit2 size={16} />
                </button>
                <button className="p-2 rounded-lg text-red-500/50 hover:text-red-400 hover:bg-red-500/10 transition-colors" onClick={() => del(c._id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {categories.length === 0 && (
          <div className="py-20 text-center text-white/30 bg-white/[0.02] border border-white/5 rounded-2xl">
            <p className="font-mono text-[14px]">Aucune catégorie. Créez-en une !</p>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {modal && (
          <Modal
            category={modal === "new" ? null : modal}
            onClose={() => setModal(null)}
            onSave={() => { setModal(null); load(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
