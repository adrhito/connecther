"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/shared/Badge";
import { SearchBar } from "@/components/shared/SearchBar";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Briefcase, Star, StarOff, Power, PowerOff } from "lucide-react";
import { formatSalary, formatDate } from "@/lib/utils/format";

interface JobItem {
  id: string;
  title: string;
  company_name: string;
  location: string;
  remote_type: string;
  employment_type: string;
  salary_min?: number;
  salary_max?: number;
  show_salary: boolean;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : data.jobs || []);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(
    (j) =>
      !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company_name?.toLowerCase().includes(search.toLowerCase()) ||
      j.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleActive = (id: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, is_active: !j.is_active } : j))
    );
  };

  const handleToggleFeatured = (id: string) => {
    setJobs((prev) =>
      prev.map((j) =>
        j.id === id ? { ...j, is_featured: !j.is_featured } : j
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
          Job Management
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage job listings, activation, and featured status
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              Jobs ({filteredJobs.length})
            </CardTitle>
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search jobs..."
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
                    Job
                  </th>
                  <th className="text-left p-3 font-medium text-text-secondary">
                    Company
                  </th>
                  <th className="text-left p-3 font-medium text-text-secondary">
                    Location
                  </th>
                  <th className="text-left p-3 font-medium text-text-secondary">
                    Salary
                  </th>
                  <th className="text-left p-3 font-medium text-text-secondary">
                    Type
                  </th>
                  <th className="text-left p-3 font-medium text-text-secondary">
                    Status
                  </th>
                  <th className="text-left p-3 font-medium text-text-secondary">
                    Posted
                  </th>
                  <th className="text-right p-3 font-medium text-text-secondary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b border-border hover:bg-surface-elevated/50 transition-colors"
                  >
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Briefcase className="w-4 h-4 text-primary" />
                        </div>
                        <span className="font-medium text-text-primary truncate max-w-[200px]">
                          {job.title}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-text-secondary">
                      {job.company_name}
                    </td>
                    <td className="p-3 text-text-secondary whitespace-nowrap">
                      {job.location}
                    </td>
                    <td className="p-3 text-text-secondary whitespace-nowrap">
                      {job.show_salary
                        ? formatSalary(job.salary_min, job.salary_max)
                        : "Hidden"}
                    </td>
                    <td className="p-3">
                      <Badge variant="outline">{job.employment_type}</Badge>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        {job.is_active ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="destructive">Inactive</Badge>
                        )}
                        {job.is_featured && (
                          <Badge variant="accent">Featured</Badge>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-text-muted whitespace-nowrap">
                      {formatDate(job.created_at)}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleActive(job.id)}
                          title={job.is_active ? "Deactivate" : "Activate"}
                        >
                          {job.is_active ? (
                            <PowerOff className="w-4 h-4 text-error" />
                          ) : (
                            <Power className="w-4 h-4 text-success" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleFeatured(job.id)}
                          title={
                            job.is_featured
                              ? "Remove from featured"
                              : "Feature"
                          }
                        >
                          {job.is_featured ? (
                            <StarOff className="w-4 h-4 text-accent-warm" />
                          ) : (
                            <Star className="w-4 h-4" />
                          )}
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
