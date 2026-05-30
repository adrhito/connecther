"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { ConversationList } from "@/components/messages/ConversationList";
import { MessageThread } from "@/components/messages/MessageThread";
import { MessageInput } from "@/components/messages/MessageInput";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAuth } from "@/lib/hooks/useAuth";
import type { ConversationItem } from "@/components/messages/ConversationList";
import type { Message } from "@/lib/types";

export default function MessagesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const currentUserId = user?.id || "user-1";

  const fetchMessages = async (convId: string) => {
    setMessagesLoading(true);
    try {
      const res = await fetch(`/api/messages/${convId}`);
      const data = await res.json();
      setMessages(data.messages);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      setConversations(data.conversations);

      // Auto-select first conversation on desktop
      if (data.conversations.length > 0 && window.innerWidth >= 768) {
        const firstConv = data.conversations[0];
        setSelectedId(firstConv.id);
        fetchMessages(firstConv.id);
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-side data fetching
    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectConversation = (convId: string) => {
    setSelectedId(convId);
    fetchMessages(convId);

    // On mobile, navigate to the conversation page
    if (window.innerWidth < 768) {
      router.push(`/messages/${convId}`);
    }
  };

  const handleSendMessage = (newMessage: { body: string }) => {
    const msg: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: selectedId || "",
      sender_id: currentUserId,
      body: newMessage.body,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
  };

  const getSelectedConversation = () => {
    return conversations.find((c) => c.id === selectedId);
  };

  const getOtherParticipant = () => {
    const conv = getSelectedConversation();
    if (!conv) return undefined;
    return conv.participants.find((p) => p.id !== currentUserId);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-surface-elevated rounded w-48" />
          <div className="h-96 bg-surface-elevated rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-4rem-4rem)] lg:h-[calc(100vh-4rem)]">
      <div className="flex h-full border border-border rounded-lg overflow-hidden bg-surface">
        {/* Conversation List - always visible on desktop, full width on mobile */}
        <div className="w-full md:w-80 lg:w-96 border-r border-border flex flex-col md:block">
          <div className="p-4 border-b border-border">
            <h1 className="text-lg font-heading font-semibold text-text-primary">
              Messages
            </h1>
          </div>
          <ConversationList
            conversations={conversations}
            selectedId={selectedId || undefined}
            onSelect={handleSelectConversation}
            currentUserId={currentUserId}
          />
        </div>

        {/* Message Thread - hidden on mobile, visible on desktop */}
        <div className="hidden md:flex flex-1 flex-col">
          {selectedId ? (
            <>
              {/* Conversation header */}
              <div className="p-4 border-b border-border flex items-center gap-3">
                {getOtherParticipant() && (
                  <>
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-medium">
                      {getOtherParticipant()!.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {getOtherParticipant()!.name}
                      </p>
                      {getOtherParticipant()!.headline && (
                        <p className="text-xs text-text-muted truncate max-w-xs">
                          {getOtherParticipant()!.headline}
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Messages */}
              {messagesLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-sm text-text-muted">Loading messages...</p>
                </div>
              ) : (
                <MessageThread
                  messages={messages}
                  currentUserId={currentUserId}
                />
              )}

              {/* Input */}
              <MessageInput
                conversationId={selectedId}
                currentUserId={currentUserId}
                onSend={handleSendMessage}
                otherParticipantName={getOtherParticipant()?.name}
              />
            </>
          ) : (
            <EmptyState
              icon={<MessageSquare className="w-12 h-12" />}
              title="Select a conversation"
              description="Choose a conversation from the sidebar to start messaging."
              className="flex-1"
            />
          )}
        </div>
      </div>
    </div>
  );
}
