"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying float vElevate;

  void main() {
    vUv = uv;
    vec3 pos = position;
    float wave = sin(pos.x * 1.8 + uTime * 0.6) * cos(pos.y * 1.4 - uTime * 0.4);
    pos.z += wave * 0.12;
    vElevate = wave;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;
  varying float vElevate;

  void main() {
    float gridX = abs(fract(vUv.x * 24.0) - 0.5);
    float gridY = abs(fract(vUv.y * 24.0) - 0.5);
    float line = smoothstep(0.05, 0.0, min(gridX, gridY));
    float pulse = 0.45 + 0.55 * sin(uTime + vUv.x * 6.0 + vElevate * 4.0);

    vec3 magenta = vec3(1.0, 0.2, 0.75);
    vec3 cyan = vec3(0.25, 0.85, 1.0);
    vec3 col = mix(magenta, cyan, vUv.y) * line * pulse;

    float edge = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x)
               * smoothstep(0.0, 0.15, vUv.y) * smoothstep(1.0, 0.85, vUv.y);

    gl_FragColor = vec4(col, line * 0.35 * edge);
  }
`;

export function HoloGrid({
  position = [0, -1.8, 0] as [number, number, number],
  rotation = [-Math.PI / 2.4, 0, 0] as [number, number, number],
}) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
    if (material.current) {
      material.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={position} rotation={rotation} scale={[8, 8, 1]}>
      <planeGeometry args={[1, 1, 48, 48]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
