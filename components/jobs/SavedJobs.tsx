"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { JobCard } from "./JobCard";
import type { Job } from "@/lib/types";

interface JobWithCompany extends Job {
  company_name: string;
  company_logo?: string;
}

export function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState<JobWithCompany[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSavedJobs() {
      try {
        // In production, this would fetch only saved jobs for the current user
        // For now, we fetch all jobs and simulate saved state with featured jobs
        const res = await fetch("/api/jobs");
        if (res.ok) {
          const jobs: JobWithCompany[] = await res.json();
          // Simulate saved jobs by using featured ones
          const featured = jobs.filter((j) => j.is_featured);
          setSavedJobs(featured);
        }
      } catch (error) {
        console.error("Failed to fetch saved jobs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSavedJobs();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="animate-pulse space-y-3">
                <div className="h-5 bg-surface-elevated rounded w-3/4" />
                <div className="h-4 bg-surface-elevated rounded w-1/2" />
                <div className="h-4 bg-surface-elevated rounded w-1/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (savedJobs.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Bookmark className="h-12 w-12 text-text-muted mx-auto mb-3" />
          <h3 className="font-heading font-semibold text-text-primary">
            No saved jobs yet
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            Save jobs you&apos;re interested in to come back to them later.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Bookmark className="h-5 w-5 text-primary" />
        <h3 className="font-heading text-lg font-semibold text-text-primary">
          Saved Jobs ({savedJobs.length})
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savedJobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            companyName={job.company_name}
          />
        ))}
      </div>
    </div>
  );
}
