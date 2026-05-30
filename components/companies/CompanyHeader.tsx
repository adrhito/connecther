"use client";

import {
  Building2,
  MapPin,
  Users,
  Calendar,
  ExternalLink,
  PenSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { getInitials } from "@/lib/utils/format";
import { getLogoColor } from "./CompanyCard";
import type { Company } from "@/lib/types";

interface CompanyHeaderProps {
  company: Company;
  avgRating?: number;
  reviewCount?: number;
  onWriteReview?: () => void;
}

export function CompanyHeader({
  company,
  avgRating,
  reviewCount,
  onWriteReview,
}: CompanyHeaderProps) {
  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <div className="flex flex-col sm:flex-row items-start gap-5">
        <div
          className={cn(
            "w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0",
            getLogoColor(company.name)
          )}
        >
          {getInitials(company.name)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h1 className="text-2xl font-heading font-bold text-text-primary">
              {company.name}
            </h1>
            {company.is_featured && (
              <Badge variant="accent">Featured Company</Badge>
            )}
          </div>

          {company.industry && (
            <p className="text-text-secondary mt-1">{company.industry}</p>
          )}

          {company.description && (
            <p className="text-sm text-text-secondary mt-2 line-clamp-2">
              {company.description}
            </p>
          )}

          <div className="flex flex-wrap gap-4 mt-4 text-sm text-text-secondary">
            {company.size && (
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-text-muted" />
                {company.size} employees
              </span>
            )}
            {company.founded_year && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-text-muted" />
                Founded {company.founded_year}
              </span>
            )}
            {company.headquarters && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-text-muted" />
                {company.headquarters}
              </span>
            )}
            {avgRating !== undefined && avgRating > 0 && (
              <span className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-text-muted" />
                {avgRating.toFixed(1)} avg rating ({reviewCount} reviews)
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <Button onClick={onWriteReview}>
              <PenSquare className="w-4 h-4" />
              Write a Review
            </Button>
            {company.website_url && (
              <Button variant="secondary" asChild>
                <a
                  href={company.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4" />
                  Website
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
