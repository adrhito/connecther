"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils/cn";
import { formatRelativeTime } from "@/lib/utils/format";
import { MessageSafety } from "./MessageSafety";
import type { Message } from "@/lib/types";

interface MessageThreadProps {
  messages: Message[];
  currentUserId: string;
  isNewConversation?: boolean;
}

function shouldShowTimestamp(
  current: Message,
  previous: Message | undefined
): boolean {
  if (!previous) return true;
  const currentDate = new Date(current.created_at);
  const previousDate = new Date(previous.created_at);
  // Show timestamp if messages are more than 1 hour apart
  return currentDate.getTime() - previousDate.getTime() > 3600000;
}

export function MessageThread({
  messages,
  currentUserId,
  isNewConversation = false,
}: MessageThreadProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-4 space-y-1"
    >
      {isNewConversation && <MessageSafety />}

      {messages.map((message, index) => {
        const isSent = message.sender_id === currentUserId;
        const showTimestamp = shouldShowTimestamp(message, messages[index - 1]);
        const previousMessage = messages[index - 1];
        const isSameSender =
          previousMessage && previousMessage.sender_id === message.sender_id;

        return (
          <div key={message.id}>
            {showTimestamp && (
              <div className="flex justify-center py-3">
                <span className="text-xs text-text-muted bg-surface-elevated px-3 py-1 rounded-full">
                  {formatRelativeTime(message.created_at)}
                </span>
              </div>
            )}

            <div
              className={cn(
                "flex",
                isSent ? "justify-end" : "justify-start",
                !isSameSender && !showTimestamp ? "mt-3" : "mt-1"
              )}
            >
              <div
                className={cn(
                  "max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed",
                  isSent
                    ? "bg-primary text-white rounded-br-md"
                    : "bg-surface-elevated text-text-primary rounded-bl-md"
                )}
              >
                <p>{message.body}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
