import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q")?.toLowerCase();
    const role = searchParams.get("role");
    const industry = searchParams.get("industry")?.toLowerCase();
    const location = searchParams.get("location")?.toLowerCase();

    const supabase = await createClient();

    let query = supabase
      .from("users")
      .select("*")
      .neq("role", "admin");

    // Apply filters
    if (role) {
      query = query.eq("role", role);
    }

    if (industry) {
      query = query.ilike("industry", `%${industry}%`);
    }

    if (location) {
      query = query.ilike("location", `%${location}%`);
    }

    const { data: users, error } = await query;

    if (error) {
      console.error("Error fetching users:", error);
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      );
    }

    // Apply text search filter if provided
    let filtered = users || [];
    if (q) {
      filtered = filtered.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.headline?.toLowerCase().includes(q) ||
          u.about?.toLowerCase().includes(q) ||
          u.skills?.some((s: string) => s.toLowerCase().includes(q)) ||
          u.company?.toLowerCase().includes(q) ||
          u.school?.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ users: filtered, total: filtered.length });
  } catch (error) {
    console.error("Error in users route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
