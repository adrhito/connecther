import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch company
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .select("*")
      .eq("id", id)
      .single();

    if (companyError || !company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Fetch related data in parallel
    const [
      { data: companyReviews },
      { data: companySalaries },
      { data: companyPromotions },
    ] = await Promise.all([
      supabase
        .from("reviews")
        .select("*")
        .eq("company_id", id)
        .eq("moderation_status", "approved"),
      supabase
        .from("salary_entries")
        .select("*")
        .eq("company_id", id)
        .order("role_title"),
      supabase
        .from("promotion_timelines")
        .select("*")
        .eq("company_id", id)
        .order("created_at", { ascending: false }),
    ]);

    // Calculate average ratings
    const ratingKeys = [
      "overall_rating",
      "pay_fairness_rating",
      "mentorship_rating",
      "promotion_fairness_rating",
      "parental_leave_rating",
      "flexibility_rating",
      "safety_culture_rating",
      "reporting_culture_rating",
      "leadership_diversity_rating",
      "work_life_balance_rating",
    ] as const;

    const avgRatings: Record<string, number> = {};
    const reviews = companyReviews || [];
    if (reviews.length > 0) {
      for (const key of ratingKeys) {
        avgRatings[key] =
          reviews.reduce((sum, r) => sum + (r[key] || 0), 0) / reviews.length;
      }
    }

    return NextResponse.json({
      company,
      reviews,
      salaries: companySalaries || [],
      promotions: companyPromotions || [],
      avgRatings,
      reviewCount: reviews.length,
    });
  } catch (error) {
    console.error("Error fetching company:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
