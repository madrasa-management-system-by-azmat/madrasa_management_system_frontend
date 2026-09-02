"use client";

import { useEffect, useState } from "react";

import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import { useAuthContext } from "@/context/AuthContext";
import { useMadrasaProfile } from "@/hooks/useSettings";
import { applyBrandTheme } from "@/lib/brandTheme";

export default function DashboardShell({ children }) {
  const { isSuperAdmin } = useAuthContext();
  const { data: madrasaProfile } = useMadrasaProfile({
    enabled: !isSuperAdmin,
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const savedTheme = window.localStorage.getItem("theme");

    return savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    applyBrandTheme(isSuperAdmin ? null : madrasaProfile);
  }, [isSuperAdmin, madrasaProfile]);

  function toggleTheme() {
    const nextThemeIsDark = !isDark;

    document.documentElement.classList.toggle("dark", nextThemeIsDark);
    window.localStorage.setItem("theme", nextThemeIsDark ? "dark" : "light");
    setIsDark(nextThemeIsDark);
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <DashboardSidebar
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />

      <div className="min-h-screen lg:pr-72">
        <DashboardTopbar
          isDark={isDark}
          onMenuToggle={() => setIsMenuOpen(true)}
          onThemeToggle={toggleTheme}
        />
        <main className="w-full px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
