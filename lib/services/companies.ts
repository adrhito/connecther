import type { Company, SalaryEntry, PromotionTimeline } from "@/lib/types";
import type { CompanyReview } from "@/lib/types";

export async function getCompanies(params?: Record<string, string>): Promise<Company[]> {
  const query = params ? "?" + new URLSearchParams(params).toString() : "";
  const res = await fetch(`/api/companies${query}`);
  const data = await res.json();
  return data.companies || [];
}

export async function getCompanyById(id: string): Promise<{
  company: Company;
  reviews: CompanyReview[];
  salaryEntries: SalaryEntry[];
  promotionTimelines: PromotionTimeline[];
} | null> {
  const res = await fetch(`/api/companies/${id}`);
  if (!res.ok) return null;
  return res.json();
}
