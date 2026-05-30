import type { Connection } from "@/lib/types";

export async function getConnections(params?: Record<string, string>): Promise<Connection[]> {
  const query = params ? "?" + new URLSearchParams(params).toString() : "";
  const res = await fetch(`/api/connections${query}`);
  const data = await res.json();
  return data.connections || [];
}

export async function sendConnectionRequest(receiverId: string): Promise<Connection | null> {
  const res = await fetch("/api/connections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ receiver_id: receiverId }),
  });
  const data = await res.json();
  return data.connection || null;
}

export async function updateConnection(id: string, status: "accepted" | "rejected"): Promise<void> {
  await fetch(`/api/connections/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}
