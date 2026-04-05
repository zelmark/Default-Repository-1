"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MotionValue, useMotionValueEvent } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * Math.min(1, Math.max(0, t));
}
function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

// Multi-octave sine noise — looks like real atmospheric turbulence
function fbm(x: number, y: number): number {
  let v = 0, a = 1, f = 1;
  for (let i = 0; i < 6; i++) {
    v += Math.sin(x * f * 0.0062 + Math.cos(y * f * 0.0055 + i * 1.7)) *
         Math.cos(y * f * 0.0048 + Math.sin(x * f * 0.0071 + i * 2.3)) * a;
    a *= 0.52; f *= 2.1;
  }
  return v; // roughly -1 to 1
}

// Interpolate between two [r,g,b] colours
function lerpRGB(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
}

/* ─────────────────────────────────────────────────────────────────────────────
   CASSINI-ACCURATE COLOR PALETTE
   Colors sampled from real Cassini mission photos (natural color processing)
───────────────────────────────────────────────────────────────────────────── */
// [latitude 0–1 (south→north), r, g, b]
type Zone = { l: number; c: [number, number, number] };
const ZONES: Zone[] = [
  { l: 0.000, c: [112, 70, 28] },   // south polar cap — dark warm brown
  { l: 0.055, c: [140, 92, 40] },   // south polar region
  { l: 0.100, c: [168, 118, 58] },  // south polar belt
  { l: 0.145, c: [192, 148, 82] },  // south temperate zone
  { l: 0.185, c: [178, 128, 62] },  // south temperate belt — reddish
  { l: 0.225, c: [210, 170, 105] }, // south tropical zone
  { l: 0.265, c: [195, 148, 72] },  // south equatorial belt — warm amber
  { l: 0.305, c: [222, 192, 128] }, // south equatorial zone — bright
  { l: 0.345, c: [235, 212, 152] }, // equatorial zone — palest yellow-cream
  { l: 0.400, c: [240, 218, 158] }, // equator peak brightness
  { l: 0.445, c: [235, 210, 148] }, // north equatorial zone
  { l: 0.490, c: [198, 158, 88] },  // north equatorial belt — darker
  { l: 0.530, c: [215, 178, 108] }, // north tropical zone
  { l: 0.570, c: [188, 145, 72] },  // north temperate belt
  { l: 0.612, c: [208, 172, 102] }, // north temperate zone
  { l: 0.652, c: [175, 135, 68] },  // north polar belt
  { l: 0.695, c: [162, 142, 110] }, // north polar region — greyer
  { l: 0.740, c: [152, 155, 175] }, // polar hexagon edge — blue-grey
  { l: 0.790, c: [138, 148, 178] }, // hexagonal storm — cool blue-grey
  { l: 0.845, c: [120, 128, 162] }, // north polar cap inner
  { l: 0.900, c: [108, 112, 148] }, // north polar cap
  { l: 1.000, c: [92,  95, 130] },  // pole tip — darkest
];

function saturnZoneColor(lat: number): [number, number, number] {
  for (let i = 0; i < ZONES.length - 1; i++) {
    const z0 = ZONES[i], z1 = ZONES[i + 1];
    if (lat >= z0.l && lat <= z1.l) {
      const t = (lat - z0.l) / (z1.l - z0.l);
      return lerpRGB(z0.c, z1.c, t);
    }
  }
  return ZONES[ZONES.length - 1].c;
}

/* ─────────────────────────────────────────────────────────────────────────────
   SATURN SURFACE TEXTURE  —  pixel-by-pixel ImageData rendering
   2048 × 1024  ≈ 2M pixels, ~80 ms in a modern browser
───────────────────────────────────────────────────────────────────────────── */
function createSaturnTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const W = 2048, H = 1024;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d")!;
  const img = ctx.createImageData(W, H);
  const d = img.data;

  for (let py = 0; py < H; py++) {
    const baseLat = py / H;                     // 0=south, 1=north

    for (let px = 0; px < W; px++) {
      const idx = (py * W + px) * 4;

      // ── Turbulent latitude warp (creates wavy bands) ──────────────────────
      const warp = fbm(px, py) * 6.5 + fbm(px * 0.4, py * 0.4 + 300) * 3.2;
      const lat = clamp(baseLat + warp / H, 0, 1);

      // ── Base zone colour ──────────────────────────────────────────────────
      let [r, g, b] = saturnZoneColor(lat);

      // ── Fine-detail turbulence overlay ───────────────────────────────────
      const detail = fbm(px * 2.2, py * 1.8 + 500) * 10;
      r = clamp(r + detail * 0.9, 0, 255);
      g = clamp(g + detail * 0.7, 0, 255);
      b = clamp(b + detail * 0.4, 0, 255);

      // ── Subtle long-wavelength cloud streaks ──────────────────────────────
      const streak = Math.sin(px * 0.0018 + py * 0.003) *
                     Math.cos(py * 0.0055 + 1.2) * 6;
      r = clamp(r + streak, 0, 255);
      g = clamp(g + streak * 0.8, 0, 255);

      // ── Polar darkening (limb towards poles) ──────────────────────────────
      const pole = Math.abs(baseLat - 0.5) * 2;           // 0 at equator, 1 at poles
      const poleDark = pole * pole * 28;
      r = clamp(r - poleDark, 0, 255);
      g = clamp(g - poleDark, 0, 255);
      b = clamp(b - poleDark * 0.6, 0, 255);

      // ── Subtle longitude-based cloud texture ─────────────────────────────
      const lon = px / W;
      const cloud = Math.sin(lon * 14 + fbm(px * 0.5, py * 0.5) * 3) * 4;
      r = clamp(r + cloud, 0, 255);
      g = clamp(g + cloud * 0.85, 0, 255);

      d[idx]     = r;
      d[idx + 1] = g;
      d[idx + 2] = b;
      d[idx + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(cv);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = 16;
  return tex;
}

/* ─────────────────────────────────────────────────────────────────────────────
   RING TEXTURE  —  photo-accurate brightness profile
   B-ring is almost pure white (like real Cassini photos)
───────────────────────────────────────────────────────────────────────────── */
function createRingTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const W = 2048, H = 4;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);

  const g = ctx.createLinearGradient(0, 0, W, 0);
  // Gap
  g.addColorStop(0.000, "rgba(0,0,0,0)");
  g.addColorStop(0.120, "rgba(0,0,0,0)");
  // C ring — faint brownish (real C ring is translucent)
  g.addColorStop(0.130, "rgba(145,110,65,0.28)");
  g.addColorStop(0.155, "rgba(138,105,60,0.40)");
  g.addColorStop(0.175, "rgba(148,115,68,0.50)");
  g.addColorStop(0.195, "rgba(152,120,72,0.52)");
  g.addColorStop(0.215, "rgba(148,115,68,0.46)");
  // B ring — VERY BRIGHT, near-white (real B ring reflects ~60% of sunlight)
  g.addColorStop(0.222, "rgba(218,200,158,0.72)");
  g.addColorStop(0.245, "rgba(238,225,185,0.84)");
  g.addColorStop(0.272, "rgba(252,242,210,0.92)");
  g.addColorStop(0.300, "rgba(255,250,230,0.97)");  // near-white peak
  g.addColorStop(0.340, "rgba(255,252,235,0.99)");  // absolute peak — white
  g.addColorStop(0.378, "rgba(253,248,228,0.98)");
  g.addColorStop(0.410, "rgba(248,240,215,0.95)");
  g.addColorStop(0.440, "rgba(238,228,198,0.89)");
  g.addColorStop(0.465, "rgba(224,210,178,0.80)");
  g.addColorStop(0.486, "rgba(205,190,155,0.68)");
  g.addColorStop(0.504, "rgba(185,170,135,0.56)");
  // Cassini Division — very dark gap (nearly black in real photos)
  g.addColorStop(0.508, "rgba(8,5,2,0.97)");
  g.addColorStop(0.524, "rgba(3,2,0,0.99)");
  g.addColorStop(0.542, "rgba(8,5,2,0.97)");
  // A ring — bright but slightly less than B
  g.addColorStop(0.550, "rgba(198,182,148,0.65)");
  g.addColorStop(0.578, "rgba(215,200,165,0.75)");
  g.addColorStop(0.606, "rgba(224,210,175,0.82)");
  g.addColorStop(0.632, "rgba(220,205,170,0.78)");
  g.addColorStop(0.658, "rgba(208,192,158,0.70)");
  g.addColorStop(0.682, "rgba(192,178,142,0.58)");
  g.addColorStop(0.702, "rgba(172,158,122,0.45)");
  g.addColorStop(0.720, "rgba(150,138,105,0.34)");
  // F ring — narrow, bright
  g.addColorStop(0.732, "rgba(248,235,195,0.58)");
  g.addColorStop(0.740, "rgba(250,238,198,0.62)");
  g.addColorStop(0.748, "rgba(248,235,195,0.54)");
  // Outer diffuse
  g.addColorStop(0.758, "rgba(148,132,98,0.28)");
  g.addColorStop(0.808, "rgba(122,108,78,0.17)");
  g.addColorStop(0.858, "rgba(98,86,60,0.09)");
  g.addColorStop(0.908, "rgba(75,65,44,0.04)");
  g.addColorStop(1.000, "rgba(55,48,32,0)");

  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  return new THREE.CanvasTexture(cv);
}

/* ─────────────────────────────────────────────────────────────────────────────
   RING MESH  —  custom GLSL shader for radial UV mapping
───────────────────────────────────────────────────────────────────────────── */
function RingMesh({ ringTex }: { ringTex: THREE.CanvasTexture | null }) {
  const INNER = 1.22, OUTER = 3.08;
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          ringMap: { value: ringTex },
          innerR:  { value: INNER },
          outerR:  { value: OUTER },
        },
        vertexShader: /* glsl */ `
          varying vec2 vPos;
          void main() {
            vPos = position.xy;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform sampler2D ringMap;
          uniform float innerR;
          uniform float outerR;
          varying vec2 vPos;
          void main() {
            float r = length(vPos);
            float u = clamp((r - innerR) / (outerR - innerR), 0.0, 1.0);
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
   SCENE  —  shows procedural texture instantly, swaps to real photo if it loads
───────────────────────────────────────────────────────────────────────────── */

// Candidate real-image URLs tried in order (browser fetches these, not the server)
const SATURN_SURFACE_URLS = [
  "https://www.solarsystemscope.com/textures/download/2k_saturn.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg",
];

function SaturnScene({ scrollRef }: { scrollRef: { current: number } }) {
  const groupRef  = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const moonRef   = useRef<THREE.Group>(null);

  // Procedural texture — generated instantly, used as fallback
  const proceduralTex = useMemo(() => createSaturnTexture(), []);
  const ringTex       = useMemo(() => createRingTexture(),   []);

  // Real image texture — loaded from URL in background
  const [saturnTex, setSaturnTex] = useState<THREE.Texture | null>(proceduralTex);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";
    let cancelled = false;

    const tryNext = (i: number) => {
      if (i >= SATURN_SURFACE_URLS.length || cancelled) return;
      loader.load(
        SATURN_SURFACE_URLS[i],
        (tex) => {
          if (cancelled) { tex.dispose(); return; }
          tex.anisotropy = 16;
          setSaturnTex(tex);   // swap in the real photo
        },
        undefined,
        () => tryNext(i + 1)  // CORS/404 → try next candidate
      );
    };
    tryNext(0);

    return () => { cancelled = true; };
  }, [proceduralTex]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (planetRef.current) planetRef.current.rotation.y = t * 0.10;
    if (moonRef.current)   moonRef.current.rotation.y   = t * 0.28;
    if (groupRef.current) {
      const target = 0.44 + scrollRef.current * 0.16;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x, target, 0.04
      );
    }
  });

  return (
    <group ref={groupRef} rotation={[0.44, 0.28, 0.10]}>
      {/* Planet sphere */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[1, 128, 64]} />
        <meshStandardMaterial
          map={saturnTex ?? undefined}
          roughness={0.78}
          metalness={0.0}
        />
      </mesh>

      {/* Atmosphere rim glow */}
      <mesh>
        <sphereGeometry args={[1.030, 64, 32]} />
        <meshStandardMaterial
          color="#C8940C"
          transparent
          opacity={0.042}
          side={THREE.FrontSide}
          depthWrite={false}
        />
      </mesh>

      {/* Rings */}
      <RingMesh ringTex={ringTex} />

      {/* Triton moon */}
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
export function Saturn3D({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
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
        {/* Primary sun light — warm, strong, from upper-left */}
        <directionalLight position={[-3.5, 2.5, 4]} intensity={4.2} color="#FFF8E8" />
        {/* Deep space fill — cool blue */}
        <ambientLight intensity={0.08} color="#223355" />
        {/* Subtle warm backscatter */}
        <pointLight position={[5, -1.5, -4]} intensity={0.28} color="#C8A040" />

        <SaturnScene scrollRef={scrollRef} />
      </Canvas>
    </div>
  );
}
