"use client";

import { ConnectionCard } from "./ConnectionCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Users } from "lucide-react";
import type { User } from "@/lib/types";

interface PeopleYouMayKnowProps {
  people: Partial<User>[];
  onConnect: (userId: string) => void;
}

export function PeopleYouMayKnow({ people, onConnect }: PeopleYouMayKnowProps) {
  if (people.length === 0) {
    return (
      <EmptyState
        icon={<Users className="w-12 h-12" />}
        title="No suggestions right now"
        description="Check back later for new people you may know based on your profile."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {people.map((person) => (
        <ConnectionCard
          key={person.id}
          user={person}
          connectionStatus="none"
          mutualConnections={((person.id?.charCodeAt(person.id.length - 1) || 0) % 8) + 1}
          onConnect={() => person.id && onConnect(person.id)}
        />
      ))}
    </div>
  );
}
