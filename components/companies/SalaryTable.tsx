"use client";

import { DollarSign, AlertCircle } from "lucide-react";
import { formatSalary } from "@/lib/utils/format";
import type { SalaryEntry } from "@/lib/types";

interface SalaryTableProps {
  salaries: SalaryEntry[];
}

export function SalaryTable({ salaries }: SalaryTableProps) {
  const sorted = [...salaries].sort((a, b) =>
    a.role_title.localeCompare(b.role_title)
  );

  if (sorted.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6">
        <h3 className="font-heading font-semibold text-text-primary mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Salary Data
        </h3>
        <p className="text-sm text-text-muted text-center py-6">
          No salary data available yet. Be the first to share!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h3 className="font-heading font-semibold text-text-primary mb-4 flex items-center gap-2">
        <DollarSign className="w-5 h-5" />
        Salary Data
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 font-medium text-text-secondary">
                Role
              </th>
              <th className="text-left py-3 px-2 font-medium text-text-secondary">
                Salary Range
              </th>
              <th className="text-left py-3 px-2 font-medium text-text-secondary hidden sm:table-cell">
                Location
              </th>
              <th className="text-left py-3 px-2 font-medium text-text-secondary hidden md:table-cell">
                Experience Level
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((entry) => (
              <tr
                key={entry.id}
                className="border-b border-border last:border-0 hover:bg-surface-elevated/50"
              >
                <td className="py-3 px-2 text-text-primary font-medium">
                  {entry.role_title}
                </td>
                <td className="py-3 px-2 text-text-primary">
                  {formatSalary(entry.salary_min, entry.salary_max)}
                  {entry.currency !== "USD" && (
                    <span className="text-text-muted ml-1">
                      ({entry.currency})
                    </span>
                  )}
                </td>
                <td className="py-3 px-2 text-text-secondary hidden sm:table-cell">
                  {entry.location || "Not specified"}
                </td>
                <td className="py-3 px-2 text-text-secondary hidden md:table-cell">
                  {entry.experience_level || "Not specified"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 pt-4 border-t border-border flex items-start gap-2 text-xs text-text-muted">
        <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        <p>
          Salary data is self-reported by community members and may not reflect
          exact compensation. Figures include base salary and may not include
          bonuses, equity, or other compensation. Use as a directional guide
          only.
        </p>
      </div>
    </div>
  );
}
