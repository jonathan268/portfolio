import HeroSection    from "../sections/HeroSection";
import SkillsSection  from "../sections/SkillsSection";
import ProjectsSection from "../sections/ProjectsSection";
import BlogSection    from "../sections/BlogSection";
import ContactSection from "../sections/ContactSection";
import NewsletterSection from "../sections/NewsletterSection";
import Footer         from "../components/Footer";
import useSEO from "../hooks/useSEO";

const Divider = () => <div className="sw-divider" />;

const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Jonathan",
  "givenName": "Jonathan",
  "jobTitle": "Fullstack Developer",
  "description": "Développeur fullstack basé à Yaoundé, Cameroun. Spécialisé en React, Node.js, Express et Laravel.",
  "url": "https://jonathan.cm",
  "sameAs": ["https://github.com/jonathan268"],
  "knowsAbout": ["React", "Node.js", "Express", "Laravel", "MongoDB", "MySQL", "Docker"],
  "worksFor": { "@type": "Organization", "name": "Freelance" },
  "homeLocation": {
    "@type": "Place",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Yaoundé",
      "addressCountry": "CM"
    }
  }
};

export default function Home() {
  useSEO({
    title: "Portfolio Fullstack Developer Yaoundé Cameroun",
    description: "Développeur fullstack basé à Yaoundé. React, Node.js, Laravel — création d'applications web, API REST et SaaS performants au Cameroun.",
    jsonLd: PERSON_SCHEMA,
  });

  return (
    <main>
      <HeroSection />
      <Divider />
      <SkillsSection />
      <Divider />
      <ProjectsSection />
      <Divider />
      <BlogSection />
      <Divider />
      <ContactSection />
      <Divider />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
