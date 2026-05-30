export type ModerationStatus = "pending" | "approved" | "rejected" | "flagged";

export interface CompanyReview {
  id: string;
  company_id: string;
  author_id?: string;
  is_anonymous: boolean;
  overall_rating: number;
  pay_fairness_rating: number;
  mentorship_rating: number;
  promotion_fairness_rating: number;
  parental_leave_rating: number;
  flexibility_rating: number;
  safety_culture_rating: number;
  reporting_culture_rating: number;
  leadership_diversity_rating: number;
  work_life_balance_rating: number;
  review_text?: string;
  pros?: string;
  cons?: string;
  role_at_company?: string;
  years_at_company?: string;
  moderation_status: ModerationStatus;
  company_response?: string;
  is_flagged: boolean;
  created_at: string;
}
