"use client";

import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface IcebreakerSuggestionsProps {
  onSelect: (text: string) => void;
  onClose: () => void;
  participantName?: string;
  participantCompany?: string;
}

const DEFAULT_ICEBREAKERS = [
  {
    template: "Hi! I noticed we both work in {industry}. I'd love to connect.",
    fallback: "Hi! I noticed we share similar professional interests. I'd love to connect.",
  },
  {
    template: "I saw your post about {topic} and found it really insightful.",
    fallback: "I saw your recent posts and found them really insightful.",
  },
  {
    template: "I'm interested in learning about your career path at {company}.",
    fallback: "I'm interested in learning about your career path. Would you be open to sharing?",
  },
  {
    template: "Would you be open to a quick coffee chat about {topic}?",
    fallback: "Would you be open to a quick virtual coffee chat? I'd love to learn from your experience.",
  },
  {
    template: "Hi {name}! I came across your profile and was impressed by your background. I'd love to connect and learn from your experience.",
    fallback: "Hi! I came across your profile and was impressed by your background. I'd love to connect and learn from your experience.",
  },
  {
    template: "Hi {name}! I'm exploring career opportunities in your field and would greatly appreciate any advice you might have.",
    fallback: "Hi! I'm exploring new career opportunities and would greatly appreciate any advice you might have.",
  },
];

export function IcebreakerSuggestions({
  onSelect,
  onClose,
  participantName,
  participantCompany,
}: IcebreakerSuggestionsProps) {
  const getIcebreakerText = (icebreaker: {
    template: string;
    fallback: string;
  }): string => {
    let text = icebreaker.template;

    if (participantName) {
      text = text.replace("{name}", participantName.split(" ")[0]);
    } else {
      text = text.replace("Hi {name}!", "Hi!");
    }

    if (participantCompany) {
      text = text.replace("{company}", participantCompany);
    } else if (text.includes("{company}")) {
      text = icebreaker.fallback;
    }

    // Replace any remaining placeholders with the fallback
    if (text.includes("{")) {
      text = icebreaker.fallback;
      if (participantName) {
        text = text.replace("Hi!", `Hi ${participantName.split(" ")[0]}!`);
      }
    }

    return text;
  };

  return (
    <div className="mb-3 bg-surface-elevated border border-border rounded-lg p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-sm font-medium text-text-primary">
          <Sparkles className="w-4 h-4 text-primary" />
          Icebreaker Suggestions
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>
      <div className="space-y-2">
        {DEFAULT_ICEBREAKERS.map((icebreaker, index) => {
          const text = getIcebreakerText(icebreaker);
          return (
            <button
              key={index}
              onClick={() => onSelect(text)}
              className="w-full text-left text-sm text-text-secondary hover:text-text-primary hover:bg-surface rounded-md p-2 transition-colors leading-relaxed"
            >
              &ldquo;{text}&rdquo;
            </button>
          );
        })}
      </div>
    </div>
  );
}
