import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
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
  const COLOR_PREVIEW = { primary:"#e779c1", secondary:"#58c7f3", accent:"#f3cc30" };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background:"rgba(0,0,0,0.75)", backdropFilter:"blur(6px)" }}>
      <div className="w-full max-w-md sw-card p-8" style={{ background:"#120a2e" }}>
        <div className="flex justify-between items-center mb-7">
          <h2 className="font-ubuntu font-bold text-[20px]">{skill ? "Modifier la catégorie" : "Nouvelle catégorie"}</h2>
          <button className="btn btn-sm btn-ghost btn-square text-lg" onClick={onClose}>✕</button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-[11px] text-primary tracking-[1px] uppercase block mb-2">Catégorie</label>
              <input className="sw-input" placeholder="Frontend" value={form.cat}
                onChange={e => set("cat", e.target.value)} />
            </div>
            <div>
              <label className="font-mono text-[11px] text-primary tracking-[1px] uppercase block mb-2">Icône (emoji)</label>
              <input className="sw-input text-center text-xl" placeholder="🖥" value={form.icon}
                onChange={e => set("icon", e.target.value)} />
            </div>
          </div>

          <div>
            <label className="font-mono text-[11px] text-primary tracking-[1px] uppercase block mb-2">Couleur</label>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map(c => (
                <button key={c} onClick={() => set("color", c)}
                  className={`flex-1 py-2 rounded-lg border font-ubuntu text-[13px] font-medium transition-all`}
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
            <label className="font-mono text-[11px] text-primary tracking-[1px] uppercase block mb-2">
              Technologies (séparées par virgule)
            </label>
            <textarea className="sw-textarea" rows={3} placeholder="React, Tailwind CSS, JavaScript"
              value={form.items} onChange={e => set("items", e.target.value)} />
          </div>

          <div>
            <label className="font-mono text-[11px] text-primary tracking-[1px] uppercase block mb-2">Ordre</label>
            <input type="number" className="sw-input" value={form.order}
              onChange={e => set("order", Number(e.target.value))} />
          </div>

          <div className="flex gap-3 justify-end mt-2">
            <button className="btn btn-ghost btn-sm rounded-[9px]" onClick={onClose}>Annuler</button>
            <button className="btn btn-primary btn-sm rounded-[9px]" onClick={save} disabled={loading}>
              {loading ? <span className="loading loading-spinner loading-sm" /> : "Sauvegarder"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const COLOR_MAP = { primary:"#e779c1", secondary:"#58c7f3", accent:"#f3cc30" };

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
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="font-mono text-[11px] text-primary tracking-[3px] uppercase mb-1">Admin</p>
          <h1 className="font-ubuntu font-bold text-[26px]">Stack</h1>
        </div>
        <button className="btn btn-primary btn-sm rounded-[9px] gap-2" onClick={() => setModal("new")}>
          + Nouvelle catégorie
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map(s => (
          <div key={s._id} className="sw-card p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{s.icon}</span>
                <h3 className="font-ubuntu font-bold text-[16px]" style={{ color: COLOR_MAP[s.color] }}>{s.cat}</h3>
              </div>
              <div className="flex gap-1">
                <button className="btn btn-sm btn-ghost btn-square text-white/40 hover:text-white/80" onClick={() => setModal(s)}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button className="btn btn-sm btn-ghost btn-square text-error/50 hover:text-error" onClick={() => del(s._id)}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {s.items?.map(item => (
                <span key={item} className="font-mono text-[11px] px-2 py-0.5 rounded-full"
                  style={{ background:`${COLOR_MAP[s.color]}18`, color:COLOR_MAP[s.color], border:`1px solid ${COLOR_MAP[s.color]}30` }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-16 text-white/25">
          <p className="font-mono text-[13px]">Aucune catégorie. Ajoutez votre stack !</p>
        </div>
      )}

      {modal && (
        <Modal
          skill={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); load(); }}
        />
      )}
    </div>
  );
}
