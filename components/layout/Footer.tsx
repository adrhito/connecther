"use client";

import Link from "next/link";

const footerLinks = {
  Platform: [
    { label: "Jobs", href: "/jobs" },
    { label: "Mentorship", href: "/mentorship" },
    { label: "Companies", href: "/companies" },
    { label: "Communities", href: "/communities" },
    { label: "Company Compare", href: "/companies/compare" },
  ],
  Resources: [
    { label: "Career Playbooks", href: "/playbooks" },
    { label: "Community Guidelines", href: "/guidelines" },
    { label: "Campus Ambassadors", href: "/ambassador" },
    { label: "Salary Insights", href: "/companies" },
  ],
  Company: [
    { label: "Join Waitlist", href: "/signup" },
    { label: "About", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 40% at 70% 90%, rgba(183,110,121,0.08), transparent)" }} />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8">
        <div
          style={{
            paddingTop: "4rem",
            paddingBottom: "3rem",
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: "2rem",
          }}
        >
          {/* Brand column */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                <span className="text-white font-bold text-sm">cH</span>
              </div>
              <span className="font-heading font-bold text-xl text-white tracking-tight">
                connect
                <span className="font-accent italic text-accent">Her</span>
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Where women build careers, together. A platform designed to
              make career opportunities, mentorship, and industry
              transparency more accessible.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4
                className="text-xs font-semibold text-white/80 uppercase mb-4"
                style={{ letterSpacing: "0.15em" }}
              >
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} connectHer. All rights reserved.
          </p>
          <p className="text-xs text-white/40">
            Built with care for women everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}
