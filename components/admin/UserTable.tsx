"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/shared/Badge";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { SearchBar } from "@/components/shared/SearchBar";
import { Ban, Star, Eye, ShieldOff } from "lucide-react";
import { formatDate } from "@/lib/utils/format";
import type { User } from "@/lib/types";

interface UserTableProps {
  users: Partial<User>[];
  onBan: (userId: string) => void;
  onFeature: (userId: string) => void;
  onViewProfile: (userId: string) => void;
}

const roleColors: Record<string, "default" | "accent" | "success" | "warning" | "outline"> = {
  student: "accent",
  professional: "default",
  mentor: "success",
  founder: "warning",
  recruiter: "outline",
  admin: "default",
};

export function UserTable({
  users,
  onBan,
  onFeature,
  onViewProfile,
}: UserTableProps) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !search ||
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase()) ||
      user.headline?.toLowerCase().includes(search.toLowerCase());

    const matchesRole = !roleFilter || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Users ({filteredUsers.length})</CardTitle>
        <div className="flex items-center gap-3 mt-3">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search users by name or email..."
            className="flex-1 max-w-sm"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 px-3 rounded-lg border border-border bg-surface text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Roles</option>
            <option value="student">Student</option>
            <option value="professional">Professional</option>
            <option value="mentor">Mentor</option>
            <option value="founder">Founder</option>
            <option value="recruiter">Recruiter</option>
          </select>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface-elevated">
                <th className="text-left p-3 font-medium text-text-secondary">
                  User
                </th>
                <th className="text-left p-3 font-medium text-text-secondary">
                  Email
                </th>
                <th className="text-left p-3 font-medium text-text-secondary">
                  Role
                </th>
                <th className="text-left p-3 font-medium text-text-secondary">
                  Status
                </th>
                <th className="text-left p-3 font-medium text-text-secondary">
                  Joined
                </th>
                <th className="text-right p-3 font-medium text-text-secondary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border hover:bg-surface-elevated/50 transition-colors"
                >
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <UserAvatar
                        name={user.name || "User"}
                        src={user.profile_photo_url}
                        size="sm"
                      />
                      <span className="font-medium text-text-primary truncate max-w-[150px]">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-text-secondary truncate max-w-[200px]">
                    {user.email}
                  </td>
                  <td className="p-3">
                    <Badge variant={roleColors[user.role || ""] || "outline"}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="p-3">
                    {user.is_active ? (
                      <Badge variant="success">Active</Badge>
                    ) : (
                      <Badge variant="destructive">Banned</Badge>
                    )}
                  </td>
                  <td className="p-3 text-text-muted whitespace-nowrap">
                    {user.created_at ? formatDate(user.created_at) : "-"}
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-1 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => user.id && onViewProfile(user.id)}
                        title="View Profile"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => user.id && onFeature(user.id)}
                        title="Feature User"
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => user.id && onBan(user.id)}
                        title={user.is_active ? "Ban User" : "Unban User"}
                        className={user.is_active ? "text-error hover:text-error" : "text-success hover:text-success"}
                      >
                        {user.is_active ? (
                          <Ban className="w-4 h-4" />
                        ) : (
                          <ShieldOff className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && (
          <div className="p-8 text-center text-text-muted text-sm">
            No users found matching your criteria.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
