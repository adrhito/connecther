import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("user_id");
    const status = searchParams.get("status");

    if (!userId) {
      return NextResponse.json(
        { error: "user_id query parameter is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    let query = supabase
      .from("connections")
      .select("*")
      .or(`requester_id.eq.${userId},receiver_id.eq.${userId}`);

    if (status) {
      query = query.eq("status", status);
    }

    const { data: connections, error } = await query;

    if (error) {
      console.error("Error fetching connections:", error);
      return NextResponse.json(
        { error: "Failed to fetch connections" },
        { status: 500 }
      );
    }

    // Enrich with user info
    const enriched = await Promise.all(
      (connections || []).map(async (conn) => {
        const otherUserId =
          conn.requester_id === userId ? conn.receiver_id : conn.requester_id;

        const { data: otherUser } = await supabase
          .from("users")
          .select("*")
          .eq("id", otherUserId)
          .single();

        return {
          ...conn,
          user: otherUser || null,
        };
      })
    );

    return NextResponse.json({
      connections: enriched,
      total: enriched.length,
    });
  } catch (error) {
    console.error("Error in connections route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { requester_id, receiver_id } = body;

    if (!requester_id || !receiver_id) {
      return NextResponse.json(
        { error: "requester_id and receiver_id are required" },
        { status: 400 }
      );
    }

    if (requester_id === receiver_id) {
      return NextResponse.json(
        { error: "Cannot send a connection request to yourself" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Check both users exist
    const [{ data: requester }, { data: receiver }] = await Promise.all([
      supabase.from("users").select("id").eq("id", requester_id).single(),
      supabase.from("users").select("id").eq("id", receiver_id).single(),
    ]);

    if (!requester || !receiver) {
      return NextResponse.json(
        { error: "One or both users not found" },
        { status: 404 }
      );
    }

    // Check for existing connection (either direction)
    const { data: existing } = await supabase
      .from("connections")
      .select("*")
      .or(
        `and(requester_id.eq.${requester_id},receiver_id.eq.${receiver_id}),and(requester_id.eq.${receiver_id},receiver_id.eq.${requester_id})`
      )
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "A connection request already exists between these users", existing },
        { status: 409 }
      );
    }

    const { data: newConnection, error: createError } = await supabase
      .from("connections")
      .insert({
        requester_id,
        receiver_id,
        status: "pending",
      })
      .select()
      .single();

    if (createError) {
      console.error("Error creating connection:", createError);
      return NextResponse.json(
        { error: "Failed to create connection" },
        { status: 500 }
      );
    }

    return NextResponse.json({ connection: newConnection }, { status: 201 });
  } catch (error) {
    console.error("Error in POST connections:", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
