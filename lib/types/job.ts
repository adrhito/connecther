export type EmploymentType = "full_time" | "part_time" | "contract" | "internship" | "fellowship" | "returnship";
export type RemoteType = "onsite" | "remote" | "hybrid";
export type ApplicationStatus = "saved" | "applied" | "interviewing" | "offer" | "rejected" | "withdrawn";

export interface Job {
  id: string;
  company_id: string;
  posted_by?: string;
  title: string;
  description: string;
  requirements?: string;
  location: string;
  remote_type: RemoteType;
  employment_type: EmploymentType;
  industry?: string;
  salary_min?: number;
  salary_max?: number;
  show_salary: boolean;
  is_returnship: boolean;
  is_internship: boolean;
  sponsorship_available: boolean;
  women_friendly_benefits?: string[];
  external_url?: string;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

export interface JobApplication {
  id: string;
  user_id: string;
  job_id: string;
  status: ApplicationStatus;
  notes?: string;
  applied_at: string;
  updated_at: string;
}

export interface RecruitingTimeline {
  id: string;
  industry: string;
  role_type: string;
  application_open: string;
  application_close: string;
  interviews_start: string;
  offers_sent: string;
  tips: string[];
}
