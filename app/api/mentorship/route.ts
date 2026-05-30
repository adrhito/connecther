import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const industry = searchParams.get("industry")?.toLowerCase();
    const availability = searchParams.get("availability")?.toLowerCase();
    const badge = searchParams.get("badge")?.toLowerCase();
    const mentorId = searchParams.get("mentor_id");
    const menteeId = searchParams.get("mentee_id");
    const status = searchParams.get("status");

    const supabase = await createClient();

    // If filtering by mentor_id or mentee_id, return mentorship requests
    if (mentorId || menteeId || status) {
      let query = supabase
        .from("mentorship_requests")
        .select(`
          *,
          mentor:users!mentorship_requests_mentor_id_fkey(name, profile_photo_url, headline),
          mentee:users!mentorship_requests_mentee_id_fkey(name, profile_photo_url)
        `);

      if (mentorId) {
        query = query.eq("mentor_id", mentorId);
      }
      if (menteeId) {
        query = query.eq("mentee_id", menteeId);
      }
      if (status) {
        query = query.eq("status", status);
      }

      const { data: requests, error } = await query;

      if (error) {
        console.error("Error fetching mentorship requests:", error);
        return NextResponse.json(
          { error: "Failed to fetch mentorship requests" },
          { status: 500 }
        );
      }

      // Enrich with user info
      const enriched = (requests || []).map((req) => ({
        ...req,
        mentor_name: req.mentor?.name ?? "Unknown",
        mentor_photo: req.mentor?.profile_photo_url,
        mentor_headline: req.mentor?.headline,
        mentee_name: req.mentee?.name ?? "Unknown",
        mentee_photo: req.mentee?.profile_photo_url,
        mentor: undefined,
        mentee: undefined,
      }));

      return NextResponse.json({
        mentorship_requests: enriched,
        total: enriched.length,
      });
    }

    // Otherwise, return mentors (users who are mentors)
    let query = supabase
      .from("users")
      .select("*")
      .eq("is_mentor", true)
      .eq("mentor_open", true)
      .eq("is_active", true);

    if (industry) {
      query = query.ilike("industry", `%${industry}%`);
    }

    if (availability) {
      query = query.ilike("mentor_availability", `%${availability}%`);
    }

    const { data: mentors, error } = await query;

    if (error) {
      console.error("Error fetching mentors:", error);
      return NextResponse.json(
        { error: "Failed to fetch mentors" },
        { status: 500 }
      );
    }

    let filtered = mentors || [];

    // Apply badge filter (array filter in TypeScript)
    if (badge) {
      filtered = filtered.filter((u) =>
        u.mentor_badges?.some((b: string) => b.toLowerCase().includes(badge))
      );
    }

    // Fetch mentorship requests for stats
    const mentorIds = filtered.map((m) => m.id);
    const { data: allRequests } = await supabase
      .from("mentorship_requests")
      .select("mentor_id, status, rating")
      .in("mentor_id", mentorIds);

    // Enrich with mentor stats
    const safeMentors = filtered.map((user) => {
      const requests = (allRequests || []).filter((r) => r.mentor_id === user.id);
      const completedWithRating = requests.filter(
        (r) => r.status === "completed" && r.rating
      );
      const avgRating =
        completedWithRating.length > 0
          ? Math.round(
              (completedWithRating.reduce((sum, r) => sum + (r.rating ?? 0), 0) /
                completedWithRating.length) *
                10
            ) / 10
          : 0;
      const totalMentees = requests.filter(
        (r) => r.status === "accepted" || r.status === "completed"
      ).length;

      return {
        ...user,
        mentor_rating: avgRating,
        mentor_total_mentees: totalMentees,
      };
    });

    return NextResponse.json({
      mentors: safeMentors,
      total: safeMentors.length,
    });
  } catch (error) {
    console.error("Error in mentorship route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mentor_id, mentee_id, request_type } = body;

    if (!mentor_id || !mentee_id || !request_type) {
      return NextResponse.json(
        { error: "mentor_id, mentee_id, and request_type are required" },
        { status: 400 }
      );
    }

    if (mentor_id === mentee_id) {
      return NextResponse.json(
        { error: "Cannot request mentorship from yourself" },
        { status: 400 }
      );
    }

    const validTypes = ["coffee_chat", "long_term", "office_hours"];
    if (!validTypes.includes(request_type)) {
      return NextResponse.json(
        { error: `request_type must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Verify mentor exists and is available
    const { data: mentor, error: mentorError } = await supabase
      .from("users")
      .select("*")
      .eq("id", mentor_id)
      .single();

    if (mentorError || !mentor) {
      return NextResponse.json(
        { error: "Mentor not found" },
        { status: 404 }
      );
    }

    if (!mentor.is_mentor || !mentor.mentor_open) {
      return NextResponse.json(
        { error: "This user is not accepting mentorship requests" },
        { status: 400 }
      );
    }

    // Check if mentee exists
    const { data: mentee, error: menteeError } = await supabase
      .from("users")
      .select("id")
      .eq("id", mentee_id)
      .single();

    if (menteeError || !mentee) {
      return NextResponse.json(
        { error: "Mentee not found" },
        { status: 404 }
      );
    }

    // Check mentor's capacity (pending + accepted requests)
    const { data: activeRequests } = await supabase
      .from("mentorship_requests")
      .select("id")
      .eq("mentor_id", mentor_id)
      .in("status", ["pending", "accepted"]);

    if ((activeRequests?.length || 0) >= mentor.mentor_max_requests) {
      return NextResponse.json(
        { error: "This mentor has reached their maximum active mentorship capacity" },
        { status: 400 }
      );
    }

    // Check for duplicate pending request
    const { data: existingRequest } = await supabase
      .from("mentorship_requests")
      .select("id")
      .eq("mentor_id", mentor_id)
      .eq("mentee_id", mentee_id)
      .eq("status", "pending")
      .single();

    if (existingRequest) {
      return NextResponse.json(
        { error: "You already have a pending request with this mentor" },
        { status: 409 }
      );
    }

    const { data: newRequest, error: createError } = await supabase
      .from("mentorship_requests")
      .insert({
        mentor_id,
        mentee_id,
        request_type,
        message: body.message || null,
        what_to_learn: body.what_to_learn || null,
        why_this_mentor: body.why_this_mentor || null,
        status: "pending",
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating mentorship request:", createError);
      return NextResponse.json(
        { error: "Failed to create mentorship request" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { mentorship_request: newRequest },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST mentorship:", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
