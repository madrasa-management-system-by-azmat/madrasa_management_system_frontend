"use client";

import { useEffect, useState } from "react";
import { Bell, Menu, Moon, Search, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function DashboardTopbar({
  isDark,
  onMenuToggle,
  onThemeToggle,
}) {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    function updateDate() {
      setCurrentDate(
        new Intl.DateTimeFormat("ur-PK", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
          timeZone: "Asia/Karachi",
        }).format(new Date()),
      );
    }
    updateDate();
    const interval = window.setInterval(updateDate, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex h-16 w-full items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="مینیو کھولیں"
            onClick={onMenuToggle}
          >
            <Menu />
          </Button>
          <label className="relative hidden sm:block">
            <Search
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="طلبہ، فیس یا ریکارڈ تلاش کریں"
              className="h-9 w-72 rounded-lg border border-input bg-card pr-9 pl-3 text-sm outline-none transition-shadow duration-200 placeholder:text-muted-foreground focus:ring-3 focus:ring-ring/50"
              aria-label="ریکارڈ تلاش کریں"
            />
          </label>
        </div>

        <div className="flex items-center gap-2">
          <p className="hidden text-xs text-muted-foreground md:block">
            {currentDate}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={isDark ? "لائٹ موڈ" : "ڈارک موڈ"}
            onClick={onThemeToggle}
          >
            {isDark ? <Sun /> : <Moon />}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="اطلاعات"
          >
            <Bell />
            <span
              className="absolute left-2 top-2 size-1.5 rounded-full bg-destructive"
              aria-hidden="true"
            />
          </Button>
        </div>
      </div>
    </header>
  );
}
