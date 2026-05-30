"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/shared/Badge";
import { Users, Lock } from "lucide-react";
import { formatNumber } from "@/lib/utils/format";
import type { Community } from "@/lib/types";

interface CommunityCardProps {
  community: Community;
  isMember?: boolean;
  onJoin?: () => void;
  onLeave?: () => void;
}

const categoryColors: Record<string, "default" | "accent" | "success" | "warning"> = {
  industry: "default",
  campus: "accent",
  interest: "success",
  company: "warning",
};

export function CommunityCard({
  community,
  isMember = false,
  onJoin,
  onLeave,
}: CommunityCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow h-full">
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          {community.is_private && (
            <Lock className="w-4 h-4 text-text-muted" />
          )}
        </div>

        <Link href={`/communities/${community.id}`} className="hover:underline">
          <h3 className="font-semibold text-text-primary text-sm mb-1">
            {community.name}
          </h3>
        </Link>

        {community.description && (
          <p className="text-xs text-text-secondary line-clamp-2 mb-3 flex-1">
            {community.description}
          </p>
        )}

        <div className="flex items-center gap-2 mb-4">
          <Badge variant={categoryColors[community.category] || "outline"}>
            {community.category}
          </Badge>
          <span className="text-xs text-text-muted">
            {formatNumber(community.member_count)} members
          </span>
        </div>

        {isMember ? (
          <Button
            size="sm"
            variant="secondary"
            onClick={onLeave}
            className="w-full"
          >
            Leave
          </Button>
        ) : (
          <Button size="sm" onClick={onJoin} className="w-full">
            {community.is_private ? "Request to Join" : "Join"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
