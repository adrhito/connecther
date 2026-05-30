"use client";

import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <Navbar />
      <main id="main-content" className="flex-1 pb-16 lg:pb-0">
        {children}
      </main>
      <MobileNav />
    </ProtectedRoute>
  );
}
