import type { CompanyReview } from "@/lib/types";

export async function getReviews(companyId?: string): Promise<CompanyReview[]> {
  const query = companyId ? `?company_id=${companyId}` : "";
  const res = await fetch(`/api/reviews${query}`);
  const data = await res.json();
  return data.reviews || [];
}

export async function createReview(review: Partial<CompanyReview>): Promise<{ review?: CompanyReview; error?: string }> {
  const res = await fetch("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(review),
  });
  return res.json();
}
