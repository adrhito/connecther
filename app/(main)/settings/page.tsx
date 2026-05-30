"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useTheme } from "@/lib/hooks/useTheme";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import {
  User,
  Bell,
  Lock,
  Eye,
  Palette,
  Shield,
  LogOut,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("account");
  const [notifSettings, setNotifSettings] = useState({
    connection_requests: true,
    messages: true,
    job_matches: true,
    mentorship: true,
    post_interactions: true,
    marketing: false,
  });
  const [privacySettings, setPrivacySettings] = useState({
    profile_visibility: "public" as "public" | "connections" | "private",
    show_email: false,
    show_phone: false,
    show_activity: true,
    allow_messages_from: "everyone" as "everyone" | "connections" | "none",
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const sections = [
    { id: "account", label: "Account", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Lock },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "security", label: "Security", icon: Shield },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-heading font-bold text-text-primary mb-6">
        Settings
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar nav */}
        <div className="md:col-span-1">
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === section.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-text-secondary hover:bg-surface-elevated hover:text-text-primary"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {section.label}
                </button>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-error hover:bg-error/5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="md:col-span-3 space-y-4">
          {/* Account */}
          {activeSection === "account" && (
            <>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-text-primary mb-4">
                    Account Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Name
                      </label>
                      <p className="text-sm text-text-primary">{user.name}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Email
                      </label>
                      <p className="text-sm text-text-primary">{user.email}</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Role
                      </label>
                      <p className="text-sm text-text-primary capitalize">
                        {user.role}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => router.push("/profile/edit")}
                  >
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-text-primary mb-2">
                    Danger Zone
                  </h2>
                  <p className="text-sm text-text-secondary mb-4">
                    Once you delete your account, there is no going back.
                  </p>
                  <Button variant="destructive" size="sm">
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </>
          )}

          {/* Notifications */}
          {activeSection === "notifications" && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4">
                  Notification Preferences
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      key: "connection_requests",
                      label: "Connection requests",
                      desc: "Someone wants to connect with you",
                    },
                    {
                      key: "messages",
                      label: "Messages",
                      desc: "New direct messages",
                    },
                    {
                      key: "job_matches",
                      label: "Job matches",
                      desc: "New jobs matching your preferences",
                    },
                    {
                      key: "mentorship",
                      label: "Mentorship updates",
                      desc: "Mentorship requests and responses",
                    },
                    {
                      key: "post_interactions",
                      label: "Post interactions",
                      desc: "Likes, comments, and reposts on your posts",
                    },
                    {
                      key: "marketing",
                      label: "Marketing emails",
                      desc: "Product updates and newsletters",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {item.label}
                        </p>
                        <p className="text-xs text-text-secondary">
                          {item.desc}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          setNotifSettings((prev) => ({
                            ...prev,
                            [item.key]:
                              !prev[item.key as keyof typeof prev],
                          }))
                        }
                        className={`relative w-10 h-5 rounded-full transition-colors ${
                          notifSettings[
                            item.key as keyof typeof notifSettings
                          ]
                            ? "bg-primary"
                            : "bg-border"
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                            notifSettings[
                              item.key as keyof typeof notifSettings
                            ]
                              ? "translate-x-5"
                              : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Privacy */}
          {activeSection === "privacy" && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4">
                  Privacy Settings
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      <Eye className="w-4 h-4 inline mr-1.5" />
                      Profile Visibility
                    </label>
                    <div className="space-y-2">
                      {[
                        {
                          value: "public",
                          label: "Public",
                          desc: "Anyone can see your profile",
                        },
                        {
                          value: "connections",
                          label: "Connections only",
                          desc: "Only your connections can see your full profile",
                        },
                        {
                          value: "private",
                          label: "Private",
                          desc: "Only you can see your profile",
                        },
                      ].map((opt) => (
                        <label
                          key={opt.value}
                          className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-surface-elevated cursor-pointer transition-colors"
                        >
                          <input
                            type="radio"
                            name="profile_visibility"
                            value={opt.value}
                            checked={
                              privacySettings.profile_visibility ===
                              opt.value
                            }
                            onChange={() =>
                              setPrivacySettings((prev) => ({
                                ...prev,
                                profile_visibility: opt.value as typeof prev.profile_visibility,
                              }))
                            }
                            className="mt-0.5 accent-primary"
                          />
                          <div>
                            <p className="text-sm font-medium text-text-primary">
                              {opt.label}
                            </p>
                            <p className="text-xs text-text-secondary">
                              {opt.desc}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Who can message you
                    </label>
                    <select
                      value={privacySettings.allow_messages_from}
                      onChange={(e) =>
                        setPrivacySettings((prev) => ({
                          ...prev,
                          allow_messages_from: e.target.value as typeof prev.allow_messages_from,
                        }))
                      }
                      className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary"
                    >
                      <option value="everyone">Everyone</option>
                      <option value="connections">Connections only</option>
                      <option value="none">No one</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        key: "show_email",
                        label: "Show email on profile",
                      },
                      {
                        key: "show_activity",
                        label: "Show activity status",
                      },
                    ].map((item) => (
                      <div
                        key={item.key}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-text-primary">
                          {item.label}
                        </span>
                        <button
                          onClick={() =>
                            setPrivacySettings((prev) => ({
                              ...prev,
                              [item.key]:
                                !prev[
                                  item.key as keyof typeof prev
                                ],
                            }))
                          }
                          className={`relative w-10 h-5 rounded-full transition-colors ${
                            privacySettings[
                              item.key as keyof typeof privacySettings
                            ]
                              ? "bg-primary"
                              : "bg-border"
                          }`}
                        >
                          <span
                            className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                              privacySettings[
                                item.key as keyof typeof privacySettings
                              ]
                                ? "translate-x-5"
                                : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Appearance */}
          {activeSection === "appearance" && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4">
                  Appearance
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      value: "light",
                      label: "Light",
                      icon: Sun,
                    },
                    {
                      value: "dark",
                      label: "Dark",
                      icon: Moon,
                    },
                    {
                      value: "system",
                      label: "System",
                      icon: Monitor,
                    },
                  ].map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setTheme(opt.value as "light" | "dark")}
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors ${
                          theme === opt.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-surface-elevated"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${
                            theme === opt.value
                              ? "text-primary"
                              : "text-text-secondary"
                          }`}
                        />
                        <span
                          className={`text-sm ${
                            theme === opt.value
                              ? "text-primary font-medium"
                              : "text-text-secondary"
                          }`}
                        >
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security */}
          {activeSection === "security" && (
            <>
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-text-primary mb-4">
                    Change Password
                  </h2>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary"
                        placeholder="Enter new password"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-text-secondary mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <Button size="sm">Update Password</Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold text-text-primary mb-2">
                    Active Sessions
                  </h2>
                  <p className="text-sm text-text-secondary mb-3">
                    Manage your active sessions across devices.
                  </p>
                  <div className="p-3 rounded-lg border border-border bg-surface-elevated">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          Current Session
                        </p>
                        <p className="text-xs text-text-muted">
                          Last active: just now
                        </p>
                      </div>
                      <span className="text-xs text-success font-medium">
                        Active
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
