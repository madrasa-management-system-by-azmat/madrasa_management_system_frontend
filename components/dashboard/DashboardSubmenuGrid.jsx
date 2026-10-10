"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpLeft } from "lucide-react";

import { useAuthContext } from "@/context/AuthContext";
import { moduleSubmenus } from "@/lib/dashboardNavigation";

export default function DashboardSubmenuGrid({ moduleKey }) {
  const { user, isSuperAdmin } = useAuthContext();
  const menu = moduleSubmenus[moduleKey];

  if (
    !menu ||
    isSuperAdmin ||
    (menu.roles && !menu.roles.includes(user?.role))
  ) {
    return (
      <section className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">
        یہ مینیو دستیاب نہیں ہے۔
      </section>
    );
  }

  const Icon = menu.icon;

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <Icon className="size-7" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-medium text-primary">ذیلی مینیو</p>
            <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
              {menu.label}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {menu.description}
            </p>
          </div>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 self-start rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <ArrowRight className="size-4" aria-hidden="true" />
          مرکزی مینیو
        </Link>
      </header>

      <section
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        aria-label={`${menu.label} مینیو`}
      >
        {menu.items.map(
          ({ label, description, icon: ItemIcon, href }, index) => (
            <Link
              key={href}
              href={href}
              className="group relative flex min-h-28 overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:min-h-32"
            >
              <span className="absolute inset-x-0 top-0 h-1 bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="flex w-full items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <ItemIcon className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold sm:text-lg">
                    {label}
                  </span>
                  <span className="mt-1.5 block text-sm leading-6 text-muted-foreground">
                    {description}
                  </span>
                </span>
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
                  <ArrowUpLeft className="size-4" aria-hidden="true" />
                </span>
              </span>
              <span
                className="absolute bottom-3 left-4 text-xs font-semibold text-muted-foreground/35"
                dir="ltr"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
            </Link>
          ),
        )}
      </section>
    </div>
  );
}
