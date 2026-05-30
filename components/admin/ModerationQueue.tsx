"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Shield, CheckCircle, Trash2, Ban, AlertTriangle } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/format";

interface ModerationItem {
  id: string;
  content: string;
  author?: string;
  authorId?: string;
  type: "post" | "review" | "comment";
  reason?: string;
  flaggedAt: string;
}

interface ModerationQueueProps {
  items: ModerationItem[];
  onApprove: (id: string) => void;
  onRemove: (id: string) => void;
  onBan: (authorId: string) => void;
}

export function ModerationQueue({
  items,
  onApprove,
  onRemove,
  onBan,
}: ModerationQueueProps) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={<Shield className="w-12 h-12" />}
        title="No items to review"
        description="The moderation queue is clear. All content is approved."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">
          {items.length} item{items.length !== 1 ? "s" : ""} flagged for review
        </p>
      </div>
      {items.map((item) => (
        <Card key={item.id} className="border-warning/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4 text-warning" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="warning">{item.type}</Badge>
                  {item.reason && (
                    <span className="text-xs text-text-muted">
                      Reason: {item.reason}
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-primary line-clamp-3 mb-2">
                  {item.content}
                </p>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  {item.author && <span>by {item.author}</span>}
                  <span>&middot;</span>
                  <span>{formatRelativeTime(item.flaggedAt)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 ml-11">
              <Button
                size="sm"
                variant="default"
                onClick={() => onApprove(item.id)}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => onRemove(item.id)}
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </Button>
              {item.authorId && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onBan(item.authorId!)}
                >
                  <Ban className="w-3.5 h-3.5" />
                  Ban User
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
