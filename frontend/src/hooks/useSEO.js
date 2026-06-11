import { useEffect } from "react";

export default function useSEO({ title, description, jsonLd } = {}) {
  useEffect(() => {
    const base = "Jonathan — Fullstack Developer";
    document.title = title ? `${title} | ${base}` : base;
  }, [title]);

  useEffect(() => {
    if (!description) return;
    let meta = document.querySelector("meta[name='description']");
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
    return () => {
      const og = document.querySelector("meta[name='description']");
      if (og) {
        og.setAttribute("content",
          "Développeur fullstack basé à Yaoundé, spécialisé dans la création d'applications web, d'API et de dashboards modernes."
        );
      }
    };
  }, [description]);

  useEffect(() => {
    if (!jsonLd) return;
    const id = "seo-schema";
    const existing = document.getElementById(id);
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.id = id;
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(jsonLd);
    document.head.appendChild(script);
    return () => {
      const el = document.getElementById(id);
      if (el) el.remove();
    };
  }, [jsonLd]);
}
