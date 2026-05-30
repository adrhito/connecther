"use client";

import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IcebreakerSuggestions } from "./IcebreakerSuggestions";

interface MessageInputProps {
  conversationId: string;
  currentUserId: string;
  onSend?: (message: { body: string }) => void;
  otherParticipantName?: string;
  otherParticipantCompany?: string;
}

export function MessageInput({
  conversationId,
  currentUserId,
  onSend,
  otherParticipantName,
  otherParticipantCompany,
}: MessageInputProps) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showIcebreakers, setShowIcebreakers] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isSending) return;

    setIsSending(true);
    try {
      const response = await fetch(`/api/messages/${conversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id: currentUserId,
          body: text.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        onSend?.(data.message);
        setText("");
      }
    } catch {
      // Error handling - keep message in input for retry
    } finally {
      setIsSending(false);
    }
  };

  const handleIcebreakerSelect = (icebreaker: string) => {
    setText(icebreaker);
    setShowIcebreakers(false);
  };

  return (
    <div className="border-t border-border p-3 bg-surface">
      {/* Icebreaker suggestions */}
      {showIcebreakers && (
        <IcebreakerSuggestions
          onSelect={handleIcebreakerSelect}
          onClose={() => setShowIcebreakers(false)}
          participantName={otherParticipantName}
          participantCompany={otherParticipantCompany}
        />
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowIcebreakers(!showIcebreakers)}
          className="shrink-0 text-text-muted"
          title="Icebreaker suggestions"
        >
          <Sparkles className="w-4 h-4" />
        </Button>

        <div className="flex-1 relative">
          <textarea
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              // Auto-resize
              e.target.style.height = "auto";
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Type a message..."
            rows={1}
            className="w-full resize-none rounded-lg border border-border bg-surface-elevated px-3 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            style={{ minHeight: "40px", maxHeight: "120px" }}
          />
        </div>

        <Button
          type="submit"
          size="sm"
          disabled={!text.trim() || isSending}
          className="shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
