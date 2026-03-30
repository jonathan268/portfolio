import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background:"rgba(0,0,0,0.75)", backdropFilter:"blur(6px)" }}>
      <div className="w-full max-w-4xl max-h-[92vh] overflow-y-auto sw-card p-8"
        style={{ background:"#120a2e" }}>

        <div className="flex justify-between items-center mb-7">
          <h2 className="font-ubuntu font-bold text-[20px]">{post ? "Modifier l'article" : "Nouvel article"}</h2>
          <button className="btn btn-sm btn-ghost btn-square text-lg" onClick={onClose}>✕</button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Titre */}
          <div>
            <label className="font-mono text-[11px] text-primary tracking-[1px] uppercase block mb-2">Titre</label>
            <input className="sw-input" placeholder="JWT + Refresh Tokens : la bonne architecture"
              value={form.title} onChange={e => set("title", e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-[11px] text-primary tracking-[1px] uppercase block mb-2">Tag / Catégorie</label>
              <input className="sw-input" placeholder="SaaS, Security, MongoDB..." value={form.tag}
                onChange={e => set("tag", e.target.value)} />
            </div>
            <div>
              <label className="font-mono text-[11px] text-primary tracking-[1px] uppercase block mb-2">Temps de lecture</label>
              <input className="sw-input" placeholder="8 min" value={form.readTime}
                onChange={e => set("readTime", e.target.value)} />
            </div>
          </div>

          <div>
            <label className="font-mono text-[11px] text-primary tracking-[1px] uppercase block mb-2">Extrait</label>
            <textarea className="sw-textarea" rows={2} placeholder="Résumé affiché sur la carte de l'article..."
              value={form.excerpt} onChange={e => set("excerpt", e.target.value)} />
          </div>

          {/* Éditeur avec tabs Édition / Aperçu */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-mono text-[11px] text-primary tracking-[1px] uppercase">
                Contenu (Markdown)
              </label>
              <div className="flex rounded-lg overflow-hidden border border-white/10">
                {["edit","preview"].map(t => (
                  <button key={t}
                    onClick={() => setTab(t)}
                    className="px-3 py-1 font-mono text-[11px] transition-colors"
                    style={{
                      background: tab === t ? "rgba(231,121,193,0.15)" : "transparent",
                      color:      tab === t ? "#e779c1" : "rgba(255,255,255,0.3)",
                    }}>
                    {t === "edit" ? "✏ Éditer" : "👁 Aperçu"}
                  </button>
                ))}
              </div>
            </div>

            {tab === "edit" ? (
              <textarea
                className="sw-textarea font-mono text-[13px]"
                rows={16}
                placeholder={"# Titre de l'article\n\nIntroduction...\n\n## Sous-section\n\n```js\nconst x = 1;\n```\n\n> Une citation importante"}
                value={form.content}
                onChange={e => set("content", e.target.value)}
                style={{ fontFamily:"'Ubuntu Mono', monospace" }}
              />
            ) : (
              <div
                className="blog-prose rounded-xl p-5 overflow-y-auto"
                style={{
                  minHeight: 380, maxHeight: 480,
                  background:"rgba(0,0,0,0.25)",
                  border:"1px solid rgba(255,255,255,0.08)",
                }}
              >
                {form.content
                  ? <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.content}</ReactMarkdown>
                  : <p className="font-mono text-[12px] text-white/20 italic">Rien à prévisualiser — écris quelque chose dans l'onglet Éditer.</p>
                }
              </div>
            )}
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" className="checkbox checkbox-primary checkbox-sm"
              checked={form.published} onChange={e => set("published", e.target.checked)} />
            <span className="font-ubuntu text-[14px] text-base-content/70">Publier immédiatement</span>
          </label>

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
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="font-mono text-[11px] text-primary tracking-[3px] uppercase mb-1">Admin</p>
          <h1 className="font-ubuntu font-bold text-[26px]">Blog</h1>
        </div>
        <button className="btn btn-primary btn-sm rounded-[9px] gap-2" onClick={() => setModal("new")}>
          + Nouvel article
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {posts.map(p => (
          <div key={p._id} className="sw-card p-5 flex items-center gap-5">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-ubuntu font-bold text-[15px] text-base-content/90 truncate">{p.title}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] px-2 py-0.5 rounded-full border border-secondary/20 text-secondary/60">{p.tag}</span>
                <span className="font-mono text-[11px] text-white/25">{p.readTime}</span>
                <span className="font-mono text-[11px] text-white/25">
                  {new Date(p.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Lien aperçu public */}
              {p.published && (
                <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer"
                  className="btn btn-xs btn-ghost btn-square text-white/30 hover:text-secondary"
                  title="Voir l'article public">
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              )}
              <button
                className={`btn btn-xs rounded-full font-mono ${p.published ? "btn-success btn-outline" : "btn-ghost"}`}
                onClick={() => togglePublish(p)}>
                {p.published ? "● Publié" : "○ Brouillon"}
              </button>
              <button className="btn btn-sm btn-ghost btn-square text-white/40 hover:text-white/80" onClick={() => setModal(p)}>
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button className="btn btn-sm btn-ghost btn-square text-error/50 hover:text-error" onClick={() => del(p._id)}>
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                  <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
              </button>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-16 text-white/25">
            <p className="font-mono text-[13px]">Aucun article. Écrivez le premier !</p>
          </div>
        )}
      </div>

      {modal && (
        <Modal post={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); load(); }} />
      )}
    </div>
  );
}