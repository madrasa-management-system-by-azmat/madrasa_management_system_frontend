"use client";

import { useEffect, useState } from "react";

import DashboardTopbar from "@/components/dashboard/DashboardTopbar";
import GlobalSearchDialog from "@/components/dashboard/GlobalSearchDialog";
import { useAuthContext } from "@/context/AuthContext";
import { useMadrasaProfile } from "@/hooks/useSettings";
import { applyBrandTheme } from "@/lib/brandTheme";

export default function DashboardShell({ children }) {
  const { isSuperAdmin } = useAuthContext();
  const { data: madrasaProfile } = useMadrasaProfile({
    enabled: !isSuperAdmin,
  });
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const savedTheme = window.localStorage.getItem("theme");

    return savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    applyBrandTheme(isSuperAdmin ? null : madrasaProfile);
  }, [isSuperAdmin, madrasaProfile]);

  useEffect(() => {
    function openSearch(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    }
    window.addEventListener("keydown", openSearch);
    return () => window.removeEventListener("keydown", openSearch);
  }, []);

  function toggleTheme() {
    const nextThemeIsDark = !isDark;

    document.documentElement.classList.toggle("dark", nextThemeIsDark);
    window.localStorage.setItem("theme", nextThemeIsDark ? "dark" : "light");
    setIsDark(nextThemeIsDark);
  }

  return (
    <div dir="rtl" className="min-h-screen bg-background text-foreground">
      <div className="min-h-screen">
        <DashboardTopbar
          isDark={isDark}
          madrasaProfile={madrasaProfile}
          onThemeToggle={toggleTheme}
          onSearchOpen={() => setIsSearchOpen(true)}
        />
        <GlobalSearchDialog
          open={isSearchOpen}
          onOpenChange={setIsSearchOpen}
        />
        <main className="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
