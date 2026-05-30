"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Badge } from "@/components/shared/Badge";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  Users,
  MessageSquare,
  Heart,
  DollarSign,
} from "lucide-react";
import { formatRelativeTime, formatSalary } from "@/lib/utils/format";

interface SearchResults {
  people: Record<string, unknown>[];
  jobs: Record<string, unknown>[];
  companies: Record<string, unknown>[];
  communities: Record<string, unknown>[];
  posts: Record<string, unknown>[];
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState<SearchResults>({
    people: [],
    jobs: [],
    companies: [],
    communities: [],
    posts: [],
  });
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchResults = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults({ people: [], jobs: [], companies: [], communities: [], posts: [] });
      setTotal(0);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.results || { people: [], jobs: [], companies: [], communities: [], posts: [] });
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (query) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync search input from URL
      setSearchInput(query);
      fetchResults(query);
    }
  }, [query, fetchResults]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search people, jobs, companies, communities..."
            className="w-full h-12 pl-12 pr-4 rounded-lg border border-border bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
          />
        </div>
      </form>

      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <LoadingSpinner size="lg" />
        </div>
      ) : !query ? (
        <EmptyState
          icon={<Search className="w-12 h-12" />}
          title="Search connectHer"
          description="Find people, jobs, companies, and communities that match your interests."
        />
      ) : total === 0 ? (
        <EmptyState
          icon={<Search className="w-12 h-12" />}
          title={`No results for "${query}"`}
          description="Try adjusting your search terms or browse our recommendations."
        />
      ) : (
        <>
          <p className="text-sm text-text-secondary mb-4">
            {total} result{total !== 1 ? "s" : ""} for &quot;{query}&quot;
          </p>

          <Tabs defaultValue="all">
            <TabsList className="mb-6 flex-wrap">
              <TabsTrigger value="all">All ({total})</TabsTrigger>
              <TabsTrigger value="people">
                People ({results.people.length})
              </TabsTrigger>
              <TabsTrigger value="jobs">
                Jobs ({results.jobs.length})
              </TabsTrigger>
              <TabsTrigger value="companies">
                Companies ({results.companies.length})
              </TabsTrigger>
              <TabsTrigger value="communities">
                Communities ({results.communities.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {results.people.length > 0 && (
                <section>
                  <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
                    People
                  </h2>
                  <div className="space-y-2">
                    {results.people.slice(0, 3).map((person) => (
                      <PersonCard key={person.id as string} person={person} />
                    ))}
                  </div>
                </section>
              )}
              {results.jobs.length > 0 && (
                <section>
                  <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
                    Jobs
                  </h2>
                  <div className="space-y-2">
                    {results.jobs.slice(0, 3).map((job) => (
                      <JobCard key={job.id as string} job={job} />
                    ))}
                  </div>
                </section>
              )}
              {results.companies.length > 0 && (
                <section>
                  <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
                    Companies
                  </h2>
                  <div className="space-y-2">
                    {results.companies.slice(0, 3).map((company) => (
                      <CompanyCard key={company.id as string} company={company} />
                    ))}
                  </div>
                </section>
              )}
              {results.communities.length > 0 && (
                <section>
                  <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
                    Communities
                  </h2>
                  <div className="space-y-2">
                    {results.communities.slice(0, 3).map((community) => (
                      <CommunityResultCard
                        key={community.id as string}
                        community={community}
                      />
                    ))}
                  </div>
                </section>
              )}
              {results.posts.length > 0 && (
                <section>
                  <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
                    Posts
                  </h2>
                  <div className="space-y-2">
                    {results.posts.slice(0, 3).map((post) => (
                      <PostResultCard key={post.id as string} post={post} />
                    ))}
                  </div>
                </section>
              )}
            </TabsContent>

            <TabsContent value="people" className="space-y-2">
              {results.people.map((person) => (
                <PersonCard key={person.id as string} person={person} />
              ))}
            </TabsContent>

            <TabsContent value="jobs" className="space-y-2">
              {results.jobs.map((job) => (
                <JobCard key={job.id as string} job={job} />
              ))}
            </TabsContent>

            <TabsContent value="companies" className="space-y-2">
              {results.companies.map((company) => (
                <CompanyCard key={company.id as string} company={company} />
              ))}
            </TabsContent>

            <TabsContent value="communities" className="space-y-2">
              {results.communities.map((community) => (
                <CommunityResultCard
                  key={community.id as string}
                  community={community}
                />
              ))}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}

function PersonCard({ person }: { person: Record<string, unknown> }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <UserAvatar
            name={(person.name as string) || "User"}
            src={person.profile_photo_url as string | undefined}
            size="lg"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text-primary text-sm">
              {person.name as string}
            </h3>
            {!!person.headline && (
              <p className="text-xs text-text-secondary truncate">
                {person.headline as string}
              </p>
            )}
            <div className="flex items-center gap-3 mt-1">
              {!!person.location && (
                <span className="text-xs text-text-muted flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {person.location as string}
                </span>
              )}
              {!!person.role && (
                <Badge variant="accent" className="text-[10px]">
                  {person.role as string}
                </Badge>
              )}
            </div>
          </div>
          <Button size="sm" variant="outline">
            Connect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function JobCard({ job }: { job: Record<string, unknown> }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-surface-elevated flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text-primary text-sm">
              {job.title as string}
            </h3>
            <p className="text-xs text-text-secondary">
              {job.company_name as string}
            </p>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-text-muted flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {job.location as string}
              </span>
              {!!job.show_salary && (
                <span className="text-xs text-success flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {formatSalary(
                    job.salary_min as number | undefined,
                    job.salary_max as number | undefined
                  )}
                </span>
              )}
            </div>
            <div className="flex gap-1 mt-2">
              <Badge variant="outline">
                {job.remote_type as string}
              </Badge>
              <Badge variant="outline">
                {job.employment_type as string}
              </Badge>
            </div>
          </div>
          <Button size="sm">View</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CompanyCard({ company }: { company: Record<string, unknown> }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-surface-elevated flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text-primary text-sm">
              {company.name as string}
            </h3>
            <p className="text-xs text-text-secondary">
              {company.industry as string} &middot;{" "}
              {company.headquarters as string}
            </p>
            <p className="text-xs text-text-muted mt-1">
              {company.size as string} employees
            </p>
          </div>
          <Button size="sm" variant="outline">
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CommunityResultCard({
  community,
}: {
  community: Record<string, unknown>;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text-primary text-sm">
              {community.name as string}
            </h3>
            <p className="text-xs text-text-secondary truncate">
              {community.description as string}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="accent">
                {community.category as string}
              </Badge>
              <span className="text-xs text-text-muted">
                {(community.member_count as number)?.toLocaleString()} members
              </span>
            </div>
          </div>
          <Button size="sm" variant="outline">
            Join
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PostResultCard({ post }: { post: Record<string, unknown> }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <p className="text-sm text-text-primary line-clamp-3">
          {post.content as string}
        </p>
        <div className="flex items-center gap-4 mt-2">
          <span className="text-xs text-text-muted flex items-center gap-1">
            <Heart className="w-3 h-3" />
            {post.likes_count as number}
          </span>
          <span className="text-xs text-text-muted flex items-center gap-1">
            <MessageSquare className="w-3 h-3" />
            {post.comments_count as number}
          </span>
          <span className="text-xs text-text-muted">
            {formatRelativeTime(post.created_at as string)}
          </span>
        </div>
        {(post.hashtags as string[])?.length > 0 && (
          <div className="flex gap-1 mt-2">
            {(post.hashtags as string[]).map((tag) => (
              <span
                key={tag}
                className="text-xs text-primary hover:underline cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
