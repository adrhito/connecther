"use client";

import { FilterPanel } from "@/components/shared/FilterPanel";

interface NetworkFiltersProps {
  values: Record<string, string[]>;
  onChange: (key: string, values: string[]) => void;
  onClear: () => void;
}

const filterGroups = [
  {
    label: "Industry",
    key: "industry",
    options: [
      { label: "Technology", value: "Technology" },
      { label: "Investment Banking", value: "Investment Banking" },
      { label: "Consulting", value: "Consulting" },
      { label: "Marketing", value: "Marketing" },
      { label: "Healthcare", value: "Healthcare" },
      { label: "Education", value: "Education" },
    ],
    multiple: true,
  },
  {
    label: "School",
    key: "school",
    options: [
      { label: "Stanford University", value: "Stanford University" },
      { label: "Harvard University", value: "Harvard University" },
      { label: "MIT", value: "MIT" },
      { label: "Wharton", value: "Wharton" },
    ],
  },
  {
    label: "Company",
    key: "company",
    options: [
      { label: "Google", value: "Google" },
      { label: "Meta", value: "Meta" },
      { label: "Amazon", value: "Amazon" },
      { label: "Goldman Sachs", value: "Goldman Sachs" },
      { label: "McKinsey & Company", value: "McKinsey & Company" },
      { label: "Salesforce", value: "Salesforce" },
    ],
  },
  {
    label: "Location",
    key: "location",
    options: [
      { label: "San Francisco, CA", value: "San Francisco" },
      { label: "New York, NY", value: "New York" },
      { label: "Palo Alto, CA", value: "Palo Alto" },
      { label: "Chicago, IL", value: "Chicago" },
      { label: "Seattle, WA", value: "Seattle" },
      { label: "Remote", value: "Remote" },
    ],
  },
  {
    label: "Career Goal",
    key: "career_goal",
    options: [
      { label: "Engineering Manager", value: "Engineering Manager" },
      { label: "Product Manager", value: "Product Manager" },
      { label: "Startup Founder", value: "Startup Founder" },
      { label: "VP of Engineering", value: "VP of Engineering" },
      { label: "Managing Director", value: "Managing Director" },
      { label: "CMO", value: "CMO" },
    ],
  },
];

export function NetworkFilters({ values, onChange, onClear }: NetworkFiltersProps) {
  return (
    <FilterPanel
      groups={filterGroups}
      values={values}
      onChange={onChange}
      onClear={onClear}
    />
  );
}
