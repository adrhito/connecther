"use client";

import { ThumbsUp } from "lucide-react";
import type { Endorsement } from "@/lib/types";

interface SkillsSectionProps {
  skills: string[];
  endorsements: Endorsement[];
  isOwnProfile: boolean;
}

export function SkillsSection({ skills, endorsements, isOwnProfile }: SkillsSectionProps) {
  if (skills.length === 0) return null;

  // Count endorsements per skill
  const endorsementCounts: Record<string, number> = {};
  for (const e of endorsements) {
    endorsementCounts[e.skill] = (endorsementCounts[e.skill] || 0) + 1;
  }

  // Sort skills by endorsement count descending
  const sortedSkills = [...skills].sort((a, b) => {
    return (endorsementCounts[b] || 0) - (endorsementCounts[a] || 0);
  });

  return (
    <div className="bg-surface border border-border rounded-lg p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-text-primary font-heading mb-4">
        Skills
      </h2>

      <div className="flex flex-wrap gap-2">
        {sortedSkills.map((skill) => {
          const count = endorsementCounts[skill] || 0;
          return (
            <div
              key={skill}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-elevated border border-border rounded-full group"
            >
              <span className="text-sm text-text-primary">{skill}</span>
              {count > 0 && (
                <span className="text-xs text-text-muted font-medium">
                  {count}
                </span>
              )}
              {!isOwnProfile && (
                <button
                  className="ml-0.5 text-text-muted hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                  aria-label={`Endorse ${skill}`}
                  title={`Endorse ${skill}`}
                >
                  <ThumbsUp className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
