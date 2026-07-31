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

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    float n = noise(uv * 2.4 + vec2(uTime * 0.05, -uTime * 0.03));
    float n2 = noise(uv * 5.0 - uTime * 0.08);
    float glow = exp(-length(uv * vec2(0.9, 1.15)) * 1.35);

    vec3 voidCol = vec3(0.01, 0.005, 0.02);
    vec3 magenta = vec3(0.95, 0.08, 0.55);
    vec3 acid = vec3(0.45, 1.0, 0.2);
    vec3 cyan = vec3(0.15, 0.75, 1.0);

    vec3 col = mix(voidCol, magenta, n * glow * 0.95);
    col = mix(col, cyan, n2 * glow * 0.45);
    col += acid * pow(glow, 3.2) * 0.18;
    col += magenta * pow(1.0 - abs(uv.y), 4.0) * 0.12;

    float scan = sin((uv.y + uTime * 0.15) * 90.0) * 0.015;
    col += scan;

    gl_FragColor = vec4(col, 0.7);
  }
`;

export function NebulaPlane() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
    if (material.current) {
      material.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, 0, -5]} scale={[16, 9, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
