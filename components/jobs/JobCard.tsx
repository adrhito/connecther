"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  Wifi,
  Building2,
  DollarSign,
  Baby,
  Globe,
  RefreshCw,
  GraduationCap,
  Heart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Job } from "@/lib/types";

interface JobCardProps {
  job: Job & { company_name?: string; company_logo?: string };
  companyName: string;
}

const remoteLabels: Record<string, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "On-site",
};

const employmentLabels: Record<string, string> = {
  full_time: "Full-time",
  part_time: "Part-time",
  contract: "Contract",
  internship: "Internship",
  fellowship: "Fellowship",
  returnship: "Returnship",
};

function formatSalary(min?: number, max?: number): string {
  if (!min && !max) return "";
  const fmt = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(0)}K` : `$${n.toLocaleString()}`;
  if (min && max) return `${fmt(min)} - ${fmt(max)}`;
  if (min) return `${fmt(min)}+`;
  return `Up to ${fmt(max!)}`;
}

export function JobCard({ job, companyName }: JobCardProps) {
  const [saved, setSaved] = useState(false);

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Link
              href={`/jobs/${job.id}`}
              className="block group-hover:text-primary-light transition-colors"
            >
              <h3 className="font-heading font-semibold text-lg text-text-primary truncate">
                {job.title}
              </h3>
            </Link>
            <div className="flex items-center gap-2 mt-1 text-sm text-text-secondary">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{companyName}</span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-sm text-text-secondary">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="shrink-0"
            onClick={(e) => {
              e.preventDefault();
              setSaved(!saved);
            }}
            aria-label={saved ? "Unsave job" : "Save job"}
          >
            {saved ? (
              <BookmarkCheck className="h-5 w-5 text-accent" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          <Badge variant="outline" className="text-xs">
            <Wifi className="h-3 w-3 mr-1" />
            {remoteLabels[job.remote_type] || job.remote_type}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {employmentLabels[job.employment_type] || job.employment_type}
          </Badge>
          {job.show_salary && (job.salary_min || job.salary_max) && (
            <Badge variant="accent" className="text-xs">
              <DollarSign className="h-3 w-3 mr-0.5" />
              {formatSalary(job.salary_min, job.salary_max)}
            </Badge>
          )}
        </div>

        {/* Feature tags */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {job.is_returnship && (
            <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
              <RefreshCw className="h-3 w-3 mr-1" />
              Returnship
            </Badge>
          )}
          {job.is_internship && (
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
              <GraduationCap className="h-3 w-3 mr-1" />
              Internship
            </Badge>
          )}
          {job.sponsorship_available && (
            <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
              <Globe className="h-3 w-3 mr-1" />
              Sponsorship
            </Badge>
          )}
          {job.women_friendly_benefits && job.women_friendly_benefits.length > 0 && (
            <Badge className="bg-pink-100 text-pink-700 border-pink-200 text-xs">
              <Heart className="h-3 w-3 mr-1" />
              Women-Friendly Benefits
            </Badge>
          )}
        </div>

        {/* Women-friendly benefits preview */}
        {job.women_friendly_benefits && job.women_friendly_benefits.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {job.women_friendly_benefits.slice(0, 3).map((benefit) => (
              <span
                key={benefit}
                className="inline-flex items-center text-xs text-text-secondary bg-surface-elevated px-2 py-0.5 rounded-full"
              >
                <Baby className="h-3 w-3 mr-1 text-accent-warm" />
                {benefit}
              </span>
            ))}
            {job.women_friendly_benefits.length > 3 && (
              <span className="text-xs text-text-muted px-2 py-0.5">
                +{job.women_friendly_benefits.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-4">
          <Button asChild size="sm" className="flex-1">
            <Link href={`/jobs/${job.id}`}>View Details</Link>
          </Button>
          <Button variant="accent" size="sm" className="flex-1">
            <ExternalLink className="h-3.5 w-3.5" />
            Apply
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
