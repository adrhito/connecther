"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Send } from "lucide-react";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { formatRelativeTime } from "@/lib/utils/format";
import type { Comment, User } from "@/lib/types";

interface CommentSectionProps {
  comments: Comment[];
  users: Record<string, User>;
  currentUserId?: string;
  onAddComment: (content: string) => void;
}

export function CommentSection({
  comments,
  users,
  currentUserId,
  onAddComment,
}: CommentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setNewComment] = useState("");

  const sortedComments = [...comments].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const displayComments = isExpanded ? sortedComments : sortedComments.slice(0, 2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(newComment.trim());
    setNewComment("");
  };

  if (comments.length === 0 && !currentUserId) return null;

  return (
    <div className="mt-3 pt-3 border-t border-border">
      {comments.length > 2 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-xs text-text-secondary hover:text-primary mb-3 transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-3 h-3" />
              Show fewer comments
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3" />
              View all {comments.length} comments
            </>
          )}
        </button>
      )}

      <div className="space-y-3">
        {displayComments.map((comment) => {
          const author = users[comment.author_id];
          return (
            <div key={comment.id} className="flex gap-2">
              <UserAvatar
                name={author?.name || "Unknown"}
                src={author?.profile_photo_url}
                size="sm"
              />
              <div className="flex-1 bg-surface-elevated rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-text-primary">
                    {author?.name || "Unknown User"}
                  </span>
                  <span className="text-xs text-text-muted">
                    {formatRelativeTime(comment.created_at)}
                  </span>
                </div>
                <p className="text-sm text-text-primary mt-0.5">{comment.content}</p>
                {comment.likes_count > 0 && (
                  <span className="text-xs text-text-muted mt-1 inline-block">
                    {comment.likes_count} {comment.likes_count === 1 ? "like" : "likes"}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {currentUserId && (
        <form onSubmit={handleSubmit} className="flex gap-2 mt-3">
          <UserAvatar
            name={users[currentUserId]?.name || "You"}
            src={users[currentUserId]?.profile_photo_url}
            size="sm"
          />
          <div className="flex-1 flex items-center gap-2 bg-surface-elevated rounded-full px-3 py-1.5">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="text-primary disabled:text-text-muted transition-colors"
              aria-label="Send comment"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
