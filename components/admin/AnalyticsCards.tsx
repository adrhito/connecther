"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  FileText,
  Briefcase,
  ClipboardList,
  GraduationCap,
  Star,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StatCard {
  label: string;
  value: number;
  change: number;
  icon: string;
}

const iconMap: Record<string, React.ElementType> = {
  Users,
  FileText,
  Briefcase,
  ClipboardList,
  GraduationCap,
  Star,
};

const defaultStats: StatCard[] = [
  { label: "Total Users", value: 12847, change: 12.5, icon: "Users" },
  { label: "Active Posts", value: 3621, change: 8.3, icon: "FileText" },
  { label: "Jobs Listed", value: 284, change: 15.2, icon: "Briefcase" },
  { label: "Applications", value: 1893, change: -3.1, icon: "ClipboardList" },
  { label: "Mentor Requests", value: 456, change: 22.7, icon: "GraduationCap" },
  { label: "Reviews", value: 891, change: 5.4, icon: "Star" },
];

interface AnalyticsCardsProps {
  stats?: StatCard[];
}

export function AnalyticsCards({ stats = defaultStats }: AnalyticsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon] || Users;
        const isPositive = stat.change >= 0;
        return (
          <Card key={stat.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-text-secondary">{stat.label}</p>
                  <p className="text-2xl font-bold text-text-primary mt-1">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                {isPositive ? (
                  <TrendingUp className="w-3.5 h-3.5 text-success" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-error" />
                )}
                <span
                  className={cn(
                    "text-xs font-medium",
                    isPositive ? "text-success" : "text-error"
                  )}
                >
                  {isPositive ? "+" : ""}
                  {stat.change}%
                </span>
                <span className="text-xs text-text-muted ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
