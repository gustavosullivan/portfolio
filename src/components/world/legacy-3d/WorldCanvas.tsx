"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { GrassPlanet } from "@/components/world/GrassPlanet";
import { RpgWalker } from "@/components/world/RpgWalker";
import { SkyCycle } from "@/components/world/SkyCycle";

function Scene({ reduced, mobile }: { reduced: boolean; mobile: boolean }) {
  return (
    <>
      <SkyCycle />
      <GrassPlanet />
      <RpgWalker />

      <ContactShadows
        position={[0, -2.2, 0]}
        opacity={0.4}
        scale={10}
        blur={2.5}
        far={5}
        color="#000000"
      />

      {!mobile && !reduced && (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.35}
            luminanceThreshold={0.7}
            luminanceSmoothing={0.4}
            mipmapBlur
          />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          <Vignette eskil={false} offset={0.25} darkness={0.55} />
        </EffectComposer>
      )}

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3.2}
        maxPolarAngle={Math.PI / 1.85}
        autoRotate={false}
        rotateSpeed={0.4}
      />
    </>
  );
}

export function WorldCanvas() {
  const mobile = useIsMobile();
  const reduced = usePrefersReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setActive(e.isIntersecting),
      { rootMargin: "120px", threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="h-full w-full">
      {active && (
        <Canvas
          shadows
          dpr={mobile ? [1, 1] : [1, 1.35]}
          camera={{ position: [0, 1.6, 6.2], fov: 40 }}
          gl={{
            antialias: !mobile,
            powerPreference: "high-performance",
            stencil: false,
          }}
          frameloop={active ? "always" : "never"}
        >
          <Scene reduced={reduced} mobile={mobile} />
        </Canvas>
      )}
    </div>
  );
}
