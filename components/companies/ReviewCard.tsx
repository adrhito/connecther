"use client";

import { useState } from "react";
import {
  User,
  Flag,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { formatDate } from "@/lib/utils/format";
import { StarRating } from "./CompanyCard";
import { REVIEW_CATEGORIES } from "@/lib/constants";
import type { CompanyReview } from "@/lib/types";

interface ReviewCardProps {
  review: CompanyReview;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  const ratingCategories = REVIEW_CATEGORIES.filter(
    (cat) => cat.key !== "overall_rating"
  );

  return (
    <Card
      className={cn(
        review.is_flagged && "border-warning/50 bg-warning/5"
      )}
    >
      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center">
              <User className="w-5 h-5 text-text-muted" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                {review.is_anonymous ? (
                  <Badge variant="outline" className="text-xs">
                    Anonymous
                  </Badge>
                ) : (
                  <span className="text-sm font-medium text-text-primary">
                    Verified Employee
                  </span>
                )}
                {review.is_flagged && (
                  <Badge variant="warning" className="text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Flagged
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                {review.role_at_company && (
                  <span>{review.role_at_company}</span>
                )}
                {review.role_at_company && review.years_at_company && (
                  <span>-</span>
                )}
                {review.years_at_company && (
                  <span>{review.years_at_company}</span>
                )}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <StarRating rating={review.overall_rating} size="md" />
              <span className="text-sm font-semibold text-text-primary">
                {review.overall_rating.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-text-muted">
              {formatDate(review.created_at)}
            </span>
          </div>
        </div>

        {/* Review text */}
        {review.review_text && (
          <p className="text-sm text-text-primary mt-4 leading-relaxed">
            {review.review_text}
          </p>
        )}

        {/* Pros and Cons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {review.pros && (
            <div>
              <div className="flex items-center gap-1.5 text-success text-xs font-medium mb-1">
                <ThumbsUp className="w-3 h-3" />
                Pros
              </div>
              <p className="text-sm text-text-secondary">{review.pros}</p>
            </div>
          )}
          {review.cons && (
            <div>
              <div className="flex items-center gap-1.5 text-error text-xs font-medium mb-1">
                <ThumbsDown className="w-3 h-3" />
                Cons
              </div>
              <p className="text-sm text-text-secondary">{review.cons}</p>
            </div>
          )}
        </div>

        {/* Compact Rating Breakdown */}
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="flex items-center gap-1 text-xs text-primary mt-4 hover:underline"
        >
          {showBreakdown ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
          {showBreakdown ? "Hide" : "Show"} rating breakdown
        </button>

        {showBreakdown && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {ratingCategories.map((cat) => {
              const rating = review[cat.key as keyof CompanyReview] as number;
              return (
                <div
                  key={cat.key}
                  className="flex items-center justify-between text-xs bg-surface-elevated rounded-md px-2 py-1.5"
                >
                  <span className="text-text-secondary truncate mr-2">
                    {cat.label}
                  </span>
                  <span
                    className={cn(
                      "font-medium",
                      rating >= 4
                        ? "text-success"
                        : rating >= 3
                        ? "text-warning"
                        : "text-error"
                    )}
                  >
                    {rating}/5
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Company Response */}
        {review.company_response && (
          <div className="mt-4 bg-surface-elevated rounded-lg p-4 border-l-4 border-primary">
            <div className="flex items-center gap-1.5 text-xs font-medium text-primary mb-1">
              <MessageSquare className="w-3 h-3" />
              Company Response
            </div>
            <p className="text-sm text-text-secondary">
              {review.company_response}
            </p>
          </div>
        )}

        {/* Report button */}
        <div className="mt-4 pt-3 border-t border-border flex justify-end">
          <Button variant="ghost" size="sm" className="text-text-muted text-xs">
            <Flag className="w-3 h-3" />
            Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
