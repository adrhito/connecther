import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q")?.toLowerCase();
    const industry = searchParams.get("industry");
    const size = searchParams.get("size");
    const minRating = searchParams.get("minRating");
    const featured = searchParams.get("featured");

    const supabase = await createClient();

    let query = supabase.from("companies").select("*");

    // Apply filters
    if (industry) {
      query = query.ilike("industry", industry);
    }

    if (size) {
      query = query.eq("size", size);
    }

    if (featured === "true") {
      query = query.eq("is_featured", true);
    }

    const { data: companies, error } = await query;

    if (error) {
      console.error("Error fetching companies:", error);
      return NextResponse.json(
        { error: "Failed to fetch companies" },
        { status: 500 }
      );
    }

    let filtered = companies || [];

    // Apply text search filter if provided
    if (q) {
      filtered = filtered.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.industry?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.headquarters?.toLowerCase().includes(q)
      );
    }

    // Fetch reviews for rating calculation
    const { data: reviews } = await supabase
      .from("reviews")
      .select("company_id, overall_rating")
      .eq("moderation_status", "approved")
      .in("company_id", filtered.map((c) => c.id));

    // Calculate average ratings for each company
    const companiesWithRatings = filtered.map((company) => {
      const companyReviews = (reviews || []).filter(
        (r) => r.company_id === company.id
      );
      const avgRating =
        companyReviews.length > 0
          ? companyReviews.reduce((sum, r) => sum + r.overall_rating, 0) /
            companyReviews.length
          : 0;
      return { ...company, avgRating, reviewCount: companyReviews.length };
    });

    // Apply min rating filter
    let result = companiesWithRatings;
    if (minRating) {
      const min = parseFloat(minRating);
      result = companiesWithRatings.filter((c) => c.avgRating >= min);
    }

    return NextResponse.json({
      companies: result,
      total: result.length,
    });
  } catch (error) {
    console.error("Error in companies route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
