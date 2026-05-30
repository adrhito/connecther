import type { User } from "@/lib/types";

export async function getUsers(params?: Record<string, string>): Promise<User[]> {
  const query = params ? "?" + new URLSearchParams(params).toString() : "";
  const res = await fetch(`/api/users${query}`);
  const data = await res.json();
  return data.users || [];
}

export async function getUserById(id: string): Promise<User | null> {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.user || null;
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  const res = await fetch(`/api/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  return data.user || null;
}
