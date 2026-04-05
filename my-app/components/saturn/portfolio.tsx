"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Building2, Cpu, Zap, TrendingUp, Heart, ShoppingBag, ArrowUpRight } from "lucide-react";

const companies = [
  {
    name: "Triton Capital Group",
    sector: "Financial Services",
    description: "A full-service investment management firm specializing in alternative assets, private credit, and structured finance solutions for institutional clients.",
    icon: TrendingUp,
    accent: "#C9A84C",
    tag: "Wholly Owned",
    founded: "2019",
  },
  {
    name: "Saturn Properties",
    sector: "Real Estate",
    description: "Premium commercial and mixed-use real estate developer with an active portfolio spanning Class-A office, logistics, and multifamily assets across major markets.",
    icon: Building2,
    accent: "#5E6AD2",
    tag: "Majority Stake",
    founded: "2018",
  },
  {
    name: "Orbit Technologies",
    sector: "Technology",
    description: "Enterprise software platform delivering AI-driven workflow automation and data intelligence tools to Fortune 500 clients across finance, healthcare, and logistics.",
    icon: Cpu,
    accent: "#C9A84C",
    tag: "Wholly Owned",
    founded: "2021",
  },
  {
    name: "Titan Energy Partners",
    sector: "Energy & Infrastructure",
    description: "Developer and operator of utility-scale renewable energy projects — solar, wind, and battery storage — with a 3.2 GW development pipeline across North America.",
    icon: Zap,
    accent: "#5E6AD2",
    tag: "Majority Stake",
    founded: "2020",
  },
  {
    name: "Nebula Ventures",
    sector: "Venture Capital",
    description: "Early-stage venture fund focused on deep-tech, biotech, and climate-tech startups. Portfolio spans 34 companies across Series A and B with 4 unicorn exits.",
    icon: TrendingUp,
    accent: "#C9A84C",
    tag: "Management Entity",
    founded: "2018",
  },
  {
    name: "Cassini Health",
    sector: "Healthcare",
    description: "Integrated healthcare services provider operating outpatient clinics, telehealth platforms, and diagnostics labs with a focus on underserved communities.",
    icon: Heart,
    accent: "#5E6AD2",
    tag: "Majority Stake",
    founded: "2022",
  },
];

export function Portfolio() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="portfolio" ref={ref} className="py-28 lg:py-36 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-[#C9A84C] text-xs font-semibold tracking-widest uppercase mb-4"
          >
            Our Holdings
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl lg:text-5xl font-bold text-[#EDEDEF] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Portfolio Companies
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-[#8A8F98] text-base leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            A curated collection of market-leading businesses across high-growth
            sectors, each benefiting from shared resources and strategic guidance.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((co, i) => {
            const Icon = co.icon;
            return (
              <motion.article
                key={co.name}
                initial={{ opacity: 0, y: 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="glass rounded-2xl p-6 flex flex-col gap-4 hover:border-[rgba(201,168,76,0.18)] hover:bg-[rgba(255,255,255,0.035)] transition-all duration-300 group cursor-default"
              >
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${co.accent}18` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: co.accent }} />
                  </div>
                  <span className="text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full border"
                    style={{
                      color: co.accent,
                      borderColor: `${co.accent}30`,
                      background: `${co.accent}0f`,
                    }}
                  >
                    {co.tag}
                  </span>
                </div>

                {/* Name + sector */}
                <div>
                  <h3
                    className="text-[#EDEDEF] font-semibold text-base mb-0.5 group-hover:text-[#E2C57A] transition-colors"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {co.name}
                  </h3>
                  <p className="text-[#5A5F6A] text-xs font-medium uppercase tracking-wide">
                    {co.sector} · Est. {co.founded}
                  </p>
                </div>

                {/* Description */}
                <p
                  className="text-[#8A8F98] text-sm leading-relaxed flex-1"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {co.description}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-1 text-[#5A5F6A] group-hover:text-[#C9A84C] transition-colors text-xs font-medium mt-auto pt-2 border-t border-[rgba(255,255,255,0.05)]">
                  Learn more
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
