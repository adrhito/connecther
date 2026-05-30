export const APP_NAME = "connectHer";
export const APP_TAGLINE = "Where women build careers, together.";

export const INDUSTRIES = [
  "Technology",
  "Finance",
  "Consulting",
  "Healthcare",
  "Law",
  "Marketing",
  "Education",
  "Private Equity",
  "Venture Capital",
  "Investment Banking",
  "Nonprofit",
  "Media & Entertainment",
  "Real Estate",
  "Government",
  "Energy",
  "Retail",
  "Manufacturing",
] as const;

export const ROLES = [
  "student",
  "professional",
  "mentor",
  "founder",
  "recruiter",
  "company_admin",
  "admin",
] as const;

export const JOB_TYPES = [
  "full_time",
  "part_time",
  "contract",
  "internship",
  "fellowship",
  "returnship",
] as const;

export const REMOTE_TYPES = ["onsite", "remote", "hybrid"] as const;

export const REVIEW_CATEGORIES = [
  { key: "overall_rating", label: "Overall" },
  { key: "pay_fairness_rating", label: "Pay Fairness" },
  { key: "mentorship_rating", label: "Mentorship" },
  { key: "promotion_fairness_rating", label: "Promotion Fairness" },
  { key: "parental_leave_rating", label: "Parental Leave" },
  { key: "flexibility_rating", label: "Flexibility" },
  { key: "safety_culture_rating", label: "Safety Culture" },
  { key: "reporting_culture_rating", label: "Reporting Culture" },
  { key: "leadership_diversity_rating", label: "Leadership Diversity" },
  { key: "work_life_balance_rating", label: "Work-Life Balance" },
] as const;

export const MENTOR_BADGE_TYPES = [
  "Finance Mentor",
  "Tech Mentor",
  "Consulting Mentor",
  "Founder Mentor",
  "Career Transition Mentor",
  "Return-to-Work Mentor",
] as const;

export const NAV_ITEMS = [
  { label: "Feed", href: "/feed", icon: "Home" },
  { label: "Network", href: "/network", icon: "Users" },
  { label: "Jobs", href: "/jobs", icon: "Briefcase" },
  { label: "Mentorship", href: "/mentorship", icon: "GraduationCap" },
  { label: "Companies", href: "/companies", icon: "Building2" },
  { label: "Messages", href: "/messages", icon: "MessageSquare" },
] as const;

export const ADMIN_NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: "BarChart3" },
  { label: "Users", href: "/admin/users", icon: "Users" },
  { label: "Posts", href: "/admin/posts", icon: "FileText" },
  { label: "Reviews", href: "/admin/reviews", icon: "Star" },
  { label: "Companies", href: "/admin/companies", icon: "Building2" },
  { label: "Jobs", href: "/admin/jobs", icon: "Briefcase" },
  { label: "Mentors", href: "/admin/mentors", icon: "GraduationCap" },
  { label: "Reports", href: "/admin/reports", icon: "Flag" },
  { label: "Featured", href: "/admin/featured", icon: "Award" },
] as const;
