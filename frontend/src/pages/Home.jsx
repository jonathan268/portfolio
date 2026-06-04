import HeroSection    from "../sections/HeroSection";
import SkillsSection  from "../sections/SkillsSection";
import ProjectsSection from "../sections/ProjectsSection";
import BlogSection    from "../sections/BlogSection";
import ContactSection from "../sections/ContactSection";
import NewsletterSection from "../sections/NewsletterSection";
import Footer         from "../components/Footer";

const Divider = () => <div className="sw-divider" />;

export default function Home() {
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
