import type { Conversation, Message } from "@/lib/types";

export async function getConversations(): Promise<Conversation[]> {
  const res = await fetch("/api/messages");
  const data = await res.json();
  return data.conversations || [];
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const res = await fetch(`/api/messages/${conversationId}`);
  const data = await res.json();
  return data.messages || [];
}

export async function sendMessage(conversationId: string, body: string): Promise<Message | null> {
  const res = await fetch(`/api/messages/${conversationId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body }),
  });
  const data = await res.json();
  return data.message || null;
}
