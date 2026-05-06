import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import api from "../../api";

const EMPTY = { cat:"", icon:"🛠", color:"primary", items:"", order:0 };

function Modal({ skill, onClose, onSave }) {
  const [form, setForm]   = useState(skill ? { ...skill, items: skill.items?.join(", ") || "" } : { ...EMPTY });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.cat || !form.items) { toast.error("Catégorie et items requis."); return; }
    setLoading(true);
    try {
      const payload = { ...form, items: form.items.split(",").map(s => s.trim()).filter(Boolean) };
      if (skill?._id) {
        await api.put(`/skills/${skill._id}`, payload);
        toast.success("Catégorie mise à jour !");
      } else {
        await api.post("/skills", payload);
        toast.success("Catégorie créée !");
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur.");
    } finally {
      setLoading(false);
    }
  };

  const COLOR_OPTIONS = ["primary","secondary","accent"];
  const COLOR_PREVIEW = { primary:"#00b4d8", secondary:"#48cae4", accent:"#0096c7" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#010214]/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md bg-[#03045e]/20 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-display font-bold text-[24px] text-white">{skill ? "Modifier la catégorie" : "Nouvelle catégorie"}</h2>
          <button className="text-white/50 hover:text-white transition-colors" onClick={onClose}><X size={24} /></button>
        </div>

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="font-mono text-[11px] text-brand-400 tracking-[1px] uppercase block mb-2">Catégorie</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500/50 transition-colors" placeholder="Frontend" value={form.cat}
                onChange={e => set("cat", e.target.value)} />
            </div>
            <div>
              <label className="font-mono text-[11px] text-brand-400 tracking-[1px] uppercase block mb-2">Icône (emoji)</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500/50 transition-colors text-center text-xl" placeholder="🖥" value={form.icon}
                onChange={e => set("icon", e.target.value)} />
            </div>
          </div>

          <div>
            <label className="font-mono text-[11px] text-brand-400 tracking-[1px] uppercase block mb-2">Couleur</label>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map(c => (
                <button key={c} onClick={() => set("color", c)}
                  className={`flex-1 py-2.5 rounded-xl border font-sans text-[13px] font-medium transition-all`}
                  style={{
                    borderColor: form.color === c ? COLOR_PREVIEW[c] : "rgba(255,255,255,0.1)",
                    color: form.color === c ? COLOR_PREVIEW[c] : "rgba(255,255,255,0.4)",
                    background: form.color === c ? `${COLOR_PREVIEW[c]}15` : "transparent",
                  }}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-mono text-[11px] text-brand-400 tracking-[1px] uppercase block mb-2">
              Technologies (séparées par virgule)
            </label>
            <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500/50 transition-colors resize-none" rows={3} placeholder="React, Tailwind CSS, JavaScript"
              value={form.items} onChange={e => set("items", e.target.value)} />
          </div>

          <div>
            <label className="font-mono text-[11px] text-brand-400 tracking-[1px] uppercase block mb-2">Ordre</label>
            <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500/50 transition-colors" value={form.order}
              onChange={e => set("order", Number(e.target.value))} />
          </div>

          <div className="flex gap-3 justify-end mt-4 pt-6 border-t border-white/10">
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

const COLOR_MAP = { primary:"#00b4d8", secondary:"#48cae4", accent:"#0096c7" };

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [modal, setModal]   = useState(null);

  const load = () => api.get("/skills").then(r => setSkills(r.data.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!confirm("Supprimer cette catégorie ?")) return;
    try { await api.delete(`/skills/${id}`); toast.success("Supprimé."); load(); }
    catch { toast.error("Erreur."); }
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-end justify-between mb-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <p className="font-mono text-[12px] text-brand-400 tracking-[3px] uppercase mb-2">Admin</p>
          <h1 className="font-display font-bold text-[36px] text-white tracking-tight leading-none">Stack</h1>
        </motion.div>
        <motion.button 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-400 transition-colors shadow-[0_0_15px_rgba(0,180,216,0.2)]" 
          onClick={() => setModal("new")}
        >
          <Plus size={18} /> Nouvelle catégorie
        </motion.button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <AnimatePresence>
          {skills.map((s, i) => (
            <motion.div 
              key={s._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 border border-white/10 text-2xl" style={{ color: COLOR_MAP[s.color] }}>
                    {s.icon}
                  </div>
                  <h3 className="font-display font-bold text-[18px]" style={{ color: COLOR_MAP[s.color] }}>{s.cat}</h3>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors" onClick={() => setModal(s)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="p-2 rounded-lg text-red-500/50 hover:text-red-400 hover:bg-red-500/10 transition-colors" onClick={() => del(s._id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {s.items?.map(item => (
                  <span key={item} className="font-mono text-[11px] px-3 py-1.5 rounded-full"
                    style={{ background:`${COLOR_MAP[s.color]}15`, color:COLOR_MAP[s.color], border:`1px solid ${COLOR_MAP[s.color]}30` }}>
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {skills.length === 0 && (
        <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-2xl mt-4">
          <p className="font-mono text-[14px] text-white/30">Aucune catégorie. Ajoutez votre stack !</p>
        </div>
      )}

      <AnimatePresence>
        {modal && (
          <Modal
            skill={modal === "new" ? null : modal}
            onClose={() => setModal(null)}
            onSave={() => { setModal(null); load(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
