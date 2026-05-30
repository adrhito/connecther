"use client";

import { useEffect, useRef, useState } from "react";
import {
  MapPin,
  CheckCircle,
  ArrowUpRight,
  ShieldCheck,
  Star,
} from "lucide-react";

export function PreviewSection() {
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
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-background relative overflow-hidden" style={{ padding: "6rem 0 8rem" }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section header */}
        <div className="text-center" style={{ marginBottom: "4.5rem" }}>
          <p className="text-accent-warm font-medium text-sm uppercase mb-5" style={{ letterSpacing: "0.15em" }}>
            Inside connectHer
          </p>
          <h2
            className="font-heading font-bold text-text-primary"
            style={{ fontSize: "clamp(1.875rem, 4vw, 3rem)" }}
          >
            A taste of what&apos;s{" "}
            <span className="font-accent italic text-accent-warm">
              waiting
            </span>
          </h2>
        </div>

        {/* Preview cards */}
        <div className="grid lg:grid-cols-12 gap-5 md:gap-6">
          {/* Featured Job Card */}
          <div
            className="lg:col-span-5 group"
            style={{
              opacity: isVisible ? 1 : 0.1,
              transform: isVisible ? "translateY(0)" : "translateY(20px)",
              transition: "all 0.6s ease 0ms",
            }}
          >
            <div className="h-full bg-surface rounded-2xl border border-border transition-all duration-500 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:border-accent/30" style={{ padding: "2rem 2.25rem 2.25rem" }}>
              <div className="flex items-center justify-between mb-5">
                <span className="text-accent-warm text-xs font-semibold uppercase" style={{ letterSpacing: "0.1em" }}>
                  Featured Job
                </span>
                <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent-warm transition-colors" />
              </div>

              <h3 className="text-xl font-heading font-bold text-text-primary mb-1.5">
                Investment Banking Summer Analyst
              </h3>
              <div className="flex items-center gap-2 text-sm text-text-secondary mb-5">
                <span className="font-medium">Goldman Sachs</span>
                <span className="text-text-muted">--</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  New York, NY
                </span>
              </div>

              <div className="flex items-center gap-2 mb-5">
                <span className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-success/10 text-success text-xs font-semibold rounded-lg">
                  $85K - $95K
                </span>
                <span className="px-3.5 py-1.5 bg-surface-elevated text-text-muted text-xs font-medium rounded-lg">
                  Internship
                </span>
              </div>

              <div className="pt-5 border-t border-border space-y-3">
                {[
                  "Pay Transparent",
                  "Parental Leave Policy",
                  "Women in Leadership: 32%",
                ].map((benefit) => (
                  <div
                    key={benefit}
                    className="flex items-center gap-2.5 text-sm text-text-secondary"
                  >
                    <CheckCircle className="w-4 h-4 text-accent-warm shrink-0" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-7 flex flex-col gap-5 md:gap-6">
            {/* Mentor Card */}
            <div
              className="group bg-surface rounded-2xl border border-border transition-all duration-500 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:border-primary-light/30"
              style={{
                padding: "2rem 2.25rem 2.25rem",
                opacity: isVisible ? 1 : 0.1,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.6s ease 120ms",
              }}
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-primary text-xs font-semibold uppercase" style={{ letterSpacing: "0.1em" }}>
                  Top Mentor
                </span>
                <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
              </div>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-accent-warm flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-lg shadow-accent/20">
                  PP
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="text-lg font-heading font-bold text-text-primary">
                      Priya Patel
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-success" />
                  </div>
                  <p className="text-sm text-text-secondary">
                    Partner, McKinsey & Company
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-accent/10 text-accent-warm text-xs font-semibold rounded-lg">
                      Consulting
                    </span>
                    <span className="flex items-center gap-1 text-xs text-success font-medium">
                      Available
                    </span>
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      4.9
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Insights Card */}
            <div
              className="group bg-surface rounded-2xl border border-border transition-all duration-500 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5 hover:border-success/30"
              style={{
                padding: "2rem 2.25rem 2.25rem",
                opacity: isVisible ? 1 : 0.1,
                transform: isVisible ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.6s ease 240ms",
              }}
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-success text-xs font-semibold uppercase" style={{ letterSpacing: "0.1em" }}>
                  Company Insights
                </span>
                <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-success transition-colors" />
              </div>

              <h3 className="text-lg font-heading font-bold text-text-primary mb-1">
                McKinsey & Company
              </h3>
              <div className="flex items-center gap-2 mb-5">
                <span className="text-sm text-text-secondary">Overall Rating</span>
                <span className="text-sm font-bold text-text-primary">4.2/5</span>
                <span className="text-xs text-text-muted">-- 47 reviews</span>
              </div>

              <div className="space-y-3.5">
                {[
                  { label: "Pay Fairness", value: 4.5, pct: 90 },
                  { label: "Mentorship Culture", value: 4.3, pct: 86 },
                  { label: "Work-Life Balance", value: 3.2, pct: 64 },
                ].map((rating) => (
                  <div key={rating.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-text-secondary">{rating.label}</span>
                      <span className="text-text-primary font-semibold">{rating.value}</span>
                    </div>
                    <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ${
                          rating.pct >= 80
                            ? "bg-success"
                            : rating.pct >= 60
                            ? "bg-warning"
                            : "bg-error"
                        }`}
                        style={{ width: `${rating.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
