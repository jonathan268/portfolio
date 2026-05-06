import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2, CheckCircle, ExternalLink, Plus, Eye, Code, X } from "lucide-react";
import api from "../../api";

const EMPTY = { title:"", excerpt:"", content:"", tag:"", readTime:"5 min", published:false };

// ── Modal editor ──────────────────────────────────────────────────────────────
function Modal({ post, onClose, onSave }) {
  const [form, setForm]       = useState(post ? { ...post } : { ...EMPTY });
  const [loading, setLoading] = useState(false);
  const [tab, setTab]         = useState("edit"); // "edit" | "preview"

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.title || !form.excerpt || !form.content || !form.tag) {
      toast.error("Tous les champs obligatoires doivent être remplis."); return;
    }
    setLoading(true);
    try {
      if (post?._id) {
        await api.put(`/blog/${post._id}`, form);
        toast.success("Article mis à jour !");
      } else {
        await api.post("/blog", form);
        toast.success("Article créé !");
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
        className="w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#03045e]/20 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl"
      >

        <div className="flex justify-between items-center mb-8">
          <h2 className="font-display font-bold text-[24px] text-white">{post ? "Modifier l'article" : "Nouvel article"}</h2>
          <button className="text-white/50 hover:text-white transition-colors" onClick={onClose}><X size={24} /></button>
        </div>

        <div className="flex flex-col gap-5">
          {/* Titre */}
          <div>
            <label className="font-mono text-[11px] text-brand-400 tracking-[1px] uppercase block mb-2">Titre</label>
            <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500/50 transition-colors" placeholder="JWT + Refresh Tokens : la bonne architecture"
              value={form.title} onChange={e => set("title", e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="font-mono text-[11px] text-brand-400 tracking-[1px] uppercase block mb-2">Tag / Catégorie</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500/50 transition-colors" placeholder="SaaS, Security, MongoDB..." value={form.tag}
                onChange={e => set("tag", e.target.value)} />
            </div>
            <div>
              <label className="font-mono text-[11px] text-brand-400 tracking-[1px] uppercase block mb-2">Temps de lecture</label>
              <input className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500/50 transition-colors" placeholder="8 min" value={form.readTime}
                onChange={e => set("readTime", e.target.value)} />
            </div>
          </div>

          <div>
            <label className="font-mono text-[11px] text-brand-400 tracking-[1px] uppercase block mb-2">Extrait</label>
            <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-500/50 transition-colors resize-none" rows={2} placeholder="Résumé affiché sur la carte de l'article..."
              value={form.excerpt} onChange={e => set("excerpt", e.target.value)} />
          </div>

          {/* Éditeur avec tabs Édition / Aperçu */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-mono text-[11px] text-brand-400 tracking-[1px] uppercase">
                Contenu (Markdown)
              </label>
              <div className="flex rounded-lg overflow-hidden border border-white/10 bg-white/5 p-1 gap-1">
                {["edit","preview"].map(t => (
                  <button key={t}
                    onClick={() => setTab(t)}
                    className="flex items-center gap-2 px-3 py-1.5 font-mono text-[11px] rounded-md transition-all"
                    style={{
                      background: tab === t ? "rgba(0,180,216,0.15)" : "transparent",
                      color:      tab === t ? "#00b4d8" : "rgba(255,255,255,0.4)",
                    }}>
                    {t === "edit" ? <><Code size={14}/> Éditer</> : <><Eye size={14}/> Aperçu</>}
                  </button>
                ))}
              </div>
            </div>

            {tab === "edit" ? (
              <textarea
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white outline-none focus:border-brand-500/50 transition-colors resize-none font-mono text-[13px] leading-relaxed"
                rows={16}
                placeholder={"# Titre de l'article\n\nIntroduction...\n\n## Sous-section\n\n```js\nconst x = 1;\n```\n\n> Une citation importante"}
                value={form.content}
                onChange={e => set("content", e.target.value)}
              />
            ) : (
              <div
                className="blog-prose rounded-xl p-6 overflow-y-auto bg-[#010214] border border-white/10"
                style={{
                  minHeight: 380, maxHeight: 480,
                }}
              >
                {form.content
                  ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.content}</ReactMarkdown>
                  : <p className="font-mono text-[12px] text-white/20 italic">Rien à prévisualiser — écris quelque chose dans l'onglet Éditer.</p>
                }
              </div>
            )}
          </div>

          <label className="flex items-center gap-3 cursor-pointer group mt-2">
            <div className={`flex items-center justify-center w-5 h-5 rounded border ${form.published ? 'bg-brand-500 border-brand-500' : 'border-white/20 group-hover:border-white/50'}`}>
              {form.published && <CheckCircle size={14} className="text-white" />}
            </div>
            <input type="checkbox" className="hidden" checked={form.published} onChange={e => set("published", e.target.checked)} />
            <span className="font-sans font-medium text-[14px] text-white/80 group-hover:text-white">Publier immédiatement</span>
          </label>

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

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminBlog() {
  const [posts, setPosts] = useState([]);
  const [modal, setModal] = useState(null);

  const load = () => api.get("/blog/admin/all").then(r => setPosts(r.data.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const del = async (id) => {
    if (!confirm("Supprimer cet article ?")) return;
    try { await api.delete(`/blog/${id}`); toast.success("Article supprimé."); load(); }
    catch { toast.error("Erreur."); }
  };

  const togglePublish = async (post) => {
    try {
      await api.put(`/blog/${post._id}`, { ...post, published: !post.published });
      toast.success(post.published ? "Article dépublié." : "Article publié !");
      load();
    } catch { toast.error("Erreur."); }
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-end justify-between mb-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <p className="font-mono text-[12px] text-brand-400 tracking-[3px] uppercase mb-2">Admin</p>
          <h1 className="font-display font-bold text-[36px] text-white tracking-tight leading-none">Blog</h1>
        </motion.div>
        <motion.button 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-400 transition-colors shadow-[0_0_15px_rgba(0,180,216,0.2)]" 
          onClick={() => setModal("new")}
        >
          <Plus size={18} /> Nouvel article
        </motion.button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <AnimatePresence>
          {posts.map((p, i) => (
            <motion.div 
              key={p._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-5 p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-white/10 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-display font-bold text-[18px] text-white truncate">{p.title}</span>
                  {!p.published && <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/50 text-[10px] font-mono tracking-wider border border-white/10 shrink-0">BROUILLON</span>}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-[11px] px-3 py-1 rounded-full border border-brand-500/30 text-brand-400 bg-brand-500/10">{p.tag}</span>
                  <span className="font-mono text-[11px] text-white/40">{p.readTime}</span>
                  <span className="font-mono text-[11px] text-white/40">
                    {new Date(p.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {/* Lien aperçu public */}
                {p.published && (
                  <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer"
                    className="p-2 rounded-lg text-white/40 hover:text-brand-400 hover:bg-brand-500/10 transition-colors"
                    title="Voir l'article public">
                    <ExternalLink size={16} />
                  </a>
                )}
                <button
                  className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-medium transition-colors border ${p.published ? "border-brand-500/50 text-brand-400 hover:bg-brand-500/10" : "border-white/20 text-white/50 hover:text-white hover:bg-white/5"}`}
                  onClick={() => togglePublish(p)}>
                  {p.published ? "● Publié" : "○ Brouillon"}
                </button>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
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

        {posts.length === 0 && (
          <div className="py-20 text-center text-white/30 bg-white/[0.02] border border-white/5 rounded-2xl">
            <p className="font-mono text-[14px]">Aucun article. Écrivez le premier !</p>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {modal && (
          <Modal post={modal === "new" ? null : modal}
            onClose={() => setModal(null)}
            onSave={() => { setModal(null); load(); }} />
        )}
      </AnimatePresence>
    </div>
  );
}