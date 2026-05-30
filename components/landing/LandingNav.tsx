"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-white shadow-sm"
          : "bg-primary"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-500 shadow-sm",
                scrolled
                  ? "bg-primary"
                  : "bg-white/15 border border-white/20"
              )}
            >
              <span
                className={cn(
                  "font-bold text-sm transition-colors duration-500",
                  scrolled ? "text-white" : "text-white"
                )}
              >
                cH
              </span>
            </div>
            <span className="font-heading font-bold text-xl tracking-tight">
              <span
                className={cn(
                  "transition-colors duration-500",
                  scrolled ? "text-primary" : "text-white"
                )}
              >
                connect
              </span>
              <span className="font-accent italic text-accent-warm">Her</span>
            </span>
          </Link>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-5">
            <Link
              href="/login"
              className={cn(
                "px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300",
                scrolled
                  ? "text-text-secondary hover:text-primary"
                  : "text-white/80 hover:text-white"
              )}
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className={cn(
                "text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-accent-warm/20 hover:shadow-accent-warm/30",
                scrolled
                  ? "bg-primary text-white hover:bg-primary-light"
                  : "bg-white text-primary hover:bg-white/90"
              )}
              style={{ padding: "0.85rem 2.25rem" }}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X
                className={cn(
                  "w-5 h-5",
                  scrolled ? "text-text-primary" : "text-white"
                )}
              />
            ) : (
              <Menu
                className={cn(
                  "w-5 h-5",
                  scrolled ? "text-text-primary" : "text-white"
                )}
              />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-white/10 pt-4 space-y-2">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block px-4 py-2.5 rounded-lg text-sm font-medium",
                scrolled
                  ? "text-text-secondary hover:bg-surface-elevated"
                  : "text-white/80 hover:bg-white/10"
              )}
            >
              Log In
            </Link>
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-2.5 rounded-lg text-sm font-semibold bg-accent text-primary text-center"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
