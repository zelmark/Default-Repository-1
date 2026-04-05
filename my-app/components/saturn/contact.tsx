"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, MapPin, Phone, Send } from "lucide-react";

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" ref={ref} className="py-28 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-[#C9A84C] text-xs font-semibold tracking-widest uppercase mb-4"
            >
              Get in Touch
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl lg:text-5xl font-bold text-[#EDEDEF] mb-6"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Let's Start a{" "}
              <span className="text-gold-gradient">Conversation</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-[#8A8F98] text-base leading-relaxed mb-10"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Whether you're a business owner exploring strategic options, an
              investor seeking co-investment opportunities, or a potential partner,
              we'd welcome the conversation.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col gap-5"
            >
              {[
                { icon: Mail, label: "Email", value: "inquiries@saturntriton.com" },
                { icon: Phone, label: "Phone", value: "+1 (212) 000-0000" },
                { icon: MapPin, label: "Headquarters", value: "New York, NY · USA" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(201,168,76,0.08)] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#C9A84C]" />
                  </div>
                  <div>
                    <p className="text-[#5A5F6A] text-xs mb-0.5">{label}</p>
                    <p className="text-[#EDEDEF] text-sm font-medium">{value}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {submitted ? (
              <div className="glass rounded-3xl p-10 flex flex-col items-center justify-center text-center h-full min-h-[400px] gap-4">
                <div className="w-14 h-14 rounded-full bg-[rgba(201,168,76,0.12)] flex items-center justify-center">
                  <Send className="w-6 h-6 text-[#C9A84C]" />
                </div>
                <h3 className="text-[#EDEDEF] font-semibold text-xl" style={{ fontFamily: "var(--font-heading)" }}>
                  Message Received
                </h3>
                <p className="text-[#8A8F98] text-sm max-w-xs" style={{ fontFamily: "var(--font-body)" }}>
                  Thank you for reaching out. A member of our team will be in
                  touch within 1–2 business days.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="glass rounded-3xl p-8 flex flex-col gap-5"
                noValidate
              >
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="first" className="text-[#8A8F98] text-xs font-medium">
                      First Name <span className="text-[#C9A84C]">*</span>
                    </label>
                    <input
                      id="first"
                      type="text"
                      required
                      placeholder="John"
                      className="h-11 px-4 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#EDEDEF] text-sm placeholder:text-[#3A3F4A] focus:outline-none focus:border-[rgba(201,168,76,0.4)] focus:ring-1 focus:ring-[rgba(201,168,76,0.25)] transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="last" className="text-[#8A8F98] text-xs font-medium">
                      Last Name <span className="text-[#C9A84C]">*</span>
                    </label>
                    <input
                      id="last"
                      type="text"
                      required
                      placeholder="Smith"
                      className="h-11 px-4 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#EDEDEF] text-sm placeholder:text-[#3A3F4A] focus:outline-none focus:border-[rgba(201,168,76,0.4)] focus:ring-1 focus:ring-[rgba(201,168,76,0.25)] transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-[#8A8F98] text-xs font-medium">
                    Email Address <span className="text-[#C9A84C]">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="john@company.com"
                    className="h-11 px-4 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#EDEDEF] text-sm placeholder:text-[#3A3F4A] focus:outline-none focus:border-[rgba(201,168,76,0.4)] focus:ring-1 focus:ring-[rgba(201,168,76,0.25)] transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subject" className="text-[#8A8F98] text-xs font-medium">
                    Subject
                  </label>
                  <select
                    id="subject"
                    className="h-11 px-4 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#EDEDEF] text-sm focus:outline-none focus:border-[rgba(201,168,76,0.4)] transition-all appearance-none"
                    style={{ colorScheme: "dark" }}
                  >
                    <option value="">Select an inquiry type</option>
                    <option value="investment">Investment Opportunity</option>
                    <option value="co-invest">Co-Investment</option>
                    <option value="business">Business Development</option>
                    <option value="media">Media & Press</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-[#8A8F98] text-xs font-medium">
                    Message <span className="text-[#C9A84C]">*</span>
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={4}
                    placeholder="Tell us about your inquiry..."
                    className="px-4 py-3 rounded-xl bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#EDEDEF] text-sm placeholder:text-[#3A3F4A] focus:outline-none focus:border-[rgba(201,168,76,0.4)] focus:ring-1 focus:ring-[rgba(201,168,76,0.25)] transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="h-12 rounded-xl bg-[#C9A84C] hover:bg-[#E2C57A] text-[#020203] font-semibold text-sm transition-all duration-200 hover:shadow-[0_0_30px_rgba(201,168,76,0.25)] flex items-center justify-center gap-2 mt-1"
                >
                  <Send className="w-4 h-4" />
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
