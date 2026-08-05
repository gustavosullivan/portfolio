"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { usePrefersReducedMotion, useIsMobile } from "@/hooks/useMediaQuery";
import { HyperspacePlane } from "@/components/shaders/HyperspacePlane";
import {
  HyperspaceLines,
  HyperspaceStreaks,
  RealisticStars,
} from "@/components/three/HyperspaceStreaks";

function CameraRig({ reduced }: { reduced: boolean }) {
  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    const x = state.pointer.x * 0.28 + Math.sin(t * 0.1) * 0.06;
    const y = 0.15 + state.pointer.y * 0.12;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, x, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, y, 0.05);
    state.camera.lookAt(0, 0.1, 0);
  });
  return null;
}

function SceneContent({
  reduced,
  mobile,
}: {
  reduced: boolean;
  mobile: boolean;
}) {
  const light = !mobile && !reduced;

  return (
    <>
      <color attach="background" args={["#000000"]} />

      <RealisticStars count={mobile ? 40 : reduced ? 90 : 120} />
      <HyperspacePlane warp={mobile ? 0.45 : reduced ? 0.45 : 1.0} />
      {light && <HyperspaceLines count={18} />}
      {light && <HyperspaceStreaks count={24} />}

      <CameraRig reduced={reduced || mobile} />
    </>
  );
}

/**
 * Hero-only galaxy — pauses WebGL when offscreen.
 */
export function HeroCanvas() {
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const root = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && !document.hidden),
      { rootMargin: "40px 0px", threshold: 0.01 },
    );
    io.observe(el);

    const onVis = () => {
      const rect = el.getBoundingClientRect();
      const onScreen = rect.bottom > 0 && rect.top < window.innerHeight;
      setVisible(onScreen && !document.hidden);
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div
      ref={root}
      className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden"
    >
      <Canvas
        dpr={mobile ? [1, 1] : [1, 1.15]}
        camera={{ position: [0, 0.2, 5.0], fov: 42 }}
        gl={{
          antialias: !mobile,
          alpha: false,
          powerPreference: mobile ? "low-power" : "high-performance",
          stencil: false,
          depth: true,
        }}
        frameloop={visible ? "always" : "never"}
        performance={{ min: mobile ? 0.35 : 0.5 }}
        style={{ width: "100%", height: "100%" }}
      >
        <SceneContent reduced={reduced} mobile={mobile} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.55)_90%)]" />
      <div className="pointer-events-none absolute inset-0 bg-black/20" />
    </div>
  );
}
