import { ChevronLeft } from "lucide-react";

export default function ModuleRecords({ title, description, records, icon: Icon }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-bold">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <a href="#all-records" className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-opacity duration-200 hover:opacity-70 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          تمام دیکھیں
          <ChevronLeft className="size-4" aria-hidden="true" />
        </a>
      </div>

      <div className="mt-5 divide-y divide-border">
        {records.map(({ title: recordTitle, subtitle, meta, tone }, index) => (
          <article key={`${recordTitle}-${index}`} className="flex items-center gap-3 py-4 first:pt-0 last:pb-0">
            <div className={`grid size-10 shrink-0 place-items-center rounded-xl ${tone}`}>
              <Icon className="size-4" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{recordTitle}</p>
              <p className="mt-1 truncate text-xs text-muted-foreground">{subtitle}</p>
            </div>
            <p className="shrink-0 text-xs text-muted-foreground">{meta}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
