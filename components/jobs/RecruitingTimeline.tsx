"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Clock,
  FileCheck,
  Users,
  Gift,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { RecruitingTimeline as RecruitingTimelineType } from "@/lib/types";

function formatTimelineDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getMonthProgress(start: string, end: string): { left: number; width: number } {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const yearStart = new Date(startDate.getFullYear(), 0, 1);
  const yearEnd = new Date(startDate.getFullYear(), 11, 31);
  const totalDays = (yearEnd.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24);

  const startDay = (startDate.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24);
  const endDay = (endDate.getTime() - yearStart.getTime()) / (1000 * 60 * 60 * 24);

  return {
    left: (startDay / totalDays) * 100,
    width: Math.max(((endDay - startDay) / totalDays) * 100, 3),
  };
}

const industryColors: Record<string, string> = {
  Technology: "bg-blue-500",
  "Investment Banking": "bg-emerald-500",
  Consulting: "bg-purple-500",
  Marketing: "bg-orange-500",
};

function TimelineCard({ timeline }: { timeline: RecruitingTimelineType }) {
  const [expanded, setExpanded] = useState(false);

  const appBar = getMonthProgress(timeline.application_open, timeline.application_close);
  const intBar = getMonthProgress(timeline.application_close, timeline.interviews_start);
  const offerBar = getMonthProgress(timeline.interviews_start, timeline.offers_sent);

  const barColor = industryColors[timeline.industry] || "bg-primary";

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="font-heading font-semibold text-text-primary">
              {timeline.role_type}
            </h4>
            <Badge variant="outline" className="mt-1 text-xs">
              {timeline.industry}
            </Badge>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-text-muted hover:text-text-secondary transition-colors p-1"
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Timeline dates */}
        <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
          <div className="flex items-start gap-2">
            <FileCheck className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-text-muted text-xs">Apps Open</p>
              <p className="font-medium">{formatTimelineDate(timeline.application_open)}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-text-muted text-xs">Apps Close</p>
              <p className="font-medium">{formatTimelineDate(timeline.application_close)}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Users className="h-4 w-4 text-purple-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-text-muted text-xs">Interviews</p>
              <p className="font-medium">{formatTimelineDate(timeline.interviews_start)}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Gift className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-text-muted text-xs">Offers Sent</p>
              <p className="font-medium">{formatTimelineDate(timeline.offers_sent)}</p>
            </div>
          </div>
        </div>

        {/* Visual timeline bar */}
        <div className="mt-4 relative h-3 bg-surface-elevated rounded-full overflow-hidden">
          <div
            className={`absolute h-full ${barColor} opacity-80 rounded-full`}
            style={{ left: `${appBar.left}%`, width: `${appBar.width}%` }}
            title="Applications Open"
          />
          <div
            className={`absolute h-full ${barColor} opacity-50 rounded-full`}
            style={{
              left: `${intBar.left}%`,
              width: `${intBar.width}%`,
            }}
            title="Interviews"
          />
          <div
            className={`absolute h-full ${barColor} opacity-30 rounded-full`}
            style={{
              left: `${offerBar.left}%`,
              width: `${offerBar.width}%`,
            }}
            title="Offers"
          />
        </div>
        <div className="flex justify-between text-[10px] text-text-muted mt-1">
          <span>Jan</span>
          <span>Apr</span>
          <span>Jul</span>
          <span>Oct</span>
          <span>Dec</span>
        </div>

        {/* Tips (expanded) */}
        {expanded && timeline.tips.length > 0 && (
          <div className="mt-4 p-3 bg-surface-elevated rounded-lg">
            <h5 className="flex items-center gap-1.5 text-sm font-medium text-text-primary mb-2">
              <Lightbulb className="h-4 w-4 text-warning" />
              Tips
            </h5>
            <ul className="space-y-1.5">
              {timeline.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <span className="text-accent-warm mt-0.5">&#8226;</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface RecruitingTimelineProps {
  compact?: boolean;
}

export function RecruitingTimeline({ compact = false }: RecruitingTimelineProps) {
  const [timelines, setTimelines] = useState<RecruitingTimelineType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTimelines() {
      try {
        const res = await fetch("/api/jobs/timelines");
        if (res.ok) {
          const data = await res.json();
          setTimelines(data);
        }
      } catch (error) {
        console.error("Failed to fetch timelines:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTimelines();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-5 bg-surface-elevated rounded w-1/2" />
            <div className="h-3 bg-surface-elevated rounded w-full" />
            <div className="h-3 bg-surface-elevated rounded w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const displayTimelines = compact ? timelines.slice(0, 3) : timelines;

  return (
    <div>
      {!compact && (
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="font-heading text-lg font-semibold text-text-primary">
            Recruiting Timelines
          </h3>
        </div>
      )}
      <div className="space-y-3">
        {displayTimelines.map((timeline) => (
          <TimelineCard key={timeline.id} timeline={timeline} />
        ))}
      </div>
    </div>
  );
}
