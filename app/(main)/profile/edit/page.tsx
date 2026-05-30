"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Save, ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";

export default function EditProfilePage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    headline: user?.headline || "",
    about: user?.about || "",
    location: user?.location || "",
    company: user?.company || "",
    school: user?.school || "",
    industry: user?.industry || "",
    portfolio_url: user?.portfolio_url || "",
    mentor_availability: user?.mentor_availability || "",
    skills: user?.skills || [],
    interests: user?.interests || [],
    career_goals: user?.career_goals || [],
  });

  const [newSkill, setNewSkill] = useState("");
  const [newInterest, setNewInterest] = useState("");
  const [newGoal, setNewGoal] = useState("");

  if (!user) {
    return (
      <div className="flex justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addToArray = (field: "skills" | "interests" | "career_goals", value: string) => {
    if (!value.trim()) return;
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), value.trim()],
    }));
  };

  const removeFromArray = (field: "skills" | "interests" | "career_goals", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMessage("");

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        updateUser(data.user);
        setSuccessMessage("Profile updated successfully!");
        setTimeout(() => {
          router.push(`/profile/${user.id}`);
        }, 1000);
      }
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href={`/profile/${user.id}`}
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-text-primary font-heading">
          Edit Profile
        </h1>
      </div>

      {successMessage && (
        <div className="mb-4 p-3 bg-success/10 text-success text-sm rounded-lg border border-success/20">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile photo section */}
        <div className="bg-surface border border-border rounded-lg p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-text-primary mb-4">Profile Photo</h2>
          <div className="flex items-center gap-4">
            <UserAvatar
              name={formData.name || user.name}
              src={user.profile_photo_url}
              size="xl"
            />
            <div>
              <p className="text-sm text-text-secondary">
                Your profile photo helps others recognize you.
              </p>
              <button
                type="button"
                className="mt-2 text-xs text-primary font-medium hover:underline"
              >
                Change photo
              </button>
            </div>
          </div>
        </div>

        {/* Basic info */}
        <div className="bg-surface border border-border rounded-lg p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-text-primary mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-medium text-text-secondary mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label htmlFor="headline" className="block text-xs font-medium text-text-secondary mb-1">
                Headline
              </label>
              <input
                id="headline"
                name="headline"
                type="text"
                value={formData.headline}
                onChange={handleChange}
                placeholder="e.g. Software Engineer at Google"
                className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label htmlFor="about" className="block text-xs font-medium text-text-secondary mb-1">
                About
              </label>
              <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us about yourself..."
                className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted resize-none outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="location" className="block text-xs font-medium text-text-secondary mb-1">
                  Location
                </label>
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. San Francisco, CA"
                  className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label htmlFor="industry" className="block text-xs font-medium text-text-secondary mb-1">
                  Industry
                </label>
                <input
                  id="industry"
                  name="industry"
                  type="text"
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder="e.g. Technology"
                  className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="company" className="block text-xs font-medium text-text-secondary mb-1">
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="e.g. Google"
                  className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label htmlFor="school" className="block text-xs font-medium text-text-secondary mb-1">
                  School
                </label>
                <input
                  id="school"
                  name="school"
                  type="text"
                  value={formData.school}
                  onChange={handleChange}
                  placeholder="e.g. Stanford University"
                  className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="portfolio_url" className="block text-xs font-medium text-text-secondary mb-1">
                Portfolio URL
              </label>
              <input
                id="portfolio_url"
                name="portfolio_url"
                type="url"
                value={formData.portfolio_url}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
                className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary transition-colors"
              />
            </div>

            {user.is_mentor && (
              <div>
                <label htmlFor="mentor_availability" className="block text-xs font-medium text-text-secondary mb-1">
                  Mentor Availability
                </label>
                <input
                  id="mentor_availability"
                  name="mentor_availability"
                  type="text"
                  value={formData.mentor_availability}
                  onChange={handleChange}
                  placeholder="e.g. Weekday evenings"
                  className="w-full bg-surface-elevated border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary transition-colors"
                />
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-surface border border-border rounded-lg p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-text-primary mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.skills.map((skill, index) => (
              <span
                key={`${skill}-${index}`}
                className="flex items-center gap-1 px-2.5 py-1 bg-surface-elevated border border-border rounded-full text-xs text-text-primary"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeFromArray("skills", index)}
                  className="text-text-muted hover:text-error transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addToArray("skills", newSkill);
                  setNewSkill("");
                }
              }}
              placeholder="Add a skill"
              className="flex-1 bg-surface-elevated border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary transition-colors"
            />
            <button
              type="button"
              onClick={() => {
                addToArray("skills", newSkill);
                setNewSkill("");
              }}
              className="px-3 py-1.5 bg-surface-elevated border border-border rounded-lg text-text-secondary hover:text-primary transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Interests */}
        <div className="bg-surface border border-border rounded-lg p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-text-primary mb-4">Interests</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.interests.map((interest, index) => (
              <span
                key={`${interest}-${index}`}
                className="flex items-center gap-1 px-2.5 py-1 bg-surface-elevated border border-border rounded-full text-xs text-text-primary"
              >
                {interest}
                <button
                  type="button"
                  onClick={() => removeFromArray("interests", index)}
                  className="text-text-muted hover:text-error transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addToArray("interests", newInterest);
                  setNewInterest("");
                }
              }}
              placeholder="Add an interest"
              className="flex-1 bg-surface-elevated border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary transition-colors"
            />
            <button
              type="button"
              onClick={() => {
                addToArray("interests", newInterest);
                setNewInterest("");
              }}
              className="px-3 py-1.5 bg-surface-elevated border border-border rounded-lg text-text-secondary hover:text-primary transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Career Goals */}
        <div className="bg-surface border border-border rounded-lg p-4 sm:p-6">
          <h2 className="text-sm font-semibold text-text-primary mb-4">Career Goals</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.career_goals.map((goal, index) => (
              <span
                key={`${goal}-${index}`}
                className="flex items-center gap-1 px-2.5 py-1 bg-accent/10 border border-accent/20 rounded-full text-xs text-primary"
              >
                {goal}
                <button
                  type="button"
                  onClick={() => removeFromArray("career_goals", index)}
                  className="text-text-muted hover:text-error transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addToArray("career_goals", newGoal);
                  setNewGoal("");
                }
              }}
              placeholder="Add a career goal"
              className="flex-1 bg-surface-elevated border border-border rounded-lg px-3 py-1.5 text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary transition-colors"
            />
            <button
              type="button"
              onClick={() => {
                addToArray("career_goals", newGoal);
                setNewGoal("");
              }}
              className="px-3 py-1.5 bg-surface-elevated border border-border rounded-lg text-text-secondary hover:text-primary transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href={`/profile/${user.id}`}
            className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-1.5 px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
