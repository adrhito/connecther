import type { User, MentorshipRequest } from "@/lib/types";

export async function getMentors(params?: Record<string, string>): Promise<User[]> {
  const query = params ? "?" + new URLSearchParams(params).toString() : "";
  const res = await fetch(`/api/mentorship${query}`);
  const data = await res.json();
  return data.mentors || [];
}

export async function createMentorshipRequest(request: Partial<MentorshipRequest>): Promise<MentorshipRequest | null> {
  const res = await fetch("/api/mentorship", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  const data = await res.json();
  return data.request || null;
}

export async function updateMentorshipRequest(
  id: string,
  updates: Partial<MentorshipRequest>
): Promise<MentorshipRequest | null> {
  const res = await fetch(`/api/mentorship/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  return data.request || null;
}
