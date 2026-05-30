"use client";

import Link from "next/link";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Badge } from "@/components/shared/Badge";
import { UserPlus, Briefcase, Users } from "lucide-react";

const suggestedMentors = [
  {
    id: "u3",
    name: "Priya Patel",
    title: "Associate Partner at McKinsey",
    badges: ["Consulting Mentor"],
  },
  {
    id: "u2",
    name: "Maya Johnson",
    title: "VP, IB Division at Goldman Sachs",
    badges: ["Finance Mentor"],
  },
  {
    id: "u8",
    name: "Rachel Green",
    title: "Partner at Sequoia Capital",
    badges: ["Founder Mentor"],
  },
];

const trendingJobs = [
  { title: "Product Manager", company: "Stripe", id: "1" },
  { title: "Software Engineer II", company: "Google", id: "2" },
  { title: "Marketing Lead", company: "BloomHQ", id: "3" },
];

const recommendedCommunities = [
  { name: "Women in Tech", members: 12400, id: "1" },
  { name: "Finance Sisters", members: 8200, id: "2" },
  { name: "Founder Circle", members: 3100, id: "3" },
];

export function FeedSidebar() {
  return (
    <aside className="hidden xl:block w-72 shrink-0">
      <div className="sticky top-20 space-y-4">
        {/* Suggested Mentors */}
        <div className="bg-surface border border-border rounded-lg p-4">
          <h3 className="font-semibold text-xs text-text-secondary uppercase tracking-wider mb-3">
            Suggested Mentors
          </h3>
          <div className="space-y-3">
            {suggestedMentors.map((mentor) => (
              <div key={mentor.id} className="flex items-start gap-2.5">
                <Link href={`/profile/${mentor.id}`}>
                  <UserAvatar name={mentor.name} size="sm" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/profile/${mentor.id}`}
                    className="text-sm font-medium text-text-primary hover:underline block truncate"
                  >
                    {mentor.name}
                  </Link>
                  <p className="text-xs text-text-secondary truncate">{mentor.title}</p>
                  {mentor.badges.length > 0 && (
                    <Badge variant="accent" className="text-[10px] mt-1 px-1.5 py-0">
                      {mentor.badges[0]}
                    </Badge>
                  )}
                </div>
                <button
                  className="shrink-0 flex items-center gap-1 text-xs font-medium text-primary border border-primary rounded-full px-2.5 py-1 hover:bg-primary hover:text-white transition-colors"
                  aria-label={`Connect with ${mentor.name}`}
                >
                  <UserPlus className="w-3 h-3" />
                  Connect
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Jobs */}
        <div className="bg-surface border border-border rounded-lg p-4">
          <h3 className="font-semibold text-xs text-text-secondary uppercase tracking-wider mb-3">
            Trending Jobs
          </h3>
          <div className="space-y-2.5">
            {trendingJobs.map((job) => (
              <Link
                key={job.id}
                href="/jobs"
                className="flex items-start gap-2.5 group"
              >
                <Briefcase className="w-4 h-4 text-text-muted mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">
                    {job.title}
                  </p>
                  <p className="text-xs text-text-secondary">{job.company}</p>
                </div>
              </Link>
            ))}
          </div>
          <Link
            href="/jobs"
            className="block text-xs text-primary font-medium mt-3 hover:underline"
          >
            View all jobs
          </Link>
        </div>

        {/* Recommended Communities */}
        <div className="bg-surface border border-border rounded-lg p-4">
          <h3 className="font-semibold text-xs text-text-secondary uppercase tracking-wider mb-3">
            Recommended Communities
          </h3>
          <div className="space-y-2.5">
            {recommendedCommunities.map((community) => (
              <div key={community.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-text-muted" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      {community.name}
                    </p>
                    <p className="text-xs text-text-muted">
                      {community.members.toLocaleString()} members
                    </p>
                  </div>
                </div>
                <button className="text-xs font-medium text-primary border border-primary rounded-full px-2.5 py-1 hover:bg-primary hover:text-white transition-colors">
                  Join
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
