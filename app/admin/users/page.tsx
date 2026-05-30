"use client";

import { useEffect, useState } from "react";
import { UserTable } from "@/components/admin/UserTable";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { User } from "@/lib/types";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Partial<User>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleBan = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, is_active: !u.is_active } : u
      )
    );
  };

  const handleFeature = (userId: string) => {
    console.log("Feature user:", userId);
  };

  const handleViewProfile = (userId: string) => {
    console.log("View profile:", userId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-text-primary">
          User Management
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage all registered users on the platform
        </p>
      </div>
      <UserTable
        users={users}
        onBan={handleBan}
        onFeature={handleFeature}
        onViewProfile={handleViewProfile}
      />
    </div>
  );
}
