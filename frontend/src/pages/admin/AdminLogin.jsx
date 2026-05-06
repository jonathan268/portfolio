import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Terminal, Lock } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center px-4 bg-deep-space relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-brand-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100, damping: 20 }}
        className="w-full max-w-sm relative z-10"
      >

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-400 to-brand-700 text-deep-space mx-auto mb-6 shadow-[0_0_20px_rgba(0,180,216,0.3)]">
            <Terminal size={28} strokeWidth={2.5} />
          </div>
          <h1 className="font-display font-bold text-[28px] text-white tracking-tight">Admin</h1>
          <p className="font-mono text-[11px] text-brand-400 tracking-[3px] uppercase mt-2">PORTFOLIO DASHBOARD</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-2xl shadow-2xl">
          <div className="flex flex-col gap-5">

            <div>
              <label className="font-mono text-[11px] text-white/60 tracking-[1px] uppercase block mb-3">Email</label>
              <input
                type="email"
                className="w-full bg-[#010214]/50 border border-white/10 rounded-xl px-5 py-3 text-white placeholder:text-white/20 outline-none focus:border-brand-500/50 focus:bg-white/5 transition-all"
                placeholder="admin@portfolio.cm"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submit()}
              />
            </div>

            <div>
              <label className="font-mono text-[11px] text-white/60 tracking-[1px] uppercase block mb-3">Mot de passe</label>
              <input
                type="password"
                className="w-full bg-[#010214]/50 border border-white/10 rounded-xl px-5 py-3 text-white placeholder:text-white/20 outline-none focus:border-brand-500/50 focus:bg-white/5 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submit()}
              />
            </div>

            <button
              className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl font-sans font-medium bg-brand-500 text-white hover:bg-brand-400 transition-colors mt-4"
              onClick={submit}
              disabled={loading}
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Lock size={18} /> Se connecter</>
              )}
            </button>
          </div>
        </div>

        <p className="text-center font-mono text-[11px] text-white/20 mt-8">
          Accès réservé · Jonathan Portfolio
        </p>
      </motion.div>
    </div>
  );
}
