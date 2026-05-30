"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/shared/Badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAuth } from "@/lib/context/AuthContext";
import { formatRelativeTime } from "@/lib/utils/format";
import {
  Bell,
  UserPlus,
  Heart,
  MessageSquare,
  Briefcase,
  GraduationCap,
  Shield,
  CheckCheck,
  Users,
} from "lucide-react";
import type { Notification } from "@/lib/types";

const notifIcons: Record<string, typeof Bell> = {
  connection_request: UserPlus,
  connection_accepted: Users,
  post_like: Heart,
  post_comment: MessageSquare,
  job_match: Briefcase,
  mentorship_request: GraduationCap,
  mentorship_accepted: GraduationCap,
  message: MessageSquare,
  moderation_alert: Shield,
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/notifications?user_id=${user.id}`);
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-side data fetching
    fetchNotifications();
  }, [fetchNotifications]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const displayed =
    filter === "unread"
      ? notifications.filter((n) => !n.is_read)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            Notifications
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`
              : "You're all caught up"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button size="sm" variant="secondary" onClick={markAllAsRead}>
            <CheckCheck className="w-4 h-4 mr-1.5" />
            Mark all read
          </Button>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-primary text-white"
              : "bg-surface-elevated text-text-secondary hover:text-text-primary"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === "unread"
              ? "bg-primary text-white"
              : "bg-surface-elevated text-text-secondary hover:text-text-primary"
          }`}
        >
          Unread {unreadCount > 0 && `(${unreadCount})`}
        </button>
      </div>

      {displayed.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-12 h-12" />}
          title={filter === "unread" ? "No unread notifications" : "No notifications yet"}
          description={
            filter === "unread"
              ? "You've read all your notifications."
              : "When you get connection requests, messages, or job matches, they'll appear here."
          }
        />
      ) : (
        <div className="space-y-2">
          {displayed.map((notif) => {
            const Icon = notifIcons[notif.type] || Bell;
            return (
              <Link
                key={notif.id}
                href={notif.link || "#"}
                onClick={() => markAsRead(notif.id)}
              >
                <Card
                  className={`transition-all hover:shadow-md ${
                    !notif.is_read
                      ? "border-l-4 border-l-primary bg-primary/[0.02]"
                      : ""
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                          !notif.is_read
                            ? "bg-primary/10 text-primary"
                            : "bg-surface-elevated text-text-muted"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-sm ${
                              !notif.is_read
                                ? "font-semibold text-text-primary"
                                : "text-text-secondary"
                            }`}
                          >
                            {notif.title}
                          </p>
                          <div className="flex items-center gap-2 shrink-0">
                            {!notif.is_read && (
                              <Badge variant="accent" className="text-[10px]">
                                New
                              </Badge>
                            )}
                          </div>
                        </div>
                        {notif.body && (
                          <p className="text-xs text-text-muted mt-0.5 line-clamp-2">
                            {notif.body}
                          </p>
                        )}
                        <p className="text-xs text-text-muted mt-1">
                          {formatRelativeTime(notif.created_at)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
