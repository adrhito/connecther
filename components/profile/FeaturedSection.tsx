"use client";

import { Star, ExternalLink } from "lucide-react";

export function FeaturedSection() {
  // Placeholder featured items
  const featuredItems = [
    {
      id: "feat-1",
      title: "My Journey in Tech",
      type: "Article",
      description: "Reflecting on 8 years building inclusive products.",
    },
    {
      id: "feat-2",
      title: "Open Source Accessibility Toolkit",
      type: "Project",
      description: "A collection of React components for accessible web apps.",
    },
    {
      id: "feat-3",
      title: "Grace Hopper Conference Talk",
      type: "Event",
      description: "Keynote on engineering leadership and sponsorship.",
    },
  ];

  return (
    <div className="bg-surface border border-border rounded-lg p-4 sm:p-6">
      <h2 className="text-lg font-semibold text-text-primary font-heading mb-4">
        Featured
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {featuredItems.map((item) => (
          <div
            key={item.id}
            className="border border-border rounded-lg p-4 hover:border-primary/30 transition-colors cursor-pointer group"
          >
            <div className="w-full h-24 bg-gradient-to-br from-accent/10 to-primary/10 rounded-md flex items-center justify-center mb-3">
              <Star className="w-8 h-8 text-accent-warm/50" />
            </div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-text-muted mt-0.5">{item.type}</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-text-muted shrink-0 mt-0.5" />
            </div>
            <p className="text-xs text-text-secondary mt-1.5 line-clamp-2">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
