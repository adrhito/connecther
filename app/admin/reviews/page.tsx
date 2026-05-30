"use client";

import { useEffect, useState } from "react";
import { ModerationQueue } from "@/components/admin/ModerationQueue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/shared/Badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { CheckCircle, X, Star } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/format";

interface ReviewItem {
  id: string;
  company_id: string;
  author_id?: string;
  review_text?: string;
  overall_rating: number;
  moderation_status: string;
  is_flagged: boolean;
  created_at: string;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/reviews");
        const data = await res.json();
        setReviews(data.reviews || []);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  const flaggedReviews = reviews.filter((r) => r.is_flagged);
  const pendingReviews = reviews.filter(
    (r) => r.moderation_status === "pending"
  );

  const moderationItems = flaggedReviews.map((r) => ({
    id: r.id,
    content: r.review_text || "No content provided",
    author: r.author_id || "Anonymous",
    authorId: r.author_id,
    type: "review" as const,
    reason: "Flagged content",
    flaggedAt: r.created_at,
  }));

  const handleApprove = (id: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, is_flagged: false, moderation_status: "approved" }
          : r
      )
    );
  };

  const handleRemove = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const handleBan = (authorId: string) => {
    console.log("Ban user:", authorId);
  };

  const handleApproveReview = (id: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, moderation_status: "approved" } : r
      )
    );
  };

  const handleRejectReview = (id: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, moderation_status: "rejected" } : r
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-text-primary">
          Review Moderation
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage flagged and pending company reviews
        </p>
      </div>

      {flaggedReviews.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-3">
            Flagged Reviews ({flaggedReviews.length})
          </h2>
          <ModerationQueue
            items={moderationItems}
            onApprove={handleApprove}
            onRemove={handleRemove}
            onBan={handleBan}
          />
        </div>
      )}

      {pendingReviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Pending Reviews ({pendingReviews.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {pendingReviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 flex items-start gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-text-primary">
                        {review.company_id}
                      </span>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.overall_rating
                                ? "text-accent-warm fill-accent-warm"
                                : "text-text-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <Badge variant="warning">Pending</Badge>
                    </div>
                    <p className="text-sm text-text-secondary line-clamp-2">
                      {review.review_text || "No content"}
                    </p>
                    <span className="text-xs text-text-muted mt-1 inline-block">
                      {formatRelativeTime(review.created_at)}
                    </span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      onClick={() => handleApproveReview(review.id)}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRejectReview(review.id)}
                    >
                      <X className="w-3.5 h-3.5" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            All Reviews ({reviews.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary">
                      {review.company_id}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < review.overall_rating
                              ? "text-accent-warm fill-accent-warm"
                              : "text-text-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <Badge
                      variant={
                        review.moderation_status === "approved"
                          ? "success"
                          : review.moderation_status === "flagged"
                          ? "destructive"
                          : review.moderation_status === "pending"
                          ? "warning"
                          : "outline"
                      }
                    >
                      {review.moderation_status}
                    </Badge>
                  </div>
                  <p className="text-xs text-text-muted mt-1 truncate">
                    {review.review_text || "No content"}
                  </p>
                </div>
                <span className="text-xs text-text-muted whitespace-nowrap">
                  {formatRelativeTime(review.created_at)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
