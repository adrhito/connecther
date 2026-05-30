"use client";

import { useEffect, useState } from "react";
import { AnalyticsCards } from "@/components/admin/AnalyticsCards";
import { AnalyticsChart } from "@/components/admin/AnalyticsChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/shared/Badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { AlertTriangle } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils/format";

interface FlaggedItem {
  id: string;
  content: string;
  type: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [flaggedItems, setFlaggedItems] = useState<FlaggedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsRes, reviewsRes] = await Promise.all([
          fetch("/api/posts?limit=100"),
          fetch("/api/reviews?flagged=true"),
        ]);
        const postsData = await postsRes.json();
        const reviewsData = await reviewsRes.json();

        const flaggedPosts = (postsData.posts || [])
          .filter((p: { is_flagged: boolean }) => p.is_flagged)
          .map((p: { id: string; content: string; created_at: string }) => ({
            id: p.id,
            content: p.content,
            type: "post",
            created_at: p.created_at,
          }));

        const flaggedReviews = (reviewsData.reviews || []).map(
          (r: { id: string; review_text: string; created_at: string }) => ({
            id: r.id,
            content: r.review_text || "No content",
            type: "review",
            created_at: r.created_at,
          })
        );

        setFlaggedItems([...flaggedPosts, ...flaggedReviews]);
      } catch (err) {
        console.error("Failed to fetch admin data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
          Admin Dashboard
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Overview of platform activity and health
        </p>
      </div>

      <AnalyticsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart type="user_growth" />
        <AnalyticsChart type="post_activity" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            Recent Flagged Items ({flaggedItems.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {flaggedItems.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-4">
              No flagged items. Everything looks good!
            </p>
          ) : (
            <div className="space-y-3">
              {flaggedItems.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-surface-elevated"
                >
                  <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-text-primary line-clamp-2">
                      {item.content}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="warning">{item.type}</Badge>
                      <span className="text-xs text-text-muted">
                        {formatRelativeTime(item.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-text-secondary">Avg. Daily Active Users</p>
            <p className="text-xl font-bold text-text-primary mt-1">2,341</p>
            <p className="text-xs text-success mt-1">+8.2% this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-text-secondary">Mentor Match Rate</p>
            <p className="text-xl font-bold text-text-primary mt-1">87%</p>
            <p className="text-xs text-success mt-1">+3.1% this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-text-secondary">Job Application Rate</p>
            <p className="text-xl font-bold text-text-primary mt-1">23%</p>
            <p className="text-xs text-warning mt-1">-1.2% this month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
