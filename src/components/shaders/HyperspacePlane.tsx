"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Cinematic hyperspace — realistic starfield + white lightspeed streaks.
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
  uniform float uWarp;
  varying vec2 vUv;

  float hash(float n) {
    return fract(sin(n) * 43758.5453123);
  }

  // Soft star with diffraction cross (telescope / cinematic look)
  float starShape(vec2 p, float size) {
    float d = length(p);
    float core = exp(-d * d / (size * size));
    float spikeX = exp(-abs(p.x) / (size * 0.35)) * exp(-abs(p.y) / (size * 3.5));
    float spikeY = exp(-abs(p.y) / (size * 0.35)) * exp(-abs(p.x) / (size * 3.5));
    float spikes = (spikeX + spikeY) * 0.22;
    return core + spikes * core;
  }

  void main() {
    vec2 uv = vUv - 0.5;
    uv.x *= 1.75;
    uv.y *= 1.05;

    float r = length(uv);
    vec3 col = vec3(0.0);
    float warp = max(uWarp, 0.4);

    // Layer 1 — faint distant field
    for (int i = 0; i < 28; i++) {
      float fi = float(i);
      float ang = hash(fi * 17.3) * 6.2831853;
      float rad = sqrt(hash(fi * 5.9)) * 1.6;
      vec2 sp = vec2(cos(ang), sin(ang)) * rad;
      float size = 0.0025 + hash(fi * 3.7) * 0.004;
      float twinkle = 0.65 + 0.35 * sin(uTime * (0.8 + hash(fi * 2.2) * 2.5) + fi);
      float s = starShape(uv - sp, size) * twinkle;

      float tone = hash(fi * 8.1);
      vec3 starCol = mix(vec3(0.85, 0.9, 1.0), vec3(1.0, 0.96, 0.88), tone);
      starCol = mix(starCol, vec3(0.75, 0.85, 1.0), step(0.75, tone) * 0.5);
      col += starCol * s * 0.5;
    }

    // Layer 2 — brighter closer stars with spikes
    for (int i = 0; i < 12; i++) {
      float fi = float(i) + 120.0;
      float ang = hash(fi * 11.1) * 6.2831853;
      float rad = 0.15 + hash(fi * 4.4) * 1.35;
      vec2 sp = vec2(cos(ang), sin(ang)) * rad;
      float size = 0.005 + hash(fi * 6.2) * 0.01;
      float twinkle = 0.75 + 0.25 * sin(uTime * (1.2 + hash(fi) * 1.8) + fi * 1.7);
      float s = starShape(uv - sp, size) * twinkle;
      vec3 starCol = mix(vec3(1.0), vec3(0.8, 0.88, 1.0), hash(fi * 2.9));
      col += starCol * s * 0.9;
    }

    // Main hyperspace streaks
    for (int i = 0; i < 70; i++) {
      float fi = float(i);
      float seed = hash(fi * 23.91);
      float ang = seed * 6.2831853 + hash(fi * 2.1) * 0.15;
      float speed = 0.28 + hash(fi * 9.4) * 1.55;
      float phase = fract(uTime * speed * warp * 0.18 + seed);

      float rad = pow(phase, 0.72) * 1.65;
      vec2 dir = vec2(cos(ang), sin(ang));
      vec2 head = dir * rad;

      float streakLen = mix(0.01, 0.4, pow(phase, 1.1)) * (0.8 + warp * 0.45);
      vec2 toUv = uv - head;
      float along = -dot(toUv, dir);
      float across = length(toUv + dir * along);

      float headGlow = exp(-length(toUv) * 95.0) * 1.05;
      float trail = smoothstep(streakLen, 0.0, along) * step(0.0, along);
      float width = mix(0.004, 0.0016, phase);
      float thin = smoothstep(width * 2.2, 0.0, across);

      float fadeIn = smoothstep(0.0, 0.08, phase);
      float fadeOut = 1.0 - smoothstep(0.88, 1.0, phase);
      float brightness = (trail * thin + headGlow) * fadeIn * fadeOut;

      vec3 streakCol = mix(vec3(1.0), vec3(0.9, 0.94, 1.0), seed * 0.3);
      col += streakCol * brightness * 1.15;
    }

    // Secondary finer streaks
    for (int i = 0; i < 30; i++) {
      float fi = float(i) + 200.0;
      float seed = hash(fi * 11.3);
      float ang = seed * 6.2831853;
      float speed = 0.5 + hash(fi * 4.2) * 1.8;
      float phase = fract(uTime * speed * warp * 0.25 + seed * 1.7);
      float rad = pow(phase, 0.65) * 1.7;
      vec2 dir = vec2(cos(ang), sin(ang));
      vec2 head = dir * rad;
      float streakLen = mix(0.02, 0.48, phase) * warp * 0.4;
      vec2 toUv = uv - head;
      float along = -dot(toUv, dir);
      float across = length(toUv + dir * along);
      float trail = smoothstep(streakLen, 0.0, along) * step(0.0, along);
      float thin = smoothstep(0.0028, 0.0, across);
      float fade = smoothstep(0.0, 0.1, phase) * (1.0 - smoothstep(0.9, 1.0, phase));
      col += vec3(1.0) * trail * thin * fade * 0.75;
    }

    float core = exp(-r * 6.0) * 0.05 * warp;
    col += vec3(1.0) * core;

    float vig = smoothstep(1.75, 0.4, r);
    col *= vig;
    col = max(col - 0.01, 0.0);
    col *= 0.92;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function HyperspacePlane({ warp = 1.6 }: { warp?: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uWarp: { value: warp },
    }),
    [warp],
  );

  useFrame((state) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = state.clock.elapsedTime;
    material.current.uniforms.uWarp.value =
      warp + Math.sin(state.clock.elapsedTime * 0.35) * 0.12;
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
