"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

const SpaceIntro3D = dynamic(
  () => import("./space-intro-3d").then((m) => ({ default: m.SpaceIntro3D })),
  { ssr: false }
);

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sRef = useRef<number>(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    sRef.current = v;
  });

  /* Black overlay: fades in near the end */
  const overlayOpacity = useTransform(scrollYProgress, [0.86, 0.97], [0, 1]);

  /* Title: fades in as sequence ends */
  const titleOpacity = useTransform(scrollYProgress, [0.93, 1.00], [0, 1]);
  const titleY       = useTransform(scrollYProgress, [0.93, 1.00], [24, 0]);

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: "600vh" }}
      aria-label="Hero"
    >
      {/* ── Sticky viewport ── */}
      <div className="sticky top-0 h-screen overflow-hidden">

        {/* Three.js canvas — full screen */}
        <SpaceIntro3D sRef={sRef} />

        {/* Black fade overlay */}
        <motion.div
          className="absolute inset-0 bg-[#020203] pointer-events-none"
          style={{ opacity: overlayOpacity, zIndex: 10 }}
        />

        {/* Title reveal */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY, zIndex: 20 }}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        >
          {/* Main title */}
          <h1
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(36px, 6vw, 88px)",
              letterSpacing: "0.12em",
              color: "#C9A84C",
              textAlign: "center",
              lineHeight: 1,
              textShadow: "0 0 60px rgba(201,168,76,0.45)",
            }}
          >
            SATURN TRITON LLC
          </h1>

          {/* Gold divider */}
          <div
            style={{
              height: 1,
              width: "min(520px, 72vw)",
              background: "linear-gradient(to right, transparent, #C9A84C 20%, #E2C57A 50%, #C9A84C 80%, transparent)",
              margin: "18px 0 14px",
            }}
          />

          {/* Tagline */}
          <p
            style={{
              color: "#8A8070",
              fontSize: "clamp(9px, 1.1vw, 13px)",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              fontFamily: "inherit",
            }}
          >
            Global Holding Company
          </p>

          {/* CTA buttons — only interactive once overlay is up */}
          <motion.div
            className="flex items-center gap-4 mt-10 pointer-events-auto"
            style={{ opacity: useTransform(scrollYProgress, [0.97, 1.00], [0, 1]) }}
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

        {/* Scroll indicator — visible at top */}
        <motion.div
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.06], [1, 0]),
            zIndex: 15,
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="text-[#4A4F5A] text-[9px] tracking-[0.35em] uppercase">Scroll</span>
          <motion.div
            animate={{ scaleY: [1, 0.3, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-9 bg-gradient-to-b from-[#C9A84C] to-transparent origin-top"
          />
        </motion.div>

      </div>
    </section>
  );
}
