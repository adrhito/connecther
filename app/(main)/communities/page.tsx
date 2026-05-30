"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CommunityCard } from "@/components/communities/CommunityCard";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { SearchBar } from "@/components/shared/SearchBar";
import { Users, Search } from "lucide-react";
import type { Community } from "@/lib/types";

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());

  const fetchCommunities = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("q", searchQuery);
      const res = await fetch(`/api/communities?${params.toString()}`);
      const data = await res.json();
      setCommunities(data.communities || []);
    } catch (err) {
      console.error("Failed to fetch communities:", err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-side data fetching
    fetchCommunities();
  }, [fetchCommunities]);

  const handleJoin = (communityId: string) => {
    setJoinedIds((prev) => new Set([...prev, communityId]));
  };

  const handleLeave = (communityId: string) => {
    setJoinedIds((prev) => {
      const next = new Set(prev);
      next.delete(communityId);
      return next;
    });
  };

  const featured = communities.filter((c) => c.is_featured);
  const byCategoryMap: Record<string, Community[]> = {};
  for (const c of communities) {
    if (!byCategoryMap[c.category]) byCategoryMap[c.category] = [];
    byCategoryMap[c.category].push(c);
  }

  const categoryLabels: Record<string, string> = {
    industry: "Industry",
    campus: "Campus",
    interest: "Interest & Skills",
    company: "Company",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            Communities
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Join communities by industry, campus, interest, or company
          </p>
        </div>
        <div className="w-full sm:w-72">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search communities..."
          />
        </div>
      </div>

      {communities.length === 0 ? (
        <EmptyState
          icon={<Search className="w-12 h-12" />}
          title="No communities found"
          description="Try adjusting your search to find communities."
        />
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All ({communities.length})</TabsTrigger>
            <TabsTrigger value="featured">
              Featured ({featured.length})
            </TabsTrigger>
            {Object.entries(byCategoryMap).map(([cat, items]) => (
              <TabsTrigger key={cat} value={cat}>
                {categoryLabels[cat] || cat} ({items.length})
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {communities.map((c) => (
                <CommunityCard
                  key={c.id}
                  community={c}
                  isMember={joinedIds.has(c.id)}
                  onJoin={() => handleJoin(c.id)}
                  onLeave={() => handleLeave(c.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="featured">
            {featured.length === 0 ? (
              <EmptyState
                icon={<Users className="w-12 h-12" />}
                title="No featured communities"
                description="Check back soon for featured communities."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {featured.map((c) => (
                  <CommunityCard
                    key={c.id}
                    community={c}
                    isMember={joinedIds.has(c.id)}
                    onJoin={() => handleJoin(c.id)}
                    onLeave={() => handleLeave(c.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {Object.entries(byCategoryMap).map(([cat, items]) => (
            <TabsContent key={cat} value={cat}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((c) => (
                  <CommunityCard
                    key={c.id}
                    community={c}
                    isMember={joinedIds.has(c.id)}
                    onJoin={() => handleJoin(c.id)}
                    onLeave={() => handleLeave(c.id)}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
