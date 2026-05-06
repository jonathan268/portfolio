import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import ProjectsPage from "./pages/ProjectsPage";
import BlogPostPage from "./pages/BlogPost";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminSkills from "./pages/admin/AdminSkills";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminComments from "./pages/admin/AdminComments";

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <Routes>
        {/* ── Public ── */}
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />

        {/* ── Admin login ── */}
        <Route path="/admin" element={<AdminLogin />} />

        {/* ── Admin dashboard (protected) ── */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="comments" element={<AdminComments />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>

        {/* ── 404 ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
