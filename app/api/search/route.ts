import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get("q")?.toLowerCase();
    const type = searchParams.get("type");

    if (!q) {
      return NextResponse.json({ results: [], total: 0 });
    }

    const supabase = await createClient();

    const results: Record<string, unknown[]> = {
      people: [],
      jobs: [],
      companies: [],
      communities: [],
      posts: [],
    };

    // Search people
    if (!type || type === "people") {
      const { data: users } = await supabase
        .from("users")
        .select("*")
        .neq("role", "admin");

      results.people = (users || []).filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.headline?.toLowerCase().includes(q) ||
          u.company?.toLowerCase().includes(q) ||
          u.skills?.some((s: string) => s.toLowerCase().includes(q))
      );
    }

    // Search jobs
    if (!type || type === "jobs") {
      const { data: jobs } = await supabase
        .from("jobs")
        .select(`
          *,
          company:companies(name, logo_url)
        `)
        .eq("is_active", true);

      results.jobs = (jobs || [])
        .filter(
          (j) =>
            j.title?.toLowerCase().includes(q) ||
            j.description?.toLowerCase().includes(q) ||
            j.location?.toLowerCase().includes(q) ||
            j.industry?.toLowerCase().includes(q)
        )
        .map((j) => ({
          ...j,
          company_name: j.company?.name ?? "Unknown",
          company_logo: j.company?.logo_url,
          company: undefined,
        }));
    }

    // Search companies
    if (!type || type === "companies") {
      const { data: companies } = await supabase.from("companies").select("*");

      results.companies = (companies || []).filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.industry?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q)
      );
    }

    // Search communities
    if (!type || type === "communities") {
      const { data: communities } = await supabase.from("communities").select("*");

      results.communities = (communities || []).filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q)
      );
    }

    // Search posts
    if (!type || type === "posts") {
      const { data: posts } = await supabase
        .from("posts")
        .select("*")
        .eq("is_flagged", false);

      results.posts = (posts || []).filter(
        (p) =>
          p.content?.toLowerCase().includes(q) ||
          p.hashtags?.some((h: string) => h.toLowerCase().includes(q))
      );
    }

    const total = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);

    return NextResponse.json({ results, total });
  } catch (error) {
    console.error("Error in search route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
