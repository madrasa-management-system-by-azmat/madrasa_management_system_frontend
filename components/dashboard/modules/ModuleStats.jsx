const toneClasses = {
  info: "border-info/20 bg-info/10 text-info",
  success: "border-success/20 bg-success/10 text-success",
  warning: "border-warning/20 bg-warning/10 text-warning",
  primary: "border-primary/20 bg-primary/10 text-primary",
  destructive: "border-destructive/20 bg-destructive/10 text-destructive",
};

export default function ModuleStats({ stats }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="ماڈیول کے اعداد و شمار">
      {stats.map(({ label, value, detail, icon: Icon, tone }) => (
        <article key={label} className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className={`grid size-10 place-items-center rounded-xl ${toneClasses[tone]}`}>
              <Icon className="size-5" aria-hidden="true" />
            </div>
            <p className="text-xs text-muted-foreground">{detail}</p>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
        </article>
      ))}
    </section>
  );
}
