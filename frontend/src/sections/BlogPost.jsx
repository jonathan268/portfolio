import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import api from "../api";

const COVER_COLORS = ["#1a103f", "#0d1a2e", "#1a1a0d", "#1a0d1a"];
const TAG_COLOR    = { SaaS:"#e779c1", Security:"#58c7f3", MongoDB:"#47A248" };

const IconArrowLeft = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconClock = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

export default function BlogPostPage() {
  const { slug }           = useParams();
  const [post, setPost]    = useState(null);
  const [loading, setLoad] = useState(true);
  const [notFound, set404] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    api.get(`/blog/${slug}`)
      .then(r => setPost(r.data.data))
      .catch(err => { if (err.response?.status === 404) set404(true); })
      .finally(() => setLoad(false));
  }, [slug]);

  if (loading) return <BlogSkeleton />;
  if (notFound) return <NotFound />;
  if (!post)    return null;

  const accent = TAG_COLOR[post.tag] || "#e779c1";
  const date   = new Date(post.createdAt).toLocaleDateString("fr-FR", { day:"numeric", month:"long", year:"numeric" });

  return (
    <div className="min-h-screen" style={{ background:"#0c061e" }}>

      {/* ── Cover hero ────────────────────────────────── */}
      <div
        className="relative flex flex-col items-center justify-end w-full overflow-hidden"
        style={{ minHeight: 280, background: post.cover ? "transparent" : COVER_COLORS[0] }}
      >
        {post.cover ? (
          <>
            <img src={post.cover} alt="cover" className="absolute inset-0 object-cover w-full h-full" />
            <div className="absolute inset-0" style={{ background:"linear-gradient(to bottom, rgba(12,6,30,0.3) 0%, rgba(12,6,30,0.92) 100%)" }} />
          </>
        ) : (
          <div className="absolute inset-0 sw-grid-bg opacity-40" />
        )}

        <div className="relative z-10 w-full max-w-3xl px-6 pt-24 pb-10 mx-auto">
          {/* Back button */}
          <Link to="/#blog"
            className="inline-flex items-center gap-2 font-mono text-[12px] text-white/40 hover:text-white/80 mb-6 transition-colors">
            <IconArrowLeft /> Retour au blog
          </Link>

          {/* Tag */}
          <span
            className="inline-block font-mono text-[11px] px-3 py-1 rounded-full mb-4"
            style={{ background:`${accent}20`, color:accent, border:`1px solid ${accent}35` }}>
            {post.tag}
          </span>

          {/* Title */}
          <h1 className="font-ubuntu font-bold leading-[1.25] text-white mb-5"
            style={{ fontSize:"clamp(24px,4vw,42px)" }}>
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 text-white/40">
              <IconCalendar />
              <span className="font-mono text-[12px]">{date}</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/40">
              <IconClock />
              <span className="font-mono text-[12px]">{post.readTime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Article body ──────────────────────────────── */}
      <div className="max-w-3xl px-6 py-12 mx-auto">
        {/* Excerpt */}
        <p className="font-ubuntu text-[17px] leading-relaxed mb-10 pb-10"
          style={{ color:"rgba(255,255,255,0.55)", borderBottom:"1px solid rgba(255,255,255,0.07)" }}>
          {post.excerpt}
        </p>

        {/* Markdown content */}
        <div className="blog-prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-8 mt-16"
          style={{ borderTop:"1px solid rgba(255,255,255,0.07)" }}>
          <Link to="/#blog"
            className="inline-flex items-center gap-2 font-mono text-[13px] text-white/40 hover:text-white/70 transition-colors">
            <IconArrowLeft /> Tous les articles
          </Link>
          <span className="font-mono text-[11px] text-white/20">Jonathan · {date}</span>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function BlogSkeleton() {
  return (
    <div className="min-h-screen animate-pulse" style={{ background:"#0c061e" }}>
      <div className="h-64 bg-white/5" />
      <div className="flex flex-col max-w-3xl gap-4 px-6 py-12 mx-auto">
        <div className="w-1/4 h-6 rounded bg-white/10" />
        <div className="w-3/4 h-10 rounded bg-white/10" />
        <div className="w-full h-4 rounded bg-white/5" />
        <div className="w-5/6 h-4 rounded bg-white/5" />
        <div className="w-4/5 h-4 rounded bg-white/5" />
      </div>
    </div>
  );
}

// ── Not found ─────────────────────────────────────────────────────────────────
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5" style={{ background:"#0c061e" }}>
      <p className="font-mono text-[13px] text-white/30">Article introuvable.</p>
      <Link to="/#blog" className="btn btn-primary btn-sm rounded-[9px]">← Retour au blog</Link>
    </div>
  );
}