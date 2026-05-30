import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: requests, error } = await supabase
      .from("mentorship_requests")
      .select(`
        *,
        mentor:users!mentorship_requests_mentor_id_fkey(name, profile_photo_url, headline),
        mentee:users!mentorship_requests_mentee_id_fkey(name, profile_photo_url)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching mentorship requests:", error);
      return NextResponse.json(
        { error: "Failed to fetch mentorship requests" },
        { status: 500 }
      );
    }

    const requestsWithDetails = (requests || []).map((req) => ({
      ...req,
      mentor_name: req.mentor?.name ?? "Unknown",
      mentor_photo: req.mentor?.profile_photo_url,
      mentor_headline: req.mentor?.headline,
      mentee_name: req.mentee?.name ?? "Unknown",
      mentee_photo: req.mentee?.profile_photo_url,
      mentor: undefined,
      mentee: undefined,
    }));

    return NextResponse.json(requestsWithDetails);
  } catch (error) {
    console.error("Error in mentorship requests route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
