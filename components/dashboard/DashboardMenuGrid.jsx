"use client";

import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";

import { useAuthContext } from "@/context/AuthContext";
import { getDashboardNavigation } from "@/lib/dashboardNavigation";

const iconTones = [
  "bg-primary text-primary-foreground",
  "bg-success text-success-foreground",
  "bg-warning text-warning-foreground",
  "bg-info text-info-foreground",
  "bg-destructive text-destructive-foreground",
];

export default function DashboardMenuGrid({ hideHeading = false }) {
  const { user, isSuperAdmin } = useAuthContext();
  const items = getDashboardNavigation(user, isSuperAdmin);

  return (
    <section aria-labelledby="main-menu-heading">
      {!hideHeading && (
        <div className="mb-5">
          <p className="text-sm font-medium text-primary">مرکزی مینیو</p>
          <h2
            id="main-menu-heading"
            className="mt-1 text-xl font-bold sm:text-2xl"
          >
            انتظامی شعبہ منتخب کریں
          </h2>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ label, description, icon: Icon, href }, index) => (
          <Link
            key={href}
            href={href}
            className="group relative flex min-h-40 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:p-6"
          >
            <span
              className={`absolute inset-y-0 right-0 w-1 ${iconTones[index % iconTones.length].split(" ")[0]}`}
            />
            <span className="flex w-full items-start gap-4 pr-1">
              <span
                className={`grid size-13 shrink-0 place-items-center rounded-2xl shadow-sm transition-transform duration-200 group-hover:scale-105 ${iconTones[index % iconTones.length]}`}
              >
                <Icon className="size-6.5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xl font-bold sm:text-2xl">
                  {label}
                </span>
                <span className="mt-2 block text-sm leading-7 text-muted-foreground">
                  {description}
                </span>
              </span>
              <span className="grid size-8 shrink-0 place-items-center rounded-full border border-border bg-background text-muted-foreground transition group-hover:border-primary/30 group-hover:bg-primary group-hover:text-primary-foreground">
                <ArrowUpLeft className="size-4" aria-hidden="true" />
              </span>
            </span>
            <span
              className="absolute bottom-3 left-4 text-xs font-semibold text-muted-foreground/40"
              dir="ltr"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
