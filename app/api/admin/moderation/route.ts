import { NextRequest, NextResponse } from "next/server";
import { posts } from "@/lib/data/posts";
import { reviews } from "@/lib/data/reviews";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const contentType = searchParams.get("type"); // "posts", "reviews", or null for all
  const status = searchParams.get("status"); // "flagged", "pending", etc.

  const flaggedContent: Record<string, unknown[]> = {};

  // Flagged/pending posts
  if (!contentType || contentType === "posts") {
    let filteredPosts = posts.filter((p) => p.is_flagged);
    if (status === "pending") {
      filteredPosts = posts.filter((p) => p.is_flagged);
    }
    flaggedContent.posts = filteredPosts.map((p) => ({
      ...p,
      content_type: "post",
    }));
  }

  // Flagged/pending reviews
  if (!contentType || contentType === "reviews") {
    let filteredReviews: typeof reviews;
    if (status === "flagged") {
      filteredReviews = reviews.filter((r) => r.is_flagged);
    } else if (status === "pending") {
      filteredReviews = reviews.filter((r) => r.moderation_status === "pending");
    } else {
      // Default: show all that need attention (flagged + pending)
      filteredReviews = reviews.filter(
        (r) => r.is_flagged || r.moderation_status === "pending"
      );
    }
    flaggedContent.reviews = filteredReviews.map((r) => ({
      ...r,
      content_type: "review",
    }));
  }

  const totalFlagged =
    (flaggedContent.posts?.length || 0) + (flaggedContent.reviews?.length || 0);

  return NextResponse.json({
    flagged_content: flaggedContent,
    total: totalFlagged,
  });
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { content_type, content_id, action } = body;

    if (!content_type || !content_id || !action) {
      return NextResponse.json(
        { error: "content_type, content_id, and action are required" },
        { status: 400 }
      );
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "action must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    if (content_type === "post") {
      const post = posts.find((p) => p.id === content_id);
      if (!post) {
        return NextResponse.json(
          { error: "Post not found" },
          { status: 404 }
        );
      }

      const updatedPost = {
        ...post,
        is_flagged: action !== "approve",
      };

      return NextResponse.json({
        content_type: "post",
        action,
        item: updatedPost,
        message: `Post ${action === "approve" ? "approved" : "rejected"} successfully`,
      });
    }

    if (content_type === "review") {
      const review = reviews.find((r) => r.id === content_id);
      if (!review) {
        return NextResponse.json(
          { error: "Review not found" },
          { status: 404 }
        );
      }

      const updatedReview = {
        ...review,
        moderation_status: action === "approve" ? "approved" : "rejected",
        is_flagged: false,
      };

      return NextResponse.json({
        content_type: "review",
        action,
        item: updatedReview,
        message: `Review ${action === "approve" ? "approved" : "rejected"} successfully`,
      });
    }

    return NextResponse.json(
      { error: "content_type must be 'post' or 'review'" },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
