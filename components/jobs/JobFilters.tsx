"use client";

import { useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface JobFilterState {
  search: string;
  industry: string;
  location: string;
  remoteType: string;
  employmentType: string;
  salaryRange: string;
  returnshipsOnly: boolean;
  internshipsOnly: boolean;
  sponsorshipOnly: boolean;
  payTransparentOnly: boolean;
}

const defaultFilters: JobFilterState = {
  search: "",
  industry: "",
  location: "",
  remoteType: "",
  employmentType: "",
  salaryRange: "",
  returnshipsOnly: false,
  internshipsOnly: false,
  sponsorshipOnly: false,
  payTransparentOnly: false,
};

interface JobFiltersProps {
  filters: JobFilterState;
  onFiltersChange: (filters: JobFilterState) => void;
}

const industries = [
  "Technology",
  "Investment Banking",
  "Consulting",
  "Marketing",
  "Healthcare",
  "Education",
];

const locations = [
  "San Francisco, CA",
  "New York, NY",
  "Seattle, WA",
  "Menlo Park, CA",
  "Mountain View, CA",
  "Chicago, IL",
  "Remote",
];

const remoteTypes = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
];

const employmentTypes = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "fellowship", label: "Fellowship" },
  { value: "returnship", label: "Returnship" },
];

const salaryRanges = [
  { value: "0-50", label: "Under $50K" },
  { value: "50-100", label: "$50K - $100K" },
  { value: "100-150", label: "$100K - $150K" },
  { value: "150-200", label: "$150K - $200K" },
  { value: "200+", label: "$200K+" },
];

export function JobFilters({ filters, onFiltersChange }: JobFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = <K extends keyof JobFilterState>(
    key: K,
    value: JobFilterState[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilter = (key: keyof JobFilterState) => {
    onFiltersChange({ ...filters, [key]: defaultFilters[key] });
  };

  const clearAll = () => {
    onFiltersChange(defaultFilters);
  };

  const activeFilters: { key: keyof JobFilterState; label: string }[] = [];
  if (filters.industry) activeFilters.push({ key: "industry", label: filters.industry });
  if (filters.location) activeFilters.push({ key: "location", label: filters.location });
  if (filters.remoteType) {
    const rt = remoteTypes.find((r) => r.value === filters.remoteType);
    activeFilters.push({ key: "remoteType", label: rt?.label || filters.remoteType });
  }
  if (filters.employmentType) {
    const et = employmentTypes.find((e) => e.value === filters.employmentType);
    activeFilters.push({ key: "employmentType", label: et?.label || filters.employmentType });
  }
  if (filters.salaryRange) {
    const sr = salaryRanges.find((s) => s.value === filters.salaryRange);
    activeFilters.push({ key: "salaryRange", label: sr?.label || filters.salaryRange });
  }
  if (filters.returnshipsOnly) activeFilters.push({ key: "returnshipsOnly", label: "Returnships" });
  if (filters.internshipsOnly) activeFilters.push({ key: "internshipsOnly", label: "Internships" });
  if (filters.sponsorshipOnly) activeFilters.push({ key: "sponsorshipOnly", label: "Sponsorship" });
  if (filters.payTransparentOnly) activeFilters.push({ key: "payTransparentOnly", label: "Pay Transparent" });

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <Input
            placeholder="Search jobs by title, company, or keyword..."
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
            <Label className="text-xs text-text-muted mb-1.5 block">Location</Label>
            <Select
              value={filters.location}
              onValueChange={(v) => updateFilter("location", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-text-muted mb-1.5 block">Remote Type</Label>
            <Select
              value={filters.remoteType}
              onValueChange={(v) => updateFilter("remoteType", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                {remoteTypes.map((rt) => (
                  <SelectItem key={rt.value} value={rt.value}>
                    {rt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-text-muted mb-1.5 block">Employment Type</Label>
            <Select
              value={filters.employmentType}
              onValueChange={(v) => updateFilter("employmentType", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Employment" />
              </SelectTrigger>
              <SelectContent>
                {employmentTypes.map((et) => (
                  <SelectItem key={et.value} value={et.value}>
                    {et.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs text-text-muted mb-1.5 block">Salary Range</Label>
            <Select
              value={filters.salaryRange}
              onValueChange={(v) => updateFilter("salaryRange", v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any Salary" />
              </SelectTrigger>
              <SelectContent>
                {salaryRanges.map((sr) => (
                  <SelectItem key={sr.value} value={sr.value}>
                    {sr.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2.5 sm:col-span-2 lg:col-span-1">
            <Label className="text-xs text-text-muted block">Show Only</Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="returnships"
                  checked={filters.returnshipsOnly}
                  onCheckedChange={(checked) =>
                    updateFilter("returnshipsOnly", checked === true)
                  }
                />
                <Label htmlFor="returnships" className="text-sm font-normal cursor-pointer">
                  Returnships
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="internships"
                  checked={filters.internshipsOnly}
                  onCheckedChange={(checked) =>
                    updateFilter("internshipsOnly", checked === true)
                  }
                />
                <Label htmlFor="internships" className="text-sm font-normal cursor-pointer">
                  Internships
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="sponsorship"
                  checked={filters.sponsorshipOnly}
                  onCheckedChange={(checked) =>
                    updateFilter("sponsorshipOnly", checked === true)
                  }
                />
                <Label htmlFor="sponsorship" className="text-sm font-normal cursor-pointer">
                  Sponsorship Available
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="payTransparent"
                  checked={filters.payTransparentOnly}
                  onCheckedChange={(checked) =>
                    updateFilter("payTransparentOnly", checked === true)
                  }
                />
                <Label htmlFor="payTransparent" className="text-sm font-normal cursor-pointer">
                  Pay Transparent
                </Label>
              </div>
            </div>
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
