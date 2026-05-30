"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ConversationList } from "@/components/messages/ConversationList";
import { MessageThread } from "@/components/messages/MessageThread";
import { MessageInput } from "@/components/messages/MessageInput";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import type { ConversationItem } from "@/components/messages/ConversationList";
import type { Message } from "@/lib/types";

interface ConversationParticipant {
  id: string;
  name: string;
  headline?: string;
  profile_photo_url?: string;
}

export default function MessageThreadPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const conversationId = params.id as string;

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<ConversationParticipant[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [sidebarLoading, setSidebarLoading] = useState(true);

  const currentUserId = user?.id || "user-1";

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/messages");
      const data = await res.json();
      setConversations(data.conversations);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setSidebarLoading(false);
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/messages/${conversationId}`);
      if (!res.ok) {
        router.push("/messages");
        return;
      }
      const data = await res.json();
      setMessages(data.messages);
      setParticipants(data.conversation.participants);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-side data fetching
    fetchConversations();
    fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  const handleSendMessage = (newMessage: { body: string }) => {
    const msg: Message = {
      id: `msg-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: currentUserId,
      body: newMessage.body,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
  };

  const handleSelectConversation = (convId: string) => {
    router.push(`/messages/${convId}`);
  };

  const getOtherParticipant = (): ConversationParticipant | undefined => {
    return participants.find((p) => p.id !== currentUserId);
  };

  const otherParticipant = getOtherParticipant();

  // Determine if this is a "new" conversation (check if participants are connected)
  const isNewConversation = messages.length <= 2;

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto h-[calc(100vh-4rem-4rem)] lg:h-[calc(100vh-4rem)]">
        <div className="flex h-full border border-border rounded-lg overflow-hidden bg-surface">
          <div className="hidden md:block w-80 lg:w-96 border-r border-border" />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-text-muted">Loading conversation...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-4rem-4rem)] lg:h-[calc(100vh-4rem)]">
      <div className="flex h-full border border-border rounded-lg overflow-hidden bg-surface">
        {/* Sidebar - hidden on mobile */}
        <div className="hidden md:flex md:w-80 lg:w-96 border-r border-border flex-col">
          <div className="p-4 border-b border-border">
            <h1 className="text-lg font-heading font-semibold text-text-primary">
              Messages
            </h1>
          </div>
          {!sidebarLoading && (
            <ConversationList
              conversations={conversations}
              selectedId={conversationId}
              onSelect={handleSelectConversation}
              currentUserId={currentUserId}
            />
          )}
        </div>

        {/* Message thread */}
        <div className="flex-1 flex flex-col">
          {/* Header with back button on mobile */}
          <div className="p-3 sm:p-4 border-b border-border flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              asChild
            >
              <Link href="/messages">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>

            {otherParticipant && (
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-medium shrink-0">
                  {otherParticipant.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">
                    {otherParticipant.name}
                  </p>
                  {otherParticipant.headline && (
                    <p className="text-xs text-text-muted truncate">
                      {otherParticipant.headline}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <MessageThread
            messages={messages}
            currentUserId={currentUserId}
            isNewConversation={isNewConversation}
          />

          {/* Input */}
          <MessageInput
            conversationId={conversationId}
            currentUserId={currentUserId}
            onSend={handleSendMessage}
            otherParticipantName={otherParticipant?.name}
          />
        </div>
      </div>
    </div>
  );
}
