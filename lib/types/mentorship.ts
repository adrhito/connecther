export type MentorshipRequestType = "coffee_chat" | "long_term" | "office_hours";
export type MentorshipRequestStatus = "pending" | "accepted" | "declined" | "completed";

export interface MentorshipRequest {
  id: string;
  mentor_id: string;
  mentee_id: string;
  request_type: MentorshipRequestType;
  message?: string;
  what_to_learn?: string;
  why_this_mentor?: string;
  status: MentorshipRequestStatus;
  rating?: number;
  rating_text?: string;
  created_at: string;
}
