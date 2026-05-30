import { NextRequest, NextResponse } from "next/server";
import { communities } from "@/lib/data/communities";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const community = communities.find((c) => c.id === id);

  if (!community) {
    return NextResponse.json(
      { error: "Community not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ community });
}
