import { Navigation } from "@/components/nav/Navigation";
import { Hero } from "@/components/hero/Hero";
import { HomeAfterFold, HomeMid } from "@/components/home/HomeBelowFold";
import { GalaxyShell } from "@/components/home/GalaxyShell";

export default function HomePage() {
  return (
    <>
      <Navigation />
      <main className="relative z-10 bg-black">
        <GalaxyShell>
          <Hero />
          <HomeMid />
        </GalaxyShell>
        <HomeAfterFold />
      </main>
    </>
  );
}
