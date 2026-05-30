"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ApplicationTracker } from "@/components/jobs/ApplicationTracker";
import { RecruitingTimeline } from "@/components/jobs/RecruitingTimeline";

export default function JobTrackerPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Back button */}
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Application tracker */}
        <div className="lg:col-span-2">
          <ApplicationTracker />
        </div>

        {/* Recruiting timelines sidebar */}
        <div>
          <RecruitingTimeline />
        </div>
      </div>
    </div>
  );
}
