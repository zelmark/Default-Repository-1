"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link2, Share2 } from "lucide-react";

const team = [
  {
    name: "Alexander J. Mercer",
    title: "Chief Executive Officer",
    bio: "25+ years leading global investment platforms. Previously Managing Director at a top-tier private equity firm, with a track record of $6B+ in value creation across 40 portfolio companies.",
    initials: "AM",
    accent: "#C9A84C",
  },
  {
    name: "Dr. Priya Nair",
    title: "Chief Investment Officer",
    bio: "Former Head of Global Alternatives at a leading sovereign wealth fund. Specializes in cross-sector capital allocation and has managed portfolios exceeding $12B AUM.",
    initials: "PN",
    accent: "#5E6AD2",
  },
  {
    name: "Thomas R. Ashford",
    title: "Chief Financial Officer",
    bio: "Deep expertise in corporate treasury, structured finance, and international tax strategy. Previously CFO at two publicly traded holding companies with combined revenues of $4B.",
    initials: "TA",
    accent: "#C9A84C",
  },
  {
    name: "Sophia L. Hartwell",
    title: "Chief Operating Officer",
    bio: "Operational transformation specialist with experience scaling portfolio companies from early-stage to market leadership. Holds an MBA from Harvard Business School.",
    initials: "SH",
    accent: "#5E6AD2",
  },
];

export function Team() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="leadership" ref={ref} className="py-28 lg:py-36 bg-[#0a0a0f]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-[#C9A84C] text-xs font-semibold tracking-widest uppercase mb-4"
          >
            Leadership
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl lg:text-5xl font-bold text-[#EDEDEF] mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Executive Team
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-[#8A8F98] text-base leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Seasoned operators and investors who have built and transformed
            businesses across multiple economic cycles.
          </motion.p>
        </div>

        {/* Team grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <motion.article
              key={member.name}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="glass rounded-2xl p-6 flex flex-col gap-5 hover:border-[rgba(201,168,76,0.18)] transition-all duration-300 group"
            >
              {/* Avatar */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold"
                style={{
                  background: `linear-gradient(135deg, ${member.accent}30, ${member.accent}10)`,
                  color: member.accent,
                  fontFamily: "var(--font-heading)",
                  border: `1px solid ${member.accent}25`,
                }}
              >
                {member.initials}
              </div>

              {/* Info */}
              <div>
                <h3
                  className="text-[#EDEDEF] font-semibold text-base mb-0.5"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {member.name}
                </h3>
                <p
                  className="text-xs font-medium uppercase tracking-wide"
                  style={{ color: member.accent }}
                >
                  {member.title}
                </p>
              </div>

              <p
                className="text-[#8A8F98] text-xs leading-relaxed flex-1"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {member.bio}
              </p>

              {/* Social */}
              <div className="flex items-center gap-3 pt-3 border-t border-[rgba(255,255,255,0.05)]">
                <button
                  type="button"
                  aria-label={`${member.name} on LinkedIn`}
                  className="p-1.5 rounded-lg text-[#5A5F6A] hover:text-[#C9A84C] transition-colors"
                >
                  <Link2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label={`${member.name} on social media`}
                  className="p-1.5 rounded-lg text-[#5A5F6A] hover:text-[#C9A84C] transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
