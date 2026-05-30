"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <section className="relative overflow-hidden" style={{ padding: "7rem 0 9rem" }}>
      {/* Background layers */}
      <div className="absolute inset-0 bg-primary" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(45,74,122,1), transparent)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 50% at 20% 80%, rgba(183,110,121,0.2), transparent)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 40% 40% at 80% 20%, rgba(232,160,191,0.1), transparent)" }} />
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-3xl mx-auto px-6 sm:px-8 text-center">
        <p className="text-white/70 text-sm font-medium uppercase mb-8" style={{ letterSpacing: "0.15em" }}>
          Early access is open
        </p>

        <h2
          className="font-heading font-bold leading-tight mb-7"
          style={{ fontSize: "clamp(1.875rem, 4vw, 3rem)", color: "#F2F4F8" }}
        >
          Ready to build your{" "}
          <span className="font-accent italic text-accent-light">career</span>
          <br className="hidden sm:block" />
          on your terms?
        </h2>

        <p className="text-white/70 text-lg max-w-lg mx-auto mb-12 leading-relaxed">
          Join thousands of women who are changing how careers are built.
          Get early access today.
        </p>

        {submitted ? (
          <div className="inline-flex items-center gap-2.5 px-6 py-4 bg-white/10 rounded-2xl border border-white/15 backdrop-blur-sm">
            <CheckCircle className="w-5 h-5 text-accent" />
            <span className="text-white font-semibold">
              You&apos;re on the list! We&apos;ll be in touch soon.
            </span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 rounded-2xl text-text-primary bg-white/95 backdrop-blur border border-white/30 focus:outline-none focus:ring-2 focus:ring-accent shadow-xl shadow-black/10 placeholder:text-text-muted text-sm"
              style={{ height: "3.75rem", padding: "0 1.5rem" }}
            />
            <button
              type="submit"
              className="bg-accent-warm text-white font-semibold rounded-2xl hover:bg-accent-warm/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-accent-warm/20 hover:shadow-accent-warm/30 shrink-0"
              style={{ height: "3.75rem", padding: "0 2rem" }}
            >
              Join Waitlist
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <p className="mt-8 text-white/60 text-sm">
          Already have an invite?{" "}
          <Link
            href="/signup"
            className="text-accent hover:text-accent-light underline underline-offset-2 font-medium transition-colors"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </section>
  );
}
