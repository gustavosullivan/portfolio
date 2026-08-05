import { Navigation } from "@/components/nav/Navigation";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { AboutGalaxyBand } from "@/components/about/AboutGalaxyBand";
import { TechStack } from "@/components/tech/TechStack";
import { Projects } from "@/components/projects/Projects";
import { Certificates } from "@/components/certificates/Certificates";
import { Contact } from "@/components/contact/Contact";
import { WorldStage } from "@/components/world/WorldStage";
import { Footer } from "@/components/footer/Footer";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { ScrollExperience } from "@/components/ui/ScrollExperience";

export default function HomePage() {
  return (
    <>
      <CommandPalette />
      <Navigation />
      <main className="relative z-10 bg-black">
        <Hero />
        <AboutGalaxyBand>
          <About />
          <TechStack />
          <Projects />
          <Certificates />
          <Contact />
        </AboutGalaxyBand>
        <WorldStage />
      </main>
      <div className="relative z-10 bg-[#0a1a0c]">
        <Footer />
      </div>
      <ScrollExperience />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Gustavo Barbosa Portela",
            jobTitle: "Desenvolvedor Full Stack",
            url: "https://github.com/gustavosullivan/portfolio",
            email: "mailto:gubportela@gmail.com",
            sameAs: [
              "https://github.com/gustavosullivan",
              "https://www.linkedin.com/in/gustavobportelacc",
            ],
            address: {
              "@type": "PostalAddress",
              addressLocality: "Passo Fundo",
              addressCountry: "BR",
            },
          }),
        }}
      />
    </>
  );
}
