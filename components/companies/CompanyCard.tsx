"use client";

import Link from "next/link";
import { Building2, MapPin, Users, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { getInitials } from "@/lib/utils/format";
import type { Company } from "@/lib/types";

interface CompanyWithRating extends Company {
  avgRating?: number;
  reviewCount?: number;
}

interface CompanyCardProps {
  company: CompanyWithRating;
}

const LOGO_COLORS = [
  "bg-primary",
  "bg-accent",
  "bg-success",
  "bg-warning",
  "bg-error",
  "bg-purple-500",
  "bg-teal-500",
  "bg-indigo-500",
];

function getLogoColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return LOGO_COLORS[Math.abs(hash) % LOGO_COLORS.length];
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const starSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <Star key={i} className={cn(starSize, "fill-warning text-warning")} />
      );
    } else if (i === fullStars && hasHalf) {
      stars.push(
        <div key={i} className="relative">
          <Star className={cn(starSize, "text-border")} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className={cn(starSize, "fill-warning text-warning")} />
          </div>
        </div>
      );
    } else {
      stars.push(
        <Star key={i} className={cn(starSize, "text-border")} />
      );
    }
  }

  return <div className="flex items-center gap-0.5">{stars}</div>;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link href={`/companies/${company.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0",
                getLogoColor(company.name)
              )}
            >
              {getInitials(company.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-text-primary truncate">
                  {company.name}
                </h3>
                {company.is_featured && (
                  <Badge variant="accent" className="shrink-0 text-xs">
                    Featured
                  </Badge>
                )}
              </div>
              {company.industry && (
                <p className="text-sm text-text-secondary mt-0.5">
                  {company.industry}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 text-xs text-text-secondary">
            {company.headquarters && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {company.headquarters}
              </span>
            )}
            {company.size && (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {company.size}
              </span>
            )}
            {company.founded_year && (
              <span className="flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                Est. {company.founded_year}
              </span>
            )}
          </div>

          {company.avgRating !== undefined && company.avgRating > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <StarRating rating={company.avgRating} />
              <span className="text-sm font-medium text-text-primary">
                {company.avgRating.toFixed(1)}
              </span>
              {company.reviewCount !== undefined && (
                <span className="text-xs text-text-muted">
                  ({company.reviewCount} {company.reviewCount === 1 ? "review" : "reviews"})
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export { StarRating, getLogoColor };
