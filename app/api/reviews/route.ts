import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { moderateContent } from "@/lib/utils/moderation";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const companyId = searchParams.get("company_id");
    const status = searchParams.get("status");
    const flagged = searchParams.get("flagged");

    const supabase = await createClient();

    let query = supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (companyId) {
      query = query.eq("company_id", companyId);
    }

    if (status) {
      query = query.eq("moderation_status", status);
    }

    if (flagged === "true") {
      query = query.eq("is_flagged", true);
    }

    const { data: reviews, error } = await query;

    if (error) {
      console.error("Error fetching reviews:", error);
      return NextResponse.json(
        { error: "Failed to fetch reviews" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      reviews: reviews || [],
      total: (reviews || []).length,
    });
  } catch (error) {
    console.error("Error in reviews route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      company_id,
      overall_rating,
      pay_fairness_rating,
      mentorship_rating,
      promotion_fairness_rating,
      parental_leave_rating,
      flexibility_rating,
      safety_culture_rating,
      reporting_culture_rating,
      leadership_diversity_rating,
      work_life_balance_rating,
      review_text,
      pros,
      cons,
      role_at_company,
      years_at_company,
      is_anonymous,
    } = body;

    // Validate required fields
    if (!company_id || !overall_rating) {
      return NextResponse.json(
        { error: "Company ID and overall rating are required" },
        { status: 400 }
      );
    }

    // Validate rating ranges
    const ratings = [
      overall_rating,
      pay_fairness_rating,
      mentorship_rating,
      promotion_fairness_rating,
      parental_leave_rating,
      flexibility_rating,
      safety_culture_rating,
      reporting_culture_rating,
      leadership_diversity_rating,
      work_life_balance_rating,
    ];

    for (const rating of ratings) {
      if (rating !== undefined && (rating < 1 || rating > 5)) {
        return NextResponse.json(
          { error: "All ratings must be between 1 and 5" },
          { status: 400 }
        );
      }
    }

    // Moderate content
    const textToCheck = [review_text, pros, cons].filter(Boolean).join(" ");
    const moderation = moderateContent(textToCheck);

    const supabase = await createClient();

    const { data: review, error } = await supabase
      .from("reviews")
      .insert({
        company_id,
        is_anonymous: is_anonymous ?? true,
        overall_rating,
        pay_fairness_rating: pay_fairness_rating ?? 0,
        mentorship_rating: mentorship_rating ?? 0,
        promotion_fairness_rating: promotion_fairness_rating ?? 0,
        parental_leave_rating: parental_leave_rating ?? 0,
        flexibility_rating: flexibility_rating ?? 0,
        safety_culture_rating: safety_culture_rating ?? 0,
        reporting_culture_rating: reporting_culture_rating ?? 0,
        leadership_diversity_rating: leadership_diversity_rating ?? 0,
        work_life_balance_rating: work_life_balance_rating ?? 0,
        review_text,
        pros,
        cons,
        role_at_company,
        years_at_company,
        moderation_status: moderation.passed ? "pending" : "flagged",
        is_flagged: !moderation.passed,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating review:", error);
      return NextResponse.json(
        { error: "Failed to submit review" },
        { status: 500 }
      );
    }

    if (!moderation.passed) {
      return NextResponse.json(
        {
          error:
            "Your review has been flagged for moderation. It will be reviewed by our team.",
          flaggedWords: moderation.flaggedWords,
          review,
        },
        { status: 202 }
      );
    }

    return NextResponse.json({
      review,
      message: "Review submitted successfully. It will be visible after moderation.",
    });
  } catch (error) {
    console.error("Error in POST review:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
