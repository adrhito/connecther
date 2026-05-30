export * from "./user";
export * from "./post";
export * from "./job";
export * from "./company";
export * from "./review";
export * from "./mentorship";
export * from "./message";
export * from "./community";
export * from "./notification";

export interface Connection {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
}

export interface Follow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface SavedItem {
  id: string;
  user_id: string;
  item_type: "post" | "job" | "company" | "mentor" | "event" | "community";
  item_id: string;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  content_type: "post" | "comment" | "message" | "review" | "user";
  content_id: string;
  reason: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  created_at: string;
}

export interface Block {
  id: string;
  blocker_id: string;
  blocked_id: string;
  created_at: string;
}
