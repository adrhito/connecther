"use client";

import { UserAvatar } from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { Check, X, UserPlus } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/format";
import type { User } from "@/lib/types";

interface ConnectionRequest {
  id: string;
  user: Partial<User> | null;
  created_at: string;
}

interface ConnectionRequestsProps {
  requests: ConnectionRequest[];
  onAccept: (connectionId: string) => void;
  onReject: (connectionId: string) => void;
}

export function ConnectionRequests({
  requests,
  onAccept,
  onReject,
}: ConnectionRequestsProps) {
  if (requests.length === 0) {
    return (
      <EmptyState
        icon={<UserPlus className="w-12 h-12" />}
        title="No pending requests"
        description="When someone sends you a connection request, it will appear here."
      />
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-text-secondary">
        {requests.length} pending request{requests.length !== 1 ? "s" : ""}
      </p>
      {requests.map((request) => (
        <Card key={request.id}>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <UserAvatar
                name={request.user?.name || "User"}
                src={request.user?.profile_photo_url}
                size="lg"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-text-primary text-sm truncate">
                  {request.user?.name || "Unknown User"}
                </h4>
                {request.user?.headline && (
                  <p className="text-xs text-text-secondary truncate">
                    {request.user.headline}
                  </p>
                )}
                <p className="text-xs text-text-muted mt-0.5">
                  {formatRelativeTime(request.created_at)}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  onClick={() => onAccept(request.id)}
                  aria-label={`Accept connection request from ${request.user?.name}`}
                >
                  <Check className="w-4 h-4" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onReject(request.id)}
                  aria-label={`Reject connection request from ${request.user?.name}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
