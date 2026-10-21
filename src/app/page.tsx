import { Navigation } from "@/components/nav/Navigation";
import { Hero } from "@/components/hero/Hero";
import { HomeAfterFold, HomeMid } from "@/components/home/HomeBelowFold";
import { GalaxyShell } from "@/components/home/GalaxyShell";

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main className="relative z-10 bg-[#03050c]">
        <GalaxyShell>
          <Hero />
        </GalaxyShell>
        <div
          className="pointer-events-none relative z-10 -mt-16 h-16 bg-gradient-to-b from-[#03050c] via-[#03050c] to-transparent md:-mt-24 md:h-24"
          aria-hidden
        />
        <HomeMid />
        <HomeAfterFold />
      </main>
    </>
  );
}
