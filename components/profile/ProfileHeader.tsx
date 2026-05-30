"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Building2, GraduationCap, UserPlus, MessageSquare, Pencil, Award } from "lucide-react";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Badge } from "@/components/shared/Badge";
import type { User } from "@/lib/types";

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
}

export function ProfileHeader({ user, isOwnProfile }: ProfileHeaderProps) {
  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Banner */}
      {user.banner_photo_url ? (
        <Image
          src={user.banner_photo_url}
          alt="Profile banner"
          width={1200}
          height={208}
          className="w-full h-40 sm:h-52 object-cover"
          unoptimized
        />
      ) : (
        <div className="w-full h-40 sm:h-52 bg-gradient-to-r from-primary via-primary-light to-accent" />
      )}

      {/* Profile info */}
      <div className="px-4 sm:px-6 pb-6">
        {/* Avatar - overlapping the banner */}
        <div className="-mt-12 sm:-mt-16 mb-3">
          <UserAvatar
            name={user.name}
            src={user.profile_photo_url}
            size="xl"
            className="border-4 border-surface w-24 h-24 sm:w-32 sm:h-32 text-2xl"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-text-primary font-heading">
                {user.name}
              </h1>
              {user.is_mentor && user.mentor_verified && (
                <Badge variant="accent" className="flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Verified Mentor
                </Badge>
              )}
              {user.is_mentor && !user.mentor_verified && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Mentor
                </Badge>
              )}
            </div>

            <p className="text-sm text-text-secondary mt-1">
              {user.headline || user.role}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-text-muted">
              {user.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {user.location}
                </span>
              )}
              {user.company && (
                <span className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {user.company}
                </span>
              )}
              {user.school && (
                <span className="flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" />
                  {user.school}
                </span>
              )}
            </div>

            {/* Mentor badges */}
            {user.mentor_badges && user.mentor_badges.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {user.mentor_badges.map((badge) => (
                  <Badge key={badge} variant="accent" className="text-xs">
                    {badge}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {isOwnProfile ? (
              <Link
                href="/profile/edit"
                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Edit Profile
              </Link>
            ) : (
              <>
                <button className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition-colors">
                  <UserPlus className="w-4 h-4" />
                  Connect
                </button>
                <button className="flex items-center gap-1.5 px-4 py-2 border border-primary text-primary text-sm font-medium rounded-lg hover:bg-primary hover:text-white transition-colors">
                  Follow
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 border border-border text-text-secondary text-sm rounded-lg hover:bg-surface-elevated transition-colors">
                  <MessageSquare className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
