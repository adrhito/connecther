export type UserRole = "student" | "professional" | "mentor" | "founder" | "recruiter" | "company_admin" | "admin";

export interface User {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: UserRole;
  headline?: string;
  about?: string;
  location?: string;
  school?: string;
  company?: string;
  industry?: string;
  career_goals?: string[];
  skills?: string[];
  interests?: string[];
  profile_photo_url?: string;
  banner_photo_url?: string;
  resume_url?: string;
  portfolio_url?: string;
  is_mentor: boolean;
  mentor_verified: boolean;
  mentor_open: boolean;
  mentor_max_requests: number;
  mentor_badges?: string[];
  mentor_availability?: string;
  is_active: boolean;
  privacy_settings: PrivacySettings;
  created_at: string;
  updated_at: string;
}

export interface PrivacySettings {
  profile_visible?: boolean;
  show_salary?: boolean;
  show_job_search?: boolean;
  show_resume?: boolean;
  who_can_message?: "anyone" | "connections" | "connections_mentors";
  hide_from_recruiters?: boolean;
}

export interface Experience {
  id: string;
  user_id: string;
  title: string;
  company: string;
  location?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description?: string;
}

export interface Education {
  id: string;
  user_id: string;
  school: string;
  degree?: string;
  field_of_study?: string;
  start_year?: number;
  end_year?: number;
  description?: string;
}

export interface Endorsement {
  id: string;
  endorser_id: string;
  endorsed_id: string;
  skill: string;
  created_at: string;
}

export interface Recommendation {
  id: string;
  author_id: string;
  recipient_id: string;
  relationship: string;
  text: string;
  created_at: string;
}

export interface ProfileView {
  id: string;
  viewer_id: string;
  viewed_id: string;
  viewed_at: string;
}
