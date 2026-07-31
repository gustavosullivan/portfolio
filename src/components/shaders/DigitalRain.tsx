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

  float hash(float n) {
    return fract(sin(n) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    float cols = 42.0;
    float col = floor(uv.x * cols);
    float speed = 0.35 + hash(col) * 1.4;
    float y = fract(uv.y + uTime * speed + hash(col * 1.7));
    float glyph = step(0.86, fract(sin(floor(y * 28.0 + col) * 12.9898) * 43758.5453));
    float fade = smoothstep(0.0, 0.35, y) * (1.0 - smoothstep(0.7, 1.0, y));

    vec3 colA = vec3(0.15, 1.0, 0.35);
    vec3 colB = vec3(1.0, 0.15, 0.7);
    vec3 color = mix(colA, colB, hash(col * 3.1));
    float alpha = glyph * fade * 0.22;

    gl_FragColor = vec4(color, alpha);
  }
`;

export function DigitalRain({
  position = [0, 0, -3.2] as [number, number, number],
}) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
    if (material.current) {
      material.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={position} scale={[14, 8, 1]}>
      <planeGeometry args={[1, 1]} />
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
