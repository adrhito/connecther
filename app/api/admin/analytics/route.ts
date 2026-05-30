import { NextResponse } from "next/server";
import { users, connections } from "@/lib/data/users";
import { posts } from "@/lib/data/posts";
import { jobs } from "@/lib/data/jobs";
import { companies } from "@/lib/data/companies";
import { reviews } from "@/lib/data/reviews";
import { mentorshipRequests } from "@/lib/data/mentors";
import { communities } from "@/lib/data/communities";

export async function GET() {
  const activeUsers = users.filter((u) => u.is_active && u.role !== "admin");
  const activeMentors = users.filter((u) => u.is_mentor && u.mentor_open);
  const activeJobs = jobs.filter((j) => j.is_active);
  const approvedReviews = reviews.filter((r) => r.moderation_status === "approved");
  const pendingReviews = reviews.filter((r) => r.moderation_status === "pending");
  const flaggedReviews = reviews.filter((r) => r.is_flagged);
  const flaggedPosts = posts.filter((p) => p.is_flagged);
  const acceptedConnections = connections.filter((c) => c.status === "accepted");
  const pendingConnections = connections.filter((c) => c.status === "pending");

  // Role distribution
  const roleDistribution = activeUsers.reduce(
    (acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Industry distribution
  const industryDistribution = activeUsers.reduce(
    (acc, user) => {
      if (user.industry) {
        acc[user.industry] = (acc[user.industry] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  // Mentorship stats
  const ratedRequests = mentorshipRequests.filter((r) => r.rating);
  const mentorshipStats = {
    total_requests: mentorshipRequests.length,
    pending: mentorshipRequests.filter((r) => r.status === "pending").length,
    accepted: mentorshipRequests.filter((r) => r.status === "accepted").length,
    completed: mentorshipRequests.filter((r) => r.status === "completed").length,
    declined: mentorshipRequests.filter((r) => r.status === "declined").length,
    average_rating:
      ratedRequests.length > 0
        ? Math.round(
            (ratedRequests.reduce((sum, r) => sum + (r.rating || 0), 0) /
              ratedRequests.length) *
              10
          ) / 10
        : null,
  };

  // Total community members
  const totalCommunityMembers = communities.reduce(
    (sum, c) => sum + c.member_count,
    0
  );

  // Post engagement
  const totalLikes = posts.reduce((sum, p) => sum + p.likes_count, 0);
  const totalComments = posts.reduce((sum, p) => sum + p.comments_count, 0);
  const totalReposts = posts.reduce((sum, p) => sum + p.reposts_count, 0);

  return NextResponse.json({
    overview: {
      total_users: activeUsers.length,
      total_mentors: activeMentors.length,
      total_posts: posts.length,
      total_jobs: activeJobs.length,
      total_companies: companies.length,
      total_reviews: approvedReviews.length,
      total_communities: communities.length,
      total_community_members: totalCommunityMembers,
      total_connections: acceptedConnections.length,
      pending_connections: pendingConnections.length,
    },
    moderation: {
      pending_reviews: pendingReviews.length,
      flagged_reviews: flaggedReviews.length,
      flagged_posts: flaggedPosts.length,
      total_flagged: flaggedReviews.length + flaggedPosts.length,
    },
    engagement: {
      total_likes: totalLikes,
      total_comments: totalComments,
      total_reposts: totalReposts,
      avg_likes_per_post:
        posts.length > 0
          ? Math.round((totalLikes / posts.length) * 10) / 10
          : 0,
      avg_comments_per_post:
        posts.length > 0
          ? Math.round((totalComments / posts.length) * 10) / 10
          : 0,
    },
    distributions: {
      roles: roleDistribution,
      industries: industryDistribution,
    },
    mentorship: mentorshipStats,
  });
}
