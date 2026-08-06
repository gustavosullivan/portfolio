import { Navigation } from "@/components/nav/Navigation";
import { Hero } from "@/components/hero/Hero";
import { HomeBelowFold } from "@/components/home/HomeBelowFold";

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main className="relative z-10 bg-black">
        <Hero />
        <HomeBelowFold />
      </main>
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
