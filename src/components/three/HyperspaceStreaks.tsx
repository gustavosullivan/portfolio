"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/** Soft twinkling 3D starfield behind the streaks */
export function RealisticStars({ count = 900 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 18 + Math.random() * 40;
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi) - 8;

      const tone = Math.random();
      if (tone < 0.55) {
        colors[i * 3] = 0.85 + Math.random() * 0.15;
        colors[i * 3 + 1] = 0.9 + Math.random() * 0.1;
        colors[i * 3 + 2] = 1.0;
      } else if (tone < 0.85) {
        colors[i * 3] = 1.0;
        colors[i * 3 + 1] = 0.94 + Math.random() * 0.06;
        colors[i * 3 + 2] = 0.82 + Math.random() * 0.1;
      } else {
        colors[i * 3] = 0.7 + Math.random() * 0.15;
        colors[i * 3 + 1] = 0.82 + Math.random() * 0.1;
        colors[i * 3 + 2] = 1.0;
      }

      sizes[i] = 0.4 + Math.random() * 2.2;
    }

    return { positions, colors, sizes };
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, colors, sizes]);

  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.PointsMaterial;
    // Subtle collective twinkle via opacity pulse
    mat.opacity = 0.7 + Math.sin(state.clock.elapsedTime * 0.7) * 0.08;
    ref.current.rotation.y = state.clock.elapsedTime * 0.008;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        vertexColors
        size={0.08}
        sizeAttenuation
        transparent
        opacity={0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Bright points rushing past the camera */
export function HyperspaceStreaks({ count = 220 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.15 + Math.random() * 9;
      positions[i * 3] = Math.cos(a) * r;
      positions[i * 3 + 1] = Math.sin(a) * r * 0.52;
      positions[i * 3 + 2] = -1 - Math.random() * 16;
      velocities[i] = 14 + Math.random() * 36;
    }

    return { positions, velocities };
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;

    for (let i = 0; i < count; i++) {
      arr[i * 3 + 2] += velocities[i] * delta;
      const expand = 1 + delta * 0.35;
      arr[i * 3] *= expand;
      arr[i * 3 + 1] *= expand;

      if (arr[i * 3 + 2] > 5) {
        const a = Math.random() * Math.PI * 2;
        const r = 0.1 + Math.random() * 2.5;
        arr[i * 3] = Math.cos(a) * r;
        arr[i * 3 + 1] = Math.sin(a) * r * 0.52;
        arr[i * 3 + 2] = -14 - Math.random() * 8;
      }
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        color="#ffffff"
        size={0.036}
        sizeAttenuation
        transparent
        opacity={0.72}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/** Long white light trails flying toward the camera */
export function HyperspaceLines({ count = 110 }: { count?: number }) {
  const group = useRef<THREE.Group>(null);

  const lines = useMemo(() => {
    return Array.from({ length: count }).map(() => {
      const a = Math.random() * Math.PI * 2;
      const r = 0.4 + Math.random() * 6.5;
      return {
        a,
        r,
        z: -3 - Math.random() * 14,
        len: 1.2 + Math.random() * 5.5,
        speed: 16 + Math.random() * 42,
        opacity: 0.4 + Math.random() * 0.5,
        thickness: 0.004 + Math.random() * 0.01,
      };
    });
  }, [count]);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.children.forEach((child, i) => {
      const data = lines[i];
      if (!data || !(child instanceof THREE.Mesh)) return;

      child.position.z += data.speed * delta;
      const rush = 1 + delta * (0.8 + data.speed * 0.02);
      child.position.x *= rush;
      child.position.y *= rush;
      const proximity = THREE.MathUtils.clamp((child.position.z + 14) / 18, 0, 1);
      child.scale.z = data.len * (0.6 + proximity * 2.2);

      if (child.position.z > 6) {
        data.a = Math.random() * Math.PI * 2;
        data.r = 0.25 + Math.random() * 2.2;
        child.position.x = Math.cos(data.a) * data.r;
        child.position.y = Math.sin(data.a) * data.r * 0.52;
        child.position.z = -16 - Math.random() * 6;
        child.scale.z = data.len * 0.5;
      }
    });
  });

  return (
    <group ref={group}>
      {lines.map((line, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(line.a) * line.r,
            Math.sin(line.a) * line.r * 0.52,
            line.z,
          ]}
          scale={[1, 1, line.len]}
        >
          <boxGeometry args={[line.thickness, line.thickness, 1]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={line.opacity * 0.7}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}
