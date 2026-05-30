"use client";

import { Briefcase } from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import type { Experience } from "@/lib/types";

interface ExperienceSectionProps {
  experiences: Experience[];
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  if (experiences.length === 0) return null;

  const sortedExperiences = [...experiences].sort((a, b) => {
    if (a.is_current && !b.is_current) return -1;
    if (!a.is_current && b.is_current) return 1;
    return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
  });

  return (
    <div className="bg-surface border border-border rounded-lg p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-text-primary font-heading mb-4">
        Experience
      </h2>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />

        <div className="space-y-6">
          {sortedExperiences.map((exp, index) => (
            <div key={exp.id} className="relative pl-10">
              {/* Timeline dot */}
              <div
                className={`absolute left-2.5 top-1 w-3 h-3 rounded-full border-2 ${
                  exp.is_current
                    ? "bg-primary border-primary"
                    : "bg-surface border-text-muted"
                }`}
              />

              <div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-elevated flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-text-muted" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-text-primary">
                      {exp.title}
                    </h3>
                    <p className="text-sm text-text-secondary">{exp.company}</p>
                    <div className="flex items-center gap-2 text-xs text-text-muted mt-0.5">
                      <span>
                        {formatDate(exp.start_date)} &mdash;{" "}
                        {exp.is_current ? "Present" : exp.end_date ? formatDate(exp.end_date) : ""}
                      </span>
                      {exp.location && (
                        <>
                          <span className="text-border">|</span>
                          <span>{exp.location}</span>
                        </>
                      )}
                    </div>
                    {exp.description && (
                      <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Separator between items (not after last) */}
              {index < sortedExperiences.length - 1 && (
                <div className="border-b border-border mt-6" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
