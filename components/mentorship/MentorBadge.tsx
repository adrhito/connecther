"use client";

import {
  Monitor,
  TrendingUp,
  Briefcase,
  Rocket,
  RefreshCw,
  ArrowRightLeft,
} from "lucide-react";

interface MentorBadgeProps {
  badge: string;
  size?: "sm" | "md";
}

const badgeConfig: Record<
  string,
  { icon: React.ReactNode; bg: string; text: string; border: string }
> = {
  "Tech Mentor": {
    icon: <Monitor className="h-3 w-3" />,
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  "Finance Mentor": {
    icon: <TrendingUp className="h-3 w-3" />,
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  "Consulting Mentor": {
    icon: <Briefcase className="h-3 w-3" />,
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
  },
  "Founder Mentor": {
    icon: <Rocket className="h-3 w-3" />,
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
  },
  "Career Transition Mentor": {
    icon: <ArrowRightLeft className="h-3 w-3" />,
    bg: "bg-pink-50",
    text: "text-pink-700",
    border: "border-pink-200",
  },
  "Return-to-Work Mentor": {
    icon: <RefreshCw className="h-3 w-3" />,
    bg: "bg-teal-50",
    text: "text-teal-700",
    border: "border-teal-200",
  },
};

const defaultBadgeConfig = {
  icon: <Briefcase className="h-3 w-3" />,
  bg: "bg-gray-50",
  text: "text-gray-700",
  border: "border-gray-200",
};

export function MentorBadge({ badge, size = "md" }: MentorBadgeProps) {
  const config = badgeConfig[badge] || defaultBadgeConfig;
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      {config.icon}
      {badge}
    </span>
  );
}
