import type { Job, JobApplication } from "@/lib/types";

export async function getJobs(params?: Record<string, string>): Promise<Job[]> {
  const query = params ? "?" + new URLSearchParams(params).toString() : "";
  const res = await fetch(`/api/jobs${query}`);
  const data = await res.json();
  return data.jobs || [];
}

export async function getJobById(id: string): Promise<Job | null> {
  const res = await fetch(`/api/jobs/${id}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.job || null;
}

export async function applyToJob(jobId: string): Promise<void> {
  await fetch(`/api/jobs/${jobId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "apply" }),
  });
}

export async function getApplications(): Promise<JobApplication[]> {
  const res = await fetch("/api/jobs?tracker=true");
  const data = await res.json();
  return data.applications || [];
}
