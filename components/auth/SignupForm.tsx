"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import type { SignupData } from "@/lib/context/AuthContext";
import type { UserRole } from "@/lib/types";
import { INDUSTRIES } from "@/lib/constants";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const steps = ["Account", "Role", "Profile", "Skills", "Resume", "Privacy"];

const roleOptions: { value: UserRole; label: string; description: string }[] = [
  { value: "student", label: "Student", description: "Looking for internships, mentorship, and career guidance" },
  { value: "professional", label: "Professional", description: "Building your career and expanding your network" },
  { value: "mentor", label: "Mentor", description: "Guide and support other women in their careers" },
  { value: "founder", label: "Founder", description: "Building a startup and connecting with the ecosystem" },
  { value: "recruiter", label: "Recruiter", description: "Find and connect with top women talent" },
  { value: "company_admin", label: "Company Admin", description: "Manage your company page and respond to reviews" },
];

export function SignupForm() {
  const router = useRouter();
  const { signup } = useAuth();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SignupData>({
    email: "",
    password: "",
    name: "",
    role: "student",
    headline: "",
    school: "",
    company: "",
    industry: "",
    location: "",
    skills: [],
    interests: [],
    career_goals: [],
  });
  const [skillInput, setSkillInput] = useState("");

  const update = (fields: Partial<SignupData>) => setData((d) => ({ ...d, ...fields }));

  const canNext = () => {
    if (step === 0) return data.email && data.password && data.name;
    if (step === 1) return data.role;
    return true;
  };

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    const result = await signup(data);
    if (result.success) {
      router.push("/feed");
    } else {
      setError(result.error || "Signup failed");
    }
    setLoading(false);
  };

  const addSkill = () => {
    if (skillInput.trim() && !data.skills?.includes(skillInput.trim())) {
      update({ skills: [...(data.skills || []), skillInput.trim()] });
      setSkillInput("");
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-8">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">cH</span>
          </div>
        </div>
        <h1 className="text-2xl font-heading font-bold text-text-primary">Join connectHer</h1>
        <p className="text-sm text-text-secondary mt-1">Step {step + 1} of {steps.length}: {steps[step]}</p>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1 mb-6">
        {steps.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              i <= step ? "bg-primary" : "bg-border"
            )}
          />
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-error/10 text-error text-sm">{error}</div>
      )}

      {/* Step 1: Account */}
      {step === 0 && (
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1">Full Name</label>
            <input id="name" type="text" value={data.name} onChange={(e) => update({ name: e.target.value })} required className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Your full name" />
          </div>
          <div>
            <label htmlFor="s-email" className="block text-sm font-medium text-text-primary mb-1">Email</label>
            <input id="s-email" type="email" value={data.email} onChange={(e) => update({ email: e.target.value })} required className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="s-password" className="block text-sm font-medium text-text-primary mb-1">Password</label>
            <input id="s-password" type="password" value={data.password} onChange={(e) => update({ password: e.target.value })} required minLength={8} className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="At least 8 characters" />
          </div>
        </div>
      )}

      {/* Step 2: Role */}
      {step === 1 && (
        <div className="space-y-3">
          {roleOptions.map((r) => (
            <button
              key={r.value}
              onClick={() => update({ role: r.value })}
              className={cn(
                "w-full text-left p-4 rounded-lg border transition-colors",
                data.role === r.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm text-text-primary">{r.label}</span>
                {data.role === r.value && <Check className="w-4 h-4 text-primary" />}
              </div>
              <p className="text-xs text-text-secondary mt-1">{r.description}</p>
            </button>
          ))}
        </div>
      )}

      {/* Step 3: Profile */}
      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label htmlFor="headline" className="block text-sm font-medium text-text-primary mb-1">Headline</label>
            <input id="headline" type="text" value={data.headline || ""} onChange={(e) => update({ headline: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="e.g. Computer Science Student at MIT" />
          </div>
          <div>
            <label htmlFor="school" className="block text-sm font-medium text-text-primary mb-1">School</label>
            <input id="school" type="text" value={data.school || ""} onChange={(e) => update({ school: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Your university" />
          </div>
          <div>
            <label htmlFor="company-input" className="block text-sm font-medium text-text-primary mb-1">Company</label>
            <input id="company-input" type="text" value={data.company || ""} onChange={(e) => update({ company: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Your company" />
          </div>
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-text-primary mb-1">Industry</label>
            <select id="industry" value={data.industry || ""} onChange={(e) => update({ industry: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Select industry</option>
              {INDUSTRIES.map((ind) => (<option key={ind} value={ind}>{ind}</option>))}
            </select>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-text-primary mb-1">Location</label>
            <input id="location" type="text" value={data.location || ""} onChange={(e) => update({ location: e.target.value })} className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="City, State" />
          </div>
        </div>
      )}

      {/* Step 4: Skills */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1">Skills</label>
            <div className="flex gap-2">
              <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())} className="flex-1 h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Add a skill and press Enter" />
              <button onClick={addSkill} type="button" className="px-4 h-10 bg-primary text-white text-sm rounded-lg hover:bg-primary-light transition-colors">Add</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {data.skills?.map((skill) => (
                <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1 bg-accent/20 text-primary text-xs rounded-full">
                  {skill}
                  <button onClick={() => update({ skills: data.skills?.filter((s) => s !== skill) })} className="hover:text-error">&times;</button>
                </span>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="career-goals" className="block text-sm font-medium text-text-primary mb-1">Career Goals</label>
            <textarea id="career-goals" value={data.career_goals?.join(", ") || ""} onChange={(e) => update({ career_goals: e.target.value.split(",").map((g) => g.trim()).filter(Boolean) })} rows={3} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="e.g. Break into investment banking, Find a mentor in consulting" />
          </div>
        </div>
      )}

      {/* Step 5: Resume */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <p className="text-text-secondary text-sm mb-2">Upload your resume (PDF)</p>
            <button type="button" className="px-4 py-2 bg-surface-elevated text-text-primary text-sm rounded-lg hover:bg-border transition-colors">
              Choose File
            </button>
            <p className="text-xs text-text-muted mt-2">Upload coming soon. Skip for now.</p>
          </div>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <p className="text-text-secondary text-sm mb-2">Import from LinkedIn</p>
            <button type="button" className="px-4 py-2 bg-[#0077B5] text-white text-sm rounded-lg hover:opacity-90 transition-opacity">
              Connect LinkedIn
            </button>
            <p className="text-xs text-text-muted mt-2">LinkedIn import coming soon. Skip for now.</p>
          </div>
        </div>
      )}

      {/* Step 6: Privacy */}
      {step === 5 && (
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">Choose your default privacy settings. You can change these anytime.</p>
          {[
            { label: "Make my profile visible to all members", default: true },
            { label: "Show my salary submissions to the community", default: true },
            { label: "Show that I'm open to job opportunities", default: false },
            { label: "Allow anyone to message me", default: true },
            { label: "Hide my profile from recruiters", default: false },
          ].map((setting) => (
            <label key={setting.label} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-surface-elevated transition-colors cursor-pointer">
              <span className="text-sm text-text-primary">{setting.label}</span>
              <input type="checkbox" defaultChecked={setting.default} className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
            </label>
          ))}
          <p className="text-xs text-text-muted">
            By signing up, you agree to our Terms of Service and{" "}
            <Link href="/guidelines" className="text-primary hover:underline">Community Guidelines</Link>.
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handleBack}
          disabled={step === 0}
          className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary disabled:opacity-0 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {step < steps.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={!canNext()}
            className="flex items-center gap-1 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50"
          >
            Continue
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-light transition-colors disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Complete Signup"}
          </button>
        )}
      </div>

      {step === 0 && (
        <p className="mt-4 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">Log in</Link>
        </p>
      )}
    </div>
  );
}
