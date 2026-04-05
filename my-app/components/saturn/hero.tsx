"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, TrendingUp, Globe, Layers } from "lucide-react";

const badges = [
  { icon: TrendingUp, label: "$2.4B+ AUM" },
  { icon: Globe, label: "12 Countries" },
  { icon: Layers, label: "18+ Portfolio Companies" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <motion.div
          animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute w-[700px] h-[700px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 65%)",
            top: "-10%",
            left: "-5%",
          }}
        />
        <motion.div
          animate={{ x: [0, -50, 30, 0], y: [0, 40, -20, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(94,106,210,0.12) 0%, transparent 65%)",
            bottom: "-5%",
            right: "-5%",
          }}
        />
        <motion.div
          animate={{ x: [0, 20, -40, 0], y: [0, -15, 35, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
            top: "40%",
            right: "20%",
          }}
        />
      </div>

      {/* Ring decoration */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden
      >
        <div
          className="w-[600px] h-[600px] rounded-full border border-[rgba(201,168,76,0.06)] absolute"
          style={{ transform: "rotate(-12deg)" }}
        />
        <div
          className="w-[820px] h-[820px] rounded-full border border-[rgba(201,168,76,0.04)] absolute"
          style={{ transform: "rotate(-12deg)" }}
        />
        <div
          className="w-[1060px] h-[1060px] rounded-full border border-[rgba(255,255,255,0.025)] absolute"
          style={{ transform: "rotate(-12deg)" }}
        />
      </div>

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 text-center max-w-5xl mx-auto px-6 flex flex-col items-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[rgba(201,168,76,0.3)] bg-[rgba(201,168,76,0.06)] text-[#C9A84C] text-xs font-medium tracking-widest uppercase mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] animate-pulse" />
          Global Holding Company
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#EDEDEF] mb-6"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Building{" "}
          <span className="text-gold-gradient">Enduring</span>
          <br />
          Enterprise Value
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg text-[#8A8F98] max-w-2xl leading-relaxed mb-10"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Saturn Triton, LLC is a diversified holding company with a long-term
          perspective on value creation. We partner with exceptional businesses
          across high-growth sectors to build lasting legacies.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#portfolio"
            className="px-7 py-3 rounded-full bg-[#C9A84C] hover:bg-[#E2C57A] text-[#020203] font-semibold text-sm transition-all duration-200 hover:shadow-[0_0_30px_rgba(201,168,76,0.3)]"
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

        {/* Badge row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-14"
        >
          {badges.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-[#8A8F98]"
            >
              <Icon className="w-4 h-4 text-[#C9A84C]" />
              <span>{label}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="w-5 h-5 text-[#5A5F6A]" aria-hidden />
        </motion.div>
      </motion.div>
    </section>
  );
}
