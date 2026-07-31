"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const RADIUS = 1.85;

function Tree({ position }: { position: THREE.Vector3 }) {
  const q = useMemo(() => {
    return new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      position.clone().normalize(),
    );
  }, [position]);

  return (
    <group position={position} quaternion={q}>
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.045, 0.22, 5]} />
        <meshStandardMaterial color="#4a3020" flatShading />
      </mesh>
      <mesh position={[0, 0.28, 0]} castShadow>
        <coneGeometry args={[0.15, 0.32, 6]} />
        <meshStandardMaterial color="#2f6b32" flatShading />
      </mesh>
    </group>
  );
}

export function GrassPlanet() {
  const planet = useRef<THREE.Group>(null);
  const grassRef = useRef<THREE.InstancedMesh>(null);
  const grassCount = 900;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const trees = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => {
      const a = (i / 12) * Math.PI * 2 + 0.2;
      const elev = 0.4 + (i % 4) * 0.1;
      const x = Math.cos(a) * Math.cos(elev) * RADIUS;
      const y = Math.sin(elev) * RADIUS;
      const z = Math.sin(a) * Math.cos(elev) * RADIUS;
      return new THREE.Vector3(x, y, z);
    });
  }, []);

  useFrame((state) => {
    if (planet.current) {
      planet.current.rotation.y = state.clock.elapsedTime * 0.07;
    }

    const mesh = grassRef.current;
    if (!mesh || mesh.userData.ready) return;

    for (let i = 0; i < grassCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(Math.max(-0.2, 1 - v * 1.2));
      const x = RADIUS * Math.sin(phi) * Math.cos(theta);
      const y = RADIUS * Math.cos(phi);
      const z = RADIUS * Math.sin(phi) * Math.sin(theta);

      dummy.position.set(x, y, z);
      dummy.scale.setScalar(0.7 + Math.random() * 1.1);
      dummy.lookAt(0, 0, 0);
      dummy.rotateX(Math.PI / 2);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.userData.ready = true;
  });

  return (
    <group ref={planet}>
      <mesh castShadow receiveShadow>
        <icosahedronGeometry args={[RADIUS, 4]} />
        <meshStandardMaterial color="#3f7d3c" roughness={0.88} flatShading />
      </mesh>

      <mesh scale={1.004} receiveShadow>
        <icosahedronGeometry args={[RADIUS, 2]} />
        <meshStandardMaterial
          color="#6b4423"
          roughness={1}
          flatShading
          transparent
          opacity={0.28}
        />
      </mesh>

      <mesh rotation={[0.25, 0.4, 0]} scale={[1.015, 0.52, 1.015]}>
        <sphereGeometry args={[RADIUS, 48, 24]} />
        <meshStandardMaterial
          color="#1b5278"
          roughness={0.2}
          metalness={0.35}
          transparent
          opacity={0.5}
        />
      </mesh>

      <instancedMesh
        ref={grassRef}
        args={[undefined, undefined, grassCount]}
        castShadow
      >
        <coneGeometry args={[0.018, 0.16, 3]} />
        <meshStandardMaterial color="#58b85a" flatShading roughness={0.75} />
      </instancedMesh>

      {trees.map((pos, i) => (
        <Tree key={i} position={pos} />
      ))}
    </group>
  );
}

export const PLANET_RADIUS = RADIUS;
