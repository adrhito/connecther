"use client";

import { GraduationCap } from "lucide-react";
import type { Education } from "@/lib/types";

interface EducationSectionProps {
  education: Education[];
}

export function EducationSection({ education }: EducationSectionProps) {
  if (education.length === 0) return null;

  const sortedEducation = [...education].sort((a, b) => {
    return (b.end_year || b.start_year || 0) - (a.end_year || a.start_year || 0);
  });

  return (
    <div className="bg-surface border border-border rounded-lg p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-text-primary font-heading mb-4">
        Education
      </h2>

      <div className="space-y-5">
        {sortedEducation.map((edu, index) => (
          <div key={edu.id}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-elevated flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5 text-text-muted" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-text-primary">
                  {edu.school}
                </h3>
                {(edu.degree || edu.field_of_study) && (
                  <p className="text-sm text-text-secondary">
                    {edu.degree}
                    {edu.degree && edu.field_of_study && ", "}
                    {edu.field_of_study}
                  </p>
                )}
                {(edu.start_year || edu.end_year) && (
                  <p className="text-xs text-text-muted mt-0.5">
                    {edu.start_year}
                    {edu.start_year && edu.end_year && " - "}
                    {edu.end_year}
                  </p>
                )}
                {edu.description && (
                  <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                    {edu.description}
                  </p>
                )}
              </div>
            </div>

            {index < sortedEducation.length - 1 && (
              <div className="border-b border-border mt-5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
