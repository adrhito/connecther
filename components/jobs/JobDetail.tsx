"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Bookmark,
  ExternalLink,
  Wifi,
  Building2,
  DollarSign,
  Globe,
  RefreshCw,
  GraduationCap,
  Heart,
  Baby,
  Users,
  Calendar,
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Check,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { WarmIntros } from "./WarmIntros";

function getSavedJobs(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = localStorage.getItem("connecther_saved_jobs");
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function getAppliedJobs(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const stored = localStorage.getItem("connecther_applied_jobs");
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

interface JobDetailData {
  id: string;
  title: string;
  company_id: string;
  company_name: string;
  company_logo?: string;
  company_description?: string;
  company_website?: string;
  company_size?: string;
  company_industry?: string;
  company_headquarters?: string;
  company_diversity_stats?: {
    women_leadership_pct?: number;
    women_workforce_pct?: number;
    women_board_pct?: number;
    women_tech_pct?: number;
  };
  company_parental_leave?: string;
  description: string;
  requirements?: string;
  location: string;
  remote_type: string;
  employment_type: string;
  industry?: string;
  salary_min?: number;
  salary_max?: number;
  show_salary: boolean;
  is_returnship: boolean;
  is_internship: boolean;
  sponsorship_available: boolean;
  women_friendly_benefits?: string[];
  external_url?: string;
  is_featured: boolean;
  created_at: string;
}

interface JobDetailProps {
  job: JobDetailData;
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

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function JobDetail({ job }: JobDetailProps) {
  const [isSaved, setIsSaved] = useState(() => getSavedJobs().has(job.id));
  const [isApplied, setIsApplied] = useState(() => getAppliedJobs().has(job.id));

  const toggleSave = () => {
    const saved = getSavedJobs();
    if (isSaved) {
      saved.delete(job.id);
    } else {
      saved.add(job.id);
    }
    localStorage.setItem("connecther_saved_jobs", JSON.stringify([...saved]));
    setIsSaved(!isSaved);
  };

  const handleApply = () => {
    const applied = getAppliedJobs();
    applied.add(job.id);
    localStorage.setItem("connecther_applied_jobs", JSON.stringify([...applied]));
    setIsApplied(true);
    // Also add to application tracker data
    const trackerKey = "connecther_applications";
    try {
      const existing = JSON.parse(localStorage.getItem(trackerKey) || "[]");
      existing.push({
        id: `app-${Date.now()}`,
        user_id: "current-user",
        job_id: job.id,
        status: "applied",
        applied_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        job_title: job.title,
        company_name: job.company_name,
        location: job.location,
      });
      localStorage.setItem(trackerKey, JSON.stringify(existing));
    } catch {
      // ignore
    }
    if (job.external_url) {
      window.open(job.external_url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back button */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {job.is_featured && (
                    <Badge variant="accent" className="mb-2">
                      Featured
                    </Badge>
                  )}
                  <h1 className="font-heading text-2xl font-bold text-text-primary">
                    {job.title}
                  </h1>
                  <div className="flex items-center gap-2 mt-2 text-text-secondary">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium">{job.company_name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-text-secondary">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-text-secondary">
                    <Calendar className="h-4 w-4" />
                    <span>Posted {formatDate(job.created_at)}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={isSaved ? "Unsave job" : "Save job"}
                  onClick={toggleSave}
                  className={isSaved ? "text-primary" : ""}
                >
                  <Bookmark className={`h-5 w-5 ${isSaved ? "fill-primary" : ""}`} />
                </Button>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline">
                  <Wifi className="h-3.5 w-3.5 mr-1" />
                  {remoteLabels[job.remote_type] || job.remote_type}
                </Badge>
                <Badge variant="outline">
                  <Briefcase className="h-3.5 w-3.5 mr-1" />
                  {employmentLabels[job.employment_type] || job.employment_type}
                </Badge>
                {job.show_salary && (job.salary_min || job.salary_max) && (
                  <Badge variant="accent">
                    <DollarSign className="h-3.5 w-3.5 mr-0.5" />
                    {formatSalary(job.salary_min, job.salary_max)}
                  </Badge>
                )}
                {job.industry && <Badge variant="outline">{job.industry}</Badge>}
              </div>

              {/* Feature tags */}
              <div className="flex flex-wrap gap-2 mt-3">
                {job.is_returnship && (
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                    <RefreshCw className="h-3.5 w-3.5 mr-1" />
                    Returnship Program
                  </Badge>
                )}
                {job.is_internship && (
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                    <GraduationCap className="h-3.5 w-3.5 mr-1" />
                    Internship
                  </Badge>
                )}
                {job.sponsorship_available && (
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    <Globe className="h-3.5 w-3.5 mr-1" />
                    Visa Sponsorship Available
                  </Badge>
                )}
              </div>

              {/* Apply button (mobile) */}
              <div className="mt-4 lg:hidden">
                {isApplied ? (
                  <Button className="w-full" size="lg" variant="secondary" disabled>
                    <Check className="h-4 w-4" />
                    Applied
                  </Button>
                ) : (
                  <Button className="w-full" size="lg" onClick={handleApply}>
                    <ExternalLink className="h-4 w-4" />
                    Apply Now
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">About this Role</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary whitespace-pre-line leading-relaxed">
                {job.description}
              </p>
            </CardContent>
          </Card>

          {/* Requirements */}
          {job.requirements && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary whitespace-pre-line leading-relaxed">
                  {job.requirements}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Women-friendly benefits */}
          {job.women_friendly_benefits && job.women_friendly_benefits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-accent" />
                  Women-Friendly Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {job.women_friendly_benefits.map((benefit) => (
                    <div
                      key={benefit}
                      className="flex items-center gap-2 p-3 rounded-lg bg-pink-50 border border-pink-100"
                    >
                      <CheckCircle2 className="h-4 w-4 text-accent-warm shrink-0" />
                      <span className="text-sm text-text-primary">{benefit}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Warm Intros */}
          <WarmIntros companyName={job.company_name} companyId={job.company_id} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply card */}
          <Card className="hidden lg:block">
            <CardContent className="p-6 space-y-3">
              {isApplied ? (
                <Button className="w-full" size="lg" variant="secondary" disabled>
                  <Check className="h-4 w-4" />
                  Applied
                </Button>
              ) : (
                <Button className="w-full" size="lg" onClick={handleApply}>
                  <ExternalLink className="h-4 w-4" />
                  Apply Now
                </Button>
              )}
              <p className="text-xs text-text-muted text-center">
                {isApplied
                  ? "You have applied for this position"
                  : "Opens external application"}
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={toggleSave}
              >
                <Bookmark
                  className={`h-4 w-4 ${isSaved ? "fill-primary text-primary" : ""}`}
                />
                {isSaved ? "Saved" : "Save Job"}
              </Button>
            </CardContent>
          </Card>

          {/* Company info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                About {job.company_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {job.company_description && (
                <p className="text-sm text-text-secondary">
                  {job.company_description}
                </p>
              )}

              <Separator />

              <div className="space-y-2 text-sm">
                {job.company_industry && (
                  <div className="flex justify-between">
                    <span className="text-text-muted">Industry</span>
                    <span className="text-text-primary font-medium">
                      {job.company_industry}
                    </span>
                  </div>
                )}
                {job.company_size && (
                  <div className="flex justify-between">
                    <span className="text-text-muted">Company Size</span>
                    <span className="text-text-primary font-medium">
                      {job.company_size} employees
                    </span>
                  </div>
                )}
                {job.company_headquarters && (
                  <div className="flex justify-between">
                    <span className="text-text-muted">Headquarters</span>
                    <span className="text-text-primary font-medium">
                      {job.company_headquarters}
                    </span>
                  </div>
                )}
              </div>

              {job.company_website && (
                <>
                  <Separator />
                  <a
                    href={job.company_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary-light transition-colors"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    Visit Website
                  </a>
                </>
              )}
            </CardContent>
          </Card>

          {/* Diversity stats */}
          {job.company_diversity_stats && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Diversity Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {job.company_diversity_stats.women_workforce_pct !== undefined && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-secondary">Women in Workforce</span>
                      <span className="font-medium">
                        {job.company_diversity_stats.women_workforce_pct}%
                      </span>
                    </div>
                    <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all"
                        style={{
                          width: `${job.company_diversity_stats.women_workforce_pct}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
                {job.company_diversity_stats.women_leadership_pct !== undefined && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-secondary">Women in Leadership</span>
                      <span className="font-medium">
                        {job.company_diversity_stats.women_leadership_pct}%
                      </span>
                    </div>
                    <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-warm rounded-full transition-all"
                        style={{
                          width: `${job.company_diversity_stats.women_leadership_pct}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
                {job.company_diversity_stats.women_tech_pct !== undefined && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-secondary">Women in Tech Roles</span>
                      <span className="font-medium">
                        {job.company_diversity_stats.women_tech_pct}%
                      </span>
                    </div>
                    <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-light rounded-full transition-all"
                        style={{
                          width: `${job.company_diversity_stats.women_tech_pct}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
                {job.company_diversity_stats.women_board_pct !== undefined && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-text-secondary">Women on Board</span>
                      <span className="font-medium">
                        {job.company_diversity_stats.women_board_pct}%
                      </span>
                    </div>
                    <div className="h-2 bg-surface-elevated rounded-full overflow-hidden">
                      <div
                        className="h-full bg-success rounded-full transition-all"
                        style={{
                          width: `${job.company_diversity_stats.women_board_pct}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Parental leave */}
          {job.company_parental_leave && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Baby className="h-5 w-5 text-accent-warm" />
                  Parental Leave
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-text-secondary">
                  {job.company_parental_leave}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
