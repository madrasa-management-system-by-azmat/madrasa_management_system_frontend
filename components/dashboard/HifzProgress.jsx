import { ChevronLeft, CircleCheckBig } from "lucide-react";

const students = [
  { name: "عبداللہ صدیق", portion: "سورۃ النساء", progress: 86, tone: "bg-success" },
  { name: "محمد طلحہ", portion: "سورۃ آل عمران", progress: 72, tone: "bg-info" },
  { name: "زینب فاطمہ", portion: "سورۃ البقرہ", progress: 58, tone: "bg-warning" },
];

export default function HifzProgress() {
  return (
    <section id="hifz" className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-bold">حفظ کی پیش رفت</h2>
          <p className="mt-1 text-sm text-muted-foreground">آج نمایاں کارکردگی</p>
        </div>
        <a href="#hifz-details" className="flex items-center gap-1 text-sm font-medium text-primary transition-opacity duration-200 hover:opacity-70 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          سب دیکھیں
          <ChevronLeft className="size-4" aria-hidden="true" />
        </a>
      </div>

      <div className="mt-6 space-y-5">
        {students.map(({ name, portion, progress, tone }) => (
          <div key={name}>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <div className="flex min-w-0 items-center gap-2">
                <CircleCheckBig className="size-4 shrink-0 text-success" aria-hidden="true" />
                <span className="truncate font-medium">{name}</span>
              </div>
              <span className="shrink-0 text-muted-foreground">{progress}٪</span>
            </div>
            <p className="mb-2 text-xs text-muted-foreground">{portion}</p>
            <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label={`${name} کی پیش رفت`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
              <div className={`h-full rounded-full ${tone}`} style={{ width: `${progress}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
