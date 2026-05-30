"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Briefcase,
  Sparkles,
  Calendar,
  Bookmark,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { JobCard } from "@/components/jobs/JobCard";
import { JobFilters, type JobFilterState } from "@/components/jobs/JobFilters";
import { RecruitingTimeline } from "@/components/jobs/RecruitingTimeline";
import type { Job } from "@/lib/types";

interface JobWithCompany extends Job {
  company_name: string;
  company_logo?: string;
}

const defaultFilters: JobFilterState = {
  search: "",
  industry: "",
  location: "",
  remoteType: "",
  employmentType: "",
  salaryRange: "",
  returnshipsOnly: false,
  internshipsOnly: false,
  sponsorshipOnly: false,
  payTransparentOnly: false,
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobWithCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<JobFilterState>(defaultFilters);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/jobs");
        if (res.ok) {
          const data = await res.json();
          setJobs(data);
        }
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const filteredJobs = useMemo(() => {
    let result = jobs;

    // Search filter
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(q) ||
          job.company_name.toLowerCase().includes(q) ||
          job.description.toLowerCase().includes(q) ||
          job.location.toLowerCase().includes(q)
      );
    }

    // Industry filter
    if (filters.industry) {
      result = result.filter((job) => job.industry === filters.industry);
    }

    // Location filter
    if (filters.location) {
      result = result.filter((job) => job.location === filters.location);
    }

    // Remote type filter
    if (filters.remoteType) {
      result = result.filter((job) => job.remote_type === filters.remoteType);
    }

    // Employment type filter
    if (filters.employmentType) {
      result = result.filter((job) => job.employment_type === filters.employmentType);
    }

    // Salary range filter
    if (filters.salaryRange) {
      const [minStr, maxStr] = filters.salaryRange.split("-");
      const min = parseInt(minStr) * 1000;
      const max = maxStr === "+" ? Infinity : parseInt(maxStr) * 1000;
      result = result.filter((job) => {
        if (!job.salary_min && !job.salary_max) return false;
        const jobMax = job.salary_max || job.salary_min || 0;
        const jobMin = job.salary_min || 0;
        return jobMax >= min && jobMin <= max;
      });
    }

    // Boolean filters
    if (filters.returnshipsOnly) {
      result = result.filter((job) => job.is_returnship);
    }
    if (filters.internshipsOnly) {
      result = result.filter((job) => job.is_internship);
    }
    if (filters.sponsorshipOnly) {
      result = result.filter((job) => job.sponsorship_available);
    }
    if (filters.payTransparentOnly) {
      result = result.filter((job) => job.show_salary);
    }

    return result;
  }, [jobs, filters]);

  const recommendedJobs = useMemo(() => {
    return jobs.filter((job) => job.is_featured).slice(0, 3);
  }, [jobs]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <Briefcase className="h-7 w-7 text-primary" />
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary">
            Jobs
          </h1>
          <p className="text-sm text-text-secondary">
            Discover opportunities at companies that support women
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <JobFilters filters={filters} onFiltersChange={setFilters} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Job listings (main content) */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardContent className="p-5">
                    <div className="space-y-3">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/3" />
                      <div className="flex gap-2 pt-2">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredJobs.length > 0 ? (
            <>
              <p className="text-sm text-text-muted mb-3">
                Showing {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    companyName={job.company_name}
                  />
                ))}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Briefcase className="h-12 w-12 text-text-muted mx-auto mb-3" />
                <h3 className="font-heading font-semibold text-text-primary">
                  No jobs found
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  Try adjusting your filters or search terms.
                </p>
                <Button
                  variant="secondary"
                  className="mt-4"
                  onClick={() => setFilters(defaultFilters)}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recommended */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                Recommended for You
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <>
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </>
              ) : (
                recommendedJobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.id}`}
                    className="block p-3 rounded-lg bg-surface-elevated hover:bg-accent/10 transition-colors"
                  >
                    <p className="text-sm font-medium text-text-primary truncate">
                      {job.title}
                    </p>
                    <p className="text-xs text-text-muted truncate">
                      {job.company_name} &bull; {job.location}
                    </p>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recruiting Timelines preview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Recruiting Timelines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecruitingTimeline compact />
              <Button asChild variant="ghost" size="sm" className="w-full mt-3">
                <Link href="/jobs/tracker">View All Timelines</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Saved Searches */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-accent-warm" />
                Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                href="/jobs/tracker"
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-elevated transition-colors text-sm text-text-secondary"
              >
                <TrendingUp className="h-4 w-4" />
                Application Tracker
              </Link>
              <button
                onClick={() =>
                  setFilters({ ...defaultFilters, returnshipsOnly: true })
                }
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-elevated transition-colors text-sm text-text-secondary w-full text-left"
              >
                <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-[10px]">
                  R
                </Badge>
                Returnship Programs
              </button>
              <button
                onClick={() =>
                  setFilters({ ...defaultFilters, internshipsOnly: true })
                }
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-elevated transition-colors text-sm text-text-secondary w-full text-left"
              >
                <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-[10px]">
                  I
                </Badge>
                Internships
              </button>
              <button
                onClick={() =>
                  setFilters({ ...defaultFilters, sponsorshipOnly: true })
                }
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-elevated transition-colors text-sm text-text-secondary w-full text-left"
              >
                <Badge className="bg-green-100 text-green-700 border-green-200 text-[10px]">
                  S
                </Badge>
                Visa Sponsorship
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
