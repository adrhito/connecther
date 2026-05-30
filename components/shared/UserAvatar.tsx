"use client";

import Image from "next/image";
import { cn } from "@/lib/utils/cn";
import { getInitials } from "@/lib/utils/format";

interface UserAvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
};

export function UserAvatar({ name, src, size = "md", className }: UserAvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={64}
        height={64}
        className={cn("rounded-full object-cover", sizes[size], className)}
        unoptimized
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full bg-accent flex items-center justify-center font-semibold text-primary",
        sizes[size],
        className
      )}
      aria-label={name}
    >
      {getInitials(name)}
    </div>
  );
}
