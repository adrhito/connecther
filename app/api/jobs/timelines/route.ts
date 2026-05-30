import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: timelines, error } = await supabase
      .from("recruiting_timelines")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching recruiting timelines:", error);
      return NextResponse.json(
        { error: "Failed to fetch recruiting timelines" },
        { status: 500 }
      );
    }

    return NextResponse.json(timelines || []);
  } catch (error) {
    console.error("Error in recruiting timelines route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
