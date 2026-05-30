import type { User } from "@/lib/types";

const API_BASE = "/api/auth";

export async function loginUser(email: string, password: string): Promise<{ user?: User; error?: string }> {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function signupUser(data: Partial<User> & { password: string }): Promise<{ user?: User; error?: string }> {
  const res = await fetch(`${API_BASE}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function logoutUser(): Promise<void> {
  await fetch(`${API_BASE}/logout`, { method: "POST" });
}
