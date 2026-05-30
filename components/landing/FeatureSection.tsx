"use client";

import { useEffect, useRef, useState } from "react";

const features = [
  {
    title: "Career Transparency",
    description:
      "Anonymous workplace reviews, pay fairness data, promotion timelines, and safety culture ratings -- so you know exactly what to expect.",
    gradientBg: "linear-gradient(to bottom right, rgba(183,110,121,0.15), rgba(232,160,191,0.08), transparent)",
  },
  {
    title: "Mentorship First",
    description:
      "Find verified mentors in your industry. Book coffee chats, request long-term guidance, or join office hours -- all structured and respectful.",
    gradientBg: "linear-gradient(to bottom right, rgba(45,74,122,0.12), rgba(27,42,74,0.06), transparent)",
  },
  {
    title: "Jobs That Fit",
    description:
      "Filter by women-friendly benefits, pay transparency, visa sponsorship, and returnship programs. Get warm intros from your network.",
    gradientBg: "linear-gradient(to bottom right, rgba(232,160,191,0.12), rgba(242,196,214,0.08), transparent)",
  },
  {
    title: "Return-to-Work",
    description:
      "Returnship listings, career gap tools, and a private community for women re-entering the workforce after caregiving or sabbaticals.",
    gradientBg: "linear-gradient(to bottom right, rgba(5,150,105,0.08), rgba(5,150,105,0.04), transparent)",
  },
  {
    title: "Founder Ecosystem",
    description:
      "Startup profiles, founder-to-founder networking, investor connections, and a dedicated space for women building companies.",
    gradientBg: "linear-gradient(to bottom right, rgba(217,119,6,0.08), rgba(217,119,6,0.04), transparent)",
  },
  {
    title: "Industry Playbooks",
    description:
      "Recruiting timelines, career roadmaps, salary benchmarks, and insider advice for breaking into finance, consulting, tech, and more.",
    gradientBg: "linear-gradient(to bottom right, rgba(27,42,74,0.08), rgba(45,74,122,0.04), transparent)",
  },
];

export function FeatureSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="bg-background relative"
      style={{ padding: "7rem 0 9rem" }}
    >
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section header */}
        <div className="max-w-2xl" style={{ marginBottom: "5rem" }}>
          <p className="text-accent-warm font-semibold text-xs uppercase mb-5" style={{ letterSpacing: "0.2em" }}>
            The Platform
          </p>
          <h2
            className="font-heading font-bold text-text-primary tracking-tight"
            style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)", lineHeight: 1.08 }}
          >
            Everything you need
            <br />
            to{" "}
            <span className="font-accent font-normal italic text-accent-warm">
              advance
            </span>
          </h2>
          <p className="mt-8 text-text-secondary text-lg leading-relaxed max-w-lg">
            More than a job board. More than a network. A platform built
            for how women actually navigate careers.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group relative bg-surface rounded-2xl border border-border overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1"
              style={{
                opacity: isVisible ? 1 : 0.1,
                transform: isVisible ? "translateY(0)" : "translateY(24px)",
                transition: "all 0.5s ease",
                transitionDelay: isVisible ? `${100 + i * 80}ms` : "0ms",
              }}
            >
              {/* Gradient fill on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: feature.gradientBg }}
              />

              <div className="relative" style={{ padding: "2rem 2.25rem 2.25rem" }}>
                {/* Title */}
                <h3
                  className="font-heading font-bold text-text-primary tracking-tight"
                  style={{ fontSize: "1.15rem", marginBottom: "0.75rem" }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-text-secondary" style={{ fontSize: "0.9rem", lineHeight: 1.7 }}>
                  {feature.description}
                </p>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
