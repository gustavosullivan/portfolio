"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useDeferredMount } from "@/hooks/useDeferredMount";
import { WhenNear } from "@/components/ui/WhenNear";

const About = dynamic(
  () => import("@/components/about/About").then((m) => m.About),
  { ssr: false },
);
const TechStack = dynamic(
  () => import("@/components/tech/TechStack").then((m) => m.TechStack),
  { ssr: false },
);
const Projects = dynamic(
  () => import("@/components/projects/Projects").then((m) => m.Projects),
  { ssr: false },
);
const Certificates = dynamic(
  () =>
    import("@/components/certificates/Certificates").then(
      (m) => m.Certificates,
    ),
  { ssr: false },
);
const Contact = dynamic(
  () => import("@/components/contact/Contact").then((m) => m.Contact),
  { ssr: false },
);
const WorldStage = dynamic(
  () => import("@/components/world/WorldStage").then((m) => m.WorldStage),
  { ssr: false },
);
const Footer = dynamic(
  () => import("@/components/footer/Footer").then((m) => m.Footer),
  { ssr: false },
);
const CommandPalette = dynamic(
  () =>
    import("@/components/ui/CommandPalette").then((m) => m.CommandPalette),
  { ssr: false },
);
const ScrollExperience = dynamic(
  () =>
    import("@/components/ui/ScrollExperience").then((m) => m.ScrollExperience),
  { ssr: false },
);

/**
 * Sections that sit on the shared hero galaxy.
 */
export function HomeMid() {
  const idleMid = useDeferredMount({ timeoutMs: 900 });
  const [forceMid, setForceMid] = useState(false);

  useEffect(() => {
    const bump = () => {
      const hash = window.location.hash.replace("#", "");
      if (
        hash &&
        ["about", "tech", "projects", "certificates", "contact"].includes(hash)
      ) {
        setForceMid(true);
      }
    };
    bump();
    window.addEventListener("hashchange", bump);
    return () => window.removeEventListener("hashchange", bump);
  }, []);

  const midReady = idleMid || forceMid;

  if (!midReady) {
    return (
      <div className="min-h-[220vh] bg-transparent" aria-hidden data-deferred="mid">
        <div id="about" />
        <div id="tech" className="mt-[40vh]" />
        <div id="projects" className="mt-[40vh]" />
        <div id="certificates" className="mt-[40vh]" />
        <div id="contact" className="mt-[40vh]" />
      </div>
    );
  }

  return (
    <div className="[text-shadow:0_1px_2px_rgba(0,0,0,0.95),0_0_14px_rgba(0,0,0,0.75)]">
      <About />
      <TechStack />
      <Projects />
      <Certificates />
      <Contact />
    </div>
  );
}

/**
 * Anime + footer — outside the galaxy so WebGL stops before the parade.
 */
export function HomeAfterFold() {
  const chromeReady = useDeferredMount({ timeoutMs: 1600 });

  return (
    <>
      {chromeReady ? <CommandPalette /> : null}

      <WhenNear
        rootMargin="400px 0px"
        minHeight="min(88vh, 720px)"
        id="world"
        className="relative z-10 bg-black"
      >
        <WorldStage />
      </WhenNear>

      <WhenNear rootMargin="200px 0px">
        <div className="relative z-10 bg-[#0a1a0c]">
          <Footer />
        </div>
      </WhenNear>

      {chromeReady ? <ScrollExperience /> : null}
    </>
  );
}
