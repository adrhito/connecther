"use client";

import Link from "next/link";
import { useAuth } from "@/lib/context/AuthContext";
import { UserAvatar } from "@/components/shared/UserAvatar";

export function Sidebar() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <aside className="hidden xl:block w-64 shrink-0">
      <div className="sticky top-20 space-y-4">
        {/* Profile summary */}
        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <div className="h-16 bg-gradient-to-r from-primary to-primary-light" />
          <div className="px-4 pb-4 -mt-6">
            <UserAvatar name={user.name} size="lg" className="border-2 border-surface" />
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

        {/* Quick links */}
        <div className="bg-surface border border-border rounded-lg p-4">
          <h4 className="font-semibold text-xs text-text-secondary uppercase tracking-wider mb-3">Quick Links</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/jobs/tracker" className="text-sm text-text-primary hover:text-primary transition-colors">
                Application Tracker
              </Link>
            </li>
            <li>
              <Link href="/mentorship" className="text-sm text-text-primary hover:text-primary transition-colors">
                Find a Mentor
              </Link>
            </li>
            <li>
              <Link href="/playbooks" className="text-sm text-text-primary hover:text-primary transition-colors">
                Career Playbooks
              </Link>
            </li>
            <li>
              <Link href="/communities" className="text-sm text-text-primary hover:text-primary transition-colors">
                Communities
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
