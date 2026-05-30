"use client";

import Link from "next/link";
import { useAuth } from "@/lib/hooks/useAuth";
import { UserAvatar } from "@/components/shared/UserAvatar";

export function ProfileSummaryCard() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div className="h-16 bg-gradient-to-r from-primary to-primary-light" />
      <div className="px-4 pb-4 -mt-6">
        <UserAvatar name={user.name} src={user.profile_photo_url} size="lg" className="border-2 border-surface" />
        <Link href={`/profile/${user.id}`} className="block mt-2">
          <h3 className="font-semibold text-sm text-text-primary hover:underline">{user.name}</h3>
        </Link>
        <p className="text-xs text-text-secondary mt-0.5">{user.headline || user.role}</p>
        {user.location && (
          <p className="text-xs text-text-muted mt-0.5">{user.location}</p>
        )}
      </div>
      <div className="border-t border-border px-4 py-3">
        <div className="flex justify-between text-xs">
          <span className="text-text-secondary">Connections</span>
          <span className="font-semibold text-primary">127</span>
        </div>
        <div className="flex justify-between text-xs mt-1">
          <span className="text-text-secondary">Profile views</span>
          <span className="font-semibold text-primary">42</span>
        </div>
      </div>
    </div>
  );
}
