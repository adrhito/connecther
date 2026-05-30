"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { Sidebar } from "@/components/layout/Sidebar";
import { PostComposer } from "@/components/feed/PostComposer";
import { PostCard } from "@/components/feed/PostCard";
import { FeedSidebar } from "@/components/feed/FeedSidebar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { Post, User, Comment } from "@/lib/types";

const USER_POSTS_KEY = "connecther_user_posts";

function getStoredPosts(): Post[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(USER_POSTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function storePost(post: Post) {
  const existing = getStoredPosts();
  existing.unshift(post);
  localStorage.setItem(USER_POSTS_KEY, JSON.stringify(existing));
}

export default function FeedPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, User>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsRes, usersRes] = await Promise.all([
          fetch("/api/posts"),
          fetch("/api/users"),
        ]);

        const postsData = await postsRes.json();
        const usersData = await usersRes.json();

        const apiPosts: Post[] = postsData.posts || [];
        const userPosts = getStoredPosts();
        // Merge user-created posts with API posts, deduplicating by id
        const apiIds = new Set(apiPosts.map((p) => p.id));
        const mergedPosts = [
          ...userPosts.filter((p) => !apiIds.has(p.id)),
          ...apiPosts,
        ].sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );

        setPosts(mergedPosts);
        setComments(postsData.comments || []);

        const map: Record<string, User> = {};
        for (const u of usersData.users || []) {
          map[u.id] = u;
        }
        // Add current user to map if not present
        if (user && !map[user.id]) {
          map[user.id] = user;
        }
        setUsersMap(map);
      } catch (err) {
        console.error("Failed to fetch feed data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [user]);

  const handleNewPost = useCallback(
    (newPost: Post) => {
      storePost(newPost);
      setPosts((prev) => [newPost, ...prev]);
      // Ensure the current user is in the users map
      if (user) {
        setUsersMap((prev) => ({ ...prev, [user.id]: user }));
      }
    },
    [user]
  );

  const getCommentsForPost = (postId: string) => {
    return comments.filter((c) => c.post_id === postId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex gap-6">
        {/* Left sidebar */}
        <Sidebar />

        {/* Main feed */}
        <div className="flex-1 min-w-0 max-w-2xl">
          <PostComposer onPost={handleNewPost} />

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-secondary text-sm">
                No posts yet. Be the first to share something!
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {posts.map((post) => {
                const author = usersMap[post.author_id];
                if (!author) return null;
                return (
                  <PostCard
                    key={post.id}
                    post={post}
                    author={author}
                    comments={getCommentsForPost(post.id)}
                    allUsers={usersMap}
                    currentUserId={user?.id}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <FeedSidebar />
      </div>
    </div>
  );
}
