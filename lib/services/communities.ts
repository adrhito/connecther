import type { Community } from "@/lib/types";

export async function getCommunities(): Promise<Community[]> {
  const res = await fetch("/api/communities");
  const data = await res.json();
  return data.communities || [];
}
