import Link from "next/link";
import { Plus } from "lucide-react";

export default function ModuleHeader({ icon: Icon, eyebrow, title, description, actionLabel }) {
  return (
    <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
          <Icon className="size-4" aria-hidden="true" />
          <span>{eyebrow}</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      </div>
      <Link
        href="#new-record"
        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground transition-colors duration-200 hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Plus className="size-4" aria-hidden="true" />
        {actionLabel}
      </Link>
    </section>
  );
}
