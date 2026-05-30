"use client";

import { Hero } from "@/components/landing/Hero";
import { FeatureSection } from "@/components/landing/FeatureSection";
import { TestimonialSection } from "@/components/landing/TestimonialCard";
import { WaitlistForm } from "@/components/landing/WaitlistForm";
import { PartnerLogos } from "@/components/landing/PartnerLogos";
import { StatsSection } from "@/components/landing/StatsSection";
import { PreviewSection } from "@/components/landing/PreviewSection";
import { Footer } from "@/components/layout/Footer";
import { LandingNav } from "@/components/landing/LandingNav";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <LandingNav />
      <Hero />
      <PartnerLogos />
      <FeatureSection />
      <StatsSection />
      <PreviewSection />
      <TestimonialSection />
      <WaitlistForm />
      <Footer />
    </div>
  );
}
