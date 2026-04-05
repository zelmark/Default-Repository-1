"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 2.4, suffix: "B+", prefix: "$", label: "Assets Under Management" },
  { value: 18, suffix: "+", prefix: "", label: "Portfolio Companies" },
  { value: 12, suffix: "+", prefix: "", label: "Countries" },
  { value: 7, suffix: "+", prefix: "", label: "Years of Excellence" },
];

function AnimatedNumber({ value, prefix, suffix, inView }: {
  value: number;
  prefix: string;
  suffix: string;
  inView: boolean;
}) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(parseFloat((ease * value).toFixed(1)));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [inView, value]);

  const formatted = value % 1 === 0 ? Math.round(display) : display.toFixed(1);

  return (
    <span>
      {prefix}{formatted}{suffix}
    </span>
  );
}

export function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-16 border-y border-[rgba(255,255,255,0.06)]" aria-label="Key statistics">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          ref={ref}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-center lg:border-r lg:last:border-r-0 border-[rgba(255,255,255,0.06)] lg:px-8"
            >
              <div
                className="text-4xl lg:text-5xl font-bold text-gold-gradient mb-2"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <AnimatedNumber
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  inView={inView}
                />
              </div>
              <p className="text-[#8A8F98] text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
