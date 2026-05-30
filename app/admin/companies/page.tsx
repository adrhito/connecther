"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/shared/Badge";
import { SearchBar } from "@/components/shared/SearchBar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Building2, Star, StarOff, Edit, ExternalLink } from "lucide-react";

interface CompanyItem {
  id: string;
  name: string;
  industry?: string;
  headquarters?: string;
  size?: string;
  is_featured: boolean;
  avgRating: number;
  reviewCount: number;
}

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await fetch("/api/companies");
        const data = await res.json();
        setCompanies(data.companies || []);
      } catch (err) {
        console.error("Failed to fetch companies:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry?.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleFeatured = (id: string) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, is_featured: !c.is_featured } : c
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-text-primary">
          Company Management
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage company profiles and featured status
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              Companies ({filteredCompanies.length})
            </CardTitle>
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search companies..."
              className="max-w-xs"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-elevated">
                  <th className="text-left p-3 font-medium text-text-secondary">
                    Company
                  </th>
                  <th className="text-left p-3 font-medium text-text-secondary">
                    Industry
                  </th>
                  <th className="text-left p-3 font-medium text-text-secondary">
                    Location
                  </th>
                  <th className="text-left p-3 font-medium text-text-secondary">
                    Size
                  </th>
                  <th className="text-left p-3 font-medium text-text-secondary">
                    Rating
                  </th>
                  <th className="text-left p-3 font-medium text-text-secondary">
                    Status
                  </th>
                  <th className="text-right p-3 font-medium text-text-secondary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCompanies.map((company) => (
                  <tr
                    key={company.id}
                    className="border-b border-border hover:bg-surface-elevated/50 transition-colors"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium text-text-primary">
                          {company.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-text-secondary">
                      {company.industry || "-"}
                    </td>
                    <td className="p-3 text-text-secondary">
                      {company.headquarters || "-"}
                    </td>
                    <td className="p-3 text-text-secondary">
                      {company.size || "-"}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-accent-warm fill-accent-warm" />
                        <span className="text-text-primary font-medium">
                          {company.avgRating > 0
                            ? company.avgRating.toFixed(1)
                            : "N/A"}
                        </span>
                        <span className="text-text-muted text-xs">
                          ({company.reviewCount})
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      {company.is_featured ? (
                        <Badge variant="success">Featured</Badge>
                      ) : (
                        <Badge variant="outline">Regular</Badge>
                      )}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleFeatured(company.id)}
                          title={
                            company.is_featured
                              ? "Remove from featured"
                              : "Add to featured"
                          }
                        >
                          {company.is_featured ? (
                            <StarOff className="w-4 h-4 text-accent-warm" />
                          ) : (
                            <Star className="w-4 h-4" />
                          )}
                        </Button>
                        <Button size="sm" variant="ghost" title="View">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
