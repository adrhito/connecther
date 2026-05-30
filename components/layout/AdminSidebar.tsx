"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3, Users, FileText, Star, Building2,
  Briefcase, GraduationCap, Flag, Award, ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const icons: Record<string, React.ElementType> = {
  BarChart3, Users, FileText, Star, Building2, Briefcase, GraduationCap, Flag, Award,
};

const adminNav = [
  { label: "Overview", href: "/admin", icon: "BarChart3" },
  { label: "Users", href: "/admin/users", icon: "Users" },
  { label: "Posts", href: "/admin/posts", icon: "FileText" },
  { label: "Reviews", href: "/admin/reviews", icon: "Star" },
  { label: "Companies", href: "/admin/companies", icon: "Building2" },
  { label: "Jobs", href: "/admin/jobs", icon: "Briefcase" },
  { label: "Mentors", href: "/admin/mentors", icon: "GraduationCap" },
  { label: "Reports", href: "/admin/reports", icon: "Flag" },
  { label: "Featured", href: "/admin/featured", icon: "Award" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-surface border-r border-border p-4">
      <Link
        href="/feed"
        className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to App
      </Link>
      <h2 className="font-heading font-bold text-lg text-primary mb-4">Admin</h2>
      <nav className="space-y-1">
        {adminNav.map((item) => {
          const Icon = icons[item.icon];
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                active
                  ? "bg-primary text-white"
                  : "text-text-secondary hover:bg-surface-elevated hover:text-primary"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
