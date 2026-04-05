"use client";

import { useRef, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";

/* ─────────────────────────────────────────────────────────────────────────────
   STAR FIELD
───────────────────────────────────────────────────────────────────────────── */
function StarField() {
  const stars = useMemo(
    () =>
      Array.from({ length: 220 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 1.8 + 0.3,
        delay: Math.random() * 4,
        duration: Math.random() * 4 + 2,
        opacity: Math.random() * 0.65 + 0.1,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, s.opacity, s.opacity * 0.25, s.opacity] }}
          transition={{ delay: s.delay, duration: s.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SHOOTING STARS
───────────────────────────────────────────────────────────────────────────── */
function ShootingStar({ delay, top, left }: { delay: number; top: string; left: string }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ top, left, rotate: -30 }}
      initial={{ opacity: 0, x: 0, y: 0 }}
      animate={{ opacity: [0, 1, 0], x: 180, y: 80 }}
      transition={{ delay, duration: 0.7, ease: "easeOut", repeat: Infinity, repeatDelay: 12 }}
    >
      <div
        style={{
          width: 90,
          height: 1.5,
          background: "linear-gradient(to right, rgba(201,168,76,0.9), transparent)",
          borderRadius: 2,
        }}
      />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SATURN PLANET + RINGS
───────────────────────────────────────────────────────────────────────────── */
function Saturn({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const ringTilt = useTransform(scrollYProgress, [0, 1], [74, 58]);
  const ringSpring = useSpring(ringTilt, { stiffness: 55, damping: 22 });
  const planetRotateZ = useTransform(scrollYProgress, [0, 1], [0, 6]);

  const P = 400; // planet diameter

  const bands = [
    { top: "13%", h: "4%",  dark: false, op: 0.16 },
    { top: "20%", h: "2.5%",dark: true,  op: 0.18 },
    { top: "27%", h: "6%",  dark: false, op: 0.14 },
    { top: "36%", h: "3%",  dark: true,  op: 0.20 },
    { top: "42%", h: "7%",  dark: false, op: 0.12 },
    { top: "52%", h: "3.5%",dark: true,  op: 0.16 },
    { top: "58%", h: "5%",  dark: false, op: 0.13 },
    { top: "67%", h: "2.5%",dark: true,  op: 0.15 },
    { top: "73%", h: "4%",  dark: false, op: 0.12 },
    { top: "80%", h: "2%",  dark: true,  op: 0.10 },
  ];

  // Ring band definitions [rx, ry, color, strokeWidth]
  const ringBands: [number, number, string, number][] = [
    [530, 95,  "rgba(120,80,20,0.20)",   8],
    [510, 91,  "rgba(160,110,35,0.28)",  10],
    [488, 87,  "rgba(190,145,55,0.38)",  14],
    [462, 83,  "rgba(210,170,70,0.52)",  18],
    [436, 78,  "rgba(225,185,80,0.62)",  22],
    [408, 73,  "rgba(215,175,75,0.55)",  16],
    [382, 68,  "rgba(195,155,60,0.42)",  12],
    [354, 63,  "rgba(170,130,48,0.32)",  10],
    [326, 58,  "rgba(145,105,35,0.22)",  8],
    [296, 53,  "rgba(120,80,22,0.15)",   6],
  ];

  const svgW = 1200;
  const svgH = 280;
  const cx = svgW / 2;
  const cy = svgH / 2;

  return (
    <div style={{ position: "relative", width: P, height: P }} aria-hidden>

      {/* ── BACK HALF OF RINGS (behind planet) ─────────────────────────────── */}
      <motion.svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: svgW,
          height: svgH,
          marginLeft: -svgW / 2,
          marginTop: -svgH / 2,
          rotateX: ringSpring,
          zIndex: 0,
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        <defs>
          {/* Clip: bottom half only */}
          <clipPath id="ring-back">
            <rect x={0} y={cy} width={svgW} height={svgH} />
          </clipPath>
        </defs>
        <g clipPath="url(#ring-back)">
          {ringBands.map(([rx, ry, color, sw], i) => (
            <ellipse
              key={i}
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              fill="none"
              stroke={color}
              strokeWidth={sw}
            />
          ))}
        </g>
      </motion.svg>

      {/* ── PLANET BODY ────────────────────────────────────────────────────── */}
      <motion.div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: P,
          height: P,
          borderRadius: "50%",
          zIndex: 1,
          overflow: "hidden",
          rotateZ: planetRotateZ,
          background: `radial-gradient(
            ellipse at 38% 30%,
            #FAF0B8 0%,
            #ECD870 7%,
            #D4AA40 17%,
            #B88228 30%,
            #8B5C14 46%,
            #5C380A 63%,
            #3C2206 78%,
            #1E1105 100%
          )`,
          boxShadow: `
            inset -${P * 0.24}px -${P * 0.12}px ${P * 0.38}px rgba(0,0,0,0.82),
            inset ${P * 0.06}px ${P * 0.04}px ${P * 0.14}px rgba(255,220,100,0.05),
            0 0 ${P * 0.32}px rgba(201,168,76,0.24),
            0 0 ${P * 0.65}px rgba(201,168,76,0.10),
            0 0 ${P * 1.1}px rgba(201,168,76,0.04)
          `,
          willChange: "transform",
        }}
      >
        {/* Atmospheric bands */}
        {bands.map((b, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: b.top,
              left: 0,
              right: 0,
              height: b.h,
              background: `rgba(${b.dark ? "60,28,4" : "200,158,55"},${b.op})`,
            }}
          />
        ))}
        {/* Polar highlight */}
        <div
          style={{
            position: "absolute",
            top: "6%",
            left: "44%",
            width: "20%",
            height: "14%",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(255,242,190,0.18) 0%, transparent 70%)",
            transform: "rotate(-22deg)",
          }}
        />
        {/* Terminator shadow edge */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at 80% 50%, rgba(0,0,0,0.55) 0%, transparent 55%)",
          }}
        />
      </motion.div>

      {/* ── FRONT HALF OF RINGS (in front of planet) ───────────────────────── */}
      <motion.svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: svgW,
          height: svgH,
          marginLeft: -svgW / 2,
          marginTop: -svgH / 2,
          rotateX: ringSpring,
          zIndex: 2,
          overflow: "visible",
          pointerEvents: "none",
        }}
      >
        <defs>
          {/* Clip: top half only */}
          <clipPath id="ring-front">
            <rect x={0} y={0} width={svgW} height={cy} />
          </clipPath>
          {/* Planet mask – hide ring section that overlaps planet body */}
          <mask id="planet-hole">
            <rect x={0} y={0} width={svgW} height={svgH} fill="white" />
            <ellipse cx={cx} cy={cy} rx={P / 2} ry={P / 2} fill="black" />
          </mask>
        </defs>
        <g clipPath="url(#ring-front)" mask="url(#planet-hole)">
          {ringBands.map(([rx, ry, color, sw], i) => (
            <ellipse
              key={i}
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              fill="none"
              stroke={color}
              strokeWidth={sw}
            />
          ))}
        </g>
      </motion.svg>

      {/* ── ORBITING MOON (Triton) ──────────────────────────────────────────── */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: P * 1.7,
          height: P * 1.7,
          marginLeft: -(P * 1.7) / 2,
          marginTop: -(P * 1.7) / 2,
          borderRadius: "50%",
          zIndex: 3,
          pointerEvents: "none",
        }}
      >
        {/* Moon body */}
        <div
          style={{
            position: "absolute",
            top: "3%",
            left: "50%",
            width: P * 0.085,
            height: P * 0.085,
            marginLeft: -(P * 0.085) / 2,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 38% 35%, #dce6f5 0%, #8fa0bc 55%, #4a5870 100%)",
            boxShadow: `inset -4px -3px 10px rgba(0,0,0,0.65), 0 0 18px rgba(180,200,230,0.28)`,
          }}
        />
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   3-D LETTER
───────────────────────────────────────────────────────────────────────────── */
function Letter3D({
  char,
  delay,
  fromBelow,
  large,
}: {
  char: string;
  delay: number;
  fromBelow: boolean;
  large: boolean;
}) {
  return (
    <motion.span
      initial={{
        rotateX: fromBelow ? -90 : 90,
        opacity: 0,
        y: fromBelow ? 60 : -60,
      }}
      animate={{ rotateX: 0, opacity: 1, y: 0 }}
      transition={{
        delay,
        duration: 1.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        display: "inline-block",
        transformOrigin: fromBelow ? "center top" : "center bottom",
        transformStyle: "preserve-3d",
      }}
      className={
        large
          ? "font-bold leading-none"
          : "font-light leading-none"
      }
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────────────────────────── */
export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  /* ── Planet movement ── */
  const rawPlanetY  = useTransform(scrollYProgress, [0, 1], [0, -260]);
  const rawScale    = useTransform(scrollYProgress, [0, 1], [1, 0.42]);
  const rawOpacity  = useTransform(scrollYProgress, [0.55, 0.9], [1, 0]);

  const planetY     = useSpring(rawPlanetY,  { stiffness: 70, damping: 22 });
  const planetScale = useSpring(rawScale,    { stiffness: 70, damping: 22 });

  /* ── Text movement ── */
  const textY       = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.45, 0.75], [1, 1, 0]);

  /* ── Glow pulse (independent) ── */
  const glowOpacity = useTransform(scrollYProgress, [0, 0.4, 0.8], [0.8, 1, 0]);

  const saturn = "SATURN";
  const triton = "TRITON";

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: "290vh" }}
      aria-label="Hero"
    >
      {/* ── Sticky scene ── */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center">

        {/* Background */}
        <div className="absolute inset-0 bg-[#020203]" />

        {/* Stars */}
        <StarField />

        {/* Shooting stars */}
        <ShootingStar delay={4}  top="18%" left="12%" />
        <ShootingStar delay={11} top="32%" left="68%" />
        <ShootingStar delay={18} top="55%" left="30%" />

        {/* ── Atmospheric glow behind planet ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 2.5 }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%",
            pointerEvents: "none",
            zIndex: 0,
          }}
          className="pointer-events-none"
        >
          {/* Outer diffuse glow */}
          <div
            style={{
              width: 900,
              height: 900,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(201,168,76,0.13) 0%, rgba(201,168,76,0.06) 40%, transparent 68%)",
              marginLeft: -450 + 200,
              marginTop: -450 + 200,
            }}
          />
        </motion.div>

        {/* ── Saturn planet (absolute center, scroll-driven) ── */}
        <motion.div
          initial={{ opacity: 0, y: 260, scale: 0.65 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.35, duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          style={{
            y: planetY,
            scale: planetScale,
            opacity: rawOpacity,
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: -380,
            marginLeft: -200,
            zIndex: 5,
            pointerEvents: "none",
          }}
        >
          <Saturn scrollYProgress={scrollYProgress} />
        </motion.div>

        {/* ── 3-D Title ── */}
        <motion.div
          style={{
            y: textY,
            opacity: textOpacity,
            position: "absolute",
            bottom: "14%",
            left: 0,
            right: 0,
            zIndex: 10,
            perspective: "900px",
            perspectiveOrigin: "center 60%",
          }}
          className="flex flex-col items-center"
        >
          {/* SATURN — large, gold */}
          <div className="flex items-end justify-center" style={{ gap: "0.02em" }}>
            {saturn.split("").map((c, i) => (
              <Letter3D
                key={`s${i}`}
                char={c}
                delay={1.0 + i * 0.09}
                fromBelow={false}
                large
              />
            ))}
          </div>

          {/* Thin gold divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 1.72, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              height: 1,
              background:
                "linear-gradient(to right, transparent, #C9A84C 20%, #E2C57A 50%, #C9A84C 80%, transparent)",
              margin: "6px 0",
              width: "110%",
            }}
          />

          {/* TRITON — lighter, slightly smaller, letter-spacing */}
          <div
            className="flex items-start justify-center"
            style={{ gap: "0.38em", letterSpacing: "0.38em" }}
          >
            {triton.split("").map((c, i) => (
              <Letter3D
                key={`t${i}`}
                char={c}
                delay={1.82 + i * 0.09}
                fromBelow={true}
                large={false}
              />
            ))}
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.72, duration: 0.9 }}
            className="text-[#8A8F98] mt-4 tracking-[0.28em] uppercase"
            style={{ fontSize: "clamp(9px, 1.1vw, 12px)" }}
          >
            Global Holding Company
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.0, duration: 0.8 }}
            className="flex items-center gap-4 mt-8"
          >
            <a
              href="#portfolio"
              className="px-7 py-3 rounded-full bg-[#C9A84C] hover:bg-[#E2C57A] text-[#020203] font-semibold text-sm transition-all duration-200 hover:shadow-[0_0_28px_rgba(201,168,76,0.35)]"
            >
              View Portfolio
            </a>
            <a
              href="#about"
              className="px-7 py-3 rounded-full border border-[rgba(255,255,255,0.12)] text-[#EDEDEF] hover:border-[rgba(201,168,76,0.4)] hover:text-[#C9A84C] font-medium text-sm transition-all duration-200"
            >
              Our Approach
            </a>
          </motion.div>
        </motion.div>

        {/* ── Scroll indicator ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.4, duration: 0.8 }}
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]),
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none"
        >
          <span className="text-[#5A5F6A] text-[9px] tracking-[0.35em] uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ scaleY: [1, 0.3, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-9 bg-gradient-to-b from-[#C9A84C] to-transparent origin-top"
          />
        </motion.div>

        {/* ── Bottom fade into page ── */}
        <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#020203] to-transparent pointer-events-none z-30" />
      </div>

      {/* ── Stats teaser at bottom of hero scroll ── */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none" />
    </section>
  );
}
