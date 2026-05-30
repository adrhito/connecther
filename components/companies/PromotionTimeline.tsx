"use client";

import { ArrowRight, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils/format";
import type { PromotionTimeline as PromotionTimelineType } from "@/lib/types";

interface PromotionTimelineProps {
  promotions: PromotionTimelineType[];
}

export function PromotionTimeline({ promotions }: PromotionTimelineProps) {
  if (promotions.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="font-heading font-semibold text-text-primary mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Promotion Timelines
        </h3>
        <p className="text-sm text-text-muted text-center py-6">
          No promotion data available yet. Share your career progression!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h3 className="font-heading font-semibold text-text-primary mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        Promotion Timelines
      </h3>

      <div className="relative">
        {/* Vertical timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

        <div className="space-y-6">
          {promotions.map((promo) => (
            <div key={promo.id} className="relative pl-10">
              {/* Timeline dot */}
              <div className="absolute left-2.5 top-2 w-3 h-3 rounded-full bg-primary border-2 border-surface" />

              <Card>
                <CardContent className="p-4">
                  {/* Role transition */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {promo.from_role && (
                      <span className="text-sm font-medium text-text-primary bg-surface-elevated px-2 py-1 rounded">
                        {promo.from_role}
                      </span>
                    )}
                    {promo.from_role && promo.to_role && (
                      <ArrowRight className="w-4 h-4 text-primary shrink-0" />
                    )}
                    {promo.to_role && (
                      <span className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                        {promo.to_role}
                      </span>
                    )}
                  </div>

                  {/* Time taken */}
                  {promo.years_taken && (
                    <div className="flex items-center gap-1.5 text-xs text-text-muted mb-2">
                      <Clock className="w-3 h-3" />
                      {promo.years_taken}
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {promo.description}
                  </p>

                  {/* Date */}
                  <p className="text-xs text-text-muted mt-2">
                    Shared on {formatDate(promo.created_at)}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
