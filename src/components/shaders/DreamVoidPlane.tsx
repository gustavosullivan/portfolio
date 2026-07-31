"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Original dream-void backdrop inspired by the existential / ink-on-parchment
 * mood of Life Is But A Dream… — not a copy of Wes Lang's artwork.
 */
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
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
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

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.05;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = (uv - 0.5) * vec2(1.6, 1.0);

    // Parchment / dream base (beige → dusty rose)
    vec3 parchment = vec3(0.91, 0.86, 0.76);
    vec3 rose = vec3(0.78, 0.55, 0.58);
    vec3 voidInk = vec3(0.05, 0.04, 0.06);
    vec3 softPink = vec3(0.92, 0.72, 0.78);

    float n = fbm(p * 2.2 + vec2(uTime * 0.03, -uTime * 0.02));
    float strokes = fbm(p * 4.5 + n * 1.8 + uTime * 0.015);
    float blot = smoothstep(0.42, 0.72, strokes);
    float horizon = smoothstep(0.15, 0.85, uv.y);

    vec3 col = mix(parchment, softPink, horizon * 0.55);
    col = mix(col, rose, n * 0.35);
    // Ink brush clouds — existential void bleeding into the dream
    col = mix(col, voidInk, blot * (0.55 + 0.25 * sin(uTime * 0.2 + p.x)));

    // Soft vignette of infinite dream
    float vignette = smoothstep(1.15, 0.25, length(p));
    col = mix(voidInk, col, vignette);

    // Floating ash / dust sparkle
    float dust = step(0.97, hash(floor(uv * 90.0 + uTime * 0.4)));
    col += dust * softPink * 0.35;

    // Slow light bloom near center
    float glow = exp(-length(p * vec2(1.0, 1.3)) * 1.8);
    col += rose * glow * 0.18;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function DreamVoidPlane() {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  useFrame((state) => {
    if (material.current) {
      material.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, 0, -6]} scale={[18, 10, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        depthWrite={false}
      />
    </mesh>
  );
}
