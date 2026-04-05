"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MotionValue, useMotionValueEvent } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   PROCEDURAL SATURN SURFACE TEXTURE  (2048 × 1024 canvas)
───────────────────────────────────────────────────────────────────────────── */
function createSaturnTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const W = 2048, H = 1024;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d")!;

  // ── Latitude-based base gradient ──────────────────────────────────────────
  const base = ctx.createLinearGradient(0, 0, 0, H);
  base.addColorStop(0.00, "#2A1206");
  base.addColorStop(0.05, "#4A2410");
  base.addColorStop(0.10, "#783E18");
  base.addColorStop(0.16, "#AC6820");
  base.addColorStop(0.22, "#CC8828");
  base.addColorStop(0.28, "#DCA032");
  base.addColorStop(0.34, "#E8B83C");
  base.addColorStop(0.40, "#F0CC48");
  base.addColorStop(0.46, "#F6D854");
  base.addColorStop(0.50, "#FAE05C"); // equatorial peak
  base.addColorStop(0.54, "#F6D854");
  base.addColorStop(0.60, "#EEBC42");
  base.addColorStop(0.66, "#DCA030");
  base.addColorStop(0.72, "#C28020");
  base.addColorStop(0.78, "#A06018");
  base.addColorStop(0.84, "#784010");
  base.addColorStop(0.90, "#4E2608");
  base.addColorStop(1.00, "#1C0C02");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, W, H);

  // ── Atmospheric band definition ───────────────────────────────────────────
  const bands = [
    { y: 0.055, h: 0.014, c: "rgba(185,120,38,0.72)" },
    { y: 0.080, h: 0.007, c: "rgba(255,228,145,0.46)" },
    { y: 0.108, h: 0.016, c: "rgba(110,56,12,0.65)" },
    { y: 0.135, h: 0.009, c: "rgba(252,230,148,0.44)" },
    { y: 0.158, h: 0.013, c: "rgba(88,44,8,0.62)" },
    { y: 0.182, h: 0.011, c: "rgba(240,200,112,0.46)" },
    { y: 0.208, h: 0.014, c: "rgba(72,36,7,0.62)" },
    { y: 0.232, h: 0.009, c: "rgba(255,238,155,0.46)" },
    { y: 0.258, h: 0.013, c: "rgba(58,28,5,0.60)" },
    { y: 0.282, h: 0.010, c: "rgba(248,222,145,0.46)" },
    { y: 0.308, h: 0.014, c: "rgba(55,26,4,0.58)" },
    { y: 0.335, h: 0.008, c: "rgba(255,242,165,0.48)" },
    { y: 0.360, h: 0.012, c: "rgba(52,24,4,0.56)" },
    { y: 0.385, h: 0.008, c: "rgba(252,240,162,0.48)" },
    { y: 0.412, h: 0.012, c: "rgba(50,22,4,0.54)" },
    { y: 0.438, h: 0.007, c: "rgba(252,238,160,0.48)" },
    { y: 0.460, h: 0.012, c: "rgba(48,22,4,0.52)" },
    { y: 0.488, h: 0.007, c: "rgba(250,236,158,0.46)" },
    { y: 0.510, h: 0.012, c: "rgba(50,22,4,0.52)" },
    { y: 0.538, h: 0.009, c: "rgba(238,196,108,0.42)" },
    { y: 0.560, h: 0.012, c: "rgba(55,26,5,0.52)" },
    { y: 0.585, h: 0.010, c: "rgba(222,178,88,0.38)" },
    { y: 0.610, h: 0.011, c: "rgba(62,30,6,0.50)" },
    { y: 0.636, h: 0.010, c: "rgba(205,160,72,0.34)" },
    { y: 0.660, h: 0.010, c: "rgba(70,34,7,0.46)" },
    { y: 0.685, h: 0.011, c: "rgba(185,145,58,0.30)" },
    { y: 0.712, h: 0.009, c: "rgba(80,38,8,0.42)" },
    { y: 0.736, h: 0.010, c: "rgba(165,130,50,0.26)" },
    { y: 0.762, h: 0.008, c: "rgba(88,42,9,0.38)" },
    { y: 0.786, h: 0.010, c: "rgba(148,115,44,0.22)" },
    { y: 0.812, h: 0.008, c: "rgba(96,46,10,0.34)" },
    { y: 0.836, h: 0.009, c: "rgba(128,98,38,0.18)" },
    { y: 0.862, h: 0.007, c: "rgba(105,50,12,0.28)" },
  ];

  for (const { y, h, c } of bands) {
    ctx.beginPath();
    const y0 = y * H, y1 = (y + h) * H;
    for (let x = 0; x <= W; x++) {
      const w = Math.sin(x * 0.0038) * 3 + Math.sin(x * 0.0125) * 2;
      if (x === 0) ctx.moveTo(0, y0 + w); else ctx.lineTo(x, y0 + w);
    }
    for (let x = W; x >= 0; x--) {
      const w = Math.sin(x * 0.0038) * 3 + Math.sin(x * 0.0125) * 2;
      ctx.lineTo(x, y1 + w);
    }
    ctx.closePath();
    ctx.fillStyle = c;
    ctx.fill();
  }

  // ── Fine horizontal turbulence streaks ────────────────────────────────────
  for (let i = 0; i < 80; i++) {
    const yp = Math.random() * H;
    ctx.beginPath();
    ctx.moveTo(0, yp);
    for (let x = 0; x < W; x += 12) {
      ctx.lineTo(x, yp + (Math.random() - 0.5) * 3);
    }
    const bright = Math.random() > 0.52;
    ctx.strokeStyle = bright
      ? `rgba(255,238,148,${0.025 + Math.random() * 0.065})`
      : `rgba(28,12,3,${0.03 + Math.random() * 0.07})`;
    ctx.lineWidth = 0.7 + Math.random() * 1.8;
    ctx.stroke();
  }

  // ── North polar hexagon region (blue tint) ────────────────────────────────
  const npg = ctx.createRadialGradient(W / 2, H * 0.92, 0, W / 2, H * 0.92, H * 0.14);
  npg.addColorStop(0, "rgba(100,135,210,0.24)");
  npg.addColorStop(0.5, "rgba(80,115,185,0.12)");
  npg.addColorStop(1, "rgba(60,95,160,0)");
  ctx.fillStyle = npg;
  ctx.fillRect(0, H * 0.80, W, H * 0.20);

  // ── South polar vortex ────────────────────────────────────────────────────
  const spg = ctx.createRadialGradient(W / 2, H * 0.05, 0, W / 2, H * 0.05, H * 0.11);
  spg.addColorStop(0, "rgba(50,22,6,0.40)");
  spg.addColorStop(0.5, "rgba(40,18,5,0.20)");
  spg.addColorStop(1, "rgba(30,14,4,0)");
  ctx.fillStyle = spg;
  ctx.fillRect(0, 0, W, H * 0.14);

  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = 16;
  return tex;
}

/* ─────────────────────────────────────────────────────────────────────────────
   PROCEDURAL RING TEXTURE  (2048 × 4 canvas — horizontal gradient)
───────────────────────────────────────────────────────────────────────────── */
function createRingTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const W = 2048, H = 4;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);

  const g = ctx.createLinearGradient(0, 0, W, 0);
  // Transparent inner gap
  g.addColorStop(0.000, "rgba(0,0,0,0)");
  g.addColorStop(0.128, "rgba(0,0,0,0)");
  // C ring
  g.addColorStop(0.138, "rgba(160,120,62,0.34)");
  g.addColorStop(0.158, "rgba(150,112,54,0.44)");
  g.addColorStop(0.175, "rgba(162,128,66,0.52)");
  g.addColorStop(0.192, "rgba(168,135,72,0.54)");
  g.addColorStop(0.210, "rgba(165,132,70,0.50)");
  // B ring — PEAK BRIGHTNESS
  g.addColorStop(0.218, "rgba(212,185,110,0.70)");
  g.addColorStop(0.248, "rgba(232,208,132,0.82)");
  g.addColorStop(0.278, "rgba(248,228,155,0.92)");
  g.addColorStop(0.308, "rgba(255,240,168,0.97)");
  g.addColorStop(0.348, "rgba(255,244,172,0.99)"); // absolute peak
  g.addColorStop(0.382, "rgba(253,238,164,0.98)");
  g.addColorStop(0.412, "rgba(247,228,150,0.94)");
  g.addColorStop(0.440, "rgba(235,212,135,0.87)");
  g.addColorStop(0.465, "rgba(218,192,115,0.78)");
  g.addColorStop(0.486, "rgba(200,172,96,0.66)");
  g.addColorStop(0.504, "rgba(180,153,80,0.55)");
  // Cassini Division
  g.addColorStop(0.508, "rgba(4,2,0,0.97)");
  g.addColorStop(0.524, "rgba(2,1,0,0.99)");
  g.addColorStop(0.540, "rgba(4,2,0,0.97)");
  // A ring
  g.addColorStop(0.548, "rgba(202,174,103,0.63)");
  g.addColorStop(0.575, "rgba(218,190,113,0.74)");
  g.addColorStop(0.604, "rgba(226,200,121,0.80)");
  g.addColorStop(0.632, "rgba(222,195,117,0.77)");
  g.addColorStop(0.660, "rgba(210,183,107,0.68)");
  g.addColorStop(0.685, "rgba(196,166,94,0.57)");
  g.addColorStop(0.706, "rgba(178,150,78,0.44)");
  g.addColorStop(0.724, "rgba(158,132,64,0.33)");
  // F ring (narrow bright stripe)
  g.addColorStop(0.736, "rgba(244,222,154,0.58)");
  g.addColorStop(0.744, "rgba(246,226,158,0.62)");
  g.addColorStop(0.752, "rgba(244,222,154,0.54)");
  // G / outer diffuse
  g.addColorStop(0.762, "rgba(155,128,68,0.30)");
  g.addColorStop(0.812, "rgba(130,105,54,0.18)");
  g.addColorStop(0.864, "rgba(105,84,42,0.10)");
  g.addColorStop(0.916, "rgba(80,64,30,0.05)");
  g.addColorStop(1.000, "rgba(60,48,22,0)");

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  return tex;
}

/* ─────────────────────────────────────────────────────────────────────────────
   RING MESH  (custom GLSL shader — maps texture radially using model-space pos)
───────────────────────────────────────────────────────────────────────────── */
function RingMesh({ ringTex }: { ringTex: THREE.CanvasTexture | null }) {
  const INNER = 1.22, OUTER = 3.08;

  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          ringMap: { value: ringTex },
          innerR: { value: INNER },
          outerR: { value: OUTER },
        },
        vertexShader: /* glsl */ `
          varying vec2 vModelXY;
          void main() {
            vModelXY = position.xy;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform sampler2D ringMap;
          uniform float innerR;
          uniform float outerR;
          varying vec2 vModelXY;
          void main() {
            float r = length(vModelXY);
            float u = (r - innerR) / (outerR - innerR);
            u = clamp(u, 0.0, 1.0);
            vec4 col = texture2D(ringMap, vec2(u, 0.5));
            if (col.a < 0.01) discard;
            gl_FragColor = col;
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [ringTex]
  );

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} material={mat}>
      <ringGeometry args={[INNER, OUTER, 512, 1]} />
    </mesh>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SCENE  (planet + rings + moon + atmosphere)
───────────────────────────────────────────────────────────────────────────── */
function SaturnScene({ scrollRef }: { scrollRef: { current: number } }) {
  const groupRef   = useRef<THREE.Group>(null);
  const planetRef  = useRef<THREE.Mesh>(null);
  const moonRef    = useRef<THREE.Group>(null);

  const saturnTex = useMemo(() => createSaturnTexture(), []);
  const ringTex   = useMemo(() => createRingTexture(),   []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Self-rotation (Saturn rotates fast — ~10.7 h)
    if (planetRef.current) planetRef.current.rotation.y = t * 0.10;
    // Moon orbit
    if (moonRef.current) moonRef.current.rotation.y = t * 0.28;
    // Scroll-driven ring tilt
    if (groupRef.current) {
      const target = 0.44 + scrollRef.current * 0.16;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x, target, 0.04
      );
    }
  });

  return (
    <group ref={groupRef} rotation={[0.44, 0.28, 0.10]}>
      {/* ── Planet sphere ── */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[1, 128, 64]} />
        <meshStandardMaterial
          map={saturnTex ?? undefined}
          roughness={0.80}
          metalness={0.02}
        />
      </mesh>

      {/* ── Thin atmosphere haze ── */}
      <mesh>
        <sphereGeometry args={[1.028, 64, 32]} />
        <meshStandardMaterial
          color="#CC9820"
          transparent
          opacity={0.048}
          side={THREE.FrontSide}
          depthWrite={false}
        />
      </mesh>

      {/* ── Rings ── */}
      <RingMesh ringTex={ringTex} />

      {/* ── Triton moon + faint orbit trail ── */}
      <group ref={moonRef} rotation={[0.28, 0, 0]}>
        <mesh position={[2.55, 0, 0]}>
          <sphereGeometry args={[0.068, 32, 16]} />
          <meshStandardMaterial color="#8fa0bc" roughness={0.92} metalness={0.0} />
        </mesh>
        <mesh>
          <torusGeometry args={[2.55, 0.003, 2, 128]} />
          <meshBasicMaterial color="#4466AA" transparent opacity={0.12} />
        </mesh>
      </group>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   EXPORT
───────────────────────────────────────────────────────────────────────────── */
export function Saturn3D({
  scrollYProgress,
}: {
  scrollYProgress: MotionValue<number>;
}) {
  const scrollRef = useRef(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    scrollRef.current = v;
  });

  return (
    <div style={{ width: 760, height: 760, position: "relative" }}>
      <Canvas
        camera={{ position: [0, 1.8, 5.4], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ width: "100%", height: "100%" }}
        dpr={[1, 2]}
      >
        {/* Sun light — upper-left warm */}
        <directionalLight position={[-3.5, 2.5, 4]} intensity={3.8} color="#FFF4CC" />
        {/* Deep-space ambient — cool blue */}
        <ambientLight intensity={0.09} color="#334488" />
        {/* Subtle back-scatter fill */}
        <pointLight position={[5, -1.5, -4]} intensity={0.30} color="#C8A040" />

        <SaturnScene scrollRef={scrollRef} />
      </Canvas>
    </div>
  );
}
