import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/Reveal";
import api from "../api";
import { Clock, ArrowRight, BookOpen } from "lucide-react";

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
    <section id="blog" className="section-pad relative">
      <div className="container-md relative z-10">
        <Reveal>
          <span className="label-mono flex items-center gap-2">
            <BookOpen size={16} /> Articles
          </span>
          <h2 className="section-title">Dernières <span className="gradient-text">Pensées</span></h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading && Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-panel animate-pulse min-h-[350px] p-6">
              <div className="w-1/3 h-6 rounded-full bg-white/10 mb-6" />
              <div className="w-full h-8 mb-4 rounded bg-white/10" />
              <div className="w-3/4 h-8 mb-6 rounded bg-white/5" />
              <div className="flex-1 h-20 w-full bg-white/5 rounded" />
            </div>
          ))}

          {!loading && posts.map((post, i) => (
            <Reveal key={post._id} delay={i * 90} dir="up">
              <Link to={`/blog/${post.slug}`} className="bento-card block">
                {post.cover && (
                  <div className="h-40 w-full overflow-hidden border-b border-white/10 rounded-t-[24px]">
                    <img 
                      src={post.cover} 
                      alt={post.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}
                
                <div className={`flex flex-col flex-1 p-8 ${post.cover ? 'pt-6' : ''}`}>
                  {/* Meta */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="px-3 py-1 text-[11px] font-mono tracking-wider text-neon-cyan border border-neon-cyan/30 bg-neon-cyan/10 rounded-full">
                      {post.tag}
                    </span>
                    <div className="flex items-center gap-1.5 text-white/40">
                      <Clock size={14} />
                      <span className="font-mono text-[11px]">{post.readTime}</span>
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-[22px] leading-[1.3] text-white mb-4 group-hover:text-neon-cyan transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="font-sans font-light text-[15px] text-white/50 leading-[1.7] mb-8 flex-1">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/10">
                    <span className="font-mono text-[11px] text-white/30">
                      {new Date(post.createdAt).toLocaleDateString("fr-FR", { day:"numeric", month:"short", year:"numeric" })}
                    </span>
                    <span className="flex items-center gap-2 font-mono text-[12px] font-medium text-white group-hover:text-neon-cyan transition-all">
                      Lire <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {!loading && posts.length === 0 && (
          <div className="py-20 text-center">
             <BookOpen size={32} className="mx-auto text-white/20 mb-4" />
             <p className="font-mono text-[14px] text-white/40">Aucun article publié pour le moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}