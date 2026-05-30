"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyHeader } from "@/components/companies/CompanyHeader";
import { RatingChart } from "@/components/companies/RatingChart";
import { ReviewCard } from "@/components/companies/ReviewCard";
import { ReviewForm } from "@/components/companies/ReviewForm";
import { SalaryTable } from "@/components/companies/SalaryTable";
import { PromotionTimeline } from "@/components/companies/PromotionTimeline";
import { SafetyDisclaimer } from "@/components/companies/SafetyDisclaimer";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Company, CompanyReview, SalaryEntry, PromotionTimeline as PromotionTimelineType } from "@/lib/types";

interface CompanyData {
  company: Company;
  reviews: CompanyReview[];
  salaries: SalaryEntry[];
  promotions: PromotionTimelineType[];
  avgRatings: Record<string, number>;
  reviewCount: number;
}

export default function CompanyDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reviewFormRef = useRef<HTMLDivElement>(null);

  const fetchCompanyData = useCallback(async () => {
    try {
      const res = await fetch(`/api/companies/${id}`);
      if (!res.ok) {
        setError("Company not found");
        return;
      }
      const result = await res.json();
      setData(result);
    } catch {
      setError("Failed to load company data");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-side data fetching
    fetchCompanyData();
  }, [fetchCompanyData]);

  const scrollToReviewForm = () => {
    reviewFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-surface-elevated rounded w-24" />
          <div className="h-32 bg-surface-elevated rounded-lg" />
          <div className="h-64 bg-surface-elevated rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <EmptyState
          title="Company not found"
          description="The company you are looking for does not exist or has been removed."
          action={
            <Button variant="secondary" asChild>
              <Link href="/companies">Back to Companies</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const { company, reviews, salaries, promotions, avgRatings, reviewCount } =
    data;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back navigation */}
      <Link
        href="/companies"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Companies
      </Link>

      {/* Company Header */}
      <CompanyHeader
        company={company}
        avgRating={avgRatings.overall_rating}
        reviewCount={reviewCount}
        onWriteReview={scrollToReviewForm}
      />

      {/* Tabs */}
      <Tabs defaultValue="overview" className="mt-6">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews ({reviewCount})
          </TabsTrigger>
          <TabsTrigger value="salaries">
            Salaries ({salaries.length})
          </TabsTrigger>
          <TabsTrigger value="promotions">
            Promotions ({promotions.length})
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {reviewCount > 0 && <RatingChart ratings={avgRatings} />}

          {/* Diversity stats */}
          {company.diversity_stats && (
            <div className="bg-surface border border-border rounded-lg p-6">
              <h3 className="font-heading font-semibold text-text-primary mb-4">
                Diversity & Inclusion
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {company.diversity_stats.women_leadership_pct !== undefined && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {company.diversity_stats.women_leadership_pct}%
                    </div>
                    <p className="text-xs text-text-muted mt-1">
                      Women in Leadership
                    </p>
                  </div>
                )}
                {company.diversity_stats.women_workforce_pct !== undefined && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {company.diversity_stats.women_workforce_pct}%
                    </div>
                    <p className="text-xs text-text-muted mt-1">
                      Women in Workforce
                    </p>
                  </div>
                )}
                {company.diversity_stats.women_board_pct !== undefined && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {company.diversity_stats.women_board_pct}%
                    </div>
                    <p className="text-xs text-text-muted mt-1">
                      Women on Board
                    </p>
                  </div>
                )}
                {company.diversity_stats.women_tech_pct !== undefined && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {company.diversity_stats.women_tech_pct}%
                    </div>
                    <p className="text-xs text-text-muted mt-1">
                      Women in Tech Roles
                    </p>
                  </div>
                )}
              </div>

              {company.parental_leave_policy && (
                <div className="mt-4 pt-4 border-t border-border">
                  <h4 className="text-sm font-medium text-text-primary mb-1">
                    Parental Leave Policy
                  </h4>
                  <p className="text-sm text-text-secondary">
                    {company.parental_leave_policy}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Latest reviews preview */}
          {reviews.length > 0 && (
            <div>
              <h3 className="font-heading font-semibold text-text-primary mb-4">
                Latest Reviews
              </h3>
              <div className="space-y-4">
                {reviews.slice(0, 3).map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          )}

          <SafetyDisclaimer />
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6 mt-6">
          {reviewCount > 0 && <RatingChart ratings={avgRatings} />}

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No reviews yet"
              description="Be the first to share your experience at this company."
            />
          )}

          <div ref={reviewFormRef}>
            <ReviewForm
              companyId={company.id}
              companyName={company.name}
              onSuccess={fetchCompanyData}
            />
          </div>

          <SafetyDisclaimer />
        </TabsContent>

        {/* Salaries Tab */}
        <TabsContent value="salaries" className="space-y-6 mt-6">
          <SalaryTable salaries={salaries} />
        </TabsContent>

        {/* Promotions Tab */}
        <TabsContent value="promotions" className="space-y-6 mt-6">
          <PromotionTimeline promotions={promotions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
