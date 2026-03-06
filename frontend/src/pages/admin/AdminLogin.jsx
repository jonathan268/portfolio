import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const { login }               = useAuth();
  const navigate                = useNavigate();

  const submit = async () => {
    if (!email || !password) { toast.error("Identifiants requis."); return; }
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Identifiants incorrects.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background:"#120a2e" }}>
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="btn btn-primary btn-square mx-auto mb-4" style={{ width:52, height:52, fontSize:22, borderRadius:14 }}>J</div>
          <h1 className="font-ubuntu font-bold text-[22px] text-base-content/90">Admin</h1>
          <p className="font-mono text-[11px] text-white/30 tracking-[2px] mt-1">PORTFOLIO DASHBOARD</p>
        </div>

        {/* Card */}
        <div className="sw-card p-8">
          <div className="flex flex-col gap-4">

            <div>
              <label className="font-mono text-[11px] text-primary tracking-[1px] uppercase block mb-2">Email</label>
              <input
                type="email"
                className="sw-input"
                placeholder="admin@portfolio.cm"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submit()}
              />
            </div>

            <div>
              <label className="font-mono text-[11px] text-primary tracking-[1px] uppercase block mb-2">Mot de passe</label>
              <input
                type="password"
                className="sw-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submit()}
              />
            </div>

            <button
              className="btn btn-primary w-full rounded-[10px] mt-2"
              onClick={submit}
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner loading-sm" /> : "Se connecter"}
            </button>
          </div>
        </div>

        <p className="text-center font-mono text-[11px] text-white/15 mt-6">
          Accès réservé · Jonathan Portfolio
        </p>
      </div>
    </div>
  );
}
