"use client";

import { ShieldAlert, Flag, Ban, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function MessageSafety() {
  return (
    <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-warning shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-text-primary">
            New Conversation
          </h4>
          <p className="text-xs text-text-secondary mt-1 leading-relaxed">
            This is a new conversation with someone outside your network. Be
            cautious about sharing personal information. If you receive
            inappropriate messages, please report them.
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            <Button variant="secondary" size="sm" className="text-xs">
              <Flag className="w-3 h-3" />
              Report
            </Button>
            <Button variant="secondary" size="sm" className="text-xs">
              <Ban className="w-3 h-3" />
              Block
            </Button>
            <Button variant="ghost" size="sm" className="text-xs" asChild>
              <Link href="/settings/messages">
                <Settings className="w-3 h-3" />
                Message Settings
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
