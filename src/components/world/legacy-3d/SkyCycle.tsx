"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars, Cloud, Clouds } from "@react-three/drei";
import * as THREE from "three";

/** Day → dusk → night cycle with sun/moon orbit */
export function SkyCycle() {
  const sun = useRef<THREE.Mesh>(null);
  const moon = useRef<THREE.Mesh>(null);
  const sunLight = useRef<THREE.DirectionalLight>(null);
  const moonLight = useRef<THREE.DirectionalLight>(null);
  const hemi = useRef<THREE.HemisphereLight>(null);

  const dayColor = useMemo(() => new THREE.Color("#87b7ff"), []);
  const duskColor = useMemo(() => new THREE.Color("#ff7a4d"), []);
  const nightColor = useMemo(() => new THREE.Color("#050818"), []);
  const tmp = useMemo(() => new THREE.Color(), []);

  const fog = useMemo(() => new THREE.Fog("#050818", 6, 18), []);

  useFrame((state) => {
    // Full day cycle ~40s
    const cycle = (state.clock.elapsedTime * 0.08) % (Math.PI * 2);
    const sunX = Math.cos(cycle) * 8;
    const sunY = Math.sin(cycle) * 6;
    const moonX = Math.cos(cycle + Math.PI) * 7;
    const moonY = Math.sin(cycle + Math.PI) * 5.5;

    if (sun.current) sun.current.position.set(sunX, sunY, 2);
    if (moon.current) moon.current.position.set(moonX, moonY, -1);

    const dayFactor = THREE.MathUtils.clamp(sunY / 5, 0, 1);
    const dusk = Math.max(0, 1 - Math.abs(sunY) / 2.5) * (sunY > -1 ? 1 : 0);

    if (sunLight.current) {
      sunLight.current.position.set(sunX, Math.max(sunY, 0.2), 3);
      sunLight.current.intensity = 0.25 + dayFactor * 1.6;
      sunLight.current.color.setHSL(0.12, 0.35, 0.55 + dayFactor * 0.35);
    }
    if (moonLight.current) {
      moonLight.current.position.set(moonX, Math.max(moonY, 0.2), -2);
      moonLight.current.intensity = (1 - dayFactor) * 0.45;
    }
    if (hemi.current) {
      hemi.current.intensity = 0.25 + dayFactor * 0.45;
      tmp.copy(dayColor).lerp(nightColor, 1 - dayFactor);
      if (dusk > 0.1) tmp.lerp(duskColor, dusk * 0.55);
      hemi.current.color.copy(tmp);
      if (state.scene.background instanceof THREE.Color) {
        state.scene.background.copy(tmp).multiplyScalar(0.35 + dayFactor * 0.4);
      } else {
        state.scene.background = tmp.clone().multiplyScalar(0.35 + dayFactor * 0.4);
      }
      fog.color.copy(tmp).multiplyScalar(0.3);
      state.scene.fog = fog;
    }
  });

  return (
    <>
      <hemisphereLight ref={hemi} args={["#87b7ff", "#3a5a2a", 0.5]} />
      <directionalLight
        ref={sunLight}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <directionalLight ref={moonLight} color="#a8c4ff" />

      <mesh ref={sun}>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshBasicMaterial color="#ffe08a" />
      </mesh>
      <mesh ref={moon}>
        <sphereGeometry args={[0.22, 12, 12]} />
        <meshStandardMaterial
          color="#e8eef5"
          emissive="#c0d0e8"
          emissiveIntensity={0.35}
          roughness={1}
        />
      </mesh>

      <Stars radius={40} depth={20} count={600} factor={2.5} fade speed={0.3} />

      <Clouds material={THREE.MeshLambertMaterial} limit={8}>
        <Cloud
          seed={2}
          segments={12}
          bounds={[4, 1, 1]}
          volume={3}
          color="#ffffff"
          fade={60}
          position={[2, 3.2, -2]}
          opacity={0.35}
          speed={0.15}
        />
        <Cloud
          seed={5}
          segments={10}
          bounds={[3, 0.8, 1]}
          volume={2}
          color="#ffd0b8"
          fade={50}
          position={[-2.5, 2.6, 1]}
          opacity={0.28}
          speed={0.12}
        />
      </Clouds>
    </>
  );
}
