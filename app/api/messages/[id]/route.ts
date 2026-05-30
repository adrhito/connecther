import { NextRequest, NextResponse } from "next/server";
import { conversations, messages } from "@/lib/data/messages";
import { users } from "@/lib/data/users";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const conversation = conversations.find((c) => c.id === id);

  if (!conversation) {
    return NextResponse.json(
      { error: "Conversation not found" },
      { status: 404 }
    );
  }

  const participants = conversation.participant_ids
    .map((pid) => {
      const user = users.find((u) => u.id === pid);
      if (!user) return null;
      return {
        id: user.id,
        name: user.name,
        headline: user.headline,
        profile_photo_url: user.profile_photo_url,
      };
    })
    .filter(Boolean);

  const convMessages = messages
    .filter((m) => m.conversation_id === id)
    .sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

  return NextResponse.json({
    conversation: {
      ...conversation,
      participants,
    },
    messages: convMessages,
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const conversation = conversations.find((c) => c.id === id);

  if (!conversation) {
    return NextResponse.json(
      { error: "Conversation not found" },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const { sender_id, body: messageBody } = body;

    if (!sender_id || !messageBody) {
      return NextResponse.json(
        { error: "sender_id and body are required" },
        { status: 400 }
      );
    }

    const newMessage = {
      id: `msg-${Date.now()}`,
      conversation_id: id,
      sender_id,
      body: messageBody,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    return NextResponse.json({ message: newMessage });
  } catch {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
