"use client";

import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { EmptyState } from "@/components/shared/EmptyState";
import { Heart, MessageSquare, Share2, FileText } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/format";
import type { Post } from "@/lib/types";
import type { User } from "@/lib/types";

interface CommunityFeedProps {
  posts: Post[];
  users: Partial<User>[];
}

export function CommunityFeed({ posts, users }: CommunityFeedProps) {
  if (posts.length === 0) {
    return (
      <EmptyState
        icon={<FileText className="w-12 h-12" />}
        title="No posts yet"
        description="Be the first to share something with this community!"
      />
    );
  }

  const getAuthor = (authorId: string) =>
    users.find((u) => u.id === authorId);

  return (
    <div className="space-y-4">
      {posts.map((post) => {
        const author = getAuthor(post.author_id);
        return (
          <Card key={post.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3 mb-3">
                <UserAvatar
                  name={author?.name || "User"}
                  src={author?.profile_photo_url}
                  size="md"
                />
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {author?.name || "Unknown User"}
                  </p>
                  <p className="text-xs text-text-muted">
                    {author?.headline && (
                      <span className="text-text-secondary">
                        {author.headline} &middot;{" "}
                      </span>
                    )}
                    {formatRelativeTime(post.created_at)}
                  </p>
                </div>
              </div>

              <p className="text-sm text-text-primary whitespace-pre-wrap mb-3">
                {post.content}
              </p>

              {post.hashtags && post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {post.hashtags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-primary hover:underline cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-4 pt-3 border-t border-border">
                <button className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary transition-colors">
                  <Heart className="w-4 h-4" />
                  {post.likes_count}
                </button>
                <button className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  {post.comments_count}
                </button>
                <button className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary transition-colors">
                  <Share2 className="w-4 h-4" />
                  {post.reposts_count}
                </button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
