"use client";

import { cn } from "@/lib/utils/cn";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "success" | "warning" | "destructive" | "outline";
  className?: string;
}

const variants = {
  default: "bg-primary text-white",
  accent: "bg-accent text-primary",
  success: "bg-success text-white",
  warning: "bg-warning text-white",
  destructive: "bg-error text-white",
  outline: "border border-border text-text-secondary bg-transparent",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
