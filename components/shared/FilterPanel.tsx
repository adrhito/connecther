"use client";

import { cn } from "@/lib/utils/cn";
import { ChevronDown, X } from "lucide-react";
import { useState } from "react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterGroup {
  label: string;
  key: string;
  options: FilterOption[];
  multiple?: boolean;
}

interface FilterPanelProps {
  groups: FilterGroup[];
  values: Record<string, string[]>;
  onChange: (key: string, values: string[]) => void;
  onClear: () => void;
  className?: string;
}

export function FilterPanel({ groups, values, onChange, onClear, className }: FilterPanelProps) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const activeCount = Object.values(values).flat().length;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-text-primary">Filters</span>
        {activeCount > 0 && (
          <button onClick={onClear} className="text-xs text-primary hover:underline">
            Clear all ({activeCount})
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {groups.map((group) => (
          <div key={group.key} className="relative">
            <button
              onClick={() => setOpenGroup(openGroup === group.key ? null : group.key)}
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm transition-colors",
                values[group.key]?.length
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-text-secondary hover:border-primary"
              )}
            >
              {group.label}
              {values[group.key]?.length > 0 && (
                <span className="bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {values[group.key].length}
                </span>
              )}
              <ChevronDown className="w-3 h-3" />
            </button>
            {openGroup === group.key && (
              <div className="absolute top-full mt-1 left-0 z-20 bg-surface border border-border rounded-lg shadow-lg p-2 min-w-[180px]">
                {group.options.map((opt) => {
                  const selected = values[group.key]?.includes(opt.value);
                  return (
                    <button
                      key={opt.value}
                      onClick={() => {
                        const current = values[group.key] || [];
                        if (group.multiple) {
                          onChange(
                            group.key,
                            selected ? current.filter((v) => v !== opt.value) : [...current, opt.value]
                          );
                        } else {
                          onChange(group.key, selected ? [] : [opt.value]);
                          setOpenGroup(null);
                        }
                      }}
                      className={cn(
                        "w-full text-left px-3 py-1.5 rounded text-sm transition-colors",
                        selected ? "bg-primary/10 text-primary" : "hover:bg-surface-elevated text-text-primary"
                      )}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-1">
          {Object.entries(values).flatMap(([key, vals]) =>
            vals.map((v) => (
              <span
                key={`${key}-${v}`}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs"
              >
                {v}
                <button
                  onClick={() => onChange(key, vals.filter((val) => val !== v))}
                  aria-label={`Remove ${v} filter`}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>
      )}
    </div>
  );
}
