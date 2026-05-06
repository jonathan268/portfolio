import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket, FileText, Mail, Bell, Plus, ExternalLink } from "lucide-react";
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
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get("/projects/admin/all"),
      api.get("/blog/admin/all"),
      api.get("/messages"),
    ]).then(([p, b, m]) => {
      const messages = m.data.data;
      setStats({
        projects: p.data.data.length,
        blog:     b.data.data.length,
        messages: messages.length,
        unread:   messages.filter(msg => !msg.read).length,
      });
    }).catch(() => {});
  }, []);

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
