"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FeaturedManager } from "@/components/admin/FeaturedManager";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

interface FeaturedItem {
  id: string;
  title: string;
  subtitle?: string;
  type: "post" | "job" | "company" | "mentor";
  isFeatured: boolean;
}

export default function AdminFeaturedPage() {
  const [items, setItems] = useState<FeaturedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [postsRes, jobsRes, companiesRes, mentorsRes] = await Promise.all([
          fetch("/api/posts?limit=100"),
          fetch("/api/jobs"),
          fetch("/api/companies"),
          fetch("/api/mentors"),
        ]);

        const postsData = await postsRes.json();
        const jobsData = await jobsRes.json();
        const companiesData = await companiesRes.json();
        const mentorsData = await mentorsRes.json();

        const postItems: FeaturedItem[] = (postsData.posts || []).map(
          (p: { id: string; content: string; author_id: string; is_featured: boolean }) => ({
            id: p.id,
            title: p.content.substring(0, 80) + (p.content.length > 80 ? "..." : ""),
            subtitle: `by ${p.author_id}`,
            type: "post" as const,
            isFeatured: p.is_featured,
          })
        );

        const jobItems: FeaturedItem[] = (
          Array.isArray(jobsData) ? jobsData : jobsData.jobs || []
        ).map(
          (j: { id: string; title: string; company_name?: string; is_featured: boolean }) => ({
            id: j.id,
            title: j.title,
            subtitle: j.company_name || "",
            type: "job" as const,
            isFeatured: j.is_featured,
          })
        );

        const companyItems: FeaturedItem[] = (
          companiesData.companies || []
        ).map(
          (c: { id: string; name: string; industry?: string; is_featured: boolean }) => ({
            id: c.id,
            title: c.name,
            subtitle: c.industry || "",
            type: "company" as const,
            isFeatured: c.is_featured,
          })
        );

        const mentorItems: FeaturedItem[] = (
          Array.isArray(mentorsData) ? mentorsData : mentorsData.mentors || []
        ).map(
          (m: { id: string; name: string; headline?: string; mentor_verified: boolean }) => ({
            id: m.id,
            title: m.name,
            subtitle: m.headline || "",
            type: "mentor" as const,
            isFeatured: m.mentor_verified,
          })
        );

        setItems([...postItems, ...jobItems, ...companyItems, ...mentorItems]);
      } catch (err) {
        console.error("Failed to fetch featured data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const handleToggleFeatured = (id: string, featured: boolean) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFeatured: featured } : item
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const postItems = items.filter((i) => i.type === "post");
  const jobItems = items.filter((i) => i.type === "job");
  const companyItems = items.filter((i) => i.type === "company");
  const mentorItems = items.filter((i) => i.type === "mentor");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-text-primary">
          Featured Content
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage what content is featured and highlighted on the platform
        </p>
      </div>

      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">
            Posts ({postItems.filter((i) => i.isFeatured).length} featured)
          </TabsTrigger>
          <TabsTrigger value="jobs">
            Jobs ({jobItems.filter((i) => i.isFeatured).length} featured)
          </TabsTrigger>
          <TabsTrigger value="companies">
            Companies ({companyItems.filter((i) => i.isFeatured).length} featured)
          </TabsTrigger>
          <TabsTrigger value="mentors">
            Mentors ({mentorItems.filter((i) => i.isFeatured).length} featured)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <FeaturedManager
            items={postItems}
            onToggleFeatured={handleToggleFeatured}
          />
        </TabsContent>

        <TabsContent value="jobs">
          <FeaturedManager
            items={jobItems}
            onToggleFeatured={handleToggleFeatured}
          />
        </TabsContent>

        <TabsContent value="companies">
          <FeaturedManager
            items={companyItems}
            onToggleFeatured={handleToggleFeatured}
          />
        </TabsContent>

        <TabsContent value="mentors">
          <FeaturedManager
            items={mentorItems}
            onToggleFeatured={handleToggleFeatured}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
