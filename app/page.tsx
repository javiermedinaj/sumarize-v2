import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { LogoMarquee } from "@/components/LogoMarquee";
import { WebAppSection } from "@/components/WebAppSection";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <WebAppSection />
        <LogoMarquee />
      </main>
      <Footer />
    </>
  );
}
