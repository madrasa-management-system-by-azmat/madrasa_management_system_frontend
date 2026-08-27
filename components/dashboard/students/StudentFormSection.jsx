export default function StudentFormSection({ title, description, children }) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="border-b border-border pb-4">
        <h2 className="font-bold">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="pt-5">{children}</div>
    </section>
  );
}
