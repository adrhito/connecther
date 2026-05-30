"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 2500, suffix: "+", label: "Women on the waitlist" },
  { value: 150, suffix: "+", label: "Companies reviewed" },
  { value: 85, suffix: "%", label: "Mentor match rate" },
  { value: 12, suffix: "", label: "Industries covered" },
];

function Counter({
  value,
  suffix,
  active,
}: {
  value: number;
  suffix: string;
  active: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [active, value]);

  return (
    <span className="tabular-nums">
      {active ? count.toLocaleString() : value.toLocaleString()}
      {suffix}
    </span>
  );
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative overflow-hidden" style={{ padding: "6rem 0" }}>
      {/* Background */}
      <div className="absolute inset-0" style={{ backgroundColor: "#0e1a32" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(45,74,122,0.4), transparent)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 20% 80%, rgba(183,110,121,0.12), transparent 50%)" }} />

      <div
        ref={ref}
        className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="text-center"
              style={{
                transition: "all 0.7s ease",
                transitionDelay: active ? `${i * 120}ms` : "0ms",
                opacity: active ? 1 : 0.15,
                transform: active ? "translateY(0)" : "translateY(16px)",
              }}
            >
              <p
                className="font-heading font-bold text-white tracking-tight leading-none mb-4"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
              >
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  active={active}
                />
              </p>
              <p className="text-white/70 text-sm font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
