import type { Conversation, Message } from "@/lib/types";

export const conversations: Conversation[] = [
  {
    id: "conv-1",
    participant_ids: ["user-1", "user-2"],
    last_message_at: "2025-03-10T18:00:00Z",
    created_at: "2024-09-01T10:00:00Z",
  },
  {
    id: "conv-2",
    participant_ids: ["user-1", "user-3"],
    last_message_at: "2025-03-08T12:00:00Z",
    created_at: "2024-07-05T14:00:00Z",
  },
  {
    id: "conv-3",
    participant_ids: ["user-2", "user-3"],
    last_message_at: "2025-03-05T16:00:00Z",
    created_at: "2024-10-15T14:00:00Z",
  },
  {
    id: "conv-4",
    participant_ids: ["user-5", "user-6"],
    last_message_at: "2025-03-09T20:00:00Z",
    created_at: "2024-11-01T11:00:00Z",
  },
  {
    id: "conv-5",
    participant_ids: ["user-1", "user-4"],
    last_message_at: "2025-02-28T15:00:00Z",
    created_at: "2024-09-10T16:00:00Z",
  },
];

export const messages: Message[] = [
  // Conversation 1: Priya <-> Sofia (mentorship)
  {
    id: "msg-1",
    conversation_id: "conv-1",
    sender_id: "user-2",
    body: "Hi Priya! Thanks for accepting my mentorship request. When would be a good time for our first chat?",
    is_read: true,
    created_at: "2024-09-01T10:30:00Z",
  },
  {
    id: "msg-2",
    conversation_id: "conv-1",
    sender_id: "user-1",
    body: "Hi Sofia! Great to connect. How about Wednesday at 6pm? I usually have some time after work.",
    is_read: true,
    created_at: "2024-09-01T12:00:00Z",
  },
  {
    id: "msg-3",
    conversation_id: "conv-1",
    sender_id: "user-2",
    body: "That works perfectly! I'll send a calendar invite. Looking forward to it!",
    is_read: true,
    created_at: "2024-09-01T12:30:00Z",
  },
  {
    id: "msg-4",
    conversation_id: "conv-1",
    sender_id: "user-2",
    body: "Hey Priya, just wanted to share that I got an interview at Google! Thank you for the referral and prep tips.",
    is_read: true,
    created_at: "2025-03-10T17:00:00Z",
  },
  {
    id: "msg-5",
    conversation_id: "conv-1",
    sender_id: "user-1",
    body: "That's amazing news, Sofia! You've worked so hard for this. Let me know if you need any help preparing for the onsite.",
    is_read: false,
    created_at: "2025-03-10T18:00:00Z",
  },

  // Conversation 2: Priya <-> Aisha
  {
    id: "msg-6",
    conversation_id: "conv-2",
    sender_id: "user-3",
    body: "Hey Priya! Congrats on the Grace Hopper panel. Your post about sponsorship really resonated.",
    is_read: true,
    created_at: "2025-03-08T11:00:00Z",
  },
  {
    id: "msg-7",
    conversation_id: "conv-2",
    sender_id: "user-1",
    body: "Thanks Aisha! And congrats on the Series A! Would love to chat about potential collaboration between our teams.",
    is_read: true,
    created_at: "2025-03-08T12:00:00Z",
  },

  // Conversation 3: Sofia <-> Aisha
  {
    id: "msg-8",
    conversation_id: "conv-3",
    sender_id: "user-2",
    body: "Hi Aisha! Thank you for the coffee chat last month. I've been thinking more about the startup path.",
    is_read: true,
    created_at: "2025-03-05T15:00:00Z",
  },
  {
    id: "msg-9",
    conversation_id: "conv-3",
    sender_id: "user-3",
    body: "Glad to hear it, Sofia! Remember, there's no rush. Get some industry experience first, then you'll be even more prepared to found something great.",
    is_read: true,
    created_at: "2025-03-05T16:00:00Z",
  },

  // Conversation 4: Maya <-> Rachel (mentorship)
  {
    id: "msg-10",
    conversation_id: "conv-4",
    sender_id: "user-5",
    body: "Hi Rachel, I've been researching the consulting transition more. Do you think my finance background is a good fit for McKinsey?",
    is_read: true,
    created_at: "2025-03-09T19:00:00Z",
  },
  {
    id: "msg-11",
    conversation_id: "conv-4",
    sender_id: "user-6",
    body: "Absolutely, Maya. Your analytical skills from IB are highly valued in consulting. Let's discuss specific firms and roles in our next session.",
    is_read: false,
    created_at: "2025-03-09T20:00:00Z",
  },

  // Conversation 5: Priya <-> Elena
  {
    id: "msg-12",
    conversation_id: "conv-5",
    sender_id: "user-4",
    body: "Hi Priya! I have some great candidates for the team. Would you be open to doing some informational interviews?",
    is_read: true,
    created_at: "2025-02-28T14:00:00Z",
  },
  {
    id: "msg-13",
    conversation_id: "conv-5",
    sender_id: "user-1",
    body: "Hi Elena! Of course, always happy to help with hiring diverse talent. Send me the details.",
    is_read: true,
    created_at: "2025-02-28T15:00:00Z",
  },
];
