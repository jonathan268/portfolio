import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { LayoutDashboard, Rocket, FileText, Zap, MessageCircle, Mail, LogOut, Terminal } from "lucide-react";

const NAV = [
  { to: "/admin/dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
  { to: "/admin/projects", icon: <Rocket size={18} />, label: "Projets" },
  { to: "/admin/blog", icon: <FileText size={18} />, label: "Blog" },
  { to: "/admin/skills", icon: <Zap size={18} />, label: "Stack" },
  { to: "/admin/comments", icon: <MessageCircle size={18} />, label: "Commentaires" },
  { to: "/admin/messages", icon: <Mail size={18} />, label: "Messages" },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  return (
    <div className="flex min-h-screen bg-deep-space text-white font-sans overflow-hidden">
      {/* ── Sidebar ── */}
      <motion.aside
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-64 shrink-0 flex flex-col py-8 px-4 border-r border-white/10 bg-white/[0.02] backdrop-blur-2xl relative z-20"
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-2 mb-10">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-400 to-brand-600 text-deep-space shadow-[0_0_15px_rgba(0,180,216,0.3)]">
            <Terminal size={20} strokeWidth={2.5} />
          </div>
          <div>
            <div className="font-display font-bold text-[16px] text-white tracking-wide">
              Jonathan<span className="text-brand-400">.</span>
            </div>
            <div className="font-mono text-[10px] text-brand-500 tracking-widest uppercase">
              Admin Panel
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-2 flex-1">
          {NAV.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin/dashboard"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-[14px] transition-all duration-300 relative overflow-hidden group ${
                  isActive 
                    ? "text-white bg-brand-500/10 border border-brand-500/20" 
                    : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-brand-400 rounded-r-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className={`transition-colors duration-300 ${isActive ? "text-brand-400" : "group-hover:text-brand-400"}`}>
                    {icon}
                  </span>
                  <span className="relative z-10">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="border-t border-white/10 pt-6 mt-6 px-2">
          <div className="font-mono text-[11px] text-white/40 mb-4 truncate flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {admin?.email || "admin@jonathan.dev"}
          </div>
          <button
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-white/50 hover:text-white hover:bg-white/5 transition-all font-medium text-[14px] border border-transparent hover:border-white/10"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </motion.aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto relative z-10 bg-gradient-to-br from-[#010214] to-[#03045e]/10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-8 lg:p-12"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
