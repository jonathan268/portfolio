import { lazy, Suspense, useState, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import SplashScreen from "./components/SplashScreen";

const Home = lazy(() => import("./pages/Home"));
const ProjectsPage = lazy(() => import("./pages/ProjectsPage"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail"));
const BlogPostPage = lazy(() => import("./pages/BlogPost"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
const AdminBlog = lazy(() => import("./pages/admin/AdminBlog"));
const AdminSkills = lazy(() => import("./pages/admin/AdminSkills"));
const AdminMessages = lazy(() => import("./pages/admin/AdminMessages"));
const AdminComments = lazy(() => import("./pages/admin/AdminComments"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-deep-space">
    <span className="w-8 h-8 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
  </div>
);

export default function App() {
  const [ready, setReady] = useState(false);
  const finish = useCallback(() => setReady(true), []);

  return (
    <>
      {!ready && <SplashScreen onFinish={finish} />}
      <AuthProvider>
        <Navbar />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/admin" element={<AdminLogin />} />
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </>
  );
}
