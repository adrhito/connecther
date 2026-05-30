"use client";

import { useState } from "react";
import {
  Type,
  Image as ImageIcon,
  BarChart3,
  CalendarPlus,
  FileText,
  Send,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { UserAvatar } from "@/components/shared/UserAvatar";
import type { Post, PostType } from "@/lib/types";

interface PostComposerProps {
  onPost: (post: Post) => void;
}

const postTypeOptions: { type: PostType; label: string; icon: React.ReactNode }[] = [
  { type: "text", label: "Text", icon: <Type className="w-4 h-4" /> },
  { type: "image", label: "Image", icon: <ImageIcon className="w-4 h-4" /> },
  { type: "poll", label: "Poll", icon: <BarChart3 className="w-4 h-4" /> },
  { type: "event", label: "Event", icon: <CalendarPlus className="w-4 h-4" /> },
  { type: "article", label: "Article", icon: <FileText className="w-4 h-4" /> },
];

export function PostComposer({ onPost }: PostComposerProps) {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState<PostType>("text");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);

    // Extract hashtags
    const hashtagRegex = /#(\w+)/g;
    const hashtags: string[] = [];
    let match;
    while ((match = hashtagRegex.exec(content)) !== null) {
      hashtags.push(match[1]);
    }

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author_id: user.id,
      content: content.trim(),
      post_type: postType,
      hashtags,
      mentions: [],
      likes_count: 0,
      comments_count: 0,
      reposts_count: 0,
      is_featured: false,
      is_flagged: false,
      created_at: new Date().toISOString(),
    };

    try {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author_id: user.id,
          content: content.trim(),
          post_type: postType,
          hashtags,
        }),
      });
    } catch {
      // Mock: just use local state
    }

    onPost(newPost);
    setContent("");
    setPostType("text");
    setIsSubmitting(false);
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="flex gap-3">
        <UserAvatar
          name={user.name}
          src={user.profile_photo_url}
          size="md"
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-text-primary">{user.name}</p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={3}
            className="w-full mt-2 bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted resize-none outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Post type toggles */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-1">
          {postTypeOptions.map(({ type, label, icon }) => (
            <button
              key={type}
              onClick={() => setPostType(type)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                postType === type
                  ? "bg-accent/20 text-primary"
                  : "text-text-secondary hover:bg-surface-elevated"
              }`}
            >
              {icon}
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!content.trim() || isSubmitting}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
          Post
        </button>
      </div>
    </div>
  );
}
