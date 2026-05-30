"use client";

import { useState } from "react";
import { Star, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";
import { REVIEW_CATEGORIES } from "@/lib/constants";

interface ReviewFormProps {
  companyId: string;
  companyName: string;
  onSuccess?: () => void;
}

function ClickableStars({
  rating,
  onRate,
  label,
}: {
  rating: number;
  onRate: (value: number) => void;
  label: string;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-text-secondary">{label}</span>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onRate(star)}
            className="p-0.5 focus:outline-none"
          >
            <Star
              className={cn(
                "w-5 h-5 transition-colors",
                (hover || rating) >= star
                  ? "fill-warning text-warning"
                  : "text-border"
              )}
            />
          </button>
        ))}
        <span className="text-xs text-text-muted w-6 text-right ml-1">
          {rating > 0 ? rating : "-"}
        </span>
      </div>
    </div>
  );
}

export function ReviewForm({ companyId, companyName, onSuccess }: ReviewFormProps) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [reviewText, setReviewText] = useState("");
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");
  const [roleAtCompany, setRoleAtCompany] = useState("");
  const [yearsAtCompany, setYearsAtCompany] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const ratingCategories = REVIEW_CATEGORIES;

  const handleRate = (key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate that overall rating is set
    if (!ratings.overall_rating) {
      setError("Please provide an overall rating.");
      return;
    }

    // Validate all category ratings are set
    const missingRatings = ratingCategories.filter(
      (cat) => !ratings[cat.key]
    );
    if (missingRatings.length > 0) {
      setError(
        `Please rate all categories: ${missingRatings
          .map((c) => c.label)
          .join(", ")}`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_id: companyId,
          ...ratings,
          review_text: reviewText || undefined,
          pros: pros || undefined,
          cons: cons || undefined,
          role_at_company: roleAtCompany || undefined,
          years_at_company: yearsAtCompany || undefined,
          is_anonymous: isAnonymous,
        }),
      });

      const data = await response.json();

      if (response.status === 202) {
        setError(
          "Your review has been flagged for moderation and will be reviewed by our team."
        );
      } else if (!response.ok) {
        setError(data.error || "Failed to submit review.");
      } else {
        setSuccess(true);
        // Reset form
        setRatings({});
        setReviewText("");
        setPros("");
        setCons("");
        setRoleAtCompany("");
        setYearsAtCompany("");
        onSuccess?.();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="flex flex-col items-center text-center py-8">
          <CheckCircle2 className="w-12 h-12 text-success mb-4" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">
            Review Submitted
          </h3>
          <p className="text-sm text-text-secondary max-w-md">
            Thank you for sharing your experience at {companyName}. Your review
            will be visible after moderation.
          </p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => setSuccess(false)}
          >
            Write Another Review
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h3 className="font-heading font-semibold text-text-primary text-lg mb-1">
        Write a Review for {companyName}
      </h3>
      <p className="text-sm text-text-secondary mb-6">
        Share your experience to help other women make informed career decisions.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Star Ratings */}
        <div className="space-y-3">
          <Label className="text-base">Rate Your Experience</Label>
          <div className="bg-surface-elevated rounded-lg p-4 space-y-3">
            {ratingCategories.map((cat) => (
              <ClickableStars
                key={cat.key}
                rating={ratings[cat.key] || 0}
                onRate={(value) => handleRate(cat.key, value)}
                label={cat.label}
              />
            ))}
          </div>
        </div>

        {/* Review Text */}
        <div className="space-y-2">
          <Label htmlFor="review-text">Your Review</Label>
          <Textarea
            id="review-text"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share details about your experience working here..."
            className="min-h-[100px]"
          />
        </div>

        {/* Pros */}
        <div className="space-y-2">
          <Label htmlFor="pros">Pros</Label>
          <Textarea
            id="pros"
            value={pros}
            onChange={(e) => setPros(e.target.value)}
            placeholder="What did you like about working here?"
            className="min-h-[80px]"
          />
        </div>

        {/* Cons */}
        <div className="space-y-2">
          <Label htmlFor="cons">Cons</Label>
          <Textarea
            id="cons"
            value={cons}
            onChange={(e) => setCons(e.target.value)}
            placeholder="What could be improved?"
            className="min-h-[80px]"
          />
        </div>

        {/* Role at company */}
        <div className="space-y-2">
          <Label htmlFor="role">Your Role at Company</Label>
          <Input
            id="role"
            value={roleAtCompany}
            onChange={(e) => setRoleAtCompany(e.target.value)}
            placeholder="e.g., Software Engineer, Product Manager"
          />
        </div>

        {/* Years at company */}
        <div className="space-y-2">
          <Label htmlFor="years">Years at Company</Label>
          <Select value={yearsAtCompany} onValueChange={setYearsAtCompany}>
            <SelectTrigger>
              <SelectValue placeholder="Select years" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Less than 1 year">Less than 1 year</SelectItem>
              <SelectItem value="1-3 years">1-3 years</SelectItem>
              <SelectItem value="3-5 years">3-5 years</SelectItem>
              <SelectItem value="5-10 years">5-10 years</SelectItem>
              <SelectItem value="10+ years">10+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Anonymous toggle */}
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="anonymous-toggle">Submit Anonymously</Label>
            <p className="text-xs text-text-muted mt-0.5">
              Your identity will not be shown with your review
            </p>
          </div>
          <Switch
            id="anonymous-toggle"
            checked={isAnonymous}
            onCheckedChange={setIsAnonymous}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 text-sm text-error bg-error/10 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        {/* Legal disclaimer */}
        <p className="text-xs text-text-muted leading-relaxed">
          By submitting this review, you confirm that you are a current or
          former employee of this company and that your review represents your
          honest opinion. All reviews are subject to our moderation guidelines.
          We reserve the right to remove reviews that violate our community
          standards. Your review may be edited for clarity but never for content.
        </p>

        {/* Submit */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      </form>
    </div>
  );
}
