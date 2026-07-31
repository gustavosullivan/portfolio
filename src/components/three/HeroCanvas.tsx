"use client";

import { useFrame, Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
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

      <RealisticStars count={mobile ? 120 : reduced ? 160 : 260} />
      <HyperspacePlane warp={mobile ? 1.0 : reduced ? 0.55 : 1.3} />
      {light && <HyperspaceLines count={50} />}
      {light && <HyperspaceStreaks count={70} />}

      <CameraRig reduced={reduced || mobile} />

      {light && (
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.5}
            luminanceThreshold={0.45}
            luminanceSmoothing={0.45}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.22} darkness={0.9} />
        </EffectComposer>
      )}
    </>
  );
}

/**
 * Hero-only galaxy — clipped to the first viewport.
 * Always keeps the WebGL loop running (never unmounts).
 */
export function HeroCanvas() {
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();

  return (
    <div className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden">
      <Canvas
        dpr={mobile ? [1, 1] : [1, 1.2]}
        camera={{ position: [0, 0.2, 5.0], fov: 42 }}
        gl={{
          antialias: !mobile,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        frameloop="always"
        // Keep rendering even if tab/compositor gets busy during scrollbar drag
        performance={{ min: 0.5 }}
        style={{ width: "100%", height: "100%" }}
      >
        <SceneContent reduced={reduced} mobile={mobile} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.55)_90%)]" />
      <div className="pointer-events-none absolute inset-0 bg-black/20" />
    </div>
  );
}
