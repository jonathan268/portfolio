import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          motion: ["framer-motion"],
          icons: ["lucide-react"],
          admin: [
            "./src/pages/admin/AdminLogin.jsx",
            "./src/pages/admin/AdminLayout.jsx",
            "./src/pages/admin/AdminDashboard.jsx",
            "./src/pages/admin/AdminProjects.jsx",
            "./src/pages/admin/AdminBlog.jsx",
            "./src/pages/admin/AdminSkills.jsx",
            "./src/pages/admin/AdminMessages.jsx",
            "./src/pages/admin/AdminComments.jsx",
          ],
        },
      },
    },
  },
});
