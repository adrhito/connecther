import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch all mentors
    const { data: mentors, error } = await supabase
      .from("users")
      .select("*")
      .eq("is_mentor", true);

    if (error) {
      console.error("Error fetching mentors:", error);
      return NextResponse.json(
        { error: "Failed to fetch mentors" },
        { status: 500 }
      );
    }

    // Fetch mentorship requests for stats
    const mentorIds = (mentors || []).map((m) => m.id);
    const { data: allRequests } = await supabase
      .from("mentorship_requests")
      .select("mentor_id, status, rating")
      .in("mentor_id", mentorIds);

    // Enrich with mentor stats
    const mentorsWithStats = (mentors || []).map((user) => {
      const requests = (allRequests || []).filter((r) => r.mentor_id === user.id);
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

      return {
        ...user,
        mentor_rating: avgRating,
        mentor_total_mentees: totalMentees,
      };
    });

    return NextResponse.json(mentorsWithStats);
  } catch (error) {
    console.error("Error in mentors route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
