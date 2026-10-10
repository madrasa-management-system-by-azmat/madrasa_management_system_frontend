"use client";

import { Building2 } from "lucide-react";

export default function AppLoader({ message = "نظام تیار ہو رہا ہے..." }) {
  return (
    <div
      dir="rtl"
      className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-6"
    >
      <div className="absolute -right-28 -top-28 size-80 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-24 size-96 rounded-full bg-info/10 blur-3xl" />
      <div className="relative text-center">
        <div className="relative mx-auto size-28">
          <span className="absolute inset-0 rounded-full border border-primary/15" />
          <span className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-r-primary border-t-primary" />
          <span className="absolute inset-5 animate-pulse rounded-3xl bg-primary/10" />
          <span className="absolute inset-5 grid place-items-center rounded-3xl bg-card text-primary shadow-xl ring-1 ring-border">
            <Building2 className="size-10" aria-hidden="true" />
          </span>
        </div>
        <p className="mt-7 text-xl font-bold">مدرسہ مینجمنٹ سسٹم</p>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <div
          className="mx-auto mt-5 flex w-24 justify-center gap-1.5"
          aria-hidden="true"
        >
          {[0, 1, 2].map((item) => (
            <span
              key={item}
              className="size-2 animate-bounce rounded-full bg-primary"
              style={{ animationDelay: `${item * 120}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
