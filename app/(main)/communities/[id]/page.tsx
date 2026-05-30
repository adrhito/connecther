"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Users,
  Lock,
  Globe,
  Calendar,
  MessageSquare,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/shared/Badge";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { PostCard } from "@/components/feed/PostCard";
import { useAuth } from "@/lib/hooks/useAuth";
import { formatNumber, formatRelativeTime } from "@/lib/utils/format";
import type { Community, Post, User } from "@/lib/types";

const categoryLabels: Record<string, string> = {
  industry: "Industry",
  campus: "Campus",
  interest: "Interest & Skills",
  company: "Company",
};

const categoryColors: Record<
  string,
  "default" | "accent" | "success" | "warning"
> = {
  industry: "default",
  campus: "accent",
  interest: "success",
  company: "warning",
};

export default function CommunityDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const [community, setCommunity] = useState<Community | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMember, setIsMember] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [communityRes, postsRes, usersRes] = await Promise.all([
        fetch(`/api/communities/${id}`),
        fetch("/api/posts?limit=10"),
        fetch("/api/users"),
      ]);

      if (!communityRes.ok) {
        setError("Community not found");
        return;
      }

      const communityData = await communityRes.json();
      const postsData = await postsRes.json();
      const usersData = await usersRes.json();

      setCommunity(communityData.community);
      // Show a subset of posts as "community posts"
      setPosts((postsData.posts || []).slice(0, 5));

      const map: Record<string, User> = {};
      for (const u of usersData.users || []) {
        map[u.id] = u;
      }
      setUsersMap(map);
    } catch {
      setError("Failed to load community");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-side data fetching
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <EmptyState
          title="Community not found"
          description="The community you are looking for does not exist or has been removed."
          action={
            <Button variant="secondary" asChild>
              <Link href="/communities">Back to Communities</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Back navigation */}
      <Link
        href="/communities"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Communities
      </Link>

      {/* Community header */}
      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-br from-primary via-primary-light to-accent/40" />

        <div className="p-6 -mt-8">
          <div className="flex items-end gap-4">
            <div className="w-16 h-16 rounded-xl bg-surface border-4 border-surface flex items-center justify-center shadow-md">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-heading font-bold text-text-primary">
                  {community.name}
                </h1>
                {community.is_private ? (
                  <Lock className="w-4 h-4 text-text-muted" />
                ) : (
                  <Globe className="w-4 h-4 text-text-muted" />
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4 flex-wrap">
            <Badge
              variant={categoryColors[community.category] || "outline"}
            >
              {categoryLabels[community.category] || community.category}
            </Badge>
            <span className="text-sm text-text-secondary flex items-center gap-1">
              <Users className="w-4 h-4" />
              {formatNumber(community.member_count)} members
            </span>
            <span className="text-sm text-text-secondary flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Created {formatRelativeTime(community.created_at)}
            </span>
          </div>

          {community.description && (
            <p className="mt-3 text-sm text-text-secondary leading-relaxed">
              {community.description}
            </p>
          )}

          <div className="mt-4 flex items-center gap-3">
            {isMember ? (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsMember(false)}
                >
                  Leave Community
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 mr-1.5" />
                  New Post
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => setIsMember(true)}>
                {community.is_private ? "Request to Join" : "Join Community"}
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Share2 className="w-4 h-4 mr-1.5" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Main feed */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-heading font-semibold text-text-primary">
            Recent Discussions
          </h2>

          {posts.length === 0 ? (
            <EmptyState
              icon={<MessageSquare className="w-10 h-10" />}
              title="No posts yet"
              description="Be the first to start a discussion in this community."
            />
          ) : (
            posts.map((post) => {
              const author = usersMap[post.author_id];
              if (!author) return null;
              return (
                <PostCard
                  key={post.id}
                  post={post}
                  author={author}
                  comments={[]}
                  allUsers={usersMap}
                  currentUserId={user?.id}
                />
              );
            })
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-text-primary mb-3">
                About this community
              </h3>
              <div className="space-y-3 text-sm text-text-secondary">
                <div className="flex items-center gap-2">
                  {community.is_private ? (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Private community</span>
                    </>
                  ) : (
                    <>
                      <Globe className="w-4 h-4" />
                      <span>Public community</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>
                    {formatNumber(community.member_count)} members
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Created{" "}
                    {new Date(community.created_at).toLocaleDateString(
                      "en-US",
                      { month: "long", year: "numeric" }
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-text-primary mb-3">
                Community Guidelines
              </h3>
              <ul className="space-y-2 text-xs text-text-secondary">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">1.</span>
                  Be respectful and supportive of all members
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">2.</span>
                  Keep discussions relevant to the community topic
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">3.</span>
                  No spam, self-promotion, or unsolicited recruiting
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">4.</span>
                  Share experiences and advice genuinely
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">5.</span>
                  Report any harassment or inappropriate content
                </li>
              </ul>
            </CardContent>
          </Card>

          {community.is_featured && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-accent-warm">&#9733;</span>
                  <span className="font-medium text-text-primary">
                    Featured Community
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  This community is recognized by connectHer for its active
                  and supportive members.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
