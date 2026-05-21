import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Rocket, FileText, Mail, Bell, Plus, ExternalLink, Camera, Trash2 } from "lucide-react";
import api from "../../api";

function StatCard({ icon, label, value, color, onClick, delay }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="relative p-6 text-left w-full cursor-pointer bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden group hover:border-white/20 transition-colors"
      onClick={onClick}
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${color}`} />
      <div className="flex items-start justify-between mb-6">
        <div className={`p-3 rounded-xl bg-white/5 text-white group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
        <span className="font-display text-[32px] font-bold text-white leading-none">{value}</span>
      </div>
      <div className="font-sans font-medium text-[15px] text-white/50 group-hover:text-white/80 transition-colors">{label}</div>
    </motion.button>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ projects:0, blog:0, messages:0, unread:0 });
  const [profileImage, setProfileImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get("/projects/admin/all"),
      api.get("/blog/admin/all"),
      api.get("/messages"),
      api.get("/auth/me"),
    ]).then(([p, b, m, me]) => {
      const messages = m.data.data;
      setStats({
        projects: p.data.data.length,
        blog:     b.data.data.length,
        messages: messages.length,
        unread:   messages.filter(msg => !msg.read).length,
      });
      setProfileImage(me.data.data.profileImage || null);
    }).catch(() => {});
  }, []);

  const handleUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Seules les images sont acceptées."); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image trop lourde (max 5 Mo)."); return; }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await api.post("/upload", formData, { headers: { "Content-Type": "multipart/form-data" } });
      await api.put("/auth/profile", { profileImage: res.data.url });
      setProfileImage(res.data.url);
      toast.success("Photo de profil mise à jour !");
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de l'upload.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async () => {
    try {
      await api.put("/auth/profile", { profileImage: null });
      setProfileImage(null);
      toast.success("Photo de profil supprimée.");
    } catch {
      toast.error("Erreur lors de la suppression.");
    }
  };

  return (
    <div className="max-w-5xl">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-10"
      >
        <p className="font-mono text-[12px] text-brand-400 tracking-[3px] uppercase mb-2">Overview</p>
        <h1 className="font-display font-bold text-[36px] text-white tracking-tight">Dashboard</h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8 mb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={<Rocket size={24} />} 
            label="Projets publiés"   
            value={stats.projects} 
            color="bg-brand-400" 
            delay={0.1}
            onClick={() => navigate("/admin/projects")} 
          />
          <StatCard 
            icon={<FileText size={24} />} 
            label="Articles de blog"  
            value={stats.blog}     
            color="bg-brand-500" 
            delay={0.2}
            onClick={() => navigate("/admin/blog")} 
          />
          <StatCard 
            icon={<Mail size={24} />} 
            label="Messages reçus"    
            value={stats.messages} 
            color="bg-brand-600" 
            delay={0.3}
            onClick={() => navigate("/admin/messages")} 
          />
          <StatCard 
            icon={<Bell size={24} />} 
            label="Non lus"           
            value={stats.unread}   
            color="bg-brand-700" 
            delay={0.4}
            onClick={() => navigate("/admin/messages")} 
          />
        </div>

        {/* Profile Image Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/[0.02] border border-white/5 rounded-2xl p-6"
        >
          <h3 className="font-mono text-[11px] text-brand-400 tracking-[2px] uppercase mb-4">Photo de profil</h3>
          
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-white/10 bg-white/5 group">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20">
                  <Camera size={32} />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-[#010214]/80 opacity-0 group-hover:opacity-100 transition-opacity">
                {uploading ? (
                  <span className="w-6 h-6 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
                ) : (
                  <button onClick={() => inputRef.current?.click()} className="p-2 rounded-lg bg-brand-500 text-white hover:bg-brand-400 transition-colors">
                    <Camera size={16} />
                  </button>
                )}
              </div>
            </div>

            <p className="font-mono text-[11px] text-white/40 text-center leading-relaxed">
              Cliquez sur l'image pour la modifier
            </p>

            {profileImage && (
              <button onClick={removeImage} className="flex items-center gap-1.5 font-mono text-[11px] text-red-400 hover:text-red-300 transition-colors">
                <Trash2 size={12} /> Supprimer
              </button>
            )}
          </div>

          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => handleUpload(e.target.files?.[0])} />
        </motion.div>
      </div>

      {/* Quick links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="font-display font-bold text-[20px] text-white mb-6">Actions rapides</h2>
        <div className="flex flex-wrap gap-4">
          <button 
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-500 text-white font-medium hover:bg-brand-400 transition-colors shadow-[0_0_15px_rgba(0,180,216,0.3)] hover:shadow-[0_0_20px_rgba(0,180,216,0.5)]" 
            onClick={() => navigate("/admin/projects")}
          >
            <Plus size={18} /> Nouveau projet
          </button>
          <button 
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-700 text-white font-medium hover:bg-brand-600 transition-colors" 
            onClick={() => navigate("/admin/blog")}
          >
            <Plus size={18} /> Nouvel article
          </button>
          <a 
            href="/" 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
          >
            Voir le portfolio <ExternalLink size={18} />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
