"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, MapPin, Clock, FileText } from "lucide-react";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Badge } from "@/components/shared/Badge";
import { PostActions } from "@/components/feed/PostActions";
import { CommentSection } from "@/components/feed/CommentSection";
import { formatRelativeTime } from "@/lib/utils/format";
import type { Post, User, Comment } from "@/lib/types";

interface PostCardProps {
  post: Post;
  author: User;
  comments: Comment[];
  allUsers: Record<string, User>;
  currentUserId?: string;
}

function getLikedPosts(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = localStorage.getItem("connecther_liked_posts");
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function getSavedPosts(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = localStorage.getItem("connecther_saved_posts");
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

export function PostCard({ post, author, comments, allUsers, currentUserId }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(() => getLikedPosts().has(post.id));
  const [isSaved, setIsSaved] = useState(() => getSavedPosts().has(post.id));
  const [likesCount, setLikesCount] = useState(
    post.likes_count + (getLikedPosts().has(post.id) ? 1 : 0)
  );
  const [showComments, setShowComments] = useState(false);
  const [localComments, setLocalComments] = useState<Comment[]>(comments);

  const handleLike = () => {
    const liked = getLikedPosts();
    if (isLiked) {
      liked.delete(post.id);
      setLikesCount((prev) => prev - 1);
    } else {
      liked.add(post.id);
      setLikesCount((prev) => prev + 1);
    }
    localStorage.setItem("connecther_liked_posts", JSON.stringify([...liked]));
    setIsLiked(!isLiked);
  };

  const handleSave = () => {
    const saved = getSavedPosts();
    if (isSaved) {
      saved.delete(post.id);
    } else {
      saved.add(post.id);
    }
    localStorage.setItem("connecther_saved_posts", JSON.stringify([...saved]));
    setIsSaved(!isSaved);
  };

  const handleAddComment = (content: string) => {
    if (!currentUserId) return;
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      post_id: post.id,
      author_id: currentUserId,
      content,
      likes_count: 0,
      created_at: new Date().toISOString(),
    };
    setLocalComments((prev) => [...prev, newComment]);
  };

  const postTypeIcon = () => {
    switch (post.post_type) {
      case "article":
        return <FileText className="w-3 h-3 text-text-muted" />;
      case "poll":
        return <span className="text-xs text-text-muted">Poll</span>;
      case "event":
        return <Calendar className="w-3 h-3 text-text-muted" />;
      default:
        return null;
    }
  };

  const totalPollVotes = post.poll_options?.reduce((sum, opt) => sum + opt.votes, 0) || 0;

  return (
    <article className="bg-surface border border-border rounded-lg p-4">
      {/* Author header */}
      <div className="flex items-start gap-3">
        <Link href={`/profile/${author.id}`}>
          <UserAvatar
            name={author.name}
            src={author.profile_photo_url}
            size="md"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Link
              href={`/profile/${author.id}`}
              className="text-sm font-semibold text-text-primary hover:underline truncate"
            >
              {author.name}
            </Link>
            {author.is_mentor && author.mentor_verified && (
              <Badge variant="accent" className="text-[10px] px-1.5 py-0">
                Mentor
              </Badge>
            )}
          </div>
          <p className="text-xs text-text-secondary truncate">
            {author.headline || author.role}
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs text-text-muted">
              {formatRelativeTime(post.created_at)}
            </span>
            {postTypeIcon()}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-3">
        <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">
          {post.content}
        </p>

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
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

        {/* Media placeholder */}
        {post.media_url && (
          <div className="mt-3 bg-surface-elevated rounded-lg h-48 flex items-center justify-center border border-border">
            <span className="text-text-muted text-sm">Media content</span>
          </div>
        )}

        {/* Poll */}
        {post.post_type === "poll" && post.poll_options && (
          <div className="mt-3 space-y-2">
            {post.poll_options.map((option) => {
              const percentage = totalPollVotes > 0
                ? Math.round((option.votes / totalPollVotes) * 100)
                : 0;
              return (
                <div
                  key={option.id}
                  className="relative border border-border rounded-lg overflow-hidden"
                >
                  <div
                    className="absolute inset-y-0 left-0 bg-accent/20 transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="relative flex items-center justify-between px-3 py-2.5">
                    <span className="text-sm text-text-primary">{option.text}</span>
                    <span className="text-xs font-medium text-text-secondary ml-2">
                      {percentage}%
                    </span>
                  </div>
                </div>
              );
            })}
            <p className="text-xs text-text-muted">{totalPollVotes} votes</p>
          </div>
        )}

        {/* Event */}
        {post.post_type === "event" && post.event_details && (
          <div className="mt-3 bg-surface-elevated border border-border rounded-lg p-4">
            <h4 className="font-semibold text-sm text-text-primary">
              {post.event_details.title}
            </h4>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <Calendar className="w-3.5 h-3.5" />
                <span>{post.event_details.date}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.event_details.time}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <MapPin className="w-3.5 h-3.5" />
                <span>{post.event_details.location}</span>
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-2">
              {post.event_details.description}
            </p>
            <button className="mt-3 px-4 py-1.5 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary-light transition-colors">
              RSVP
            </button>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-3">
        <PostActions
          likesCount={likesCount}
          commentsCount={localComments.length || post.comments_count}
          repostsCount={post.reposts_count}
          isLiked={isLiked}
          isSaved={isSaved}
          onLike={handleLike}
          onComment={() => setShowComments(!showComments)}
          onRepost={() => {}}
          onSave={handleSave}
          onShare={() => {}}
        />
      </div>

      {/* Comments */}
      {showComments && (
        <CommentSection
          comments={localComments}
          users={allUsers}
          currentUserId={currentUserId}
          onAddComment={handleAddComment}
        />
      )}
    </article>
  );
}
