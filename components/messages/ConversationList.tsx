"use client";

import { useState } from "react";
import { Search, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatRelativeTime, getInitials } from "@/lib/utils/format";

interface Participant {
  id: string;
  name: string;
  headline?: string;
  profile_photo_url?: string;
}

interface ConversationItem {
  id: string;
  participant_ids: string[];
  participants: Participant[];
  lastMessage: {
    id: string;
    body: string;
    sender_id: string;
    created_at: string;
    is_read: boolean;
  } | null;
  unreadCount: number;
  last_message_at: string;
}

interface ConversationListProps {
  conversations: ConversationItem[];
  selectedId?: string;
  onSelect: (id: string) => void;
  currentUserId: string;
}

const AVATAR_COLORS = [
  "bg-primary",
  "bg-accent",
  "bg-success",
  "bg-purple-500",
  "bg-teal-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-orange-500",
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  currentUserId,
}: ConversationListProps) {
  const [search, setSearch] = useState("");

  const getOtherParticipant = (conv: ConversationItem): Participant => {
    const other = conv.participants.find((p) => p.id !== currentUserId);
    return (
      other || {
        id: "unknown",
        name: "Unknown User",
      }
    );
  };

  const filtered = conversations.filter((conv) => {
    if (!search) return true;
    const other = getOtherParticipant(conv);
    const lowerSearch = search.toLowerCase();
    return (
      other.name.toLowerCase().includes(lowerSearch) ||
      conv.lastMessage?.body.toLowerCase().includes(lowerSearch)
    );
  });

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-3 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-surface text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Conversation items */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <MessageSquare className="w-8 h-8 text-text-muted mb-2" />
            <p className="text-sm text-text-muted">
              {search ? "No conversations found" : "No conversations yet"}
            </p>
          </div>
        ) : (
          filtered.map((conv) => {
            const other = getOtherParticipant(conv);
            const isSelected = conv.id === selectedId;
            const hasUnread = conv.unreadCount > 0;

            return (
              <button
                key={conv.id}
                onClick={() => onSelect(conv.id)}
                className={cn(
                  "w-full flex items-start gap-3 p-3 text-left hover:bg-surface-elevated/50 transition-colors border-b border-border",
                  isSelected && "bg-surface-elevated"
                )}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-medium",
                      getAvatarColor(other.name)
                    )}
                  >
                    {getInitials(other.name)}
                  </div>
                  {hasUnread && (
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-primary rounded-full border-2 border-surface" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        "text-sm truncate",
                        hasUnread
                          ? "font-semibold text-text-primary"
                          : "font-medium text-text-primary"
                      )}
                    >
                      {other.name}
                    </span>
                    {conv.lastMessage && (
                      <span className="text-xs text-text-muted shrink-0 ml-2">
                        {formatRelativeTime(conv.lastMessage.created_at)}
                      </span>
                    )}
                  </div>
                  {conv.lastMessage && (
                    <p
                      className={cn(
                        "text-xs mt-0.5 truncate",
                        hasUnread
                          ? "text-text-primary font-medium"
                          : "text-text-muted"
                      )}
                    >
                      {conv.lastMessage.sender_id === currentUserId
                        ? "You: "
                        : ""}
                      {conv.lastMessage.body}
                    </p>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export type { ConversationItem, Participant };
