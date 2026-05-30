import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    // Fetch all conversations
    const { data: conversations, error: convError } = await supabase
      .from("conversations")
      .select("*")
      .order("last_message_at", { ascending: false });

    if (convError) {
      console.error("Error fetching conversations:", convError);
      return NextResponse.json(
        { error: "Failed to fetch conversations" },
        { status: 500 }
      );
    }

    // Enrich conversations with participant details and messages
    const enrichedConversations = await Promise.all(
      (conversations || []).map(async (conv) => {
        // Fetch participants
        const { data: participants } = await supabase
          .from("users")
          .select("id, name, headline, profile_photo_url")
          .in("id", conv.participant_ids);

        // Fetch messages for unread count and last message
        const { data: messages } = await supabase
          .from("messages")
          .select("*")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false });

        const lastMessage = messages?.[0] || null;
        const unreadCount = messages?.filter((m) => !m.is_read).length || 0;

        return {
          ...conv,
          participants: participants || [],
          lastMessage,
          unreadCount,
        };
      })
    );

    return NextResponse.json({
      conversations: enrichedConversations,
      total: enrichedConversations.length,
    });
  } catch (error) {
    console.error("Error in messages route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
