"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MotionValue, useMotionValueEvent } from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   GLSL PLANET SHADER  —  GPU-rendered fallback (used until real photo loads)
   Fractional Brownian Motion noise + Cassini-accurate color zones
───────────────────────────────────────────────────────────────────────────── */
const VERT = /* glsl */`
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAG = /* glsl */`
  precision highp float;
  uniform float uTime;
  uniform vec3  uSunDir;    // normalised direction toward sun
  varying vec2  vUv;
  varying vec3  vNormal;
  varying vec3  vWorldNormal;

  /* ── value noise ── */
  float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 17.5);
    return fract(p.x * p.y);
  }
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    f = f*f*(3.0-2.0*f);
    return mix(
      mix(hash(i), hash(i+vec2(1,0)), f.x),
      mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), f.x), f.y);
  }
  /* ── 7-octave FBM ── */
  float fbm(vec2 p) {
    float v=0.0, a=0.5;
    for(int i=0;i<7;i++){ v+=vnoise(p)*a; p=p*2.13+vec2(1.7,9.3); a*=0.5; }
    return v;
  }

  /* ── Cassini-accurate colour zones (lat 0=south, 1=north) ── */
  vec3 zoneColor(float lat) {
    /* palette entries: lat, r, g, b (values 0-1) */
    vec3 palette[22];
    float stops[22];
    stops[ 0]=0.000; palette[ 0]=vec3(0.438,0.275,0.110);
    stops[ 1]=0.055; palette[ 1]=vec3(0.549,0.361,0.157);
    stops[ 2]=0.100; palette[ 2]=vec3(0.659,0.463,0.227);
    stops[ 3]=0.145; palette[ 3]=vec3(0.753,0.580,0.322);
    stops[ 4]=0.185; palette[ 4]=vec3(0.698,0.502,0.243);
    stops[ 5]=0.225; palette[ 5]=vec3(0.824,0.667,0.412);
    stops[ 6]=0.265; palette[ 6]=vec3(0.765,0.580,0.282);
    stops[ 7]=0.305; palette[ 7]=vec3(0.871,0.753,0.502);
    stops[ 8]=0.345; palette[ 8]=vec3(0.922,0.831,0.596);
    stops[ 9]=0.400; palette[ 9]=vec3(0.941,0.855,0.620);  /* equator peak */
    stops[10]=0.445; palette[10]=vec3(0.922,0.824,0.580);
    stops[11]=0.490; palette[11]=vec3(0.776,0.620,0.345);
    stops[12]=0.530; palette[12]=vec3(0.843,0.698,0.424);
    stops[13]=0.570; palette[13]=vec3(0.737,0.569,0.282);
    stops[14]=0.612; palette[14]=vec3(0.816,0.675,0.400);
    stops[15]=0.652; palette[15]=vec3(0.686,0.529,0.267);
    stops[16]=0.695; palette[16]=vec3(0.635,0.557,0.431);
    stops[17]=0.740; palette[17]=vec3(0.596,0.608,0.686);
    stops[18]=0.790; palette[18]=vec3(0.541,0.580,0.698);
    stops[19]=0.845; palette[19]=vec3(0.471,0.502,0.635);
    stops[20]=0.900; palette[20]=vec3(0.424,0.439,0.580);
    stops[21]=1.000; palette[21]=vec3(0.361,0.373,0.510);

    for(int i=0;i<21;i++){
      if(lat>=stops[i] && lat<=stops[i+1]){
        float t=(lat-stops[i])/(stops[i+1]-stops[i]);
        return mix(palette[i], palette[i+1], t);
      }
    }
    return palette[21];
  }

  void main() {
    float lon = vUv.x + uTime * 0.006;   /* slow self-rotation */
    float lat = vUv.y;

    /* ── turbulent band warp ── */
    float warp = fbm(vec2(lon*2.8, lat*7.5)) * 0.032
               + fbm(vec2(lon*1.2+3.0, lat*3.2+5.0)) * 0.018;
    float distLat = clamp(lat + warp, 0.0, 1.0);

    /* ── base colour from zone ── */
    vec3 col = zoneColor(distLat);

    /* ── fine turbulence overlay ── */
    float detail = fbm(vec2(lon*9.0, distLat*22.0)) - 0.5;
    col += vec3(detail*0.055, detail*0.040, detail*0.018);

    /* ── long-wavelength cloud streaks ── */
    float streak = sin(lon*11.0 + fbm(vec2(lon*2.0,lat*4.0))*2.8) * 0.022;
    col += vec3(streak, streak*0.75, streak*0.25);

    /* ── polar darkening ── */
    float pole = abs(lat - 0.5) * 2.0;
    col *= 1.0 - pole*pole*0.28;

    /* ── diffuse + limb darkening ── */
    float NdotL  = clamp(dot(vWorldNormal, uSunDir), 0.0, 1.0);
    float NdotV  = clamp(dot(vNormal, vec3(0,0,1)), 0.0, 1.0);
    float diffuse = mix(0.07, 1.0, NdotL);           /* dark-side fill */
    float limb    = 1.0 - pow(1.0-NdotV, 1.6)*0.44; /* edge darkening */

    col = clamp(col * diffuse * limb, 0.0, 1.0);
    gl_FragColor = vec4(col, 1.0);
  }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   RING TEXTURE  —  Cassini-accurate brightness profile
───────────────────────────────────────────────────────────────────────────── */
function createRingTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;
  const W = 2048, H = 4;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);
  const g = ctx.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0.000, "rgba(0,0,0,0)");
  g.addColorStop(0.120, "rgba(0,0,0,0)");
  g.addColorStop(0.130, "rgba(145,110,65,0.28)");
  g.addColorStop(0.155, "rgba(138,105,60,0.42)");
  g.addColorStop(0.180, "rgba(150,118,70,0.52)");
  g.addColorStop(0.210, "rgba(148,115,68,0.46)");
  // B ring — near-white (like real Cassini photos)
  g.addColorStop(0.222, "rgba(220,205,165,0.74)");
  g.addColorStop(0.248, "rgba(240,228,192,0.86)");
  g.addColorStop(0.278, "rgba(252,244,215,0.93)");
  g.addColorStop(0.308, "rgba(255,252,232,0.97)");
  g.addColorStop(0.345, "rgba(255,254,238,0.99)");
  g.addColorStop(0.380, "rgba(253,250,230,0.98)");
  g.addColorStop(0.415, "rgba(248,242,218,0.94)");
  g.addColorStop(0.445, "rgba(238,228,200,0.88)");
  g.addColorStop(0.472, "rgba(222,210,180,0.78)");
  g.addColorStop(0.494, "rgba(202,190,158,0.65)");
  g.addColorStop(0.510, "rgba(180,168,136,0.53)");
  // Cassini Division — near-black
  g.addColorStop(0.514, "rgba(6,4,1,0.97)");
  g.addColorStop(0.528, "rgba(2,1,0,0.99)");
  g.addColorStop(0.542, "rgba(6,4,1,0.97)");
  // A ring
  g.addColorStop(0.550, "rgba(200,185,150,0.67)");
  g.addColorStop(0.578, "rgba(218,205,168,0.77)");
  g.addColorStop(0.608, "rgba(226,212,175,0.83)");
  g.addColorStop(0.636, "rgba(220,206,170,0.79)");
  g.addColorStop(0.662, "rgba(208,194,158,0.70)");
  g.addColorStop(0.685, "rgba(190,178,142,0.58)");
  g.addColorStop(0.706, "rgba(170,158,122,0.44)");
  g.addColorStop(0.724, "rgba(148,136,104,0.33)");
  // F ring
  g.addColorStop(0.734, "rgba(250,238,200,0.60)");
  g.addColorStop(0.742, "rgba(252,240,202,0.64)");
  g.addColorStop(0.750, "rgba(250,238,200,0.55)");
  // outer diffuse
  g.addColorStop(0.762, "rgba(145,130,95,0.28)");
  g.addColorStop(0.820, "rgba(118,105,75,0.16)");
  g.addColorStop(0.875, "rgba(92,82,56,0.08)");
  g.addColorStop(1.000, "rgba(60,54,36,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  return new THREE.CanvasTexture(cv);
}

/* ─────────────────────────────────────────────────────────────────────────────
   RING MESH — radial GLSL shader
───────────────────────────────────────────────────────────────────────────── */
function RingMesh({ ringTex }: { ringTex: THREE.CanvasTexture | null }) {
  const INNER = 1.22, OUTER = 3.08;
  const mat = useMemo(() =>
    new THREE.ShaderMaterial({
      uniforms: { ringMap: { value: ringTex }, innerR: { value: INNER }, outerR: { value: OUTER } },
      vertexShader:   `varying vec2 vPos; void main(){ vPos=position.xy; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
      fragmentShader: `uniform sampler2D ringMap; uniform float innerR,outerR; varying vec2 vPos;
        void main(){ float r=length(vPos); float u=clamp((r-innerR)/(outerR-innerR),0.0,1.0);
        vec4 c=texture2D(ringMap,vec2(u,0.5)); if(c.a<0.01)discard; gl_FragColor=c; }`,
      transparent: true, side: THREE.DoubleSide, depthWrite: false,
    }), [ringTex]);
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} material={mat}>
      <ringGeometry args={[INNER, OUTER, 512, 1]} />
    </mesh>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   PLANET MESH — GLSL shader by default, real photo texture when available
───────────────────────────────────────────────────────────────────────────── */
const SUN_DIR = new THREE.Vector3(-3.5, 2.5, 4).normalize();

function PlanetMesh({ photoTex }: { photoTex: THREE.Texture | null }) {
  const meshRef  = useRef<THREE.Mesh>(null);
  const shaderRef = useRef<THREE.ShaderMaterial | null>(null);

  const shaderMat = useMemo(() => {
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime:   { value: 0 },
        uSunDir: { value: SUN_DIR },
      },
      vertexShader:   VERT,
      fragmentShader: FRAG,
    });
    shaderRef.current = mat;
    return mat;
  }, []);

  const photoMat = useMemo(() => {
    if (!photoTex) return null;
    return new THREE.MeshStandardMaterial({
      map: photoTex, roughness: 0.78, metalness: 0.0,
    });
  }, [photoTex]);

  useFrame(({ clock }) => {
    if (shaderRef.current) shaderRef.current.uniforms.uTime.value = clock.getElapsedTime();
    if (meshRef.current)   meshRef.current.rotation.y = clock.getElapsedTime() * 0.10;
  });

  return (
    <mesh ref={meshRef} material={photoMat ?? shaderMat}>
      <sphereGeometry args={[1, 128, 64]} />
    </mesh>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SCENE
───────────────────────────────────────────────────────────────────────────── */
function SaturnScene({ scrollRef }: { scrollRef: { current: number } }) {
  const groupRef = useRef<THREE.Group>(null);
  const moonRef  = useRef<THREE.Group>(null);
  const ringTex  = useMemo(() => createRingTexture(), []);

  /* Try loading a local real-photo texture uploaded to /public/saturn.jpg */
  const [photoTex, setPhotoTex] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";
    // Local path (works once user uploads the file — see README instructions)
    loader.load(
      "/Default-Repository-1/saturn.jpg",
      (tex) => { tex.anisotropy = 16; setPhotoTex(tex); },
      undefined,
      () => { /* file not present — GLSL shader stays active */ }
    );
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (moonRef.current) moonRef.current.rotation.y = t * 0.28;
    if (groupRef.current) {
      const target = 0.44 + scrollRef.current * 0.16;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, target, 0.04);
    }
  });

  return (
    <group ref={groupRef} rotation={[0.44, 0.28, 0.10]}>
      <PlanetMesh photoTex={photoTex} />

      {/* Atmosphere rim */}
      <mesh>
        <sphereGeometry args={[1.030, 64, 32]} />
        <meshStandardMaterial color="#C8940C" transparent opacity={0.038} side={THREE.FrontSide} depthWrite={false} />
      </mesh>

      <RingMesh ringTex={ringTex} />

      {/* Triton moon */}
      <group ref={moonRef} rotation={[0.28, 0, 0]}>
        <mesh position={[2.55, 0, 0]}>
          <sphereGeometry args={[0.068, 32, 16]} />
          <meshStandardMaterial color="#8fa0bc" roughness={0.92} />
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
  useMotionValueEvent(scrollYProgress, "change", (v) => { scrollRef.current = v; });

  return (
    <div style={{ width: 760, height: 760 }}>
      <Canvas
        camera={{ position: [0, 1.8, 5.4], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ width: "100%", height: "100%" }}
        dpr={[1, 2]}
      >
        <directionalLight position={[-3.5, 2.5, 4]} intensity={4.0} color="#FFF8E8" />
        <ambientLight intensity={0.08} color="#223355" />
        <pointLight position={[5, -1.5, -4]} intensity={0.25} color="#C8A040" />
        <SaturnScene scrollRef={scrollRef} />
      </Canvas>
    </div>
  );
}
