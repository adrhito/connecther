"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Home, Users, Briefcase, GraduationCap, Building2,
  MessageSquare, Bell, Search, Menu, X, LogOut, Settings, Shield, ChevronDown,
} from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { label: "Feed", href: "/feed", icon: Home },
  { label: "Network", href: "/network", icon: Users },
  { label: "Jobs", href: "/jobs", icon: Briefcase },
  { label: "Mentorship", href: "/mentorship", icon: GraduationCap },
  { label: "Companies", href: "/companies", icon: Building2 },
  { label: "Communities", href: "/communities", icon: MessageSquare },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/feed" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">cH</span>
            </div>
            <span className="hidden sm:block font-heading font-bold text-lg text-primary">
              connect<span className="font-accent text-accent-warm italic">Her</span>
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search people, jobs, companies..."
                className="w-full h-9 pl-9 pr-4 rounded-lg bg-surface-elevated border border-border text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </form>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex flex-col items-center px-3 py-1 rounded-lg text-xs transition-colors",
                    active
                      ? "text-primary"
                      : "text-text-secondary hover:text-primary hover:bg-surface-elevated"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="mt-0.5">{item.label}</span>
                  {active && <div className="w-full h-0.5 bg-primary rounded-full mt-0.5" />}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link
              href="/messages"
              className="p-2 rounded-lg hover:bg-surface-elevated transition-colors relative"
              aria-label="Messages"
            >
              <MessageSquare className="w-5 h-5 text-text-secondary" />
            </Link>
            <Link
              href="/notifications"
              className="p-2 rounded-lg hover:bg-surface-elevated transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5 text-text-secondary" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent-warm rounded-full" />
            </Link>

            <ThemeToggle />

            {/* Profile dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-surface-elevated transition-colors"
              >
                <UserAvatar name={user?.name || "User"} size="sm" />
                <ChevronDown className="w-3 h-3 text-text-muted hidden sm:block" />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-surface border border-border rounded-lg shadow-lg z-50 py-1">
                    <div className="px-4 py-3 border-b border-border">
                      <p className="font-medium text-sm text-text-primary">{user?.name}</p>
                      <p className="text-xs text-text-secondary">{user?.headline || user?.role}</p>
                    </div>
                    <Link
                      href={`/profile/${user?.id}`}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-surface-elevated"
                    >
                      View Profile
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-surface-elevated"
                    >
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                    {user?.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-text-primary hover:bg-surface-elevated"
                      >
                        <Shield className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}
                    <div className="border-t border-border mt-1">
                      <button
                        onClick={() => { logout(); setProfileOpen(false); router.push("/login"); }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-error hover:bg-surface-elevated w-full text-left"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-surface-elevated"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border py-2">
            <form onSubmit={handleSearch} className="mb-2 md:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full h-9 pl-9 pr-4 rounded-lg bg-surface-elevated border border-border text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </form>
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                    active ? "text-primary bg-primary/5" : "text-text-secondary hover:bg-surface-elevated"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
