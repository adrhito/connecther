import type { Post, Comment } from "@/lib/types";

export async function getPosts(authorId?: string): Promise<Post[]> {
  const query = authorId ? `?author_id=${authorId}` : "";
  const res = await fetch(`/api/posts${query}`);
  const data = await res.json();
  return data.posts || [];
}

export async function getPostById(id: string): Promise<{ post: Post; comments: Comment[] } | null> {
  const res = await fetch(`/api/posts/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export async function createPost(post: Partial<Post>): Promise<Post | null> {
  const res = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  const data = await res.json();
  return data.post || null;
}

export async function likePost(postId: string): Promise<void> {
  await fetch(`/api/posts/${postId}?action=like`, { method: "POST" });
}

export async function commentOnPost(postId: string, content: string): Promise<Comment | null> {
  const res = await fetch(`/api/posts/${postId}?action=comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  const data = await res.json();
  return data.comment || null;
}
