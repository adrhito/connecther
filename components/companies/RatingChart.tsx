"use client";

import { cn } from "@/lib/utils/cn";
import { REVIEW_CATEGORIES } from "@/lib/constants";

interface RatingChartProps {
  ratings: Record<string, number>;
}

function getRatingColor(rating: number): string {
  if (rating >= 4) return "bg-success";
  if (rating >= 3) return "bg-warning";
  return "bg-error";
}

function getRatingTextColor(rating: number): string {
  if (rating >= 4) return "text-success";
  if (rating >= 3) return "text-warning";
  return "text-error";
}

export function RatingChart({ ratings }: RatingChartProps) {
  // Skip "overall_rating" since it's shown separately in the header
  const categories = REVIEW_CATEGORIES.filter(
    (cat) => cat.key !== "overall_rating"
  );

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h3 className="font-heading font-semibold text-text-primary mb-4">
        Rating Breakdown
      </h3>
      <div className="space-y-3">
        {categories.map((category) => {
          const rating = ratings[category.key] || 0;
          const widthPct = (rating / 5) * 100;

          return (
            <div key={category.key} className="flex items-center gap-3">
              <span className="text-sm text-text-secondary w-40 shrink-0 truncate">
                {category.label}
              </span>
              <div className="flex-1 h-3 bg-surface-elevated rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    getRatingColor(rating)
                  )}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
              <span
                className={cn(
                  "text-sm font-medium w-8 text-right",
                  getRatingTextColor(rating)
                )}
              >
                {rating > 0 ? rating.toFixed(1) : "N/A"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-4 text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-success" />
            4.0 - 5.0 Great
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-warning" />
            3.0 - 3.9 Average
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-error" />
            1.0 - 2.9 Needs Improvement
          </span>
        </div>
      </div>
    </div>
  );
}
