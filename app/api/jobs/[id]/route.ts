import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: job, error } = await supabase
      .from("jobs")
      .select(`
        *,
        company:companies(
          name,
          logo_url,
          description,
          website_url,
          size,
          industry,
          headquarters,
          diversity_stats,
          parental_leave_policy
        )
      `)
      .eq("id", id)
      .single();

    if (error || !job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Format response to match expected structure
    const jobWithCompany = {
      ...job,
      company_name: job.company?.name ?? "Unknown Company",
      company_logo: job.company?.logo_url,
      company_description: job.company?.description,
      company_website: job.company?.website_url,
      company_size: job.company?.size,
      company_industry: job.company?.industry,
      company_headquarters: job.company?.headquarters,
      company_diversity_stats: job.company?.diversity_stats,
      company_parental_leave: job.company?.parental_leave_policy,
      company: undefined, // Remove nested company object
    };

    return NextResponse.json(jobWithCompany);
  } catch (error) {
    console.error("Error fetching job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
