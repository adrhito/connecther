"use client";

import { Heart, MessageCircle, Repeat2, Bookmark, Share2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatNumber } from "@/lib/utils/format";

interface PostActionsProps {
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  isLiked: boolean;
  isSaved: boolean;
  onLike: () => void;
  onComment: () => void;
  onRepost: () => void;
  onSave: () => void;
  onShare: () => void;
}

export function PostActions({
  likesCount,
  commentsCount,
  repostsCount,
  isLiked,
  isSaved,
  onLike,
  onComment,
  onRepost,
  onSave,
  onShare,
}: PostActionsProps) {
  return (
    <div className="flex items-center justify-between pt-3 border-t border-border">
      <button
        onClick={onLike}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors hover:bg-surface-elevated",
          isLiked ? "text-accent-warm font-medium" : "text-text-secondary"
        )}
        aria-label={isLiked ? "Unlike" : "Like"}
      >
        <Heart
          className={cn("w-4 h-4", isLiked && "fill-accent-warm")}
        />
        <span>{likesCount > 0 ? formatNumber(likesCount) : "Like"}</span>
      </button>

      <button
        onClick={onComment}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-secondary transition-colors hover:bg-surface-elevated"
        aria-label="Comment"
      >
        <MessageCircle className="w-4 h-4" />
        <span>{commentsCount > 0 ? formatNumber(commentsCount) : "Comment"}</span>
      </button>

      <button
        onClick={onRepost}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-secondary transition-colors hover:bg-surface-elevated"
        aria-label="Repost"
      >
        <Repeat2 className="w-4 h-4" />
        <span>{repostsCount > 0 ? formatNumber(repostsCount) : "Repost"}</span>
      </button>

      <button
        onClick={onSave}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors hover:bg-surface-elevated",
          isSaved ? "text-primary font-medium" : "text-text-secondary"
        )}
        aria-label={isSaved ? "Unsave" : "Save"}
      >
        <Bookmark
          className={cn("w-4 h-4", isSaved && "fill-primary")}
        />
        <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
      </button>

      <button
        onClick={onShare}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-text-secondary transition-colors hover:bg-surface-elevated"
        aria-label="Share"
      >
        <Share2 className="w-4 h-4" />
        <span className="hidden sm:inline">Share</span>
      </button>
    </div>
  );
}
