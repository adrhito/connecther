import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: applications, error } = await supabase
      .from("job_applications")
      .select(`
        *,
        job:jobs(
          title,
          location,
          company:companies(
            name,
            logo_url
          )
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching job applications:", error);
      return NextResponse.json(
        { error: "Failed to fetch job applications" },
        { status: 500 }
      );
    }

    // Format response to match expected structure
    const applicationsWithDetails = (applications || []).map((app) => ({
      ...app,
      job_title: app.job?.title ?? "Unknown Job",
      company_name: app.job?.company?.name ?? "Unknown Company",
      company_logo: app.job?.company?.logo_url,
      location: app.job?.location,
      job: undefined, // Remove nested job object
    }));

    return NextResponse.json(applicationsWithDetails);
  } catch (error) {
    console.error("Error in job tracker route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
