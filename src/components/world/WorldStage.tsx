"use client";

import { AnimeParade } from "@/components/world/AnimeParade";

export function WorldStage() {
  return (
    <section
      className="relative z-10 bg-black"
      aria-label="Cena anime 2D"
    >
      <AnimeParade />
    </section>
  );
}
