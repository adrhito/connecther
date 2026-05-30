import { NextRequest, NextResponse } from "next/server";
import { reviews } from "@/lib/data/reviews";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const review = reviews.find((r) => r.id === id);

  if (!review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  return NextResponse.json({ review });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const review = reviews.find((r) => r.id === id);

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const body = await request.json();
    const { company_response, moderation_status } = body;

    const updates: Record<string, unknown> = {};

    // Handle company response
    if (company_response !== undefined) {
      if (typeof company_response !== "string" || company_response.trim().length === 0) {
        return NextResponse.json(
          { error: "company_response must be a non-empty string" },
          { status: 400 }
        );
      }
      updates.company_response = company_response;
    }

    // Handle moderation status update
    if (moderation_status !== undefined) {
      const validStatuses = ["pending", "approved", "rejected", "flagged"];
      if (!validStatuses.includes(moderation_status)) {
        return NextResponse.json(
          { error: `moderation_status must be one of: ${validStatuses.join(", ")}` },
          { status: 400 }
        );
      }
      updates.moderation_status = moderation_status;

      // If approved or rejected, clear the flagged status
      if (moderation_status === "approved" || moderation_status === "rejected") {
        updates.is_flagged = false;
      }
      if (moderation_status === "flagged") {
        updates.is_flagged = true;
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update. Provide company_response or moderation_status." },
        { status: 400 }
      );
    }

    const updatedReview = { ...review, ...updates };

    return NextResponse.json({ review: updatedReview });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
