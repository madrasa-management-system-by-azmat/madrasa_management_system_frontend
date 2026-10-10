"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  Bell,
  Building2,
  LogOut,
  Moon,
  Search,
  Settings2,
  Sun,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { getMediaUrl } from "@/lib/apiClient";
import { toast } from "@/lib/toast";

export default function DashboardTopbar({
  isDark,
  madrasaProfile,
  onThemeToggle,
  onSearchOpen,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, endSession, isSuperAdmin } = useAuthContext();
  const [currentDate, setCurrentDate] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.username ||
    "صارف";

  async function handleLogout() {
    setIsLoggingOut(true);
    await endSession();
    toast.success("لاگ آؤٹ", "آپ محفوظ طریقے سے لاگ آؤٹ ہو گئے ہیں۔");
    router.replace("/auth");
  }

  function goBack() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/dashboard");
    }
  }

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
    <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="mx-auto flex h-16 w-full max-w-screen-2xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-3">
          {pathname !== "/dashboard" && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="ایک صفحہ پیچھے جائیں"
              title="واپس جائیں"
              onClick={goBack}
            >
              <ArrowRight />
            </Button>
          )}
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-card text-primary">
              {madrasaProfile?.logo ? (
                <Image
                  src={getMediaUrl(madrasaProfile.logo)}
                  alt={madrasaProfile.name || "مدرسہ"}
                  width={40}
                  height={40}
                  unoptimized
                  className="size-full object-contain p-0.5"
                />
              ) : (
                <Building2 className="size-5" />
              )}
            </span>
            <span className="hidden sm:block">
              <span className="block max-w-64 truncate text-sm font-bold">
                {madrasaProfile?.name || user?.madrasa_name || "نظامِ انتظام"}
              </span>
              <span className="block text-xs text-muted-foreground">
                {madrasaProfile?.name_english || "مرکزی ڈیش بورڈ"}
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={onSearchOpen}
            className="relative hidden h-9 w-72 items-center rounded-lg border border-input bg-card pr-9 pl-3 text-right text-sm text-muted-foreground transition-shadow hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:flex"
            aria-label="عالمی تلاش کھولیں"
          >
            <Search
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <span className="truncate">طلبہ، فیس یا ریکارڈ تلاش کریں</span>
            <kbd className="mr-auto rounded border border-border bg-muted px-1.5 py-0.5 text-[10px]">
              Ctrl K
            </kbd>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="sm:hidden"
            aria-label="عالمی تلاش کھولیں"
            onClick={onSearchOpen}
          >
            <Search />
          </Button>
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
          <div className="relative">
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-border bg-card p-1.5 pl-3 text-right transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              onClick={() => setIsProfileOpen((open) => !open)}
              aria-expanded={isProfileOpen}
            >
              <span className="grid size-8 place-items-center overflow-hidden rounded-lg bg-primary/10 text-sm font-bold text-primary">
                {user?.photo ? (
                  <Image
                    src={getMediaUrl(user.photo)}
                    alt={fullName}
                    width={32}
                    height={32}
                    unoptimized
                    className="size-full object-cover"
                  />
                ) : (
                  fullName.charAt(0)
                )}
              </span>
              <span className="hidden max-w-32 truncate text-sm font-semibold md:block">
                {fullName}
              </span>
            </button>
            {isProfileOpen && (
              <div className="absolute left-0 top-full z-50 mt-2 w-52 rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg">
                <Link
                  href="/dashboard/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent"
                >
                  <UserRound className="size-4" /> میرا پروفائل
                </Link>
                {!isSuperAdmin && user?.role === "admin" && (
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-accent"
                  >
                    <Settings2 className="size-4" /> ترتیبات
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 disabled:opacity-60"
                >
                  <LogOut className="size-4" />{" "}
                  {isLoggingOut ? "لاگ آؤٹ ہو رہا ہے..." : "لاگ آؤٹ"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
