import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

// Attach JWT token on every request if present
api.interceptors.request.use(config => {
  const token = localStorage.getItem("admin_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 && window.location.pathname.startsWith("/admin")) {
      localStorage.removeItem("admin_token");
      window.location.href = "/admin";
    }
    return Promise.reject(err);
  }
);

export default api;
