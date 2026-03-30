import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
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
      <label className="font-mono text-[11px] text-primary tracking-[1px] uppercase block mb-2">
        Image d'aperçu
      </label>

      <div
        onClick={() => !uploading && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className="relative w-full overflow-hidden transition-all border cursor-pointer rounded-xl"
        style={{
          height: value ? 180 : 120,
          borderColor: dragOver ? "#e779c1" : "rgba(255,255,255,0.1)",
          background: dragOver ? "rgba(231,121,193,0.07)" : "rgba(255,255,255,0.03)",
        }}
      >
        {value && !uploading && (
          <>
            <img src={value} alt="Aperçu" className="object-cover w-full h-full" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 transition-opacity opacity-0 hover:opacity-100"
              style={{ background:"rgba(12,6,30,0.75)" }}>
              <svg width="22" height="22" fill="none" stroke="#e779c1" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              <span className="font-mono text-[11px] text-white/70">Changer l'image</span>
            </div>
          </>
        )}

        {uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
            style={{ background:"rgba(12,6,30,0.85)" }}>
            <span className="loading loading-spinner loading-md text-primary" />
            <span className="font-mono text-[11px] text-white/50">Upload en cours…</span>
          </div>
        )}

        {!value && !uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <svg width="24" height="24" fill="none" stroke={dragOver ? "#e779c1" : "rgba(255,255,255,0.25)"} strokeWidth="1.5" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="3"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span className="font-mono text-[11px]" style={{ color: dragOver ? "#e779c1" : "rgba(255,255,255,0.3)" }}>
              {dragOver ? "Déposer l'image ici" : "Cliquer ou déposer une image"}
            </span>
            <span className="font-mono text-[10px] text-white/20">JPG, PNG, WebP — max 5 Mo</span>
          </div>
        )}
      </div>

      {value && !uploading && (
        <button type="button"
          onClick={() => onChange("")}
          className="mt-2 font-mono text-[11px] text-error/60 hover:text-error flex items-center gap-1 transition-colors">
          <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
          </svg>
          Supprimer l'image
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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background:"rgba(0,0,0,0.7)", backdropFilter:"blur(6px)" }}>
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto sw-card p-8" style={{ background:"#120a2e" }}>

        <div className="flex items-center justify-between mb-7">
          <h2 className="font-ubuntu font-bold text-[20px]">{project ? "Modifier le projet" : "Nouveau projet"}</h2>
          <button className="text-lg btn btn-sm btn-ghost btn-square" onClick={onClose}>✕</button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nom" value={form.name} onChange={v => set("name", v)} placeholder="StockWise" />
            <div>
              <label className="font-mono text-[11px] text-primary tracking-[1px] uppercase block mb-2">Type</label>
              <select className="select select-bordered select-primary w-full bg-white/5 text-[14px]"
                value={form.type} onChange={e => set("type", e.target.value)} style={{ fontFamily:"Ubuntu, sans-serif" }}>
                <option value="saas">SaaS</option>
                <option value="web">Web App</option>
                <option value="api">API</option>
              </select>
            </div>
          </div>

          <Field label="Tagline" value={form.tagline} onChange={v => set("tagline", v)} placeholder="AI Inventory SaaS" />
          <Textarea label="Description" value={form.description} onChange={v => set("description", v)} rows={3} placeholder="Description du projet..." />
          <Textarea label="Fonctionnalités (une par ligne)" value={form.features} onChange={v => set("features", v)} rows={4} placeholder={"Gestion produits\nSuivi des ventes\n..."} />
          <Field label="Stack (séparées par virgule)" value={form.stack} onChange={v => set("stack", v)} placeholder="React, Node.js, MongoDB" />

          <ImageUploader value={form.imageUrl} onChange={v => set("imageUrl", v)} />

          <div className="grid grid-cols-2 gap-4">
            <Field label="URL Live" value={form.live} onChange={v => set("live", v)} placeholder="https://..." />
            <Field label="URL GitHub" value={form.github} onChange={v => set("github", v)} placeholder="https://github.com/..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Ordre d'affichage" value={form.order} type="number" onChange={v => set("order", v)} placeholder="1" />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" className="checkbox checkbox-primary checkbox-sm"
                checked={form.featured} onChange={e => set("featured", e.target.checked)} />
              <span className="font-ubuntu text-[14px] text-base-content/70">Featured</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" className="checkbox checkbox-primary checkbox-sm"
                checked={form.published} onChange={e => set("published", e.target.checked)} />
              <span className="font-ubuntu text-[14px] text-base-content/70">Publié</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-2">
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

// ── Sub-components ────────────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder, type="text" }) {
  return (
    <div>
      {label && <label className="font-mono text-[11px] text-primary tracking-[1px] uppercase block mb-2">{label}</label>}
      <input type={type} className="sw-input" placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)} />
    </div>
  );
}
function Textarea({ label, value, onChange, rows=3, placeholder }) {
  return (
    <div>
      <label className="font-mono text-[11px] text-primary tracking-[1px] uppercase block mb-2">{label}</label>
      <textarea className="sw-textarea" rows={rows} placeholder={placeholder} value={value}
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

  const TYPE_COLOR = { saas:"#e779c1", web:"#58c7f3", api:"#f3cc30" };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-[11px] text-primary tracking-[3px] uppercase mb-1">Admin</p>
          <h1 className="font-ubuntu font-bold text-[26px]">Projets</h1>
        </div>
        <button className="btn btn-primary btn-sm rounded-[9px] gap-2" onClick={() => setModal("new")}>
          + Nouveau projet
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {projects.map(p => (
          <div key={p._id} className="flex items-center gap-5 p-5 sw-card">
            {p.imageUrl ? (
              <div className="h-10 overflow-hidden border rounded-lg w-14 shrink-0 border-white/10">
                <img src={p.imageUrl} alt={p.name} className="object-cover w-full h-full" />
              </div>
            ) : (
              <div className="w-1.5 h-12 rounded-full shrink-0" style={{ background: TYPE_COLOR[p.type] || "#e779c1" }} />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-ubuntu font-bold text-[16px] text-base-content/90">{p.name}</span>
                {p.featured && <span className="badge badge-primary text-[10px]">Featured</span>}
                {!p.published && <span className="badge badge-ghost text-[10px]">Brouillon</span>}
              </div>
              <span className="font-mono text-[12px] text-white/35">{p.tagline}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-mono text-[11px] text-white/30 border border-white/10 rounded-full px-2 py-0.5">{p.type}</span>
              <button className="btn btn-sm btn-ghost btn-square text-white/40 hover:text-white/80" onClick={() => setModal(p)}>
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button className="btn btn-sm btn-ghost btn-square text-error/50 hover:text-error" onClick={() => del(p._id)}>
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
              </button>
            </div>
          </div>
        ))}
        {projects.length === 0 && (
          <div className="py-16 text-center text-white/25">
            <p className="font-mono text-[13px]">Aucun projet. Créez-en un !</p>
          </div>
        )}
      </div>

      {modal && (
        <Modal project={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); load(); }} />
      )}
    </div>
  );
}