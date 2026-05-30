"use client";

import { useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface MentorFilterState {
  search: string;
  industry: string;
  company: string;
  school: string;
  badgeType: string;
  availability: string;
  experienceLevel: string;
}

const defaultFilters: MentorFilterState = {
  search: "",
  industry: "",
  company: "",
  school: "",
  badgeType: "",
  availability: "",
  experienceLevel: "",
};

interface MentorFiltersProps {
  filters: MentorFilterState;
  onFiltersChange: (filters: MentorFilterState) => void;
}

const industries = [
  "Technology",
  "Investment Banking",
  "Consulting",
  "Marketing",
  "Healthcare",
  "Education",
];

const companies = [
  "Google",
  "Meta",
  "Goldman Sachs",
  "McKinsey & Company",
  "Amazon",
  "BloomHQ",
  "Salesforce",
];

const badgeTypes = [
  "Tech Mentor",
  "Finance Mentor",
  "Consulting Mentor",
  "Founder Mentor",
  "Career Transition Mentor",
  "Return-to-Work Mentor",
];

const availabilities = [
  { value: "available", label: "Available Now" },
  { value: "unavailable", label: "Unavailable" },
];

const experienceLevels = [
  { value: "mid", label: "Mid-level (3-5 years)" },
  { value: "senior", label: "Senior (5-10 years)" },
  { value: "executive", label: "Executive (10+ years)" },
];

export function MentorFilters({ filters, onFiltersChange }: MentorFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = <K extends keyof MentorFilterState>(
    key: K,
    value: MentorFilterState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilter = (key: keyof MentorFilterState) => {
    onFiltersChange({ ...filters, [key]: defaultFilters[key] });
  };

  const clearAll = () => {
    onFiltersChange(defaultFilters);
  };

  const activeFilters: { key: keyof MentorFilterState; label: string }[] = [];
  if (filters.industry) activeFilters.push({ key: "industry", label: filters.industry });
  if (filters.company) activeFilters.push({ key: "company", label: filters.company });
  if (filters.school) activeFilters.push({ key: "school", label: filters.school });
  if (filters.badgeType) activeFilters.push({ key: "badgeType", label: filters.badgeType });
  if (filters.availability) {
    const av = availabilities.find((a) => a.value === filters.availability);
    activeFilters.push({ key: "availability", label: av?.label || filters.availability });
  }
  if (filters.experienceLevel) {
    const el = experienceLevels.find((e) => e.value === filters.experienceLevel);
    activeFilters.push({ key: "experienceLevel", label: el?.label || filters.experienceLevel });
  }

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search mentors by name, company, or skills..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10"
          />
        </div>
        <Button
          variant={showAdvanced ? "default" : "secondary"}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
        </Button>
      </div>

      {/* Filter dropdowns */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 bg-surface rounded-lg border border-border">
          <div>
            <Label className="text-xs text-text-muted mb-1.5 block">Industry</Label>
            <Select
              value={filters.industry}
              onValueChange={(v) => updateFilter("industry", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Industries" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((ind) => (
                  <SelectItem key={ind} value={ind}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-text-muted mb-1.5 block">Company</Label>
            <Select
              value={filters.company}
              onValueChange={(v) => updateFilter("company", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Companies" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((comp) => (
                  <SelectItem key={comp} value={comp}>
                    {comp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-text-muted mb-1.5 block">Badge Type</Label>
            <Select
              value={filters.badgeType}
              onValueChange={(v) => updateFilter("badgeType", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Badges" />
              </SelectTrigger>
              <SelectContent>
                {badgeTypes.map((bt) => (
                  <SelectItem key={bt} value={bt}>
                    {bt}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-text-muted mb-1.5 block">Availability</Label>
            <Select
              value={filters.availability}
              onValueChange={(v) => updateFilter("availability", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                {availabilities.map((av) => (
                  <SelectItem key={av.value} value={av.value}>
                    {av.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-text-muted mb-1.5 block">Experience Level</Label>
            <Select
              value={filters.experienceLevel}
              onValueChange={(v) => updateFilter("experienceLevel", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                {experienceLevels.map((el) => (
                  <SelectItem key={el.value} value={el.value}>
                    {el.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-text-muted mb-1.5 block">School</Label>
            <Input
              placeholder="Filter by school..."
              value={filters.school}
              onChange={(e) => updateFilter("school", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-text-muted">Active filters:</span>
          {activeFilters.map(({ key, label }) => (
            <Badge
              key={key}
              variant="accent"
              className="flex items-center gap-1 cursor-pointer hover:bg-accent-light/80"
              onClick={() => clearFilter(key)}
            >
              {label}
              <X className="h-3 w-3" />
            </Badge>
          ))}
          <button
            onClick={clearAll}
            className="text-xs text-text-muted hover:text-error transition-colors underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
