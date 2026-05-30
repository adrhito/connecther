"use client";

import Link from "next/link";
import { Star, MapPin, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MentorBadge } from "./MentorBadge";

interface MentorData {
  id: string;
  name: string;
  headline?: string;
  about?: string;
  location?: string;
  company?: string;
  industry?: string;
  profile_photo_url?: string;
  is_mentor: boolean;
  mentor_verified: boolean;
  mentor_open: boolean;
  mentor_badges?: string[];
  mentor_availability?: string;
  mentor_rating?: number;
  mentor_total_mentees?: number;
}

interface MentorCardProps {
  mentor: MentorData;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3.5 w-3.5 ${
            star <= rating
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-200"
          }`}
        />
      ))}
      {rating > 0 && (
        <span className="ml-1 text-xs text-text-secondary">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export function MentorCard({ mentor }: MentorCardProps) {
  const initials = mentor.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <Link href={`/mentorship/${mentor.id}`} className="shrink-0">
            <Avatar className="h-14 w-14">
              <AvatarImage src={mentor.profile_photo_url} alt={mentor.name} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Link
                href={`/mentorship/${mentor.id}`}
                className="font-heading font-semibold text-text-primary hover:text-primary-light transition-colors truncate"
              >
                {mentor.name}
              </Link>
              {/* Availability dot */}
              <span
                className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                  mentor.mentor_open ? "bg-success" : "bg-gray-300"
                }`}
                title={mentor.mentor_open ? "Available" : "Unavailable"}
              />
            </div>

            {mentor.headline && (
              <p className="text-sm text-text-secondary truncate mt-0.5">
                {mentor.headline}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-text-muted">
              {mentor.company && (
                <span className="flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {mentor.company}
                </span>
              )}
              {mentor.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {mentor.location}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mentor badges */}
        {mentor.mentor_badges && mentor.mentor_badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {mentor.mentor_badges.map((badge) => (
              <MentorBadge key={badge} badge={badge} size="sm" />
            ))}
            {mentor.mentor_verified && (
              <span className="inline-flex items-center gap-1 rounded-full border border-success/30 bg-success/10 text-success px-2 py-0.5 text-[10px] font-medium">
                Verified
              </span>
            )}
          </div>
        )}

        {/* Rating and stats */}
        <div className="flex items-center justify-between mt-3">
          <StarRating rating={mentor.mentor_rating || 0} />
          {mentor.mentor_total_mentees !== undefined && mentor.mentor_total_mentees > 0 && (
            <span className="text-xs text-text-muted">
              {mentor.mentor_total_mentees} mentee{mentor.mentor_total_mentees !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Action */}
        <div className="mt-4">
          <Button asChild className="w-full" size="sm" variant={mentor.mentor_open ? "default" : "secondary"} disabled={!mentor.mentor_open}>
            <Link href={`/mentorship/${mentor.id}`}>
              {mentor.mentor_open ? "Request Mentorship" : "Unavailable"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
