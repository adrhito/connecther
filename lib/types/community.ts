export type CommunityCategory = "industry" | "campus" | "interest" | "company";

export interface Community {
  id: string;
  name: string;
  description?: string;
  category: CommunityCategory;
  is_private: boolean;
  member_count: number;
  is_featured: boolean;
  created_at: string;
}

export interface CommunityMember {
  id: string;
  community_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}
