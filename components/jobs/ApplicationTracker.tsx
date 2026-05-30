"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  Calendar,
  Building2,
  MapPin,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  Bookmark,
  Send,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { ApplicationStatus } from "@/lib/types";

interface ApplicationWithDetails {
  id: string;
  user_id: string;
  job_id: string;
  status: ApplicationStatus;
  notes?: string;
  applied_at: string;
  updated_at: string;
  job_title: string;
  company_name: string;
  company_logo?: string;
  location?: string;
}

const statusConfig: Record<
  ApplicationStatus,
  { label: string; icon: React.ReactNode; color: string }
> = {
  saved: {
    label: "Saved",
    icon: <Bookmark className="h-4 w-4" />,
    color: "bg-gray-100 text-gray-700 border-gray-200",
  },
  applied: {
    label: "Applied",
    icon: <Send className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-700 border-blue-200",
  },
  interviewing: {
    label: "Interviewing",
    icon: <Clock className="h-4 w-4" />,
    color: "bg-yellow-100 text-yellow-700 border-yellow-200",
  },
  offer: {
    label: "Offer",
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "bg-green-100 text-green-700 border-green-200",
  },
  rejected: {
    label: "Rejected",
    icon: <XCircle className="h-4 w-4" />,
    color: "bg-red-100 text-red-700 border-red-200",
  },
  withdrawn: {
    label: "Withdrawn",
    icon: <XCircle className="h-4 w-4" />,
    color: "bg-gray-100 text-gray-500 border-gray-200",
  },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ApplicationCard({ application }: { application: ApplicationWithDetails }) {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(application.notes || "");
  const config = statusConfig[application.status];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-heading font-semibold text-text-primary truncate">
              {application.job_title}
            </h4>
            <div className="flex items-center gap-2 mt-1 text-sm text-text-secondary">
              <Building2 className="h-3.5 w-3.5 shrink-0" />
              <span>{application.company_name}</span>
            </div>
            {application.location && (
              <div className="flex items-center gap-2 mt-0.5 text-sm text-text-secondary">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>{application.location}</span>
              </div>
            )}
          </div>
          <Badge className={config.color}>
            {config.icon}
            <span className="ml-1">{config.label}</span>
          </Badge>
        </div>

        <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            Applied {formatDate(application.applied_at)}
          </span>
          {application.updated_at !== application.applied_at && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Updated {formatDate(application.updated_at)}
            </span>
          )}
        </div>

        {/* Notes section */}
        <div className="mt-3">
          {editingNotes ? (
            <div className="space-y-2">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this application..."
                className="text-sm min-h-[60px]"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => setEditingNotes(false)}
                >
                  Save
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setNotes(application.notes || "");
                    setEditingNotes(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setEditingNotes(true)}
              className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              <MessageSquare className="h-3 w-3" />
              {notes ? notes : "Add notes..."}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ApplicationTracker() {
  const [applications, setApplications] = useState<ApplicationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApplications() {
      try {
        const res = await fetch("/api/jobs/tracker");
        if (res.ok) {
          const data = await res.json();
          setApplications(data);
        }
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, []);

  const tabStatuses: ApplicationStatus[] = [
    "applied",
    "interviewing",
    "offer",
    "rejected",
    "saved",
  ];

  const getCount = (status: ApplicationStatus) =>
    applications.filter((a) => a.status === status).length;

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse space-y-3">
                <div className="h-5 bg-surface-elevated rounded w-2/3" />
                <div className="h-4 bg-surface-elevated rounded w-1/3" />
                <div className="h-3 bg-surface-elevated rounded w-1/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Briefcase className="h-6 w-6 text-primary" />
        <h2 className="font-heading text-2xl font-bold text-text-primary">
          Application Tracker
        </h2>
      </div>

      <Tabs defaultValue="applied">
        <TabsList className="w-full flex">
          {tabStatuses.map((status) => (
            <TabsTrigger key={status} value={status} className="flex-1 gap-1.5">
              {statusConfig[status].icon}
              <span className="hidden sm:inline">{statusConfig[status].label}</span>
              <span className="text-xs bg-surface-elevated px-1.5 py-0.5 rounded-full">
                {getCount(status)}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabStatuses.map((status) => (
          <TabsContent key={status} value={status}>
            <div className="space-y-3 mt-4">
              {applications
                .filter((a) => a.status === status)
                .map((app) => (
                  <ApplicationCard key={app.id} application={app} />
                ))}
              {getCount(status) === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-text-muted">
                      No applications with status &quot;{statusConfig[status].label}&quot;
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
