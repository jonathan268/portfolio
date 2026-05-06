import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, useScroll, useSpring } from "framer-motion";
import api from "../api";
import CommentSection from "../components/CommentSection";

const COVER_COLORS = ["#03045e", "#023e8a", "#0077b6", "#010214"];
const TAG_COLOR = { SaaS: "#00b4d8", Security: "#48cae4", MongoDB: "#0096c7" };

const IconArrowLeft = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);
const IconClock = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconCalendar = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export default function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoad] = useState(true);
  const [notFound, set404] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    setPost(null);
    set404(false);
    setLoad(true);

    api
      .get(`/blog/${slug}`)
      .then((r) => {
        setPost(r.data.data);
        set404(false);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          set404(true);
        }
        setPost(null);
      })
      .finally(() => setLoad(false));
  }, [slug]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleBlogLink = () => {
    navigate("/?section=blog", { replace: false });
    setTimeout(() => {
      const blogSection = document.getElementById("blog");
      if (blogSection) {
        blogSection.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  if (loading) return <BlogSkeleton />;
  if (notFound) return <NotFound />;
  if (!post) return null;

  const accent = TAG_COLOR[post.tag] || "#00b4d8";
  const date = new Date(post.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-deep-space">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-brand-500 origin-left z-50 shadow-[0_0_10px_rgba(0,180,216,0.5)]"
        style={{ scaleX }}
      />

      {/* ── Cover hero ────────────────────────────────── */}
      <div
        className="relative flex flex-col items-center justify-end w-full overflow-hidden"
        style={{
          minHeight: 320,
          background: post.cover ? "transparent" : COVER_COLORS[0],
        }}
      >
        {post.cover ? (
          <>
            <img
              src={post.cover}
              alt="cover"
              className="absolute inset-0 object-cover w-full h-full opacity-60"
            />
            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(to bottom, rgba(1,2,20,0.1) 0%, rgba(1,2,20,1) 100%)",
              }}
            />
          </>
        ) : (
          <div className="absolute inset-0 sw-grid-bg opacity-40 mix-blend-overlay" />
        )}

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 w-full max-w-3xl px-6 pt-24 pb-10 mx-auto"
        >
          {/* Back button */}
          <button
            onClick={handleBackClick}
            className="inline-flex items-center gap-2 font-mono text-[12px] text-white/50 hover:text-white mb-6 transition-colors bg-none border-none cursor-pointer group"
          >
            <span className="group-hover:-translate-x-1 transition-transform"><IconArrowLeft /></span> Retour
          </button>

          {/* Tag */}
          <span
            className="inline-block font-mono text-[11px] px-3 py-1 rounded-full mb-6 backdrop-blur-md"
            style={{
              background: `${accent}20`,
              color: accent,
              border: `1px solid ${accent}35`,
            }}
          >
            {post.tag}
          </span>

          {/* Title */}
          <h1
            className="font-display font-bold leading-[1.2] text-white mb-6"
            style={{ fontSize: "clamp(28px, 5vw, 48px)" }}
          >
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5 text-white/50">
              <IconCalendar />
              <span className="font-mono text-[12px]">{date}</span>
            </div>
            <div className="flex items-center gap-1.5 text-brand-400">
              <IconClock />
              <span className="font-mono text-[12px]">{post.readTime}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Article body ──────────────────────────────── */}
      <div className="max-w-3xl px-6 py-12 mx-auto">
        {/* Excerpt */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-sans text-[18px] leading-relaxed mb-10 pb-10 font-light"
          style={{
            color: "rgba(255,255,255,0.7)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {post.excerpt}
        </motion.p>

        {/* Markdown content */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="blog-prose"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </motion.div>

        {/* Comments Section */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <CommentSection postSlug={post.slug} />
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 mt-16 border-t border-white/10">
          <button
            onClick={handleBlogLink}
            className="inline-flex items-center gap-2 font-mono text-[13px] text-white/50 hover:text-brand-400 transition-colors bg-none border-none cursor-pointer group"
          >
            <span className="group-hover:-translate-x-1 transition-transform"><IconArrowLeft /></span> Tous les articles
          </button>
          <span className="font-mono text-[12px] text-white/30">
            Jonathan · {date}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────
function BlogSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-deep-space">
      <div className="h-[320px] bg-white/5" />
      <div className="flex flex-col max-w-3xl gap-6 px-6 py-12 mx-auto">
        <div className="w-1/4 h-8 rounded-full bg-white/10" />
        <div className="w-3/4 h-12 rounded bg-white/10" />
        <div className="w-full h-4 rounded bg-white/5 mt-8" />
        <div className="w-5/6 h-4 rounded bg-white/5" />
        <div className="w-4/5 h-4 rounded bg-white/5" />
      </div>
    </div>
  );
}

// ── Not found ─────────────────────────────────────────────────────────────────
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-5 bg-deep-space">
      <p className="font-mono text-[14px] text-white/40">
        Article introuvable.
      </p>
      <Link to="/?section=blog" className="px-6 py-3 rounded-xl bg-brand-500/20 text-brand-400 hover:bg-brand-500/30 transition-colors font-sans font-medium">
        ← Retour au blog
      </Link>
    </div>
  );
}
