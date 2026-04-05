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
  // Seeded random so SSR matches client
  const stars = useMemo(() => {
    let seed = 42;
    const rand = () => { seed = (seed * 16807 + 0) % 2147483647; return (seed - 1) / 2147483646; };
    const colors = ["#ffffff", "#ffffff", "#ffffff", "#fff8e0", "#ffe8b0", "#d0e8ff", "#ffd0d0"];
    return Array.from({ length: 280 }, (_, i) => ({
      id: i,
      x: rand() * 100,
      y: rand() * 100,
      size: rand() < 0.08 ? rand() * 2.2 + 1.8 : rand() * 1.4 + 0.5, // occasional bright stars
      delay: rand() * 6,
      duration: rand() * 5 + 2.5,
      opacity: rand() * 0.75 + 0.25,
      color: colors[Math.floor(rand() * colors.length)],
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, backgroundColor: s.color }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, s.opacity, s.opacity * 0.30, s.opacity] }}
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

  const P = 560; // planet diameter — larger + more detailed

  // Vibrant atmospheric bands with real-Saturn-style contrast
  const bands = [
    { top: "7%",  h: "3%",   color: "rgba(255,238,160,0.42)" },
    { top: "12%", h: "5%",   color: "rgba(248,220,130,0.32)" },
    { top: "18%", h: "2.5%", color: "rgba(80,40,8,0.55)" },
    { top: "22%", h: "4.5%", color: "rgba(252,225,138,0.36)" },
    { top: "28%", h: "2%",   color: "rgba(70,34,6,0.50)" },
    { top: "32%", h: "5%",   color: "rgba(240,200,108,0.26)" },
    { top: "39%", h: "2%",   color: "rgba(65,30,5,0.46)" },
    { top: "43%", h: "4%",   color: "rgba(228,185,92,0.22)" },
    { top: "49%", h: "2%",   color: "rgba(60,28,4,0.42)" },
    { top: "53%", h: "3.5%", color: "rgba(215,172,80,0.20)" },
    { top: "58%", h: "1.8%", color: "rgba(55,24,4,0.36)" },
    { top: "62%", h: "3%",   color: "rgba(200,158,68,0.17)" },
    { top: "67%", h: "1.5%", color: "rgba(50,22,3,0.30)" },
    { top: "71%", h: "2.5%", color: "rgba(185,145,58,0.14)" },
    { top: "76%", h: "1.5%", color: "rgba(45,20,3,0.25)" },
    { top: "80%", h: "2%",   color: "rgba(170,132,50,0.12)" },
    { top: "85%", h: "1.2%", color: "rgba(40,18,2,0.20)" },
  ];

  // Ring system: C ring → B ring (bright) → Cassini Division → A ring → F ring → outer
  // SVG coord system: planet center at (cx, cy), planet radius P/2 = 280
  const svgW = 1900;
  const svgH = 460;
  const cx = svgW / 2;
  const cy = svgH / 2;

  // [rx, ry, color, strokeWidth]
  const ringBands: [number, number, string, number][] = [
    // ── C ring (inner, translucent brownish-tan)
    [294, 49,  "rgba(165,122,60,0.30)",  7],
    [308, 51,  "rgba(155,115,54,0.38)",  8],
    [322, 54,  "rgba(162,122,58,0.42)",  9],
    [336, 56,  "rgba(168,130,64,0.44)",  9],
    [350, 58,  "rgba(172,135,68,0.42)",  8],

    // ── B ring (WIDEST, BRIGHTEST — cream / warm white / golden)
    [368, 61,  "rgba(210,182,108,0.62)", 14],
    [386, 64,  "rgba(228,204,130,0.75)", 18],
    [406, 68,  "rgba(244,222,150,0.85)", 22],
    [426, 71,  "rgba(252,234,162,0.92)", 27],
    [446, 75,  "rgba(255,240,168,0.96)", 30], // peak brightness
    [466, 78,  "rgba(255,238,165,0.96)", 30],
    [486, 82,  "rgba(252,232,158,0.91)", 27],
    [504, 85,  "rgba(244,220,146,0.84)", 22],
    [520, 87,  "rgba(228,202,126,0.74)", 18],
    [534, 90,  "rgba(210,180,104,0.60)", 13],

    // ── Cassini Division (prominent dark gap)
    [549, 92,  "rgba(4,2,1,0.96)",       16],
    [563, 94,  "rgba(6,3,1,0.92)",       11],

    // ── A ring (bright, slightly warmer tint than B)
    [578, 97,  "rgba(205,175,102,0.58)", 13],
    [596, 100, "rgba(220,190,112,0.68)", 17],
    [614, 103, "rgba(230,200,120,0.76)", 19],
    [630, 106, "rgba(226,196,116,0.72)", 17],
    [646, 109, "rgba(215,184,106,0.62)", 13],
    [662, 111, "rgba(198,168,92,0.50)",  10],
    [676, 114, "rgba(180,150,78,0.38)",  8],

    // ── F ring (narrow, distinct bright line)
    [700, 117, "rgba(242,220,154,0.56)",  4],
    [706, 118, "rgba(238,215,148,0.44)",  3],

    // ── G / outer diffuse rings
    [728, 122, "rgba(158,128,68,0.26)",   6],
    [756, 126, "rgba(138,110,55,0.17)",   5],
    [784, 131, "rgba(118,94,44,0.10)",    4],
    [812, 135, "rgba(98,78,34,0.06)",     4],
    [840, 140, "rgba(78,62,26,0.04)",     3],
  ];

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
        {/* Planet shadow cast on back rings (shadow falls right of planet) */}
        <defs>
          <radialGradient id="ring-shadow-grad" cx="62%" cy="50%" r="38%">
            <stop offset="0%" stopColor="rgba(0,0,0,0.55)" />
            <stop offset="60%" stopColor="rgba(0,0,0,0.20)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
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
          {/* Planet shadow on rings */}
          <ellipse cx={cx} cy={cy} rx={620} ry={112} fill="url(#ring-shadow-grad)" />
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
            ellipse at 36% 28%,
            #FFFCE8 0%,
            #FAE86A 4%,
            #F2D045 10%,
            #E6B828 18%,
            #D49820 28%,
            #BE7C18 40%,
            #9A5C12 54%,
            #6E380A 68%,
            #401E04 82%,
            #1A0C02 100%
          )`,
          boxShadow: `
            inset -${P * 0.22}px -${P * 0.10}px ${P * 0.32}px rgba(0,0,0,0.75),
            inset ${P * 0.07}px ${P * 0.05}px ${P * 0.20}px rgba(255,228,120,0.14),
            inset ${P * 0.02}px ${P * 0.02}px ${P * 0.08}px rgba(255,245,200,0.22),
            0 0 ${P * 0.22}px rgba(240,195,65,0.55),
            0 0 ${P * 0.45}px rgba(225,178,55,0.30),
            0 0 ${P * 0.80}px rgba(201,168,76,0.16),
            0 0 ${P * 1.40}px rgba(201,168,76,0.07)
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
              background: b.color,
            }}
          />
        ))}
        {/* North polar hexagonal region (subtle blue-grey tint) */}
        <div
          style={{
            position: "absolute",
            top: "0%",
            left: "25%",
            width: "50%",
            height: "18%",
            borderRadius: "0 0 50% 50%",
            background: "radial-gradient(ellipse at 50% 20%, rgba(160,185,220,0.18) 0%, transparent 70%)",
          }}
        />
        {/* Bright equatorial highlight streak */}
        <div
          style={{
            position: "absolute",
            top: "42%",
            left: "8%",
            right: "8%",
            height: "1.2%",
            background: "rgba(255,245,190,0.22)",
            borderRadius: 4,
            filter: "blur(1px)",
          }}
        />
        {/* Specular highlight spot */}
        <div
          style={{
            position: "absolute",
            top: "14%",
            left: "28%",
            width: "18%",
            height: "10%",
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(255,252,220,0.38) 0%, transparent 70%)",
            transform: "rotate(-18deg)",
            filter: "blur(2px)",
          }}
        />
        {/* Terminator shadow — right side darkening */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at 82% 52%, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.30) 35%, transparent 58%)",
          }}
        />
        {/* Limb darkening overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.45) 78%, rgba(0,0,0,0.70) 100%)",
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
            {/* mask out planet body — radius = P/2 = 280, plus 2px feather */}
            <ellipse cx={cx} cy={cy} rx={282} ry={282} fill="black" />
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

        {/* ── Multi-layer atmospheric glow ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 3.0 }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%",
            pointerEvents: "none",
            zIndex: 0,
            marginTop: -380,
            marginLeft: -200,
          }}
          className="pointer-events-none"
        >
          {/* Innermost tight golden halo */}
          <motion.div
            animate={{ scale: [1, 1.04, 1], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              width: 800,
              height: 800,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(240,195,60,0.42) 0%, rgba(225,175,50,0.22) 28%, rgba(201,168,76,0.08) 52%, transparent 68%)",
              marginLeft: -120,  /* -400 + 280 */
              marginTop: -120,
            }}
          />
          {/* Wide diffuse golden nebula */}
          <motion.div
            animate={{ scale: [1, 1.06, 1], opacity: [0.65, 0.85, 0.65] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            style={{
              position: "absolute",
              width: 1400,
              height: 1400,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(220,175,50,0.18) 0%, rgba(201,160,60,0.10) 35%, rgba(180,140,50,0.04) 60%, transparent 75%)",
              marginLeft: -420,  /* -700 + 280 */
              marginTop: -420,
            }}
          />
          {/* Subtle cool rim (space atmosphere) */}
          <div
            style={{
              position: "absolute",
              width: 1100,
              height: 1100,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, transparent 38%, rgba(80,100,190,0.06) 55%, rgba(60,80,160,0.03) 70%, transparent 82%)",
              marginLeft: -270,  /* -550 + 280 */
              marginTop: -270,
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
            marginTop: -440,
            marginLeft: -280,
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
