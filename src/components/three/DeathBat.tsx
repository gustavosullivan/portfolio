"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Original gothic bat sculpture — inspired by metal iconography,
 * NOT a reproduction of Avenged Sevenfold's trademarked Deathbat.
 */
function createWingShape(side: 1 | -1) {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0.15);
  shape.bezierCurveTo(0.35 * side, 0.55, 0.95 * side, 0.85, 1.55 * side, 0.35);
  shape.bezierCurveTo(1.75 * side, 0.05, 1.45 * side, -0.35, 1.1 * side, -0.55);
  shape.bezierCurveTo(0.85 * side, -0.15, 0.55 * side, -0.45, 0.35 * side, -0.75);
  shape.bezierCurveTo(0.18 * side, -0.35, 0.08 * side, -0.15, 0, 0.05);
  shape.closePath();
  return shape;
}

function Wing({ side }: { side: 1 | -1 }) {
  const ref = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => {
    const shape = createWingShape(side);
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.04,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.012,
      bevelSegments: 2,
    });
  }, [side]);

  useFrame((state) => {
    if (!ref.current) return;
    const flap = Math.sin(state.clock.elapsedTime * 1.6) * 0.12;
    ref.current.rotation.y = side * (0.15 + flap);
    ref.current.rotation.z = side * (-0.08 + flap * 0.4);
  });

  return (
    <mesh ref={ref} geometry={geometry} position={[side * 0.28, 0.05, -0.05]} castShadow>
      <meshStandardMaterial
        color="#0a0a0a"
        roughness={0.45}
        metalness={0.55}
        emissive="#1a1018"
        emissiveIntensity={0.15}
      />
    </mesh>
  );
}

export function DeathBat({
  position = [0, 0.15, 0] as [number, number, number],
  scale = 1.15,
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.35) * 0.25 + state.pointer.x * 0.35;
    group.current.rotation.x = Math.sin(t * 0.4) * 0.06 + state.pointer.y * -0.12;
    group.current.position.y = position[1] + Math.sin(t * 0.9) * 0.08;
  });

  return (
    <group ref={group} position={position} scale={scale}>
      {/* Cranium */}
      <mesh position={[0, 0.22, 0]} castShadow>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial
          color="#111111"
          roughness={0.35}
          metalness={0.65}
          emissive="#2a1820"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Elongated snout / skull face */}
      <mesh position={[0, 0.02, 0.28]} rotation={[0.35, 0, 0]} castShadow>
        <boxGeometry args={[0.38, 0.28, 0.42]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* Eye sockets */}
      {([-1, 1] as const).map((s) => (
        <mesh key={`eye-${s}`} position={[s * 0.16, 0.22, 0.32]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial
            color="#050505"
            emissive="#c45c5c"
            emissiveIntensity={0.85}
            roughness={0.2}
            metalness={0.1}
          />
        </mesh>
      ))}

      {/* Pupils glow */}
      {([-1, 1] as const).map((s) => (
        <mesh key={`pupil-${s}`} position={[s * 0.16, 0.22, 0.4]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshBasicMaterial color="#ff6b6b" />
        </mesh>
      ))}

      {/* Ears / horns */}
      {([-1, 1] as const).map((s) => (
        <mesh
          key={`ear-${s}`}
          position={[s * 0.28, 0.55, -0.05]}
          rotation={[0.2, 0, s * -0.45]}
          castShadow
        >
          <coneGeometry args={[0.08, 0.38, 5]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.5} metalness={0.5} />
        </mesh>
      ))}

      {/* Jaw */}
      <mesh position={[0, -0.18, 0.22]} rotation={[0.15, 0, 0]} castShadow>
        <boxGeometry args={[0.34, 0.12, 0.32]} />
        <meshStandardMaterial color="#121212" roughness={0.45} metalness={0.55} />
      </mesh>

      {/* Fangs */}
      {([-1, 1] as const).map((s) => (
        <mesh key={`fang-${s}`} position={[s * 0.1, -0.28, 0.34]} rotation={[0.2, 0, 0]}>
          <coneGeometry args={[0.03, 0.14, 4]} />
          <meshStandardMaterial
            color="#e8dcc8"
            roughness={0.25}
            metalness={0.3}
            emissive="#e8dcc8"
            emissiveIntensity={0.15}
          />
        </mesh>
      ))}

      {/* Ribcage hint */}
      <mesh position={[0, -0.55, -0.05]} castShadow>
        <capsuleGeometry args={[0.16, 0.35, 6, 12]} />
        <meshStandardMaterial color="#0c0c0c" roughness={0.5} metalness={0.45} />
      </mesh>

      <Wing side={-1} />
      <Wing side={1} />

      {/* Soft aura */}
      <mesh scale={2.4}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color="#c45c5c" transparent opacity={0.035} depthWrite={false} />
      </mesh>
    </group>
  );
}
