import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Fetch user
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (userError || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch related data in parallel
    const [
      { data: userExperiences },
      { data: userEducation },
      { data: userEndorsements },
      { data: userRecommendations },
      { data: userProfileViews },
    ] = await Promise.all([
      supabase.from("experiences").select("*").eq("user_id", id),
      supabase.from("education").select("*").eq("user_id", id),
      supabase.from("endorsements").select("*").eq("endorsed_id", id),
      supabase.from("recommendations").select("*").eq("recipient_id", id),
      supabase
        .from("profile_views")
        .select("*")
        .eq("viewed_id", id)
        .order("viewed_at", { ascending: false })
        .limit(5),
    ]);

    // Include mentor-specific data if this user is a mentor
    let mentorData = {};
    if (user.is_mentor) {
      const { data: requests } = await supabase
        .from("mentorship_requests")
        .select("*, mentee:users!mentorship_requests_mentee_id_fkey(name, profile_photo_url)")
        .eq("mentor_id", id);

      if (requests) {
        const completedWithRating = requests.filter(
          (r) => r.status === "completed" && r.rating
        );
        const avgRating =
          completedWithRating.length > 0
            ? completedWithRating.reduce((sum, r) => sum + (r.rating ?? 0), 0) /
              completedWithRating.length
            : 0;
        const totalMentees = requests.filter(
          (r) => r.status === "accepted" || r.status === "completed"
        ).length;

        const reviews = completedWithRating.map((r) => ({
          id: r.id,
          mentee_name: r.mentee?.name ?? "Anonymous",
          mentee_photo: r.mentee?.profile_photo_url,
          rating: r.rating,
          text: r.rating_text,
          date: r.created_at,
        }));

        mentorData = {
          mentor_rating: avgRating,
          mentor_total_mentees: totalMentees,
          mentor_reviews: reviews,
        };
      }
    }

    return NextResponse.json({
      user: { ...user, ...mentorData },
      experiences: userExperiences || [],
      education: userEducation || [],
      endorsements: userEndorsements || [],
      recommendations: userRecommendations || [],
      profileViews: userProfileViews || [],
    });
  } catch (error) {
    console.error("Error fetching user:", error);
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
    const body = await request.json();

    // Fields that cannot be updated via this endpoint
    const protectedFields = ["id", "email", "created_at", "role"];
    for (const field of protectedFields) {
      if (field in body) {
        return NextResponse.json(
          { error: `Cannot update protected field: ${field}` },
          { status: 400 }
        );
      }
    }

    const supabase = await createClient();

    // Update user
    const { data: updatedUser, error } = await supabase
      .from("users")
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating user:", error);
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Error in PATCH user:", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
