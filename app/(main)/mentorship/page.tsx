"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Users,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MentorCard } from "@/components/mentorship/MentorCard";
import { MentorFilters, type MentorFilterState } from "@/components/mentorship/MentorFilters";

interface MentorData {
  id: string;
  name: string;
  headline?: string;
  about?: string;
  location?: string;
  company?: string;
  school?: string;
  industry?: string;
  profile_photo_url?: string;
  skills?: string[];
  is_mentor: boolean;
  mentor_verified: boolean;
  mentor_open: boolean;
  mentor_badges?: string[];
  mentor_availability?: string;
  mentor_rating?: number;
  mentor_total_mentees?: number;
}

interface MentorshipRequestData {
  id: string;
  mentor_id: string;
  mentee_id: string;
  request_type: string;
  status: string;
  mentor_name: string;
  mentor_photo?: string;
  mentor_headline?: string;
  created_at: string;
}

const defaultFilters: MentorFilterState = {
  search: "",
  industry: "",
  company: "",
  school: "",
  badgeType: "",
  availability: "",
  experienceLevel: "",
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-3.5 w-3.5 text-yellow-600" />,
  accepted: <CheckCircle className="h-3.5 w-3.5 text-success" />,
  declined: <XCircle className="h-3.5 w-3.5 text-error" />,
  completed: <CheckCircle className="h-3.5 w-3.5 text-primary" />,
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  accepted: "Active",
  declined: "Declined",
  completed: "Completed",
};

export default function MentorshipPage() {
  const [mentors, setMentors] = useState<MentorData[]>([]);
  const [requests, setRequests] = useState<MentorshipRequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<MentorFilterState>(defaultFilters);

  useEffect(() => {
    async function fetchData() {
      try {
        const [mentorsRes, requestsRes] = await Promise.all([
          fetch("/api/mentors"),
          fetch("/api/mentorship/requests"),
        ]);

        if (mentorsRes.ok) {
          const mentorsData = await mentorsRes.json();
          setMentors(mentorsData);
        }
        if (requestsRes.ok) {
          const requestsData = await requestsRes.json();
          setRequests(requestsData);
        }
      } catch (error) {
        console.error("Failed to fetch mentorship data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredMentors = useMemo(() => {
    let result = mentors;

    // Search filter
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.headline?.toLowerCase().includes(q) ||
          m.company?.toLowerCase().includes(q) ||
          m.skills?.some((s) => s.toLowerCase().includes(q)) ||
          m.about?.toLowerCase().includes(q)
      );
    }

    // Industry filter
    if (filters.industry) {
      result = result.filter((m) => m.industry === filters.industry);
    }

    // Company filter
    if (filters.company) {
      result = result.filter((m) => m.company === filters.company);
    }

    // School filter
    if (filters.school) {
      const schoolQ = filters.school.toLowerCase();
      result = result.filter((m) =>
        m.school?.toLowerCase().includes(schoolQ)
      );
    }

    // Badge type filter
    if (filters.badgeType) {
      result = result.filter((m) =>
        m.mentor_badges?.includes(filters.badgeType)
      );
    }

    // Availability filter
    if (filters.availability) {
      if (filters.availability === "available") {
        result = result.filter((m) => m.mentor_open);
      } else {
        result = result.filter((m) => !m.mentor_open);
      }
    }

    return result;
  }, [mentors, filters]);

  // Filter requests to show current user's (using user-2 as mock current user)
  const myRequests = requests.filter((r) => r.mentee_id === "user-2");
  const pendingRequests = myRequests.filter((r) => r.status === "pending");
  const activeRequests = myRequests.filter(
    (r) => r.status === "accepted" || r.status === "completed"
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <Users className="h-7 w-7 text-primary" />
        <div>
          <h1 className="font-heading text-2xl font-bold text-text-primary">
            Mentorship
          </h1>
          <p className="text-sm text-text-secondary">
            Connect with experienced mentors who can guide your career
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <MentorFilters filters={filters} onFiltersChange={setFilters} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Mentor directory (main content) */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="p-5">
                    <div className="flex gap-3">
                      <Skeleton className="h-14 w-14 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-2/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredMentors.length > 0 ? (
            <>
              <p className="text-sm text-text-muted mb-3">
                {filteredMentors.length} mentor{filteredMentors.length !== 1 ? "s" : ""} found
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMentors.map((mentor) => (
                  <MentorCard key={mentor.id} mentor={mentor} />
                ))}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-text-muted mx-auto mb-3" />
                <h3 className="font-heading font-semibold text-text-primary">
                  No mentors found
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  Try adjusting your filters or search terms.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pending Requests */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4 text-warning" />
                Pending Requests
                {pendingRequests.length > 0 && (
                  <Badge variant="warning" className="text-xs">
                    {pendingRequests.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : pendingRequests.length > 0 ? (
                <div className="space-y-3">
                  {pendingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-surface-elevated"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={req.mentor_photo} alt={req.mentor_name} />
                        <AvatarFallback className="text-xs">
                          {req.mentor_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {req.mentor_name}
                        </p>
                        <div className="flex items-center gap-1">
                          {statusIcons[req.status]}
                          <span className="text-xs text-text-muted">
                            {statusLabels[req.status]}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted">No pending requests</p>
              )}
            </CardContent>
          </Card>

          {/* Active Mentorships */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                Active Mentorships
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : activeRequests.length > 0 ? (
                <div className="space-y-3">
                  {activeRequests.map((req) => (
                    <div
                      key={req.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-surface-elevated"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={req.mentor_photo} alt={req.mentor_name} />
                        <AvatarFallback className="text-xs">
                          {req.mentor_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {req.mentor_name}
                        </p>
                        <div className="flex items-center gap-1">
                          {statusIcons[req.status]}
                          <span className="text-xs text-text-muted">
                            {statusLabels[req.status]}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-text-muted">No active mentorships</p>
              )}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-accent/5 border-accent/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Mentorship Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-accent-warm mt-0.5">&#8226;</span>
                  Be specific about what you want to learn
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-warm mt-0.5">&#8226;</span>
                  Come prepared with questions for each session
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-warm mt-0.5">&#8226;</span>
                  Respect your mentor&apos;s time and availability
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent-warm mt-0.5">&#8226;</span>
                  Follow up and share your progress
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
