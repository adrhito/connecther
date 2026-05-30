"use client";

import { UserAvatar } from "@/components/shared/UserAvatar";
import { formatRelativeTime } from "@/lib/utils/format";
import { Quote } from "lucide-react";
import type { Recommendation, User } from "@/lib/types";

interface RecommendationSectionProps {
  recommendations: Recommendation[];
  users: Record<string, User>;
}

export function RecommendationSection({ recommendations, users }: RecommendationSectionProps) {
  if (recommendations.length === 0) return null;

  return (
    <div className="bg-surface border border-border rounded-lg p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-text-primary font-heading mb-4">
        Recommendations
      </h2>

      <div className="space-y-5">
        {recommendations.map((rec, index) => {
          const author = users[rec.author_id];
          return (
            <div key={rec.id}>
              <div className="flex items-start gap-3">
                <UserAvatar
                  name={author?.name || "Unknown"}
                  src={author?.profile_photo_url}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-text-primary">
                    {author?.name || "Unknown User"}
                  </h3>
                  <p className="text-xs text-text-secondary">
                    {author?.headline || ""}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {rec.relationship} &middot; {formatRelativeTime(rec.created_at)}
                  </p>
                  <div className="mt-2 relative">
                    <Quote className="w-4 h-4 text-accent absolute -left-0.5 -top-0.5 opacity-40" />
                    <p className="text-sm text-text-primary leading-relaxed pl-5 italic">
                      {rec.text}
                    </p>
                  </div>
                </div>
              </div>

              {index < recommendations.length - 1 && (
                <div className="border-b border-border mt-5" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
