"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Landmark, Building2, Cpu, Zap, Heart, ShoppingBag } from "lucide-react";

const sectors = [
  {
    icon: Landmark,
    title: "Financial Services",
    desc: "Asset management, private credit, insurance, and fintech platforms serving institutional and high-net-worth clients globally.",
    metrics: ["$850M deployed", "3 platforms", "12 yr avg. hold"],
  },
  {
    icon: Building2,
    title: "Real Estate",
    desc: "Commercial, logistics, and multifamily development and investment across top-tier North American and European markets.",
    metrics: ["4.2M sq ft", "8 markets", "92% occupancy"],
  },
  {
    icon: Cpu,
    title: "Technology",
    desc: "Enterprise software, AI infrastructure, and data platforms that generate recurring revenue and exhibit strong network effects.",
    metrics: ["$240M ARR", "500+ clients", "40% YoY growth"],
  },
  {
    icon: Zap,
    title: "Energy & Infrastructure",
    desc: "Renewable energy generation, transmission infrastructure, and energy storage development with multi-decade contracted revenue.",
    metrics: ["3.2 GW pipeline", "7 states", "25 yr contracts"],
  },
  {
    icon: Heart,
    title: "Healthcare",
    desc: "Outpatient services, diagnostics, telehealth, and specialty pharmacy — focused on improving access and outcomes at scale.",
    metrics: ["180+ clinics", "2.1M patients", "4 specialties"],
  },
  {
    icon: ShoppingBag,
    title: "Consumer & Retail",
    desc: "Branded consumer products and omnichannel retail businesses with differentiated positioning and loyal customer bases.",
    metrics: ["Placeholder metric", "Placeholder metric", "Placeholder metric"],
  },
];

export function Sectors() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="sectors" ref={ref} className="py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-[#C9A84C] text-xs font-semibold tracking-widest uppercase mb-4"
          >
            Investment Focus
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl lg:text-5xl font-bold text-[#EDEDEF] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Where We Invest
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-[#8A8F98] text-base leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            We concentrate capital in sectors where structural tailwinds, high barriers to entry,
            and operational complexity reward long-term, engaged ownership.
          </motion.p>
        </div>

        {/* Sectors grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(255,255,255,0.05)] rounded-3xl overflow-hidden border border-[rgba(255,255,255,0.05)]">
          {sectors.map((sector, i) => {
            const Icon = sector.icon;
            return (
              <motion.div
                key={sector.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="bg-[#020203] p-8 flex flex-col gap-5 hover:bg-[#0a0a0f] transition-colors duration-300 group"
              >
                <div className="w-11 h-11 rounded-xl bg-[rgba(201,168,76,0.08)] flex items-center justify-center group-hover:bg-[rgba(201,168,76,0.14)] transition-colors">
                  <Icon className="w-5 h-5 text-[#C9A84C]" />
                </div>

                <div>
                  <h3
                    className="text-[#EDEDEF] font-semibold text-base mb-2"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {sector.title}
                  </h3>
                  <p
                    className="text-[#8A8F98] text-sm leading-relaxed"
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {sector.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-[rgba(255,255,255,0.05)]">
                  {sector.metrics.map((m) => (
                    <span
                      key={m}
                      className="text-[10px] text-[#5A5F6A] font-medium px-2.5 py-1 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)]"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
