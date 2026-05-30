import type { Notification } from "@/lib/types";

export async function getNotifications(): Promise<Notification[]> {
  const res = await fetch("/api/notifications");
  const data = await res.json();
  return data.notifications || [];
}

export async function markNotificationRead(id: string): Promise<void> {
  await fetch(`/api/notifications?id=${id}`, { method: "PATCH" });
}
