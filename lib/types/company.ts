export interface Company {
  id: string;
  name: string;
  industry?: string;
  description?: string;
  headquarters?: string;
  size?: string;
  founded_year?: number;
  logo_url?: string;
  website_url?: string;
  diversity_stats?: DiversityStats;
  parental_leave_policy?: string;
  is_featured: boolean;
  created_at: string;
}

export interface DiversityStats {
  women_leadership_pct?: number;
  women_workforce_pct?: number;
  women_board_pct?: number;
  women_tech_pct?: number;
}

export interface SalaryEntry {
  id: string;
  company_id: string;
  author_id?: string;
  role_title: string;
  salary_min?: number;
  salary_max?: number;
  currency: string;
  location?: string;
  experience_level?: string;
  created_at: string;
}

export interface PromotionTimeline {
  id: string;
  company_id: string;
  author_id?: string;
  description: string;
  from_role?: string;
  to_role?: string;
  years_taken?: string;
  created_at: string;
}
