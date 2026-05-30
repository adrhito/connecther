"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ExperienceSection } from "@/components/profile/ExperienceSection";
import { EducationSection } from "@/components/profile/EducationSection";
import { SkillsSection } from "@/components/profile/SkillsSection";
import { RecommendationSection } from "@/components/profile/RecommendationSection";
import { FeaturedSection } from "@/components/profile/FeaturedSection";
import { ProfileViewers } from "@/components/profile/ProfileViewers";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { User, Experience, Education, Endorsement, Recommendation, ProfileView } from "@/lib/types";

interface ProfileData {
  user: User;
  experiences: Experience[];
  education: Education[];
  endorsements: Endorsement[];
  recommendations: Recommendation[];
  profileViews: ProfileView[];
}

export default function ProfilePage() {
  const params = useParams();
  const { user: currentUser } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [allUsers, setAllUsers] = useState<Record<string, User>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = params.id as string;
  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    async function fetchProfile() {
      try {
        const [profileRes, usersRes] = await Promise.all([
          fetch(`/api/users/${userId}`),
          fetch("/api/users"),
        ]);

        if (!profileRes.ok) {
          setError("Profile not found");
          return;
        }

        const profileJson = await profileRes.json();
        const usersJson = await usersRes.json();

        setProfileData(profileJson);

        const map: Record<string, User> = {};
        for (const u of usersJson.users || []) {
          map[u.id] = u;
        }
        setAllUsers(map);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    }

    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h1 className="text-xl font-semibold text-text-primary">
          {error || "Profile not found"}
        </h1>
        <p className="text-text-secondary mt-2">
          The profile you are looking for does not exist or is not accessible.
        </p>
      </div>
    );
  }

  const { user: profileUser, experiences, education, endorsements, recommendations, profileViews } = profileData;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
      <ProfileHeader user={profileUser} isOwnProfile={isOwnProfile} />

      {/* About section */}
      {profileUser.about && (
        <div className="bg-surface border border-border rounded-lg p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-text-primary font-heading mb-3">
            About
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
            {profileUser.about}
          </p>
          {profileUser.career_goals && profileUser.career_goals.length > 0 && (
            <div className="mt-4">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                Career Goals
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {profileUser.career_goals.map((goal) => (
                  <span
                    key={goal}
                    className="px-2.5 py-1 bg-accent/10 text-primary text-xs rounded-full"
                  >
                    {goal}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <FeaturedSection />

      <ExperienceSection experiences={experiences} />

      <EducationSection education={education} />

      {profileUser.skills && (
        <SkillsSection
          skills={profileUser.skills}
          endorsements={endorsements}
          isOwnProfile={isOwnProfile}
        />
      )}

      <RecommendationSection recommendations={recommendations} users={allUsers} />

      {/* Only show profile viewers on own profile */}
      {isOwnProfile && (
        <ProfileViewers profileViews={profileViews} users={allUsers} />
      )}
    </div>
  );
}
