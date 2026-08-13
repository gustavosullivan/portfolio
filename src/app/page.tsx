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
    </>
  );
}
