import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const authorId = searchParams.get("author_id");
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    const supabase = await createClient();

    let query = supabase
      .from("posts")
      .select("*")
      .eq("is_flagged", false)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (authorId) {
      query = query.eq("author_id", authorId);
    }

    if (featured === "true") {
      query = query.eq("is_featured", true);
    }

    const { data: posts, error: postsError, count } = await query;

    if (postsError) {
      console.error("Error fetching posts:", postsError);
      return NextResponse.json(
        { error: "Failed to fetch posts" },
        { status: 500 }
      );
    }

    // Fetch comments for the posts
    const postIds = (posts || []).map((p) => p.id);
    const { data: comments } = await supabase
      .from("comments")
      .select("*")
      .in("post_id", postIds);

    return NextResponse.json({
      posts: posts || [],
      comments: comments || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error in posts route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { author_id, content, post_type } = body;

    if (!author_id || !content) {
      return NextResponse.json(
        { error: "author_id and content are required" },
        { status: 400 }
      );
    }

    // Extract hashtags from content
    const hashtagRegex = /#(\w+)/g;
    const hashtags: string[] = [];
    let match;
    while ((match = hashtagRegex.exec(content)) !== null) {
      hashtags.push(match[1]);
    }

    // Extract mentions from content
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    while ((match = mentionRegex.exec(content)) !== null) {
      mentions.push(match[1]);
    }

    const supabase = await createClient();

    const { data: newPost, error } = await supabase
      .from("posts")
      .insert({
        author_id,
        content,
        post_type: post_type || "text",
        media_url: body.media_url,
        poll_options: body.poll_options,
        event_details: body.event_details,
        hashtags: hashtags.length > 0 ? hashtags : body.hashtags,
        mentions: mentions.length > 0 ? mentions : body.mentions,
        likes_count: 0,
        comments_count: 0,
        reposts_count: 0,
        is_featured: false,
        is_flagged: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating post:", error);
      return NextResponse.json(
        { error: "Failed to create post" },
        { status: 500 }
      );
    }

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    console.error("Error in POST posts:", error);
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}
