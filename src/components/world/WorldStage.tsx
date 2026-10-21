"use client";

import { AnimeParade } from "@/components/world/AnimeParade";

export function WorldStage() {
  return (
    <section
      className="relative z-10"
      aria-label="Cena ilustrativa — caminhada no mundo"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-20 bg-gradient-to-b from-[#03050c] to-transparent md:h-28" />
      <AnimeParade />
    </section>
  );
}
