"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const roles = [
  "in finance",
  "in tech",
  "in consulting",
  "in healthcare",
  "founders",
  "returning to work",
  "breaking barriers",
];

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setRoleIndex((i) => (i + 1) % roles.length);
        setVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative flex items-center overflow-hidden"
      style={{ minHeight: "100vh" }}
    >
      {/* Background layers */}
      <div className="absolute inset-0" style={{ backgroundColor: "#0e1a32" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 120% 80% at 10% 30%, #1B2A4A, transparent)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 70% at 75% 60%, rgba(183,110,121,0.18), transparent)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 50% at 50% 10%, rgba(45,74,122,0.6), transparent)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 90% 20%, rgba(232,160,191,0.12), transparent 50%)" }} />

      {/* Warm glow orbs */}
      <div className="absolute rounded-full" style={{ top: "20%", right: "12%", width: 500, height: 500, background: "rgba(183,110,121,0.07)", filter: "blur(100px)" }} />
      <div className="absolute rounded-full" style={{ bottom: "10%", left: "5%", width: 400, height: 400, background: "rgba(232,160,191,0.05)", filter: "blur(80px)" }} />

      {/* Noise grain overlay */}
      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{
          opacity: 0.035,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Geometric constellation */}
      <div className="absolute rounded-full" style={{ opacity: 0.6, top: "12%", right: "6%", width: 420, height: 420, border: "1px solid rgba(255,255,255,0.04)" }} />
      <div className="absolute rounded-full" style={{ top: "16%", right: "9%", width: 320, height: 320, border: "1px solid rgba(255,255,255,0.03)" }} />
      <div className="absolute rounded-full" style={{ top: "20%", right: "12%", width: 220, height: 220, border: "1px solid rgba(255,255,255,0.02)" }} />

      {/* Content */}
      <div className="relative w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12" style={{ paddingTop: "10rem", paddingBottom: "8rem" }}>
        <div style={{ maxWidth: "52rem" }}>
          {/* Headline */}
          <h1
            style={{
              transition: "all 1s ease 150ms",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(32px)",
            }}
          >
            <span
              className="block font-heading font-bold text-white"
              style={{ fontSize: "clamp(3.25rem, 8vw, 6.5rem)", lineHeight: 0.95, letterSpacing: "-0.03em" }}
            >
              Where women
            </span>
            <span
              className="block font-heading font-bold text-white mt-1"
              style={{ fontSize: "clamp(3.25rem, 8vw, 6.5rem)", lineHeight: 0.95, letterSpacing: "-0.03em" }}
            >
              build{" "}
              <span className="relative inline-block">
                <span className="font-accent font-normal italic text-accent">
                  careers
                </span>
                <svg
                  className="absolute left-0 w-full"
                  style={{ bottom: "-4px", height: "0.25em" }}
                  viewBox="0 0 200 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 9C30 4 70 2 100 5C130 8 170 4 198 2"
                    stroke="rgba(183,110,121,0.45)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    style={{
                      opacity: mounted ? 1 : 0,
                      strokeDasharray: 300,
                      strokeDashoffset: mounted ? 0 : 300,
                      transition: "stroke-dashoffset 1.2s ease-out 1.2s, opacity 0.3s ease 1.2s",
                    }}
                  />
                </svg>
              </span>
              ,
            </span>
            <span
              className="block font-heading font-bold text-white/90 mt-1"
              style={{ fontSize: "clamp(3.25rem, 8vw, 6.5rem)", lineHeight: 0.95, letterSpacing: "-0.03em" }}
            >
              together.
            </span>
          </h1>

          {/* Subheadline */}
          <div
            className="mt-12 md:mt-14"
            style={{
              transition: "all 1s ease 300ms",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(24px)",
            }}
          >
            <p className="text-white/70 leading-relaxed max-w-xl" style={{ fontSize: "clamp(1.125rem, 2vw, 1.35rem)" }}>
              Career transparency, mentorship, and real opportunities
              <br className="hidden sm:block" />
              designed for women{" "}
              <span
                className="inline-block font-semibold text-accent"
                style={{
                  transition: "all 0.5s ease",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(6px)",
                }}
              >
                {roles[roleIndex]}
              </span>
              .
            </p>
          </div>

          {/* CTA buttons */}
          <div
            className="mt-12 md:mt-14 flex flex-wrap items-center gap-5"
            style={{
              transition: "all 1s ease 500ms",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(24px)",
            }}
          >
            <Link
              href="/signup"
              className="group relative inline-flex items-center gap-3 bg-white font-semibold rounded-2xl shadow-2xl shadow-black/15 hover:shadow-black/25 transition-all duration-300"
              style={{ color: "#0e1a32", fontSize: "0.95rem", padding: "1.1rem 2.25rem" }}
            >
              <span>
                Join connect
                <span className="font-accent italic text-accent-warm">Her</span>
              </span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/jobs"
              className="inline-flex items-center gap-3 text-white font-semibold rounded-2xl border border-white/30 hover:border-white/50 hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
              style={{ fontSize: "0.95rem", padding: "1.1rem 2.25rem" }}
            >
              See how it works
            </Link>
          </div>

          {/* Social proof */}
          <div
            className="mt-8 md:mt-10 flex items-center gap-5"
            style={{
              transition: "all 1s ease 700ms",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(24px)",
            }}
          >
            <div className="flex -space-x-2.5">
              {[
                { i: "SC", gradient: "linear-gradient(to bottom right, #E8A0BF, #B76E79)" },
                { i: "MJ", gradient: "linear-gradient(to bottom right, #B76E79, #c97a84)" },
                { i: "PP", gradient: "linear-gradient(to bottom right, #2D4A7A, #1B2A4A)" },
                { i: "JW", gradient: "linear-gradient(to bottom right, #E8A0BF, #d48da8)" },
                { i: "ER", gradient: "linear-gradient(to bottom right, #c97a84, #B76E79)" },
              ].map((user, idx) => (
                <div
                  key={idx}
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white shadow-md ring-1 ring-white/5"
                  style={{ background: user.gradient, borderColor: "#0e1a32" }}
                >
                  {user.i}
                </div>
              ))}
            </div>
            <div className="text-sm text-white/70">
              <span className="text-white font-semibold tabular-nums">
                2,500+
              </span>{" "}
              women already on the waitlist
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
