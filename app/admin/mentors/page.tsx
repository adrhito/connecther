"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/shared/Badge";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { SearchBar } from "@/components/shared/SearchBar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ShieldCheck, ShieldOff, Star } from "lucide-react";

interface MentorItem {
  id: string;
  name: string;
  email: string;
  headline?: string;
  profile_photo_url?: string;
  mentor_verified: boolean;
  mentor_open: boolean;
  mentor_badges?: string[];
  mentor_rating: number;
  mentor_total_mentees: number;
  industry?: string;
}

export default function AdminMentorsPage() {
  const [mentors, setMentors] = useState<MentorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchMentors() {
      try {
        const res = await fetch("/api/mentors");
        const data = await res.json();
        setMentors(Array.isArray(data) ? data : data.mentors || []);
      } catch (err) {
        console.error("Failed to fetch mentors:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMentors();
  }, []);

  const filteredMentors = mentors.filter(
    (m) =>
      !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.headline?.toLowerCase().includes(search.toLowerCase()) ||
      m.industry?.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleVerified = (id: string) => {
    setMentors((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, mentor_verified: !m.mentor_verified } : m
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-text-primary">
          Mentor Management
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Verify and manage mentor profiles
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              Mentors ({filteredMentors.length})
            </CardTitle>
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search mentors..."
              className="max-w-xs"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-elevated">
                  <th className="text-left p-3 font-medium text-text-secondary">
                    Mentor
                  </th>
                  <th className="text-left p-3 font-medium text-text-secondary">
                    Industry
                  </th>
                  <th className="text-left p-3 font-medium text-text-secondary">
                    Rating
                  </th>
                  <th className="text-left p-3 font-medium text-text-secondary">
                    Mentees
                  </th>
                  <th className="text-left p-3 font-medium text-text-secondary">
                    Badges
                  </th>
                  <th className="text-left p-3 font-medium text-text-secondary">
                    Status
                  </th>
                  <th className="text-right p-3 font-medium text-text-secondary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMentors.map((mentor) => (
                  <tr
                    key={mentor.id}
                    className="border-b border-border hover:bg-surface-elevated/50 transition-colors"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <UserAvatar
                          name={mentor.name}
                          src={mentor.profile_photo_url}
                          size="sm"
                        />
                        <div>
                          <span className="font-medium text-text-primary block">
                            {mentor.name}
                          </span>
                          <span className="text-xs text-text-muted truncate block max-w-[180px]">
                            {mentor.headline}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-text-secondary">
                      {mentor.industry || "-"}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-accent-warm fill-accent-warm" />
                        <span className="text-text-primary font-medium">
                          {mentor.mentor_rating > 0
                            ? mentor.mentor_rating.toFixed(1)
                            : "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-text-secondary">
                      {mentor.mentor_total_mentees}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1 flex-wrap">
                        {mentor.mentor_badges?.map((badge) => (
                          <Badge key={badge} variant="accent" className="text-[10px]">
                            {badge}
                          </Badge>
                        )) || <span className="text-text-muted">-</span>}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        {mentor.mentor_verified ? (
                          <Badge variant="success">Verified</Badge>
                        ) : (
                          <Badge variant="warning">Unverified</Badge>
                        )}
                        {mentor.mentor_open && (
                          <Badge variant="outline">Open</Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          size="sm"
                          variant={mentor.mentor_verified ? "secondary" : "default"}
                          onClick={() => handleToggleVerified(mentor.id)}
                        >
                          {mentor.mentor_verified ? (
                            <>
                              <ShieldOff className="w-3.5 h-3.5" />
                              Unverify
                            </>
                          ) : (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Verify
                            </>
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
