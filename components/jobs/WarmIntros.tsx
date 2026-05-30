"use client";

import { Users, UserPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface WarmIntrosProps {
  companyName: string;
  companyId: string;
}

// Placeholder connections data for demo purposes
const placeholderConnections = [
  {
    id: "conn-demo-1",
    name: "Priya Sharma",
    headline: "Senior Software Engineer",
    photo: "/avatars/priya.jpg",
  },
  {
    id: "conn-demo-2",
    name: "Elena Chen",
    headline: "Senior Technical Recruiter",
    photo: "/avatars/elena.jpg",
  },
];

export function WarmIntros({ companyName }: WarmIntrosProps) {
  // In a real app, this would fetch actual connections at the company
  const connections = placeholderConnections;

  if (connections.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5 text-accent-warm" />
          People in your network at {companyName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {connections.map((connection) => (
            <div
              key={connection.id}
              className="flex items-center justify-between gap-3 p-3 rounded-lg bg-surface-elevated"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={connection.photo} alt={connection.name} />
                  <AvatarFallback>
                    {connection.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {connection.name}
                  </p>
                  <p className="text-xs text-text-secondary truncate">
                    {connection.headline}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="shrink-0">
                <UserPlus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Request Intro</span>
              </Button>
            </div>
          ))}
        </div>
        <p className="text-xs text-text-muted mt-3">
          Warm intros can increase your chances of getting an interview by up to 10x.
        </p>
      </CardContent>
    </Card>
  );
}
