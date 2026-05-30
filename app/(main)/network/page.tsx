"use client";

import { useState, useEffect, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ConnectionCard } from "@/components/network/ConnectionCard";
import { ConnectionRequests } from "@/components/network/ConnectionRequests";
import { PeopleYouMayKnow } from "@/components/network/PeopleYouMayKnow";
import { NetworkFilters } from "@/components/network/NetworkFilters";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { useAuth } from "@/lib/context/AuthContext";
import { Users, GraduationCap } from "lucide-react";
import type { User } from "@/lib/types";

interface EnrichedConnection {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  user: Partial<User> | null;
}

export default function NetworkPage() {
  const { user } = useAuth();
  const [connections, setConnections] = useState<EnrichedConnection[]>([]);
  const [allUsers, setAllUsers] = useState<Partial<User>[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, string[]>>({});

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [connRes, usersRes] = await Promise.all([
        fetch(`/api/connections?user_id=${user.id}`),
        fetch("/api/users"),
      ]);
      const connData = await connRes.json();
      const usersData = await usersRes.json();
      setConnections(connData.connections || []);
      setAllUsers(usersData.users || []);
    } catch (err) {
      console.error("Failed to fetch network data:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-side data fetching
    fetchData();
  }, [fetchData]);

  const acceptedConnections = connections.filter((c) => c.status === "accepted");
  const pendingRequests = connections.filter(
    (c) => c.status === "pending" && c.receiver_id === user?.id
  );

  // Users not already connected
  const connectedUserIds = new Set(
    connections
      .filter((c) => c.status === "accepted" || c.status === "pending")
      .map((c) => (c.requester_id === user?.id ? c.receiver_id : c.requester_id))
  );
  connectedUserIds.add(user?.id || "");

  const suggestedPeople = allUsers.filter(
    (u) => u.id && !connectedUserIds.has(u.id) && u.role !== "admin"
  );

  const mentorSuggestions = allUsers.filter(
    (u) =>
      u.id &&
      !connectedUserIds.has(u.id) &&
      u.is_mentor &&
      u.mentor_open &&
      u.role !== "admin"
  );

  // Apply filters
  const applyFilters = (users: Partial<User>[]) => {
    let filtered = [...users];
    if (filters.industry?.length) {
      filtered = filtered.filter((u) =>
        filters.industry.some(
          (ind) => u.industry?.toLowerCase().includes(ind.toLowerCase())
        )
      );
    }
    if (filters.school?.length) {
      filtered = filtered.filter((u) =>
        filters.school.some(
          (s) => u.school?.toLowerCase().includes(s.toLowerCase())
        )
      );
    }
    if (filters.company?.length) {
      filtered = filtered.filter((u) =>
        filters.company.some(
          (c) => u.company?.toLowerCase().includes(c.toLowerCase())
        )
      );
    }
    if (filters.location?.length) {
      filtered = filtered.filter((u) =>
        filters.location.some(
          (loc) => u.location?.toLowerCase().includes(loc.toLowerCase())
        )
      );
    }
    if (filters.career_goal?.length) {
      filtered = filtered.filter((u) =>
        u.career_goals?.some((g) =>
          filters.career_goal.some(
            (fg) => g.toLowerCase().includes(fg.toLowerCase())
          )
        )
      );
    }
    return filtered;
  };

  const handleConnect = async (receiverId: string) => {
    if (!user) return;
    try {
      await fetch("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requester_id: user.id,
          receiver_id: receiverId,
        }),
      });
      // Also store locally so the connection persists on reload
      const receiverUser = allUsers.find((u) => u.id === receiverId) || null;
      const newConn: EnrichedConnection = {
        id: `conn-${Date.now()}`,
        requester_id: user.id,
        receiver_id: receiverId,
        status: "pending",
        created_at: new Date().toISOString(),
        user: receiverUser,
      };
      setConnections((prev) => [...prev, newConn]);
    } catch (err) {
      console.error("Failed to send connection request:", err);
    }
  };

  const handleAccept = (connectionId: string) => {
    setConnections((prev) =>
      prev.map((c) =>
        c.id === connectionId ? { ...c, status: "accepted" } : c
      )
    );
  };

  const handleReject = (connectionId: string) => {
    setConnections((prev) =>
      prev.map((c) =>
        c.id === connectionId ? { ...c, status: "rejected" } : c
      )
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-text-primary">
          My Network
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          {acceptedConnections.length} connection{acceptedConnections.length !== 1 ? "s" : ""}
          {pendingRequests.length > 0 &&
            ` / ${pendingRequests.length} pending request${pendingRequests.length !== 1 ? "s" : ""}`}
        </p>
      </div>

      <Tabs defaultValue="connections">
        <TabsList className="mb-4">
          <TabsTrigger value="connections">
            Connections ({acceptedConnections.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending Requests ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="suggestions">People You May Know</TabsTrigger>
          <TabsTrigger value="mentors">Mentor Suggestions</TabsTrigger>
        </TabsList>

        <div className="mb-6">
          <NetworkFilters
            values={filters}
            onChange={(key, vals) =>
              setFilters((prev) => ({ ...prev, [key]: vals }))
            }
            onClear={() => setFilters({})}
          />
        </div>

        <TabsContent value="connections">
          {acceptedConnections.length === 0 ? (
            <EmptyState
              icon={<Users className="w-12 h-12" />}
              title="No connections yet"
              description="Start building your network by connecting with professionals in your industry."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {applyFilters(
                acceptedConnections
                  .map((c) => c.user)
                  .filter((u): u is Partial<User> => u !== null)
              ).map((connUser) => (
                <ConnectionCard
                  key={connUser.id}
                  user={connUser}
                  connectionStatus="connected"
                  mutualConnections={((connUser.id?.charCodeAt(connUser.id.length - 1) || 0) % 5) + 1}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending">
          <ConnectionRequests
            requests={pendingRequests.map((c) => ({
              id: c.id,
              user: c.user,
              created_at: c.created_at,
            }))}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        </TabsContent>

        <TabsContent value="suggestions">
          <PeopleYouMayKnow
            people={applyFilters(suggestedPeople)}
            onConnect={handleConnect}
          />
        </TabsContent>

        <TabsContent value="mentors">
          {mentorSuggestions.length === 0 ? (
            <EmptyState
              icon={<GraduationCap className="w-12 h-12" />}
              title="No mentor suggestions"
              description="We are working on finding mentors that match your career goals."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {applyFilters(mentorSuggestions).map((mentor) => (
                <ConnectionCard
                  key={mentor.id}
                  user={mentor}
                  connectionStatus="none"
                  mutualConnections={(mentor.id?.charCodeAt(mentor.id.length - 1) || 0) % 4}
                  onConnect={() => mentor.id && handleConnect(mentor.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
