import { NextRequest, NextResponse } from "next/server";
import { connections } from "@/lib/data/users";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const connection = connections.find((c) => c.id === id);

    if (!connection) {
      return NextResponse.json(
        { error: "Connection not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { status } = body;

    if (!status || !["accepted", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "status must be 'accepted' or 'rejected'" },
        { status: 400 }
      );
    }

    if (connection.status !== "pending") {
      return NextResponse.json(
        { error: `Connection has already been ${connection.status}` },
        { status: 400 }
      );
    }

    const updatedConnection = {
      ...connection,
      status: status as "accepted" | "rejected",
    };

    return NextResponse.json({ connection: updatedConnection });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
