"use client";

const partners = [
  "Goldman Sachs",
  "McKinsey",
  "Google",
  "JPMorgan",
  "Bain & Co",
  "Deloitte",
  "BlackRock",
  "Meta",
  "Stripe",
  "BCG",
];

export function PartnerLogos() {
  return (
    <section className="bg-background relative" style={{ padding: "4rem 0 5rem" }}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <p
          className="text-center text-text-muted uppercase font-medium"
          style={{ fontSize: "0.7rem", letterSpacing: "0.2em", marginBottom: "2.5rem" }}
        >
          Our members work at leading companies
        </p>
        <div className="relative overflow-hidden">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-background to-transparent z-10" style={{ width: 80 }} />
          <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-background to-transparent z-10" style={{ width: 80 }} />

          <div className="flex items-center animate-marquee" style={{ gap: "3.5rem" }}>
            {[...partners, ...partners].map((name, i) => (
              <span
                key={`${name}-${i}`}
                className="font-heading font-bold whitespace-nowrap select-none shrink-0 hover:text-text-muted/50 transition-colors duration-500"
                style={{ fontSize: "clamp(1.125rem, 2vw, 1.375rem)", color: "rgba(156,163,175,0.35)" }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}
