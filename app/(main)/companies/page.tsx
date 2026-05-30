"use client";

import { useState, useEffect, useCallback } from "react";
import { Building2, Sparkles, Filter } from "lucide-react";
import { CompanyCard } from "@/components/companies/CompanyCard";
import { SearchBar } from "@/components/shared/SearchBar";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INDUSTRIES } from "@/lib/constants";
import type { Company } from "@/lib/types";
import Link from "next/link";

interface CompanyWithRating extends Company {
  avgRating?: number;
  reviewCount?: number;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyWithRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchCompanies = useCallback(async () => {
    try {
      const res = await fetch("/api/companies");
      const data = await res.json();
      setCompanies(data.companies);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-side data fetching
    fetchCompanies();
  }, [fetchCompanies]);

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      !search ||
      company.name.toLowerCase().includes(search.toLowerCase()) ||
      company.industry?.toLowerCase().includes(search.toLowerCase()) ||
      company.headquarters?.toLowerCase().includes(search.toLowerCase());

    const matchesIndustry =
      !industry || company.industry?.toLowerCase() === industry.toLowerCase();

    const matchesSize = !size || company.size === size;

    return matchesSearch && matchesIndustry && matchesSize;
  });

  const featuredCompanies = filteredCompanies.filter((c) => c.is_featured);
  const allCompanies = filteredCompanies;

  const clearFilters = () => {
    setSearch("");
    setIndustry("");
    setSize("");
  };

  const hasActiveFilters = search || industry || size;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface-elevated rounded w-48" />
          <div className="h-10 bg-surface-elevated rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-surface-elevated rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            Companies
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Explore transparent company reviews and ratings from women in the
            workforce
          </p>
        </div>
        <Button variant="secondary" asChild>
          <Link href="/companies/compare">Compare Companies</Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-3 mb-8">
        <div className="flex gap-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search companies by name, industry, or location..."
            className="flex-1"
          />
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className="shrink-0"
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-primary" />
            )}
          </Button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-3 bg-surface-elevated rounded-lg p-4">
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {INDUSTRIES.map((ind) => (
                  <SelectItem key={ind} value={ind.toLowerCase()}>
                    {ind}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={size} onValueChange={setSize}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Company Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Size</SelectItem>
                <SelectItem value="1-10">1-10</SelectItem>
                <SelectItem value="11-50">11-50</SelectItem>
                <SelectItem value="51-200">51-200</SelectItem>
                <SelectItem value="201-1000">201-1000</SelectItem>
                <SelectItem value="1001-5000">1001-5000</SelectItem>
                <SelectItem value="10,000+">10,000+</SelectItem>
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Featured Companies */}
      {featuredCompanies.length > 0 && !hasActiveFilters && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-warning" />
            <h2 className="text-lg font-heading font-semibold text-text-primary">
              Featured Companies
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </div>
      )}

      {/* All Companies */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-heading font-semibold text-text-primary">
            {hasActiveFilters ? "Results" : "All Companies"}
          </h2>
          <Badge variant="outline">{allCompanies.length} companies</Badge>
        </div>

        {allCompanies.length === 0 ? (
          <EmptyState
            icon={<Building2 className="w-12 h-12" />}
            title="No companies found"
            description="Try adjusting your search or filters to find what you're looking for."
            action={
              hasActiveFilters ? (
                <Button variant="secondary" onClick={clearFilters}>
                  Clear Filters
                </Button>
              ) : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
