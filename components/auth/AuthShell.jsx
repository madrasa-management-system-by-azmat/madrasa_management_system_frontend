"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

import AuthBrandPanel from "@/components/auth/AuthBrandPanel";
import { Button } from "@/components/ui/button";

export default function AuthShell({ children }) {
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

  function toggleTheme() {
    const nextThemeIsDark = !isDark;

    document.documentElement.classList.toggle("dark", nextThemeIsDark);
    window.localStorage.setItem("theme", nextThemeIsDark ? "dark" : "light");
    setIsDark(nextThemeIsDark);
  }

  return (
    <main dir="rtl" className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-2">
        <AuthBrandPanel />
        <section className="relative flex min-h-screen items-center justify-center px-5 py-12 sm:px-8 lg:px-12">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute left-5 top-5 sm:left-8 sm:top-8"
            aria-label={isDark ? "لائٹ موڈ" : "ڈارک موڈ"}
            onClick={toggleTheme}
          >
            {isDark ? <Sun /> : <Moon />}
          </Button>
          {children}
        </section>
      </div>
    </main>
  );
}
