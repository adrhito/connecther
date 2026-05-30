"use client";

import { useState } from "react";
import { Send, Coffee, Users, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MentorRequestFormProps {
  mentorName: string;
  mentorId: string;
}

const requestTypes = [
  {
    value: "coffee_chat",
    label: "Coffee Chat",
    description: "A one-time 30-minute conversation",
    icon: <Coffee className="h-4 w-4 text-amber-600" />,
  },
  {
    value: "long_term",
    label: "Long-term Mentorship",
    description: "Ongoing guidance over weeks/months",
    icon: <Users className="h-4 w-4 text-primary" />,
  },
  {
    value: "office_hours",
    label: "Office Hours",
    description: "Join an open Q&A session",
    icon: <Clock className="h-4 w-4 text-accent-warm" />,
  },
];

export function MentorRequestForm({ mentorName }: MentorRequestFormProps) {
  const [requestType, setRequestType] = useState("");
  const [whatToLearn, setWhatToLearn] = useState("");
  const [whyThisMentor, setWhyThisMentor] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <Card className="border-success/30 bg-success/5">
        <CardContent className="p-6 text-center">
          <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
            <Send className="h-6 w-6 text-success" />
          </div>
          <h3 className="font-heading font-semibold text-text-primary text-lg">
            Request Sent!
          </h3>
          <p className="text-sm text-text-secondary mt-2">
            Your mentorship request has been sent to {mentorName}. You&apos;ll be notified
            when they respond.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Send className="h-5 w-5 text-primary" />
          Request Mentorship from {mentorName}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Request Type */}
          <div className="space-y-2">
            <Label htmlFor="requestType">Request Type *</Label>
            <Select value={requestType} onValueChange={setRequestType}>
              <SelectTrigger id="requestType">
                <SelectValue placeholder="Select request type..." />
              </SelectTrigger>
              <SelectContent>
                {requestTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex items-center gap-2">
                      {type.icon}
                      <div>
                        <span>{type.label}</span>
                        <span className="text-text-muted ml-2 text-xs">
                          - {type.description}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* What to learn */}
          <div className="space-y-2">
            <Label htmlFor="whatToLearn">What do you want to learn? *</Label>
            <Textarea
              id="whatToLearn"
              value={whatToLearn}
              onChange={(e) => setWhatToLearn(e.target.value)}
              placeholder="e.g., System design, career transitions, interview preparation..."
              className="min-h-[80px]"
            />
          </div>

          {/* Why this mentor */}
          <div className="space-y-2">
            <Label htmlFor="whyThisMentor">Why this mentor? *</Label>
            <Textarea
              id="whyThisMentor"
              value={whyThisMentor}
              onChange={(e) => setWhyThisMentor(e.target.value)}
              placeholder="What about this mentor's experience or background stands out to you?"
              className="min-h-[80px]"
            />
          </div>

          {/* Optional message */}
          <div className="space-y-2">
            <Label htmlFor="message">
              Additional Message <span className="text-text-muted">(optional)</span>
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Anything else you'd like to share..."
              className="min-h-[60px]"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={!requestType || !whatToLearn || !whyThisMentor || submitting}
          >
            {submitting ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Send Mentorship Request
              </>
            )}
          </Button>

          <p className="text-xs text-text-muted text-center">
            Mentors typically respond within 3-5 business days.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
