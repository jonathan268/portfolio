import { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import api from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem("admin_token");
    if (!token) { setLoading(false); return; }
    api.get("/auth/me", { signal: controller.signal })
      .then(res => setAdmin(res.data.data))
      .catch(() => {
        if (!controller.signal.aborted) localStorage.removeItem("admin_token");
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    const { token, email: adminEmail } = res.data.data;
    localStorage.setItem("admin_token", token);
    setAdmin({ email: adminEmail });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("admin_token");
    setAdmin(null);
  }, []);

  const value = useMemo(() => ({ admin, loading, login, logout }), [admin, loading, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
