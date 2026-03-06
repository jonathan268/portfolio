import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to:"/admin/dashboard",  icon:"📊", label:"Dashboard" },
  { to:"/admin/projects",   icon:"🚀", label:"Projets" },
  { to:"/admin/blog",       icon:"✍️", label:"Blog" },
  { to:"/admin/skills",     icon:"⚡", label:"Stack" },
  { to:"/admin/messages",   icon:"📬", label:"Messages" },
];

export default function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate          = useNavigate();

  const handleLogout = () => { logout(); navigate("/admin"); };

  return (
    <div className="flex min-h-screen" style={{ background:"#0e0822" }}>

      {/* ── Sidebar ── */}
      <aside
        className="w-56 shrink-0 flex flex-col py-7 px-3.5 border-r border-primary/10"
        style={{ background:"#120a2e" }}
      >
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-2.5 mb-9">
          <div className="btn btn-primary btn-square btn-sm" style={{ borderRadius:9, fontSize:14, minHeight:"unset", width:34, height:34 }}>J</div>
          <div>
            <div className="font-ubuntu font-bold text-[15px] text-base-content/90">Jonathan</div>
            <div className="font-mono text-[10px] text-white/30 tracking-[1px]">Admin Panel</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {NAV.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin/dashboard"}
              className={({ isActive }) => `admin-link${isActive ? " active" : ""}`}
            >
              <span className="text-[17px]">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="border-t border-white/5 pt-4 mt-4 px-2">
          <div className="font-mono text-[11px] text-white/30 mb-3 truncate">{admin?.email}</div>
          <button
            className="btn btn-sm btn-ghost w-full justify-start gap-2 text-white/40 hover:text-white/70 hover:bg-white/5"
            style={{ fontFamily:"Ubuntu, sans-serif" }}
            onClick={handleLogout}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
