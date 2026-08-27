export default function ModuleSummary({ title, description, items }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <h2 className="font-bold">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-6 space-y-5">
        {items.map(({ label, value, progress, tone }) => (
          <div key={label}>
            <div className="mb-2 flex items-center justify-between gap-3 text-sm">
              <span className="font-medium">{label}</span>
              <span className="text-muted-foreground">{value}</span>
            </div>
            {typeof progress === "number" ? (
              <div className="h-2 overflow-hidden rounded-full bg-muted" role="progressbar" aria-label={label} aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
                <div className={`h-full rounded-full ${tone}`} style={{ width: `${progress}%` }} />
              </div>
            ) : (
              <div className="h-2 rounded-full bg-muted" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
