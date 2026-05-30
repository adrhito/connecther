import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const q = searchParams.get("q")?.toLowerCase();

    const supabase = await createClient();

    let query = supabase.from("communities").select("*");

    if (category) {
      query = query.eq("category", category);
    }

    if (featured === "true") {
      query = query.eq("is_featured", true);
    }

    const { data: communities, error } = await query;

    if (error) {
      console.error("Error fetching communities:", error);
      return NextResponse.json(
        { error: "Failed to fetch communities" },
        { status: 500 }
      );
    }

    let filtered = communities || [];

    // Apply text search filter if provided
    if (q) {
      filtered = filtered.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({
      communities: filtered,
      total: filtered.length,
    });
  } catch (error) {
    console.error("Error in communities route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
