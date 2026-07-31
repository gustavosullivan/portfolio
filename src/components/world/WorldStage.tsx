"use client";

import { AnimeParade } from "@/components/world/AnimeParade";

export function WorldStage() {
  return (
    <section
      id="world"
      className="relative z-10 bg-transparent"
      aria-label="Cena anime 2D"
    >
      {/* Altitude climb — starfield above dissolves into the meadow */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-32 h-32 bg-gradient-to-b from-transparent via-black/20 to-transparent md:-top-40 md:h-40"
        aria-hidden
      />
      <AnimeParade />
    </section>
  );
}
