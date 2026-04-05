"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Target, Handshake, BarChart3 } from "lucide-react";

const pillars = [
  {
    icon: Shield,
    title: "Capital Preservation",
    desc: "We prioritize protecting our partners' capital through rigorous due diligence, disciplined portfolio construction, and active risk management across all market cycles.",
  },
  {
    icon: Target,
    title: "Strategic Focus",
    desc: "Our investments concentrate on sectors where we have deep operational expertise, enabling us to identify differentiated opportunities and support portfolio growth.",
  },
  {
    icon: Handshake,
    title: "Long-Term Partnership",
    desc: "We take a patient, relationship-driven approach. Our holding structure eliminates pressure for premature exits, aligning our interests fully with our portfolio companies.",
  },
  {
    icon: BarChart3,
    title: "Value Creation",
    desc: "Beyond capital, we provide operational support, strategic guidance, and access to our global network—actively partnering with management to unlock enterprise value.",
  },
];

export function About() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" ref={ref} className="py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left: text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-[#C9A84C] text-xs font-semibold tracking-widest uppercase mb-4"
            >
              About Saturn Triton
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl lg:text-5xl font-bold text-[#EDEDEF] mb-6 leading-tight"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              A Different Kind of{" "}
              <span className="text-gold-gradient">Holding Company</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-[#8A8F98] text-base leading-relaxed mb-4"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Founded with a vision to build an enduring enterprise, Saturn Triton, LLC operates
              as a permanent capital vehicle — acquiring, growing, and holding exceptional
              businesses for the long term.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-[#8A8F98] text-base leading-relaxed mb-8"
              style={{ fontFamily: "var(--font-body)" }}
            >
              We seek businesses with durable competitive advantages, strong management teams,
              and meaningful growth potential. Our decentralized model empowers portfolio
              company leadership while providing the resources and strategic support of
              a global platform.
            </motion.p>

            <motion.a
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.5 }}
              href="#portfolio"
              className="inline-flex items-center gap-2 text-[#C9A84C] font-medium text-sm hover:text-[#E2C57A] transition-colors group"
            >
              Explore our holdings
              <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </motion.a>
          </div>

          {/* Right: pillars */}
          <div className="grid sm:grid-cols-2 gap-4">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <motion.div
                  key={pillar.title}
                  initial={{ opacity: 0, y: 28 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="glass rounded-2xl p-6 hover:border-[rgba(201,168,76,0.2)] transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-[rgba(201,168,76,0.1)] flex items-center justify-center mb-4 group-hover:bg-[rgba(201,168,76,0.15)] transition-colors">
                    <Icon className="w-5 h-5 text-[#C9A84C]" />
                  </div>
                  <h3
                    className="text-[#EDEDEF] font-semibold text-sm mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {pillar.title}
                  </h3>
                  <p className="text-[#8A8F98] text-xs leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                    {pillar.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
