export interface AdminAnalytics {
  totalUsers: number;
  totalPosts: number;
  totalJobs: number;
  totalApplications: number;
  totalMentorRequests: number;
  totalReviews: number;
  userGrowth: Array<{ month: string; users: number }>;
  postActivity: Array<{ month: string; posts: number }>;
}

export async function getAnalytics(): Promise<AdminAnalytics> {
  const res = await fetch("/api/admin/analytics");
  return res.json();
}

export async function getFlaggedContent(): Promise<{ posts: unknown[]; reviews: unknown[] }> {
  const res = await fetch("/api/admin/moderation");
  return res.json();
}

export async function moderateContent(id: string, action: "approve" | "reject"): Promise<void> {
  await fetch("/api/admin/moderation", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, action }),
  });
}
