import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import api from "../api";

const TAG_BADGE = { SaaS:"badge-primary", Security:"badge-secondary", MongoDB:"badge-accent" };

const IconClock = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconArrow = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const COVER_COLORS = ["#1a103f","#0d1a2e","#1a1a0d","#1a0d1a"];

export default function BlogSection() {
  const [posts, setPosts]  = useState([]);
  const [loading, setLoad] = useState(true);

  useEffect(() => {
    api.get("/blog")
      .then(r => setPosts(r.data.data))
      .catch(() => {})
      .finally(() => setLoad(false));
  }, []);

  return (
    <section id="blog" className="section-pad" style={{ background:"rgba(88,199,243,0.02)" }}>
      <div className="container-md">
        <Reveal>
          <span className="label-mono">Articles</span>
          <h2 className="section-title">Blog</h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {loading && Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="blog-card animate-pulse">
              <div className="h-[100px] bg-white/5" />
              <div className="p-5">
                <div className="w-2/3 h-4 mb-3 rounded bg-white/10" />
                <div className="h-3 w-full bg-white/5 rounded mb-1.5" />
                <div className="w-3/4 h-3 rounded bg-white/5" />
              </div>
            </div>
          ))}

          {!loading && posts.map((post, i) => (
            <Reveal key={post._id} delay={i * 90} dir="up">
              {/* Toute la card est cliquable */}
              <Link to={`/blog/${post.slug}`} className="flex flex-col block h-full blog-card group">
                {/* Cover */}
                <div
                  className="h-[100px] flex items-center justify-center relative overflow-hidden"
                  style={{ background: post.cover ? "transparent" : COVER_COLORS[i % COVER_COLORS.length] }}
                >
                  {post.cover ? (
                    <>
                      <img src={post.cover} alt={post.title}
                        className="absolute inset-0 object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0" style={{ background:"rgba(12,6,30,0.45)" }} />
                    </>
                  ) : (
                    <div className="absolute inset-0 sw-grid-bg opacity-60" />
                  )}
                  <span className="font-mono text-[11px] text-white/15 tracking-[2px] relative z-10">
                    {post.tag?.toUpperCase()}
                  </span>
                </div>

                <div className="flex flex-col flex-1 p-5">
                  {/* Meta */}
                  <div className="flex justify-between items-center mb-3.5">
                    <span className={`badge ${TAG_BADGE[post.tag] || "badge-primary"} text-[10px] font-mono`}>
                      {post.tag}
                    </span>
                    <div className="flex items-center gap-1.5 text-white/30">
                      <IconClock />
                      <span className="font-mono text-[10px]">{post.readTime}</span>
                    </div>
                  </div>

                  <h3 className="font-ubuntu font-bold text-[16px] leading-[1.45] text-base-content/90 mb-2.5 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="font-ubuntu font-light text-[13px] text-base-content/50 leading-[1.65] mb-5 flex-1">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-mono text-[10px] text-white/25">
                      {new Date(post.createdAt).toLocaleDateString("fr-FR", { day:"numeric", month:"short", year:"numeric" })}
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-[12px] text-primary transition-all duration-150 group-hover:gap-2.5">
                      Lire l'article <IconArrow />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {!loading && posts.length === 0 && (
          <div className="text-center py-14 text-white/25">
            <p className="font-mono text-[13px]">Aucun article publié pour le moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}