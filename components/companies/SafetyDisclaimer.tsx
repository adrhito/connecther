"use client";

import { useState } from "react";
import { ShieldAlert, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function SafetyDisclaimer() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full p-4 text-left hover:bg-surface-elevated/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-warning" />
          <span className="text-sm font-medium text-text-primary">
            Safety & Data Disclaimer
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-text-muted" />
        ) : (
          <ChevronDown className="w-4 h-4 text-text-muted" />
        )}
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          isExpanded ? "max-h-96" : "max-h-0"
        )}
      >
        <div className="px-4 pb-4 space-y-3 text-sm text-text-secondary">
          <p>
            The safety culture data, reviews, and ratings on this page are
            submitted by individual users and reflect their personal
            experiences. They do not represent the views of connectHer or
            constitute an endorsement or criticism of any company.
          </p>
          <p>
            Reviews undergo moderation to remove harmful content, but we cannot
            verify every claim. Companies may respond to reviews to provide
            context. We encourage users to consider multiple sources when
            evaluating a company.
          </p>
          <p>
            Salary data is self-reported and may not reflect current
            compensation. Promotion timelines vary by individual and team.
          </p>
          <a
            href="/community-guidelines"
            className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            Read our Community Guidelines
          </a>
        </div>
      </div>
    </div>
  );
}
