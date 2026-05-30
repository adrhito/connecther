"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, GraduationCap, MessageSquare, Users } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const items = [
  { label: "Feed", href: "/feed", icon: Home },
  { label: "Network", href: "/network", icon: Users },
  { label: "Jobs", href: "/jobs", icon: Briefcase },
  { label: "Mentors", href: "/mentorship", icon: GraduationCap },
  { label: "Messages", href: "/messages", icon: MessageSquare },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border lg:hidden">
      <div className="flex items-center justify-around h-14">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors",
                active ? "text-primary" : "text-text-muted"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
