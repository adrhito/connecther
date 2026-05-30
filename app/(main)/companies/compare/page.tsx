"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowLeftRight } from "lucide-react";
import Link from "next/link";
import { CompanyComparison } from "@/components/companies/CompanyComparison";
import type { Company } from "@/lib/types";

interface CompanyWithRating extends Company {
  avgRating?: number;
  reviewCount?: number;
}

export default function CompareCompaniesPage() {
  const [companies, setCompanies] = useState<CompanyWithRating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await fetch("/api/companies");
        const data = await res.json();
        setCompanies(data.companies);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface-elevated rounded w-64" />
          <div className="h-10 bg-surface-elevated rounded" />
          <div className="h-96 bg-surface-elevated rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back navigation */}
      <Link
        href="/companies"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary mb-4 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Companies
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <ArrowLeftRight className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-heading font-bold text-text-primary">
            Compare Companies
          </h1>
        </div>
        <p className="text-sm text-text-secondary">
          Compare ratings, salaries, and benefits side by side to make informed
          career decisions.
        </p>
      </div>

      {/* Comparison Component */}
      {companies.length >= 2 ? (
        <CompanyComparison companies={companies} />
      ) : (
        <div className="text-center py-12 text-text-muted">
          Not enough companies to compare.
        </div>
      )}
    </div>
  );
}
