"use client";

import { UserAvatar } from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/shared/Badge";
import { UserPlus, Check, Clock, UserMinus } from "lucide-react";
import type { User } from "@/lib/types";

interface ConnectionCardProps {
  user: Partial<User>;
  connectionStatus: "none" | "pending" | "connected" | "incoming";
  mutualConnections?: number;
  onConnect?: () => void;
  onAccept?: () => void;
  onReject?: () => void;
  onFollow?: () => void;
}

export function ConnectionCard({
  user,
  connectionStatus,
  mutualConnections = 0,
  onConnect,
  onAccept,
  onReject,
  onFollow,
}: ConnectionCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center">
          <UserAvatar
            name={user.name || "User"}
            src={user.profile_photo_url}
            size="lg"
            className="mb-3"
          />
          <h3 className="font-semibold text-text-primary text-sm truncate w-full">
            {user.name}
          </h3>
          {user.headline && (
            <p className="text-xs text-text-secondary mt-1 line-clamp-2 min-h-[2rem]">
              {user.headline}
            </p>
          )}
          {user.location && (
            <p className="text-xs text-text-muted mt-1">{user.location}</p>
          )}
          {mutualConnections > 0 && (
            <p className="text-xs text-text-muted mt-1">
              {mutualConnections} mutual connection{mutualConnections !== 1 ? "s" : ""}
            </p>
          )}
          {user.role && (
            <Badge variant="accent" className="mt-2">
              {user.role}
            </Badge>
          )}

          <div className="flex flex-col gap-2 w-full mt-4">
            {connectionStatus === "none" && (
              <Button size="sm" onClick={onConnect} className="w-full">
                <UserPlus className="w-3.5 h-3.5" />
                Connect
              </Button>
            )}
            {connectionStatus === "pending" && (
              <Button size="sm" variant="secondary" disabled className="w-full">
                <Clock className="w-3.5 h-3.5" />
                Pending
              </Button>
            )}
            {connectionStatus === "connected" && (
              <Button size="sm" variant="accent" disabled className="w-full">
                <Check className="w-3.5 h-3.5" />
                Connected
              </Button>
            )}
            {connectionStatus === "incoming" && (
              <div className="flex gap-2 w-full">
                <Button size="sm" onClick={onAccept} className="flex-1">
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={onReject}
                  className="flex-1"
                >
                  <UserMinus className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
            {connectionStatus !== "incoming" && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onFollow}
                className="w-full text-xs"
              >
                Follow
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
