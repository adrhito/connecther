"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MentorDetail } from "@/components/mentorship/MentorDetail";
import type { ComponentProps } from "react";

type MentorData = ComponentProps<typeof MentorDetail>["mentor"];

export default function MentorDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [mentor, setMentor] = useState<MentorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMentor() {
      try {
        const res = await fetch(`/api/users/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError("Mentor not found");
          } else {
            setError("Failed to load mentor profile");
          }
          return;
        }
        const data = await res.json();
        const user = data.user;

        if (!user.is_mentor) {
          setError("This user is not a mentor");
          return;
        }

        setMentor(user);
      } catch (err) {
        console.error("Failed to fetch mentor:", err);
        setError("Failed to load mentor profile");
      } finally {
        setLoading(false);
      }
    }
    if (id) {
      fetchMentor();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Skeleton className="h-5 w-28 mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-7 w-48" />
                    <Skeleton className="h-5 w-64" />
                    <Skeleton className="h-4 w-40" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-28 rounded-full" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="font-heading text-xl font-semibold text-text-primary">
              {error}
            </h2>
            <p className="text-sm text-text-secondary mt-2">
              The mentor profile you are looking for might not be available.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      {mentor && <MentorDetail mentor={mentor} />}
    </div>
  );
}
