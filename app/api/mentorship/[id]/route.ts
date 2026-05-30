import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: mentorshipRequest, error } = await supabase
      .from("mentorship_requests")
      .select(`
        *,
        mentor:users!mentorship_requests_mentor_id_fkey(name, profile_photo_url, headline),
        mentee:users!mentorship_requests_mentee_id_fkey(name, profile_photo_url)
      `)
      .eq("id", id)
      .single();

    if (error || !mentorshipRequest) {
      return NextResponse.json(
        { error: "Mentorship request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      mentorship_request: {
        ...mentorshipRequest,
        mentor_name: mentorshipRequest.mentor?.name ?? "Unknown",
        mentor_photo: mentorshipRequest.mentor?.profile_photo_url,
        mentor_headline: mentorshipRequest.mentor?.headline,
        mentee_name: mentorshipRequest.mentee?.name ?? "Unknown",
        mentee_photo: mentorshipRequest.mentee?.profile_photo_url,
        mentor: undefined,
        mentee: undefined,
      },
    });
  } catch (error) {
    console.error("Error fetching mentorship request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: mentorshipRequest, error: fetchError } = await supabase
      .from("mentorship_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !mentorshipRequest) {
      return NextResponse.json(
        { error: "Mentorship request not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { status, rating, rating_text } = body;

    const updates: Record<string, unknown> = {};

    // Handle status changes
    if (status !== undefined) {
      const validTransitions: Record<string, string[]> = {
        pending: ["accepted", "declined"],
        accepted: ["completed"],
        declined: [],
        completed: [],
      };

      const allowed = validTransitions[mentorshipRequest.status];
      if (!allowed || !allowed.includes(status)) {
        return NextResponse.json(
          {
            error: `Cannot transition from '${mentorshipRequest.status}' to '${status}'. Valid transitions: ${
              allowed?.join(", ") || "none"
            }`,
          },
          { status: 400 }
        );
      }

      updates.status = status;
    }

    // Handle rating (only for completed requests)
    if (rating !== undefined) {
      const effectiveStatus = updates.status || mentorshipRequest.status;
      if (effectiveStatus !== "completed") {
        return NextResponse.json(
          { error: "Can only rate completed mentorship requests" },
          { status: 400 }
        );
      }

      if (typeof rating !== "number" || rating < 1 || rating > 5) {
        return NextResponse.json(
          { error: "Rating must be a number between 1 and 5" },
          { status: 400 }
        );
      }

      updates.rating = rating;
      if (rating_text) {
        updates.rating_text = rating_text;
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update. Provide status, rating, or rating_text." },
        { status: 400 }
      );
    }

    const { data: updatedRequest, error: updateError } = await supabase
      .from("mentorship_requests")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating mentorship request:", updateError);
      return NextResponse.json(
        { error: "Failed to update mentorship request" },
        { status: 500 }
      );
    }

    return NextResponse.json({ mentorship_request: updatedRequest });
  } catch (error) {
    console.error("Error in PATCH mentorship request:", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
