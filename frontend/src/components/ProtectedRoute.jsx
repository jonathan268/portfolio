import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background:"#120a2e" }}>
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  return admin ? children : <Navigate to="/admin" replace />;
}
