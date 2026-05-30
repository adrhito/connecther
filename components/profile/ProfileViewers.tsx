"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { formatRelativeTime } from "@/lib/utils/format";
import type { ProfileView, User } from "@/lib/types";

interface ProfileViewersProps {
  profileViews: ProfileView[];
  users: Record<string, User>;
}

export function ProfileViewers({ profileViews, users }: ProfileViewersProps) {
  if (profileViews.length === 0) return null;

  return (
    <div className="bg-surface border border-border rounded-lg p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Eye className="w-5 h-5 text-text-muted" />
        <h2 className="text-lg font-semibold text-text-primary font-heading">
          Who viewed your profile
        </h2>
      </div>

      <div className="space-y-3">
        {profileViews.map((view) => {
          const viewer = users[view.viewer_id];
          if (!viewer) return null;

          return (
            <div key={view.id} className="flex items-center gap-3">
              <Link href={`/profile/${viewer.id}`}>
                <UserAvatar
                  name={viewer.name}
                  src={viewer.profile_photo_url}
                  size="sm"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/profile/${viewer.id}`}
                  className="text-sm font-medium text-text-primary hover:underline truncate block"
                >
                  {viewer.name}
                </Link>
                <p className="text-xs text-text-secondary truncate">
                  {viewer.headline || viewer.role}
                </p>
              </div>
              <span className="text-xs text-text-muted shrink-0">
                {formatRelativeTime(view.viewed_at)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
