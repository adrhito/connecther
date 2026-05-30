"use client";

import { useState, useEffect } from "react";
import { ArrowLeftRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";
import { getInitials, formatSalary } from "@/lib/utils/format";
import { getLogoColor } from "./CompanyCard";
import { REVIEW_CATEGORIES } from "@/lib/constants";
import type { Company, SalaryEntry } from "@/lib/types";

interface CompanyWithDetails extends Company {
  avgRating?: number;
  reviewCount?: number;
  avgRatings?: Record<string, number>;
  salaries?: SalaryEntry[];
}

interface CompanyComparisonProps {
  companies: CompanyWithDetails[];
}

function CompanySelector({
  companies,
  value,
  onChange,
  label,
}: {
  companies: CompanyWithDetails[];
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-text-secondary">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a company" />
        </SelectTrigger>
        <SelectContent>
          {companies.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              {company.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ComparisonRow({
  label,
  values,
  type = "rating",
}: {
  label: string;
  values: (number | string | undefined)[];
  type?: "rating" | "text";
}) {
  const numericValues =
    type === "rating"
      ? values.map((v) => (typeof v === "number" ? v : 0))
      : [];

  const maxValue =
    type === "rating" ? Math.max(...numericValues.filter((v) => v > 0)) : 0;

  return (
    <div className="flex items-center border-b border-border last:border-0 py-3">
      <div className="w-40 shrink-0 text-sm text-text-secondary truncate pr-2">
        {label}
      </div>
      <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4">
        {values.map((value, i) => {
          if (value === undefined) {
            return (
              <div key={i} className="text-sm text-text-muted text-center">
                -
              </div>
            );
          }

          if (type === "rating" && typeof value === "number") {
            const isMax = value === maxValue && maxValue > 0 && values.filter(v => v === maxValue).length === 1;
            return (
              <div key={i} className="flex items-center gap-2 justify-center">
                <div className="flex-1 h-2.5 bg-surface-elevated rounded-full max-w-[100px]">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      value >= 4
                        ? "bg-success"
                        : value >= 3
                        ? "bg-warning"
                        : "bg-error"
                    )}
                    style={{ width: `${(value / 5) * 100}%` }}
                  />
                </div>
                <span
                  className={cn(
                    "text-sm font-medium w-8 text-right",
                    isMax ? "text-success font-bold" : "text-text-primary"
                  )}
                >
                  {value > 0 ? value.toFixed(1) : "N/A"}
                </span>
              </div>
            );
          }

          return (
            <div key={i} className="text-sm text-text-primary text-center">
              {value}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CompanyComparison({ companies }: CompanyComparisonProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([
    companies[0]?.id || "",
    companies[1]?.id || "",
  ]);
  const [companyDetails, setCompanyDetails] = useState<
    (CompanyWithDetails | null)[]
  >([null, null]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      const details = await Promise.all(
        selectedIds.map(async (id) => {
          if (!id) return null;
          try {
            const res = await fetch(`/api/companies/${id}`);
            const data = await res.json();
            return {
              ...data.company,
              avgRatings: data.avgRatings,
              salaries: data.salaries,
              reviewCount: data.reviewCount,
              avgRating: data.avgRatings?.overall_rating || 0,
            } as CompanyWithDetails;
          } catch {
            return null;
          }
        })
      );
      setCompanyDetails(details);
      setLoading(false);
    }
    fetchDetails();
  }, [selectedIds]);

  const handleSelect = (index: number, value: string) => {
    setSelectedIds((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const ratingCategories = REVIEW_CATEGORIES;

  return (
    <div className="space-y-6">
      {/* Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CompanySelector
          companies={companies}
          value={selectedIds[0]}
          onChange={(v) => handleSelect(0, v)}
          label="Company 1"
        />
        <CompanySelector
          companies={companies}
          value={selectedIds[1]}
          onChange={(v) => handleSelect(1, v)}
          label="Company 2"
        />
      </div>

      {loading ? (
        <div className="text-center py-12 text-text-muted">
          Loading comparison...
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-lg p-6">
          {/* Company headers */}
          <div className="flex items-center border-b border-border pb-4 mb-4">
            <div className="w-40 shrink-0" />
            <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 gap-4">
              {companyDetails.map((company, i) =>
                company ? (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm",
                        getLogoColor(company.name)
                      )}
                    >
                      {getInitials(company.name)}
                    </div>
                    <span className="text-sm font-semibold text-text-primary text-center">
                      {company.name}
                    </span>
                    <span className="text-xs text-text-muted">
                      {company.reviewCount || 0} reviews
                    </span>
                  </div>
                ) : (
                  <div
                    key={i}
                    className="text-sm text-text-muted text-center py-4"
                  >
                    Select a company
                  </div>
                )
              )}
            </div>
          </div>

          {/* Ratings comparison */}
          <h4 className="text-sm font-medium text-text-primary mb-2 flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4" />
            Ratings Comparison
          </h4>

          <div className="mb-6">
            {ratingCategories.map((cat) => (
              <ComparisonRow
                key={cat.key}
                label={cat.label}
                values={companyDetails.map(
                  (c) => c?.avgRatings?.[cat.key] || 0
                )}
                type="rating"
              />
            ))}
          </div>

          {/* Company info comparison */}
          <h4 className="text-sm font-medium text-text-primary mb-2 mt-6">
            Company Details
          </h4>
          <ComparisonRow
            label="Size"
            values={companyDetails.map((c) => c?.size || "-")}
            type="text"
          />
          <ComparisonRow
            label="Headquarters"
            values={companyDetails.map((c) => c?.headquarters || "-")}
            type="text"
          />
          <ComparisonRow
            label="Founded"
            values={companyDetails.map((c) =>
              c?.founded_year ? String(c.founded_year) : "-"
            )}
            type="text"
          />
          <ComparisonRow
            label="Parental Leave"
            values={companyDetails.map(
              (c) => c?.parental_leave_policy || "-"
            )}
            type="text"
          />

          {/* Salary ranges */}
          <h4 className="text-sm font-medium text-text-primary mb-2 mt-6">
            Salary Ranges
          </h4>
          {companyDetails.some((c) => c?.salaries && c.salaries.length > 0) ? (
            companyDetails
              .flatMap((c) =>
                (c?.salaries || []).map((s) => s.role_title)
              )
              .filter((v, i, a) => a.indexOf(v) === i)
              .map((role) => (
                <ComparisonRow
                  key={role}
                  label={role}
                  values={companyDetails.map((c) => {
                    const entry = c?.salaries?.find(
                      (s) => s.role_title === role
                    );
                    return entry
                      ? formatSalary(entry.salary_min, entry.salary_max)
                      : "-";
                  })}
                  type="text"
                />
              ))
          ) : (
            <p className="text-sm text-text-muted py-2">
              No salary data available for comparison.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
