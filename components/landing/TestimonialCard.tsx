"use client";

import { UserAvatar } from "@/components/shared/UserAvatar";
import { useEffect, useRef, useState } from "react";

const testimonials = [
  {
    name: "Maya Johnson",
    role: "Analyst, Goldman Sachs",
    text: "connectHer helped me find a mentor who guided me through recruiting. The transparency around pay and culture was a game-changer.",
  },
  {
    name: "Priya Patel",
    role: "Partner, McKinsey & Company",
    text: "As a mentor, I love how the structured request system works. I can help more women effectively without being overwhelmed.",
  },
  {
    name: "Jessica Williams",
    role: "Founder & CEO, TechSis",
    text: "The founder community connected me with my co-founder and two early investors. Nothing else like it exists for women in startups.",
  },
];

export function TestimonialSection() {
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} id="community" className="bg-surface relative overflow-hidden" style={{ padding: "6rem 0 8rem" }}>
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
        {/* Header */}
        <div className="max-w-2xl" style={{ marginBottom: "4.5rem" }}>
          <p className="text-accent-warm font-medium text-sm uppercase mb-5" style={{ letterSpacing: "0.15em" }}>
            Community Voices
          </p>
          <h2
            className="font-heading font-bold text-text-primary leading-tight"
            style={{ fontSize: "clamp(1.875rem, 4vw, 3rem)" }}
          >
            Hear from women who{" "}
            <span className="font-accent italic text-accent-warm">
              lead
            </span>
          </h2>
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="group relative"
              style={{
                opacity: isVisible ? 1 : 0.1,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: `all 0.6s ease ${i * 120}ms`,
              }}
            >
              <div className="h-full bg-background rounded-2xl border border-border transition-all duration-500 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:border-accent/20" style={{ padding: "2rem 2.25rem 2.25rem" }}>
                {/* Quote text */}
                <p className="text-text-primary leading-relaxed mb-8" style={{ fontSize: "0.95rem" }}>
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-5 border-t border-border">
                  <UserAvatar name={t.name} size="md" />
                  <div>
                    <p className="font-heading font-semibold text-sm text-text-primary">
                      {t.name}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">{t.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
