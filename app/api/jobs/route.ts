import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: jobs, error } = await supabase
      .from("jobs")
      .select(`
        *,
        company:companies(
          name,
          logo_url
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching jobs:", error);
      return NextResponse.json(
        { error: "Failed to fetch jobs" },
        { status: 500 }
      );
    }

    // Format response to match expected structure
    const jobsWithCompany = (jobs || []).map((job) => ({
      ...job,
      company_name: job.company?.name ?? "Unknown Company",
      company_logo: job.company?.logo_url,
      company: undefined, // Remove nested company object
    }));

    return NextResponse.json(jobsWithCompany);
  } catch (error) {
    console.error("Error in jobs route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
