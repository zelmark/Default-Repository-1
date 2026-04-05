"use client";

import { Link2, Share2, Globe } from "lucide-react";

const links = {
  Company: ["About", "Portfolio", "Sectors", "Leadership", "Contact"],
  Legal: ["Privacy Policy", "Terms of Use", "Disclosures", "Cookie Policy"],
  Sectors: ["Financial Services", "Real Estate", "Technology", "Energy", "Healthcare"],
};

export function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.06)] bg-[#020203]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
          {/* Brand col */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E2C57A] to-[#A0803A] flex items-center justify-center text-[#020203] font-bold text-sm">
                ST
              </div>
              <span className="text-[#EDEDEF] font-semibold tracking-wide text-sm" style={{ fontFamily: "var(--font-heading)" }}>
                Saturn Triton, LLC
              </span>
            </div>
            <p
              className="text-[#5A5F6A] text-sm leading-relaxed max-w-xs mb-6"
              style={{ fontFamily: "var(--font-body)" }}
            >
              A diversified global holding company building enduring enterprise value
              across high-growth sectors through permanent capital and active ownership.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Link2, label: "LinkedIn" },
                { icon: Share2, label: "Twitter" },
                { icon: Globe, label: "Website" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl glass flex items-center justify-center text-[#5A5F6A] hover:text-[#C9A84C] hover:border-[rgba(201,168,76,0.2)] transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Link cols */}
          {Object.entries(links).map(([group, items]) => (
            <div key={group}>
              <h4
                className="text-[#EDEDEF] text-xs font-semibold uppercase tracking-widest mb-4"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {group}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-[#5A5F6A] hover:text-[#C9A84C] text-sm transition-colors duration-200"
                      style={{ fontFamily: "var(--font-body)" }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[#3A3F4A] text-xs" style={{ fontFamily: "var(--font-body)" }}>
            © {new Date().getFullYear()} Saturn Triton, LLC. All rights reserved.
          </p>
          <p className="text-[#3A3F4A] text-xs text-center sm:text-right max-w-md" style={{ fontFamily: "var(--font-body)" }}>
            This website is for informational purposes only and does not constitute
            an offer or solicitation to buy or sell any security.
          </p>
        </div>
      </div>
    </footer>
  );
}
