"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { Flag, CheckCircle, XCircle, Eye } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/format";
import type { Report } from "@/lib/types";

const mockReports: Report[] = [
  {
    id: "report-1",
    reporter_id: "user-2",
    content_type: "post",
    content_id: "post-8",
    reason: "Spam content that violates community guidelines",
    status: "pending",
    created_at: "2025-03-11T08:30:00Z",
  },
  {
    id: "report-2",
    reporter_id: "user-5",
    content_type: "review",
    content_id: "review-6",
    reason: "Contains harassment and inappropriate language",
    status: "pending",
    created_at: "2025-03-10T09:00:00Z",
  },
  {
    id: "report-3",
    reporter_id: "user-1",
    content_type: "message",
    content_id: "msg-99",
    reason: "Unsolicited recruiting spam",
    status: "reviewed",
    created_at: "2025-03-08T14:00:00Z",
  },
  {
    id: "report-4",
    reporter_id: "user-3",
    content_type: "user",
    content_id: "user-99",
    reason: "Fake profile impersonating a public figure",
    status: "resolved",
    created_at: "2025-03-05T11:00:00Z",
  },
  {
    id: "report-5",
    reporter_id: "user-6",
    content_type: "comment",
    content_id: "comment-99",
    reason: "Offensive comment targeting women in leadership",
    status: "dismissed",
    created_at: "2025-03-03T16:00:00Z",
  },
];

const statusColors: Record<string, "warning" | "default" | "success" | "outline"> = {
  pending: "warning",
  reviewed: "default",
  resolved: "success",
  dismissed: "outline",
};

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [filterStatus, setFilterStatus] = useState<string>("");

  const filteredReports = reports.filter(
    (r) => !filterStatus || r.status === filterStatus
  );

  const handleResolve = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "resolved" as const } : r))
    );
  };

  const handleDismiss = (id: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: "dismissed" as const } : r
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-text-primary">
          Reports
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage user-submitted reports of content and behavior
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-text-secondary">Filter:</span>
        {["", "pending", "reviewed", "resolved", "dismissed"].map((status) => (
          <Button
            key={status || "all"}
            size="sm"
            variant={filterStatus === status ? "default" : "secondary"}
            onClick={() => setFilterStatus(status)}
          >
            {status || "All"} ({status ? reports.filter((r) => r.status === status).length : reports.length})
          </Button>
        ))}
      </div>

      {filteredReports.length === 0 ? (
        <EmptyState
          icon={<Flag className="w-12 h-12" />}
          title="No reports found"
          description="There are no reports matching your filter."
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Reports ({filteredReports.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 flex items-start gap-4 hover:bg-surface-elevated/50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center shrink-0">
                    <Flag className="w-4 h-4 text-error" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={statusColors[report.status]}>
                        {report.status}
                      </Badge>
                      <Badge variant="outline">{report.content_type}</Badge>
                      <span className="text-xs text-text-muted">
                        {formatRelativeTime(report.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-text-primary">{report.reason}</p>
                    <p className="text-xs text-text-muted mt-1">
                      Reported by: {report.reporter_id} &middot; Content:{" "}
                      {report.content_id}
                    </p>
                  </div>
                  {report.status === "pending" && (
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        title="View content"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleResolve(report.id)}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Resolve
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleDismiss(report.id)}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Dismiss
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
