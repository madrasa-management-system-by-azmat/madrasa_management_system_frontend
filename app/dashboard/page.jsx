"use client";

import Link from "next/link";
import {
  ArrowUpLeft,
  ClipboardCheck,
  LayoutGrid,
  Plus,
  Sparkles,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import DashboardMenuGrid from "@/components/dashboard/DashboardMenuGrid";

export default function DashboardPage() {
  const { user, isSuperAdmin } = useAuthContext();
  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.username ||
    "صارف";
  const roleLabels = {
    admin: "منتظم",
    operator: "آپریٹر",
    accountant: "اکاؤنٹنٹ",
    super_admin: "سپر ایڈمن",
  };

  return (
    <div className="space-y-7 lg:space-y-9">
      <section className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card shadow-sm">
        <div className="absolute inset-y-0 right-0 w-2 bg-primary" />
        <div className="absolute -right-20 -top-28 size-72 rounded-full bg-primary/10" />
        <div className="absolute -bottom-24 left-10 size-52 rounded-full bg-info/10" />
        <div className="relative flex flex-col gap-6 px-6 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-10">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="size-3.5" />
                خوش آمدید
              </span>
              <span className="rounded-full border border-border bg-background/70 px-3 py-1 text-xs text-muted-foreground">
                {roleLabels[user?.role] || "صارف"}
              </span>
            </div>
            <h1 className="mt-5 text-3xl font-bold leading-relaxed tracking-tight sm:text-4xl">
              السلام علیکم، {fullName}
            </h1>
            <p className="mt-2 text-sm leading-7 text-muted-foreground sm:text-base">
              {user?.madrasa_name
                ? `${user.madrasa_name} کے تمام انتظامی شعبے ایک منظم جگہ پر۔`
                : "مطلوبہ انتظامی شعبہ منتخب کریں اور اپنا کام شروع کریں۔"}
            </p>
          </div>

          {!isSuperAdmin && (
            <div className="grid w-full gap-3 sm:grid-cols-2 lg:w-auto lg:min-w-80">
              {user?.role !== "accountant" && (
                <Link
                  href="/dashboard/students/admissions"
                  className={buttonVariants({
                    size: "lg",
                    className:
                      "h-12 w-full justify-between rounded-xl px-4 text-base shadow-sm",
                  })}
                >
                  <span className="flex items-center gap-2">
                    <Plus /> نئی درخواست
                  </span>
                  <ArrowUpLeft className="size-4" />
                </Link>
              )}
              {user?.role !== "accountant" && (
                <Link
                  href="/dashboard/attendance"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className:
                      "h-12 w-full justify-between rounded-xl bg-background/80 px-4 text-base",
                  })}
                >
                  <span className="flex items-center gap-2">
                    <ClipboardCheck /> آج کی حاضری
                  </span>
                  <ArrowUpLeft className="size-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <LayoutGrid className="size-5" />
          </span>
          <div>
            <p className="text-xs font-semibold text-primary">مرکزی مینیو</p>
            <h2 className="mt-0.5 text-xl font-bold sm:text-2xl">
              انتظامی شعبہ منتخب کریں
            </h2>
          </div>
        </div>
        <DashboardMenuGrid hideHeading />
      </section>
    </div>
  );
}
