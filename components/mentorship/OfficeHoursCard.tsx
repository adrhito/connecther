"use client";

import { Clock, CalendarCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OfficeHoursCardProps {
  availability: string;
  mentorName: string;
}

export function OfficeHoursCard({ availability, mentorName }: OfficeHoursCardProps) {
  return (
    <Card className="border-accent/30 bg-accent/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-4 w-4 text-accent-warm" />
          Office Hours
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-text-secondary mb-3">
          {mentorName} holds office hours for open Q&A sessions.
        </p>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-surface border border-border mb-3">
          <CalendarCheck className="h-4 w-4 text-success shrink-0" />
          <span className="text-sm font-medium text-text-primary">
            {availability}
          </span>
        </div>
        <Button variant="accent" className="w-full">
          <CalendarCheck className="h-4 w-4" />
          Book Office Hours
        </Button>
        <p className="text-[11px] text-text-muted text-center mt-2">
          Booking functionality coming soon
        </p>
      </CardContent>
    </Card>
  );
}
