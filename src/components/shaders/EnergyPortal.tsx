"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv - 0.5;
    float r = length(uv);
    float a = atan(uv.y, uv.x);

    float ring = smoothstep(0.42, 0.38, r) * smoothstep(0.28, 0.34, r);
    float pulse = 0.55 + 0.45 * sin(uTime * 2.2 + r * 12.0);
    float swirl = sin(a * 6.0 - uTime * 2.5 + r * 18.0) * 0.5 + 0.5;
    float core = exp(-r * 8.0) * (0.6 + 0.4 * sin(uTime * 3.0));

    vec3 magenta = vec3(1.0, 0.12, 0.72);
    vec3 acid = vec3(0.48, 1.0, 0.22);
    vec3 cyan = vec3(0.2, 0.85, 1.0);

    vec3 col = magenta * ring * pulse;
    col += acid * swirl * ring * 0.65;
    col += cyan * core;
    col += magenta * pow(1.0 - smoothstep(0.0, 0.5, r), 3.0) * 0.25;

    float alpha = clamp(ring * 1.4 + core * 0.9, 0.0, 1.0);
    gl_FragColor = vec4(col, alpha);
  }
`;

export function EnergyPortal({
  position = [0, 0, -1.5] as [number, number, number],
  scale = 2.4,
}) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
    if (material.current) {
      material.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={position} scale={scale}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
