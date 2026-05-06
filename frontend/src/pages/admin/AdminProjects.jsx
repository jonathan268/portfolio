import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, Image as ImageIcon, CheckCircle, Circle, X } from "lucide-react";
import api from "../../api";

const EMPTY = {
  name:"", tagline:"", description:"", features:"", stack:"",
  type:"saas", live:"", github:"", imageUrl:"", featured:false, published:true, order:0,
};

// ── Image Uploader ────────────────────────────────────────────────────────────
function ImageUploader({ value, onChange }) {
  const inputRef                  = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver]   = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Seules les images sont acceptées."); return; }
    if (file.size > 5 * 1024 * 1024)    { toast.error("Image trop lourde (max 5 Mo)."); return; }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await api.post("/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
      onChange(res.data.url);
      toast.success("Image uploadée !");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'upload.");
    } finally {
      setUploading(false);
    }
  };

  const onInputChange = (e) => handleFile(e.target.files?.[0]);
  const onDrop = (e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]); };

  return (
    <div>
      <label className="font-mono text-[11px] text-brand-400 tracking-[1px] uppercase block mb-2">
        Image d'aperçu
      </label>

      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className="relative w-full overflow-hidden transition-all border cursor-pointer rounded-xl bg-white/5 hover:bg-white/10"
        style={{
          height: value ? 180 : 120,
          borderColor: dragOver ? "#00b4d8" : "rgba(255,255,255,0.1)",
        }}
      >
        {value && !uploading && (
          <>
            <img src={value} alt="Aperçu" className="object-cover w-full h-full" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 transition-opacity opacity-0 hover:opacity-100 bg-[#010214]/80">
              <ImageIcon size={24} className="text-brand-400" />
              <span className="font-mono text-[11px] text-white/70">Changer l'image</span>
            </div>
          </>
        )}

        {uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#010214]/80">
            <span className="w-6 h-6 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
            <span className="font-mono text-[11px] text-white/50">Upload en cours…</span>
          </div>
        )}

        {!value && !uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <ImageIcon size={24} className={dragOver ? "text-brand-400" : "text-white/20"} />
            <span className="font-mono text-[11px]" style={{ color: dragOver ? "#00b4d8" : "rgba(255,255,255,0.3)" }}>
              {dragOver ? "Déposer l'image ici" : "Cliquer ou déposer une image"}
            </span>
            <span className="font-mono text-[10px] text-white/20">JPG, PNG, WebP — max 5 Mo</span>
          </div>
        )}
      </div>

      {value && !uploading && (
        <button type="button"
          onClick={(e) => { e.stopPropagation(); onChange(""); }}
          className="mt-2 font-mono text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors">
          <Trash2 size={12} /> Supprimer l'image
        </button>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onInputChange} />
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function Modal({ project, onClose, onSave }) {
  const [form, setForm] = useState(
    project
      ? { ...project, features: project.features?.join("\n") || "", stack: project.stack?.join(", ") || "", imageUrl: project.imageUrl || "" }
      : { ...EMPTY }
  );
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name || !form.tagline || !form.description) {
      toast.error("Nom, tagline et description sont requis."); return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        features: form.features.split("\n").map(s => s.trim()).filter(Boolean),
        stack:    form.stack.split(",").map(s => s.trim()).filter(Boolean),
        imageUrl: form.imageUrl || null,
      };
      if (project?._id) {
        await api.put(`/projects/${project._id}`, payload);
        toast.success("Projet mis à jour !");
      } else {
        await api.post("/projects", payload);
        toast.success("Projet créé !");
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
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#03045e]/20 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl"
      >

        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display font-bold text-[24px] text-white">{project ? "Modifier le projet" : "Nouveau projet"}</h2>
          <button className="text-white/50 hover:text-white transition-colors" onClick={onClose}><X size={24} /></button>
        </div>

        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-5">
            <Field label="Nom" value={form.name} onChange={v => set("name", v)} placeholder="StockWise" />
            <div>
              <label className="font-mono text-[11px] text-brand-400 tracking-[1px] uppercase block mb-2">Type</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500/50 transition-colors"
                value={form.type} onChange={e => set("type", e.target.value)}>
                <option value="saas" className="bg-[#010214]">SaaS</option>
                <option value="web" className="bg-[#010214]">Web App</option>
                <option value="api" className="bg-[#010214]">API</option>
              </select>
            </div>
          </div>

          <Field label="Tagline" value={form.tagline} onChange={v => set("tagline", v)} placeholder="AI Inventory SaaS" />
          <Textarea label="Description" value={form.description} onChange={v => set("description", v)} rows={3} placeholder="Description du projet..." />
          <Textarea label="Fonctionnalités (une par ligne)" value={form.features} onChange={v => set("features", v)} rows={4} placeholder={"Gestion produits\nSuivi des ventes\n..."} />
          <Field label="Stack (séparées par virgule)" value={form.stack} onChange={v => set("stack", v)} placeholder="React, Node.js, MongoDB" />

          <ImageUploader value={form.imageUrl} onChange={v => set("imageUrl", v)} />

          <div className="grid grid-cols-2 gap-5">
            <Field label="URL Live" value={form.live} onChange={v => set("live", v)} placeholder="https://..." />
            <Field label="URL GitHub" value={form.github} onChange={v => set("github", v)} placeholder="https://github.com/..." />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <Field label="Ordre d'affichage" value={form.order} type="number" onChange={v => set("order", v)} placeholder="1" />
          </div>

          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`flex items-center justify-center w-5 h-5 rounded border ${form.featured ? 'bg-brand-500 border-brand-500' : 'border-white/20 group-hover:border-white/50'}`}>
                {form.featured && <CheckCircle size={14} className="text-white" />}
              </div>
              <input type="checkbox" className="hidden" checked={form.featured} onChange={e => set("featured", e.target.checked)} />
              <span className="font-sans font-medium text-[14px] text-white/80 group-hover:text-white">Featured</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`flex items-center justify-center w-5 h-5 rounded border ${form.published ? 'bg-brand-500 border-brand-500' : 'border-white/20 group-hover:border-white/50'}`}>
                {form.published && <CheckCircle size={14} className="text-white" />}
              </div>
              <input type="checkbox" className="hidden" checked={form.published} onChange={e => set("published", e.target.checked)} />
              <span className="font-sans font-medium text-[14px] text-white/80 group-hover:text-white">Publié</span>
            </label>
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

// ── Sub-components ────────────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder, type="text" }) {
  return (
    <div>
      {label && <label className="font-mono text-[11px] text-brand-400 tracking-[1px] uppercase block mb-2">{label}</label>}
      <input type={type} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500/50 transition-colors" placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)} />
    </div>
  );
}
function Textarea({ label, value, onChange, rows=3, placeholder }) {
  return (
    <div>
      <label className="font-mono text-[11px] text-brand-400 tracking-[1px] uppercase block mb-2">{label}</label>
      <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500/50 transition-colors resize-none" rows={rows} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)} />
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [modal, setModal]       = useState(null);

  const load = () => api.get("/projects/admin/all").then(r => setProjects(r.data.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!confirm("Supprimer ce projet ?")) return;
    try { await api.delete(`/projects/${id}`); toast.success("Projet supprimé."); load(); }
    catch { toast.error("Erreur lors de la suppression."); }
  };

  const TYPE_COLOR = { saas:"#00b4d8", web:"#48cae4", api:"#0096c7" };

  return (
    <div className="max-w-5xl">
      <div className="flex items-end justify-between mb-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <p className="font-mono text-[12px] text-brand-400 tracking-[3px] uppercase mb-2">Admin</p>
          <h1 className="font-display font-bold text-[36px] text-white tracking-tight leading-none">Projets</h1>
        </motion.div>
        <motion.button 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-400 transition-colors shadow-[0_0_15px_rgba(0,180,216,0.2)]" 
          onClick={() => setModal("new")}
        >
          <Plus size={18} /> Nouveau
        </motion.button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <AnimatePresence>
          {projects.map((p, i) => (
            <motion.div 
              key={p._id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-5 p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-colors group"
            >
              {p.imageUrl ? (
                <div className="h-12 w-16 overflow-hidden rounded-lg shrink-0 border border-white/10">
                  <img src={p.imageUrl} alt={p.name} className="object-cover w-full h-full" />
                </div>
              ) : (
                <div className="w-1.5 h-12 rounded-full shrink-0" style={{ background: TYPE_COLOR[p.type] || "#00b4d8" }} />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-display font-bold text-[18px] text-white">{p.name}</span>
                  {p.featured && <span className="px-2 py-0.5 rounded-md bg-brand-500/20 text-brand-400 text-[10px] font-mono tracking-wider border border-brand-500/30">FEATURED</span>}
                  {!p.published && <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/50 text-[10px] font-mono tracking-wider border border-white/10">BROUILLON</span>}
                </div>
                <span className="font-sans text-[14px] text-white/50 truncate block">{p.tagline}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="font-mono text-[11px] text-white/40 border border-white/10 rounded-full px-3 py-1 bg-white/5">{p.type}</span>
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
                  <button className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors" onClick={() => setModal(p)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="p-2 rounded-lg text-red-500/50 hover:text-red-400 hover:bg-red-500/10 transition-colors" onClick={() => del(p._id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {projects.length === 0 && (
          <div className="py-20 text-center text-white/30 bg-white/[0.02] border border-white/5 rounded-2xl">
            <p className="font-mono text-[14px]">Aucun projet. Créez-en un !</p>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {modal && (
          <Modal project={modal === "new" ? null : modal}
            onClose={() => setModal(null)}
            onSave={() => { setModal(null); load(); }} />
        )}
      </AnimatePresence>
    </div>
  );
}