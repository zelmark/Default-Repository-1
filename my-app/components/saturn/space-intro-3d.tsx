"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/* ─────────────────────────────────────────────────────────────────────────────
   SHARED GLSL NOISE
───────────────────────────────────────────────────────────────────────────── */
const NOISE_GLSL = /* glsl */`
  float hash(vec2 p){p=fract(p*vec2(127.1,311.7));p+=dot(p,p+17.5);return fract(p.x*p.y);}
  float vn(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
  float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<6;i++){v+=vn(p)*a;p=p*2.1+vec2(1.7,9.2);a*=.5;}return v;}
`;

const PLANET_VERT = /* glsl */`
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorld;
  void main(){
    vUv=uv;
    vNormal=normalize(normalMatrix*normal);
    vWorld=normalize((modelMatrix*vec4(normal,0.)).xyz);
    gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);
  }
`;

/* ─────────────────────────────────────────────────────────────────────────────
   STARFIELD  (8 000 points)
───────────────────────────────────────────────────────────────────────────── */
function Stars() {
  const { geometry, colors } = useMemo(() => {
    const N = 8000;
    const pos = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    let seed = 1337;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < N; i++) {
      const r = 400 + rnd() * 1200;
      const theta = rnd() * Math.PI * 2;
      const phi = Math.acos(2 * rnd() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const t = rnd();
      if (t < 0.65) { col[i*3]=0.85+rnd()*0.15; col[i*3+1]=0.88+rnd()*0.12; col[i*3+2]=1.0; }
      else if (t < 0.80) { col[i*3]=0.7+rnd()*0.2; col[i*3+1]=0.7+rnd()*0.2; col[i*3+2]=1.0; }
      else if (t < 0.90) { col[i*3]=0.9+rnd()*0.1; col[i*3+1]=0.75+rnd()*0.15; col[i*3+2]=1.0; }
      else { col[i*3]=1.0; col[i*3+1]=0.88+rnd()*0.12; col[i*3+2]=0.65+rnd()*0.25; }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(col, 3));
    return { geometry, colors: col };
  }, []);

  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {},
    vertexShader: /* glsl */`
      attribute vec3 color;
      varying vec3 vCol;
      void main(){
        vCol=color;
        vec4 mvPos=modelViewMatrix*vec4(position,1.);
        gl_PointSize=clamp(280.0/-mvPos.z,0.5,3.5);
        gl_Position=projectionMatrix*mvPos;
      }
    `,
    fragmentShader: /* glsl */`
      varying vec3 vCol;
      void main(){
        float d=length(gl_PointCoord-0.5)*2.;
        float a=1.-smoothstep(0.4,1.,d);
        gl_FragColor=vec4(vCol,a);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    vertexColors: false,
  }), []);

  return <points geometry={geometry} material={mat} />;
}

/* ─────────────────────────────────────────────────────────────────────────────
   NEBULA  (4 layered planes)
───────────────────────────────────────────────────────────────────────────── */
function Nebula() {
  const planes = useMemo(() => [
    { z: -40,  rot: [0, 0, 0.3],          color: [0.18, 0.08, 0.42], scale: 180 },
    { z: -70,  rot: [0.1, 0.15, -0.2],    color: [0.08, 0.06, 0.38], scale: 220 },
    { z: -100, rot: [-0.05, 0.2, 0.1],    color: [0.12, 0.04, 0.30], scale: 260 },
    { z: -130, rot: [0.08, -0.1, 0.25],   color: [0.06, 0.02, 0.22], scale: 300 },
  ], []);

  return (
    <>
      {planes.map((p, i) => (
        <mesh key={i} position={[0, 0, p.z]} rotation={p.rot as [number, number, number]}>
          <planeGeometry args={[p.scale, p.scale]} />
          <shaderMaterial
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            uniforms={{ uColor: { value: new THREE.Color(...(p.color as [number, number, number])) } }}
            vertexShader={/* glsl */`
              varying vec2 vUv;
              void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }
            `}
            fragmentShader={/* glsl */`
              ${NOISE_GLSL}
              uniform vec3 uColor;
              varying vec2 vUv;
              void main(){
                vec2 p=(vUv-.5)*3.5;
                float n=fbm(p*1.2+vec2(${(i * 3.7).toFixed(2)},${(i * 2.1).toFixed(2)}));
                float r=length(p);
                float a=n*smoothstep(1.6,0.2,r)*0.35;
                gl_FragColor=vec4(uColor*1.4,a);
              }
            `}
          />
        </mesh>
      ))}
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SATURN
───────────────────────────────────────────────────────────────────────────── */
function SaturnSystem() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.06;
  });

  const sphereMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uLight: { value: new THREE.Vector3(-0.75, 0.35, 0.55).normalize() },
    },
    vertexShader: PLANET_VERT,
    fragmentShader: /* glsl */`
      ${NOISE_GLSL}
      uniform vec3 uLight;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vWorld;
      void main(){
        float lat=vUv.y;
        float lon=vUv.x;
        float band=fbm(vec2(lon*4.,lat*18.)*1.1+vec2(2.3,7.8));
        float band2=fbm(vec2(lon*6.,lat*24.)*0.9+vec2(5.1,1.4));
        vec3 c0=vec3(0.88,0.70,0.34);
        vec3 c1=vec3(0.72,0.54,0.22);
        vec3 c2=vec3(0.95,0.82,0.52);
        vec3 c3=vec3(0.64,0.46,0.18);
        vec3 c4=vec3(0.80,0.63,0.28);
        float z=lat;
        vec3 base=mix(c0,c1,smoothstep(0.2,0.45,z));
        base=mix(base,c2,smoothstep(0.45,0.55,z));
        base=mix(base,c3,smoothstep(0.55,0.72,z));
        base=mix(base,c4,smoothstep(0.72,0.88,z));
        base=mix(base,base+vec3(0.06,-0.02,-0.06),band*0.65);
        base=mix(base,base+vec3(-0.04,0.02,0.08),band2*0.4);
        float diff=max(0.,dot(vNormal,uLight));
        float amb=0.12;
        float lit=amb+diff*0.88;
        float rim=pow(1.-max(0.,dot(vNormal,normalize(vec3(0,0,1)))),2.8)*0.18;
        gl_FragColor=vec4(base*lit+rim*vec3(0.9,0.75,0.4),1.);
      }
    `,
  }), []);

  const ringMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uLight: { value: new THREE.Vector3(-0.75, 0.35, 0.55).normalize() },
    },
    vertexShader: /* glsl */`
      varying vec2 vUv;
      void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }
    `,
    fragmentShader: /* glsl */`
      ${NOISE_GLSL}
      uniform vec3 uLight;
      varying vec2 vUv;
      void main(){
        float r=vUv.x;
        float angle=vUv.y;
        float cassini=smoothstep(0.54,0.56,r)-smoothstep(0.60,0.62,r);
        float inner=smoothstep(0.0,0.12,r)*(1.-smoothstep(0.52,0.56,r));
        float outer=smoothstep(0.64,0.68,r)*(1.-smoothstep(0.92,1.0,r));
        float density=inner*0.88+outer*0.55;
        density*=1.-cassini*0.9;
        float n=fbm(vec2(r*22.,angle*8.)+vec2(3.1,0.7));
        density*=0.7+n*0.55;
        density=clamp(density,0.,1.);
        float diff=max(0.,dot(normalize(vec3(0,1,0)),uLight))*0.6+0.4;
        vec3 col=mix(vec3(0.55,0.48,0.35),vec3(0.92,0.88,0.78),r);
        col=mix(col,vec3(0.30,0.24,0.14),cassini);
        gl_FragColor=vec4(col*diff,density*0.92);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.NormalBlending,
  }), []);

  return (
    <group ref={groupRef} rotation={[0.12, 0.4, 0.28]}>
      <mesh>
        <sphereGeometry args={[3.2, 64, 48]} />
        <primitive object={sphereMat} attach="material" />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.8, 9.5, 128, 8]} />
        <primitive object={ringMat} attach="material" />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   NEPTUNE
───────────────────────────────────────────────────────────────────────────── */
function NeptuneSystem() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.04;
  });

  const sphereMat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uLight: { value: new THREE.Vector3(-0.6, 0.3, 0.75).normalize() },
    },
    vertexShader: PLANET_VERT,
    fragmentShader: /* glsl */`
      ${NOISE_GLSL}
      uniform vec3 uLight;
      varying vec2 vUv;
      varying vec3 vNormal;
      void main(){
        float n=fbm(vUv*5.5+vec2(1.3,4.7));
        float n2=fbm(vUv*10.+vec2(7.2,2.1));
        float storm=smoothstep(0.55,0.65,n2)*smoothstep(0.3,0.5,1.-abs(vUv.y-0.62)*2.2);
        vec3 deep=vec3(0.04,0.09,0.48);
        vec3 mid=vec3(0.08,0.18,0.72);
        vec3 bright=vec3(0.22,0.42,0.88);
        vec3 stormCol=vec3(0.55,0.70,0.95);
        vec3 col=mix(deep,mid,n*0.8);
        col=mix(col,bright,n2*0.4);
        col=mix(col,stormCol,storm*0.6);
        float diff=max(0.,dot(vNormal,uLight));
        float lit=0.10+diff*0.90;
        float rim=pow(1.-max(0.,dot(vNormal,normalize(vec3(0,0,1)))),3.)*0.25;
        gl_FragColor=vec4(col*lit+rim*vec3(0.3,0.5,1.),1.);
      }
    `,
  }), []);

  const atmoMat1 = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {},
    vertexShader: /* glsl */`varying vec3 vNormal; void main(){vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: /* glsl */`
      varying vec3 vNormal;
      void main(){
        float rim=pow(1.-max(0.,dot(vNormal,normalize(vec3(0,0,1)))),3.8);
        gl_FragColor=vec4(0.12,0.30,0.90,rim*0.55);
      }
    `,
    transparent: true,
    side: THREE.BackSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), []);

  const atmoMat2 = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {},
    vertexShader: /* glsl */`varying vec3 vNormal; void main(){vNormal=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: /* glsl */`
      varying vec3 vNormal;
      void main(){
        float rim=pow(1.-max(0.,dot(vNormal,normalize(vec3(0,0,1)))),5.5);
        gl_FragColor=vec4(0.08,0.18,0.70,rim*0.30);
      }
    `,
    transparent: true,
    side: THREE.BackSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }), []);

  return (
    <group position={[0, -4, -78]}>
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[2.8, 64, 48]} />
          <primitive object={sphereMat} attach="material" />
        </mesh>
      </group>
      <mesh>
        <sphereGeometry args={[3.1, 48, 36]} />
        <primitive object={atmoMat1} attach="material" />
      </mesh>
      <mesh>
        <sphereGeometry args={[3.55, 48, 36]} />
        <primitive object={atmoMat2} attach="material" />
      </mesh>
    </group>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TRITON
───────────────────────────────────────────────────────────────────────────── */
function TritonMoon() {
  const mat = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      uLight: { value: new THREE.Vector3(-0.6, 0.3, 0.75).normalize() },
    },
    vertexShader: PLANET_VERT,
    fragmentShader: /* glsl */`
      ${NOISE_GLSL}
      uniform vec3 uLight;
      varying vec2 vUv;
      varying vec3 vNormal;
      void main(){
        float n=fbm(vUv*8.+vec2(4.2,1.9));
        float n2=fbm(vUv*18.+vec2(0.5,6.3));
        float craters=step(0.64,fbm(vUv*28.+vec2(2.2,8.1)));
        vec3 base=vec3(0.55,0.48,0.38);
        vec3 dark=vec3(0.32,0.27,0.20);
        vec3 frost=vec3(0.82,0.88,0.92);
        vec3 col=mix(base,dark,n*0.7);
        col=mix(col,dark*0.6,craters*0.5);
        float pole=smoothstep(0.72,0.88,vUv.y)+smoothstep(0.28,0.12,vUv.y);
        col=mix(col,frost,pole*0.6);
        col=mix(col,col+vec3(0.04,0.02,-0.02),n2*0.3);
        float diff=max(0.,dot(vNormal,uLight));
        float lit=0.08+diff*0.92;
        gl_FragColor=vec4(col*lit,1.);
      }
    `,
  }), []);

  return (
    <mesh position={[4.5, -4, -81]}>
      <sphereGeometry args={[0.75, 48, 36]} />
      <primitive object={mat} attach="material" />
    </mesh>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CAMERA CONTROLLER
───────────────────────────────────────────────────────────────────────────── */
const CAMERA_PATH = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0,   3.5,  24),    // 0.00 — wide Saturn shot
  new THREE.Vector3(5,   2.5,  18),    // 0.11 — arc right
  new THREE.Vector3(12,  1.5,  10),    // 0.22 — continuing
  new THREE.Vector3(16,  0.5,   4),    // 0.33 — close Saturn ring detail
  new THREE.Vector3(15, -1,    -6),    // 0.44 — past Saturn
  new THREE.Vector3(8,  -2.5, -26),    // 0.55 — deep space
  new THREE.Vector3(2,  -3.5, -52),    // 0.66 — toward Neptune
  new THREE.Vector3(0,  -4,   -66),    // 0.77 — approaching Neptune
  new THREE.Vector3(2,  -4,   -74.5),  // 0.88 — near Neptune
  new THREE.Vector3(4.5,-4,   -79.5),  // 1.00 — Triton close-up
]);

const SATURN_POS  = new THREE.Vector3(0, 0, 0);
const NEPTUNE_POS = new THREE.Vector3(0, -4, -78);
const TRITON_POS  = new THREE.Vector3(4.5, -4, -81);

function CameraController({ sRef }: { sRef: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  const lookTarget = useRef(new THREE.Vector3().copy(SATURN_POS));

  useFrame(() => {
    const t = sRef.current;

    // Camera position along spline
    const pathT = Math.max(0, Math.min(1, t));
    const desiredPos = CAMERA_PATH.getPoint(pathT);
    camera.position.lerp(desiredPos, 0.06);

    // Look-at target
    let desired: THREE.Vector3;
    if (t < 0.5) {
      desired = SATURN_POS;
    } else if (t < 0.68) {
      const f = (t - 0.5) / 0.18;
      desired = new THREE.Vector3().lerpVectors(SATURN_POS, NEPTUNE_POS, f);
    } else if (t < 0.82) {
      desired = NEPTUNE_POS;
    } else {
      const f = (t - 0.82) / 0.18;
      desired = new THREE.Vector3().lerpVectors(NEPTUNE_POS, TRITON_POS, Math.min(f, 1));
    }
    lookTarget.current.lerp(desired, 0.05);
    camera.lookAt(lookTarget.current);
  });

  return null;
}

/* ─────────────────────────────────────────────────────────────────────────────
   SCENE
───────────────────────────────────────────────────────────────────────────── */
function Scene({ sRef }: { sRef: React.MutableRefObject<number> }) {
  return (
    <>
      <pointLight position={[-80, 40, 80]} intensity={4.5} color="#FFF8F0" />
      <ambientLight intensity={0.025} color="#112244" />
      <Stars />
      <Nebula />
      <SaturnSystem />
      <NeptuneSystem />
      <TritonMoon />
      <CameraController sRef={sRef} />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   EXPORT
───────────────────────────────────────────────────────────────────────────── */
export function SpaceIntro3D({ sRef }: { sRef: React.MutableRefObject<number> }) {
  return (
    <Canvas
      camera={{ position: [0, 3.5, 24], fov: 55, near: 0.1, far: 2000 }}
      gl={{ alpha: false, antialias: true }}
      dpr={[1, 2]}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <Scene sRef={sRef} />
    </Canvas>
  );
}
