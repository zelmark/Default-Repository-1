"use client";

import dynamic from "next/dynamic";
import { useRef, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "framer-motion";

/* Dynamic import — Three.js must be client-only (no SSR) */
const Saturn3D = dynamic(
  () => import("./saturn-3d").then((m) => ({ default: m.Saturn3D })),
  { ssr: false }
);

/* ─────────────────────────────────────────────────────────────────────────────
   STAR FIELD
───────────────────────────────────────────────────────────────────────────── */
function StarField() {
  const stars = useMemo(() => {
    let seed = 42;
    const rand = () => {
      seed = (seed * 16807 + 0) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    const colors = ["#ffffff", "#ffffff", "#ffffff", "#fff8e0", "#ffe8b0", "#d0e8ff", "#ffd0d0"];
    return Array.from({ length: 280 }, (_, i) => ({
      id: i,
      x: rand() * 100,
      y: rand() * 100,
      size: rand() < 0.08 ? rand() * 2.2 + 1.8 : rand() * 1.4 + 0.5,
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
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            backgroundColor: s.color,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, s.opacity, s.opacity * 0.3, s.opacity] }}
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
      animate={{ opacity: [0, 1, 0], x: 200, y: 90 }}
      transition={{ delay, duration: 0.65, ease: "easeOut", repeat: Infinity, repeatDelay: 14 }}
    >
      <div
        style={{
          width: 110,
          height: 1.5,
          background: "linear-gradient(to right, rgba(255,240,160,0.95), transparent)",
          borderRadius: 2,
        }}
      />
    </motion.div>
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
      initial={{ rotateX: fromBelow ? -90 : 90, opacity: 0, y: fromBelow ? 60 : -60 }}
      animate={{ rotateX: 0, opacity: 1, y: 0 }}
      transition={{ delay, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: "inline-block",
        transformOrigin: fromBelow ? "center top" : "center bottom",
        transformStyle: "preserve-3d",
      }}
      className={large ? "font-bold leading-none" : "font-light leading-none"}
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

  /* ── Planet scroll effects ── */
  const rawPlanetY = useTransform(scrollYProgress, [0, 1], [0, -220]);
  const rawScale   = useTransform(scrollYProgress, [0, 1], [1, 0.40]);
  const rawOpacity = useTransform(scrollYProgress, [0.50, 0.88], [1, 0]);

  const planetY     = useSpring(rawPlanetY, { stiffness: 65, damping: 20 });
  const planetScale = useSpring(rawScale,   { stiffness: 65, damping: 20 });

  /* ── Text scroll effects ── */
  const textY       = useTransform(scrollYProgress, [0, 1], [0, -130]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.42, 0.72], [1, 1, 0]);

  const saturn = "SATURN";
  const triton = "TRITON";

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: "290vh" }}
      aria-label="Hero"
    >
      {/* ── Sticky viewport ── */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center">

        {/* Background */}
        <div className="absolute inset-0 bg-[#020203]" />

        {/* Stars */}
        <StarField />

        {/* Shooting stars */}
        <ShootingStar delay={4}  top="16%" left="10%" />
        <ShootingStar delay={11} top="30%" left="66%" />
        <ShootingStar delay={19} top="58%" left="28%" />

        {/* ── Atmospheric glow (behind planet) ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 3 }}
          style={{ position: "absolute", top: "38%", left: "50%", x: "-50%", y: "-50%", zIndex: 0, pointerEvents: "none" }}
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              width: 900,
              height: 900,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(235,185,55,0.38) 0%, rgba(210,165,45,0.18) 30%, rgba(180,140,40,0.06) 58%, transparent 72%)",
              marginLeft: -450,
              marginTop: -450,
            }}
          />
          <motion.div
            animate={{ scale: [1, 1.08, 1], opacity: [0.45, 0.65, 0.45] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            style={{
              position: "absolute",
              width: 1500,
              height: 1500,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(210,168,48,0.14) 0%, rgba(180,140,38,0.07) 40%, transparent 68%)",
              marginLeft: -750,
              marginTop: -750,
            }}
          />
        </motion.div>

        {/* ── 3-D Saturn (Three.js) ── */}
        <motion.div
          initial={{ opacity: 0, y: 280, scale: 0.55 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            y: planetY,
            scale: planetScale,
            opacity: rawOpacity,
            position: "absolute",
            top: "50%",
            left: "50%",
            marginTop: -520,
            marginLeft: -380,
            zIndex: 5,
            pointerEvents: "none",
          }}
        >
          <Saturn3D scrollYProgress={scrollYProgress as MotionValue<number>} />
        </motion.div>

        {/* ── 3-D Title ── */}
        <motion.div
          style={{
            y: textY,
            opacity: textOpacity,
            position: "absolute",
            bottom: "12%",
            left: 0,
            right: 0,
            zIndex: 10,
            perspective: "900px",
            perspectiveOrigin: "center 60%",
          }}
          className="flex flex-col items-center"
        >
          {/* SATURN */}
          <div
            className="flex items-end justify-center text-[clamp(52px,8vw,108px)] text-gold-gradient"
            style={{ gap: "0.02em" }}
          >
            {saturn.split("").map((c, i) => (
              <Letter3D key={`s${i}`} char={c} delay={1.0 + i * 0.09} fromBelow={false} large />
            ))}
          </div>

          {/* Gold divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 1.72, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              height: 1,
              background: "linear-gradient(to right, transparent, #C9A84C 20%, #E2C57A 50%, #C9A84C 80%, transparent)",
              margin: "6px 0",
              width: "110%",
            }}
          />

          {/* TRITON */}
          <div
            className="flex items-start justify-center text-[clamp(18px,2.8vw,38px)] tracking-[0.38em] text-[#C8C0A8]"
            style={{ gap: "0.38em" }}
          >
            {triton.split("").map((c, i) => (
              <Letter3D key={`t${i}`} char={c} delay={1.82 + i * 0.09} fromBelow large={false} />
            ))}
          </div>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.72, duration: 0.9 }}
            className="text-[#6A7080] mt-4 tracking-[0.28em] uppercase"
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
              className="px-7 py-3 rounded-full bg-[#C9A84C] hover:bg-[#E2C57A] text-[#020203] font-semibold text-sm transition-all duration-200 hover:shadow-[0_0_32px_rgba(201,168,76,0.40)]"
            >
              View Portfolio
            </a>
            <a
              href="#about"
              className="px-7 py-3 rounded-full border border-[rgba(255,255,255,0.12)] text-[#EDEDEF] hover:border-[rgba(201,168,76,0.45)] hover:text-[#C9A84C] font-medium text-sm transition-all duration-200"
            >
              Our Approach
            </a>
          </motion.div>
        </motion.div>

        {/* ── Scroll indicator ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 0.8 }}
          style={{ opacity: useTransform(scrollYProgress, [0, 0.14], [1, 0]) }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none"
        >
          <span className="text-[#4A4F5A] text-[9px] tracking-[0.35em] uppercase">Scroll</span>
          <motion.div
            animate={{ scaleY: [1, 0.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-9 bg-gradient-to-b from-[#C9A84C] to-transparent origin-top"
          />
        </motion.div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#020203] to-transparent pointer-events-none z-30" />
      </div>
    </section>
  );
}
