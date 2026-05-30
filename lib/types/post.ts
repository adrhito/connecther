export type PostType = "text" | "image" | "poll" | "event" | "article";

export interface Post {
  id: string;
  author_id: string;
  content: string;
  post_type: PostType;
  media_url?: string;
  poll_options?: PollOption[];
  event_details?: EventDetails;
  hashtags?: string[];
  mentions?: string[];
  likes_count: number;
  comments_count: number;
  reposts_count: number;
  is_featured: boolean;
  is_flagged: boolean;
  created_at: string;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface EventDetails {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  likes_count: number;
  created_at: string;
}

export interface Like {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}
