"use client";

import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Building2,
  Star,
  CheckCircle,
  Users,
  Calendar,
  Briefcase,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MentorBadge } from "./MentorBadge";
import { OfficeHoursCard } from "./OfficeHoursCard";
import { MentorRequestForm } from "./MentorRequestForm";

interface MentorReview {
  id: string;
  mentee_name: string;
  mentee_photo?: string;
  rating?: number;
  text?: string;
  date: string;
}

interface MentorDetailData {
  id: string;
  name: string;
  headline?: string;
  about?: string;
  location?: string;
  company?: string;
  industry?: string;
  school?: string;
  profile_photo_url?: string;
  skills?: string[];
  interests?: string[];
  career_goals?: string[];
  is_mentor: boolean;
  mentor_verified: boolean;
  mentor_open: boolean;
  mentor_max_requests: number;
  mentor_badges?: string[];
  mentor_availability?: string;
  mentor_rating?: number;
  mentor_total_mentees?: number;
  mentor_reviews?: MentorReview[];
}

interface MentorDetailProps {
  mentor: MentorDetailData;
}

function StarRating({ rating, size = "md" }: { rating: number; size?: "sm" | "md" }) {
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${starSize} ${
            star <= rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function MentorDetail({ mentor }: MentorDetailProps) {
  const initials = mentor.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back button */}
      <Link
        href="/mentorship"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Mentors
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={mentor.profile_photo_url} alt={mentor.name} />
                  <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="font-heading text-2xl font-bold text-text-primary">
                      {mentor.name}
                    </h1>
                    {mentor.mentor_verified && (
                      <Badge className="bg-success/10 text-success border-success/30">
                        <CheckCircle className="h-3.5 w-3.5 mr-1" />
                        Verified Mentor
                      </Badge>
                    )}
                    <span
                      className={`h-3 w-3 rounded-full ${
                        mentor.mentor_open ? "bg-success" : "bg-gray-300"
                      }`}
                      title={mentor.mentor_open ? "Available for mentorship" : "Not available"}
                    />
                  </div>

                  {mentor.headline && (
                    <p className="text-text-secondary mt-1">{mentor.headline}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-text-muted">
                    {mentor.company && (
                      <span className="flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5" />
                        {mentor.company}
                      </span>
                    )}
                    {mentor.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {mentor.location}
                      </span>
                    )}
                    {mentor.industry && (
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5" />
                        {mentor.industry}
                      </span>
                    )}
                  </div>

                  {/* Rating & stats */}
                  <div className="flex items-center gap-4 mt-3">
                    {mentor.mentor_rating !== undefined && mentor.mentor_rating > 0 && (
                      <div className="flex items-center gap-2">
                        <StarRating rating={mentor.mentor_rating} />
                        <span className="text-sm text-text-secondary">
                          ({mentor.mentor_rating.toFixed(1)})
                        </span>
                      </div>
                    )}
                    {mentor.mentor_total_mentees !== undefined && mentor.mentor_total_mentees > 0 && (
                      <span className="flex items-center gap-1 text-sm text-text-secondary">
                        <Users className="h-4 w-4" />
                        {mentor.mentor_total_mentees} mentee
                        {mentor.mentor_total_mentees !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Badges */}
              {mentor.mentor_badges && mentor.mentor_badges.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {mentor.mentor_badges.map((badge) => (
                    <MentorBadge key={badge} badge={badge} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* About */}
          {mentor.about && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary whitespace-pre-line leading-relaxed">
                  {mentor.about}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Skills */}
          {mentor.skills && mentor.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Expertise & Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mentor.skills.map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Interests */}
          {mentor.interests && mentor.interests.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mentor.interests.map((interest) => (
                    <Badge key={interest} variant="accent">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reviews */}
          {mentor.mentor_reviews && mentor.mentor_reviews.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  Reviews from Mentees
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mentor.mentor_reviews.map((review) => (
                  <div key={review.id} className="p-4 rounded-lg bg-surface-elevated">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={review.mentee_photo} alt={review.mentee_name} />
                        <AvatarFallback className="text-xs">
                          {review.mentee_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {review.mentee_name}
                        </p>
                        <div className="flex items-center gap-2">
                          {review.rating && <StarRating rating={review.rating} size="sm" />}
                          <span className="text-xs text-text-muted">
                            {formatDate(review.date)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {review.text && (
                      <p className="text-sm text-text-secondary italic">
                        &quot;{review.text}&quot;
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Request form */}
          {mentor.mentor_open && (
            <MentorRequestForm mentorName={mentor.name} mentorId={mentor.id} />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Availability */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`h-3 w-3 rounded-full ${
                    mentor.mentor_open ? "bg-success animate-pulse" : "bg-gray-300"
                  }`}
                />
                <span className="text-sm font-medium">
                  {mentor.mentor_open ? "Accepting Requests" : "Not Accepting Requests"}
                </span>
              </div>
              {mentor.mentor_availability && (
                <p className="text-sm text-text-secondary">
                  {mentor.mentor_availability}
                </p>
              )}
              {mentor.mentor_max_requests > 0 && (
                <p className="text-xs text-text-muted mt-2">
                  Accepts up to {mentor.mentor_max_requests} mentees
                </p>
              )}
            </CardContent>
          </Card>

          {/* Office Hours */}
          {mentor.mentor_availability && (
            <OfficeHoursCard
              availability={mentor.mentor_availability}
              mentorName={mentor.name}
            />
          )}

          {/* Career Goals */}
          {mentor.career_goals && mentor.career_goals.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Career Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {mentor.career_goals.map((goal) => (
                    <li
                      key={goal}
                      className="flex items-start gap-2 text-sm text-text-secondary"
                    >
                      <span className="text-accent-warm mt-0.5">&#8226;</span>
                      {goal}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
