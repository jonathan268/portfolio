import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../api";

export default function useTracking() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;
    api.post("/analytics/track", { path: pathname }).catch(() => {});
  }, [pathname]);
}
