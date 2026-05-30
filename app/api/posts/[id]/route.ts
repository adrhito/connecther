import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (postError || !post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const { data: postComments } = await supabase
      .from("comments")
      .select("*")
      .eq("post_id", id);

    return NextResponse.json({ post, comments: postComments || [] });
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (postError || !post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const action = request.nextUrl.searchParams.get("action");
    const body = await request.json().catch(() => ({}));

    switch (action) {
      case "like": {
        const userId = body.user_id;
        if (!userId) {
          return NextResponse.json(
            { error: "user_id is required" },
            { status: 400 }
          );
        }

        // Insert like
        const { data: like, error: likeError } = await supabase
          .from("likes")
          .insert({
            user_id: userId,
            post_id: id,
          })
          .select()
          .single();

        if (likeError) {
          console.error("Error creating like:", likeError);
          return NextResponse.json(
            { error: "Failed to like post" },
            { status: 500 }
          );
        }

        // Update post likes count
        const { data: updatedPost } = await supabase
          .from("posts")
          .update({ likes_count: post.likes_count + 1 })
          .eq("id", id)
          .select()
          .single();

        return NextResponse.json({
          post: updatedPost,
          like,
        });
      }

      case "comment": {
        const { user_id: authorId, content } = body;
        if (!authorId || !content) {
          return NextResponse.json(
            { error: "user_id and content are required" },
            { status: 400 }
          );
        }

        // Insert comment
        const { data: newComment, error: commentError } = await supabase
          .from("comments")
          .insert({
            post_id: id,
            author_id: authorId,
            content,
            likes_count: 0,
          })
          .select()
          .single();

        if (commentError) {
          console.error("Error creating comment:", commentError);
          return NextResponse.json(
            { error: "Failed to create comment" },
            { status: 500 }
          );
        }

        // Update post comments count
        const { data: updatedPost } = await supabase
          .from("posts")
          .update({ comments_count: post.comments_count + 1 })
          .eq("id", id)
          .select()
          .single();

        return NextResponse.json(
          {
            post: updatedPost,
            comment: newComment,
          },
          { status: 201 }
        );
      }

      case "repost": {
        const repostUserId = body.user_id;
        if (!repostUserId) {
          return NextResponse.json(
            { error: "user_id is required" },
            { status: 400 }
          );
        }

        // Insert repost
        const { data: repost, error: repostError } = await supabase
          .from("reposts")
          .insert({
            user_id: repostUserId,
            post_id: id,
          })
          .select()
          .single();

        if (repostError) {
          console.error("Error creating repost:", repostError);
          return NextResponse.json(
            { error: "Failed to repost" },
            { status: 500 }
          );
        }

        // Update post reposts count
        const { data: updatedPost } = await supabase
          .from("posts")
          .update({ reposts_count: post.reposts_count + 1 })
          .eq("id", id)
          .select()
          .single();

        return NextResponse.json({
          post: updatedPost,
          repost,
        });
      }

      default:
        return NextResponse.json(
          {
            error:
              "Invalid action. Use ?action=like, ?action=comment, or ?action=repost",
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error in POST post action:", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
