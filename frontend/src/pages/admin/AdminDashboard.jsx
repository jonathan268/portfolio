import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

function StatCard({ icon, label, value, color, onClick }) {
  return (
    <button
      className="sw-card p-6 text-left w-full cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-2xl">{icon}</span>
        <span className="font-mono text-[22px] font-bold" style={{ color }}>{value}</span>
      </div>
      <div className="font-ubuntu font-medium text-[14px] text-base-content/60">{label}</div>
    </button>
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
    <div className="p-8">
      <div className="mb-10">
        <p className="font-mono text-[11px] text-primary tracking-[3px] uppercase mb-1">Admin</p>
        <h1 className="font-ubuntu font-bold text-[28px] text-base-content/90">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon="🚀" label="Projets publiés"   value={stats.projects} color="#e779c1" onClick={() => navigate("/admin/projects")} />
        <StatCard icon="✍️" label="Articles de blog"  value={stats.blog}     color="#58c7f3" onClick={() => navigate("/admin/blog")} />
        <StatCard icon="📬" label="Messages reçus"    value={stats.messages} color="#f3cc30" onClick={() => navigate("/admin/messages")} />
        <StatCard icon="🔔" label="Non lus"           value={stats.unread}   color="#e779c1" onClick={() => navigate("/admin/messages")} />
      </div>

      {/* Quick links */}
      <div>
        <h2 className="font-ubuntu font-bold text-[17px] text-base-content/70 mb-4">Actions rapides</h2>
        <div className="flex flex-wrap gap-3">
          <button className="btn btn-primary btn-sm rounded-[9px] gap-2" onClick={() => navigate("/admin/projects")}>
            + Nouveau projet
          </button>
          <button className="btn btn-secondary btn-sm rounded-[9px] gap-2" onClick={() => navigate("/admin/blog")}>
            + Nouvel article
          </button>
          <a href="/" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm btn-ghost rounded-[9px] gap-2"
            style={{ border:"1px solid rgba(231,121,193,0.2)", color:"#9490b0" }}>
            Voir le portfolio ↗
          </a>
        </div>
      </div>
    </div>
  );
}
