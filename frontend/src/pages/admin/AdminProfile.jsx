import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, Camera } from "lucide-react";
import api from "../../api";

export default function AdminProfile() {
  const [form, setForm] = useState({
    name: "", tagline: "", bio: "", titles: [], techStack: [],
    stats: [], socialLinks: { github: "", linkedin: "", email: "" },
    available: true, profileImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    api.get("/auth/me").then(r => {
      const d = r.data.data;
      setForm({
        name: d.name || "",
        tagline: d.tagline || "",
        bio: d.bio || "",
        titles: d.titles?.length ? d.titles : [""],
        techStack: d.techStack?.length ? d.techStack : [""],
        stats: d.stats?.length ? d.stats : [{ label: "", value: "" }],
        socialLinks: d.socialLinks || { github: "", linkedin: "", email: "" },
        available: d.available ?? true,
        profileImage: d.profileImage || null,
      });
    }).catch(() => {});
  }, []);

  const handleImageUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Seules les images sont acceptées."); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image trop lourde (max 5 Mo)."); return; }
    setUploading(true);
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      set("profileImage", res.data.url);
      toast.success("Image uploadée !");
    } catch { toast.error("Erreur upload."); } finally { setUploading(false); }
  };

  const save = async () => {
    setLoading(true);
    try {
      await api.put("/auth/profile", {
        ...form,
        titles: form.titles.filter(Boolean),
        techStack: form.techStack.filter(Boolean),
        stats: form.stats.filter(s => s.label || s.value),
      });
      toast.success("Profil mis à jour !");
    } catch { toast.error("Erreur."); } finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-10">
        <p className="font-mono text-[12px] text-brand-400 tracking-[3px] uppercase mb-2">Admin</p>
        <h1 className="font-display font-bold text-[36px] text-white tracking-tight">Profil</h1>
      </motion.div>

      <div className="flex flex-col gap-8">
        {/* Image */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl"
        >
          <h3 className="font-mono text-[11px] text-brand-400 tracking-[2px] uppercase mb-4">Photo de profil</h3>
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-white/10 bg-white/5 group shrink-0">
              {form.profileImage ? (
                <img src={form.profileImage} alt="" className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20"><Camera size={24} /></div>
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-[#010214]/80 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                {uploading
                  ? <span className="w-5 h-5 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
                  : <Camera size={18} className="text-white" />
                }
                <input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e.target.files?.[0])} />
              </label>
            </div>
            <p className="font-mono text-[11px] text-white/40">Cliquez sur l'image pour la modifier</p>
          </div>
        </motion.div>

        {/* Infos de base */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl"
        >
          <h3 className="font-mono text-[11px] text-brand-400 tracking-[2px] uppercase mb-6">Informations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="font-mono text-[11px] text-white/50 tracking-wider uppercase block mb-2">Nom</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500/50 transition-colors"
                value={form.name} onChange={e => set("name", e.target.value)} />
            </div>
            <div>
              <label className="font-mono text-[11px] text-white/50 tracking-wider uppercase block mb-2">Disponible</label>
              <label className="flex items-center gap-3 h-full cursor-pointer">
                <div className={`w-5 h-5 rounded border ${form.available ? 'bg-brand-500 border-brand-500' : 'border-white/20'}`}>
                  {form.available && <span className="flex items-center justify-center w-full h-full text-white text-[12px]">✓</span>}
                </div>
                <input type="checkbox" className="hidden" checked={form.available} onChange={e => set("available", e.target.checked)} />
                <span className="font-sans text-[14px] text-white/70">{form.available ? "Open to work" : "Indisponible"}</span>
              </label>
            </div>
            <div className="md:col-span-2">
              <label className="font-mono text-[11px] text-white/50 tracking-wider uppercase block mb-2">Tagline</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500/50 transition-colors"
                value={form.tagline} onChange={e => set("tagline", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="font-mono text-[11px] text-white/50 tracking-wider uppercase block mb-2">Bio</label>
              <textarea rows={5} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500/50 transition-colors resize-none"
                value={form.bio} onChange={e => set("bio", e.target.value)} />
            </div>
          </div>
        </motion.div>

        {/* Titres animés */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-mono text-[11px] text-brand-400 tracking-[2px] uppercase">Titres animés</h3>
            <button onClick={() => set("titles", [...form.titles, ""])}
              className="flex items-center gap-1.5 font-mono text-[11px] text-brand-400 hover:text-brand-300 transition-colors">
              <Plus size={14} /> Ajouter
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {form.titles.map((t, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500/50 transition-colors"
                  placeholder="ex: Fullstack Web Developer" value={t} onChange={e => {
                    const next = [...form.titles]; next[i] = e.target.value; set("titles", next);
                  }} />
                <button onClick={() => set("titles", form.titles.filter((_, j) => j !== i))}
                  className="p-2 rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-mono text-[11px] text-brand-400 tracking-[2px] uppercase">Tech Stack</h3>
            <button onClick={() => set("techStack", [...form.techStack, ""])}
              className="flex items-center gap-1.5 font-mono text-[11px] text-brand-400 hover:text-brand-300 transition-colors">
              <Plus size={14} /> Ajouter
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {form.techStack.map((t, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500/50 transition-colors"
                  placeholder="ex: React" value={t} onChange={e => {
                    const next = [...form.techStack]; next[i] = e.target.value; set("techStack", next);
                  }} />
                <button onClick={() => set("techStack", form.techStack.filter((_, j) => j !== i))}
                  className="p-2 rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-mono text-[11px] text-brand-400 tracking-[2px] uppercase">Statistiques</h3>
            <button onClick={() => set("stats", [...form.stats, { label: "", value: "" }])}
              className="flex items-center gap-1.5 font-mono text-[11px] text-brand-400 hover:text-brand-300 transition-colors">
              <Plus size={14} /> Ajouter
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {form.stats.map((s, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500/50 transition-colors"
                  placeholder="Label (ex: Expérience)" value={s.label} onChange={e => {
                    const next = [...form.stats]; next[i] = { ...next[i], label: e.target.value }; set("stats", next);
                  }} />
                <input className="w-28 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500/50 transition-colors"
                  placeholder="Valeur (ex: 2+ ans)" value={s.value} onChange={e => {
                    const next = [...form.stats]; next[i] = { ...next[i], value: e.target.value }; set("stats", next);
                  }} />
                <button onClick={() => set("stats", form.stats.filter((_, j) => j !== i))}
                  className="p-2 rounded-lg text-red-400/50 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Réseaux sociaux */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl"
        >
          <h3 className="font-mono text-[11px] text-brand-400 tracking-[2px] uppercase mb-6">Réseaux sociaux</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { key: "email", label: "Email", placeholder: "email@example.com" },
              { key: "github", label: "GitHub", placeholder: "https://github.com/..." },
              { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/..." },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="font-mono text-[11px] text-white/50 tracking-wider uppercase block mb-2">{label}</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500/50 transition-colors"
                  placeholder={placeholder} value={form.socialLinks[key] || ""}
                  onChange={e => set("socialLinks", { ...form.socialLinks, [key]: e.target.value })} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Save */}
        <div className="flex justify-end">
          <button onClick={save} disabled={loading}
            className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-400 transition-colors disabled:opacity-50">
            {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={18} />}
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}
