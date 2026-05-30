"use client";

import { useEffect, useState } from "react";
import { ModerationQueue } from "@/components/admin/ModerationQueue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/shared/Badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Flag, Star, Trash2 } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/format";

interface PostItem {
  id: string;
  author_id: string;
  content: string;
  is_flagged: boolean;
  is_featured: boolean;
  created_at: string;
  likes_count: number;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts?limit=100");
        const data = await res.json();
        setPosts(data.posts || []);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const flaggedPosts = posts.filter((p) => p.is_flagged);
  const moderationItems = flaggedPosts.map((p) => ({
    id: p.id,
    content: p.content,
    author: p.author_id,
    authorId: p.author_id,
    type: "post" as const,
    reason: "Community guidelines violation",
    flaggedAt: p.created_at,
  }));

  const handleApprove = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_flagged: false } : p))
    );
  };

  const handleRemove = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleBan = (authorId: string) => {
    console.log("Ban user:", authorId);
  };

  const handleToggleFlag = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_flagged: !p.is_flagged } : p))
    );
  };

  const handleToggleFeatured = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, is_featured: !p.is_featured } : p
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-text-primary">
          Post Moderation
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Review flagged posts and manage content
        </p>
      </div>

      {flaggedPosts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-text-primary mb-3">
            Flagged Posts ({flaggedPosts.length})
          </h2>
          <ModerationQueue
            items={moderationItems}
            onApprove={handleApprove}
            onRemove={handleRemove}
            onBan={handleBan}
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Posts ({posts.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-4 flex items-start gap-4 hover:bg-surface-elevated/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text-primary line-clamp-2">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-text-muted">
                      {post.author_id}
                    </span>
                    <span className="text-xs text-text-muted">
                      {formatRelativeTime(post.created_at)}
                    </span>
                    <span className="text-xs text-text-muted">
                      {post.likes_count} likes
                    </span>
                    {post.is_featured && (
                      <Badge variant="success">Featured</Badge>
                    )}
                    {post.is_flagged && (
                      <Badge variant="destructive">Flagged</Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleToggleFlag(post.id)}
                    title={post.is_flagged ? "Unflag" : "Flag"}
                  >
                    <Flag className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleToggleFeatured(post.id)}
                    title={post.is_featured ? "Unfeature" : "Feature"}
                  >
                    <Star className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRemove(post.id)}
                    title="Delete"
                    className="text-error hover:text-error"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
