"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PLANET_RADIUS } from "@/components/world/GrassPlanet";

/** Low-poly RPG wanderer with sword — walks around the planet */
export function RpgWalker() {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Mesh>(null);
  const rightLeg = useRef<THREE.Mesh>(null);
  const leftArm = useRef<THREE.Mesh>(null);
  const rightArm = useRef<THREE.Mesh>(null);
  const sword = useRef<THREE.Group>(null);

  const orbit = useRef(0);
  const elev = 0.42;
  const speed = 0.55;

  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const quat = useMemo(() => new THREE.Quaternion(), []);
  const pos = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    orbit.current = t * speed;

    const a = orbit.current;
    const r = PLANET_RADIUS + 0.12;
    pos.set(
      Math.cos(a) * Math.cos(elev) * r,
      Math.sin(elev) * r,
      Math.sin(a) * Math.cos(elev) * r,
    );

    // Surface normal = outward
    const normal = pos.clone().normalize();
    // Tangent forward along orbit
    look.set(-Math.sin(a) * Math.cos(elev), 0, Math.cos(a) * Math.cos(elev)).normalize();

    quat.setFromUnitVectors(up, normal);
    if (root.current) {
      root.current.position.copy(pos);
      root.current.quaternion.copy(quat);
      // Face travel direction in local frame
      const localForward = look.clone().applyQuaternion(quat.clone().invert());
      const yaw = Math.atan2(localForward.x, localForward.z);
      if (body.current) body.current.rotation.y = yaw + Math.PI;
    }

    // Walk cycle
    const step = Math.sin(t * 8);
    const step2 = Math.sin(t * 8 + Math.PI);
    if (leftLeg.current) leftLeg.current.rotation.x = step * 0.55;
    if (rightLeg.current) rightLeg.current.rotation.x = step2 * 0.55;
    if (leftArm.current) leftArm.current.rotation.x = step2 * 0.4;
    if (rightArm.current) rightArm.current.rotation.x = step * 0.35;
    if (sword.current) {
      sword.current.rotation.z = -0.35 + step * 0.08;
      sword.current.rotation.x = 0.15 + Math.abs(step) * 0.05;
    }
    if (body.current) {
      body.current.position.y = Math.abs(step) * 0.02;
    }
  });

  return (
    <group ref={root}>
      <group ref={body}>
        {/* Torso armor */}
        <mesh position={[0, 0.22, 0]} castShadow>
          <boxGeometry args={[0.22, 0.28, 0.16]} />
          <meshStandardMaterial color="#3d4f6f" metalness={0.55} roughness={0.35} flatShading />
        </mesh>
        {/* Belt */}
        <mesh position={[0, 0.08, 0]} castShadow>
          <boxGeometry args={[0.24, 0.05, 0.17]} />
          <meshStandardMaterial color="#8b6914" metalness={0.4} roughness={0.5} />
        </mesh>
        {/* Head / helmet */}
        <mesh position={[0, 0.42, 0]} castShadow>
          <boxGeometry args={[0.16, 0.16, 0.16]} />
          <meshStandardMaterial color="#c4a574" flatShading />
        </mesh>
        <mesh position={[0, 0.48, 0]} castShadow>
          <boxGeometry args={[0.18, 0.1, 0.18]} />
          <meshStandardMaterial color="#5a6a82" metalness={0.6} roughness={0.3} flatShading />
        </mesh>
        {/* Visor glow */}
        <mesh position={[0, 0.43, 0.09]}>
          <boxGeometry args={[0.1, 0.03, 0.02]} />
          <meshStandardMaterial
            color="#7cff3a"
            emissive="#7cff3a"
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* Legs */}
        <mesh ref={leftLeg} position={[-0.06, -0.02, 0]} castShadow>
          <boxGeometry args={[0.07, 0.22, 0.08]} />
          <meshStandardMaterial color="#2a3344" flatShading />
        </mesh>
        <mesh ref={rightLeg} position={[0.06, -0.02, 0]} castShadow>
          <boxGeometry args={[0.07, 0.22, 0.08]} />
          <meshStandardMaterial color="#2a3344" flatShading />
        </mesh>

        {/* Arms */}
        <mesh ref={leftArm} position={[-0.16, 0.22, 0]} castShadow>
          <boxGeometry args={[0.06, 0.2, 0.06]} />
          <meshStandardMaterial color="#3d4f6f" flatShading />
        </mesh>
        <mesh ref={rightArm} position={[0.16, 0.22, 0]} castShadow>
          <boxGeometry args={[0.06, 0.2, 0.06]} />
          <meshStandardMaterial color="#3d4f6f" flatShading />
        </mesh>

        {/* Sword in right hand */}
        <group ref={sword} position={[0.2, 0.12, 0.05]} rotation={[0.2, 0, -0.4]}>
          <mesh position={[0, 0.05, 0]} castShadow>
            <boxGeometry args={[0.035, 0.1, 0.035]} />
            <meshStandardMaterial color="#4a3020" />
          </mesh>
          <mesh position={[0, 0.12, 0]}>
            <boxGeometry args={[0.1, 0.03, 0.03]} />
            <meshStandardMaterial color="#c9a227" metalness={0.8} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.38, 0]} castShadow>
            <boxGeometry args={[0.04, 0.48, 0.01]} />
            <meshStandardMaterial
              color="#d8e0ea"
              metalness={0.9}
              roughness={0.15}
              emissive="#a0b0c8"
              emissiveIntensity={0.15}
            />
          </mesh>
          {/* Blade tip */}
          <mesh position={[0, 0.64, 0]} rotation={[0, 0, 0]}>
            <coneGeometry args={[0.025, 0.08, 4]} />
            <meshStandardMaterial color="#e8eef5" metalness={0.9} roughness={0.12} />
          </mesh>
        </group>

        {/* Cape */}
        <mesh position={[0, 0.2, -0.1]} rotation={[0.25, 0, 0]} castShadow>
          <boxGeometry args={[0.2, 0.32, 0.02]} />
          <meshStandardMaterial color="#8b1e2d" flatShading roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}
