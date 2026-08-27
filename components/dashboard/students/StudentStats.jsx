import { BookMarked, CircleAlert, GraduationCap, UsersRound } from "lucide-react";

const stats = [
  { label: "کل طلبہ", value: "1,248", detail: "اس تعلیمی سال میں", icon: UsersRound, tone: "info" },
  { label: "فعال طلبہ", value: "1,206", detail: "96.6٪ مجموعی تعداد", icon: BookMarked, tone: "success" },
  { label: "شعبہ حفظ", value: "173", detail: "زیرِ تعلیم طلبہ", icon: GraduationCap, tone: "warning" },
  { label: "آج غیر حاضر", value: "142", detail: "حاضری درکار ہے", icon: CircleAlert, tone: "destructive" },
];

const toneClasses = {
  info: "bg-info/10 text-info",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
};

export default function StudentStats() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="طلبہ کے اعداد و شمار">
      {stats.map(({ label, value, detail, icon: Icon, tone }) => (
        <article key={label} className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div className={`grid size-10 place-items-center rounded-xl ${toneClasses[tone]}`}>
              <Icon className="size-5" aria-hidden="true" />
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
          <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
        </article>
      ))}
    </section>
  );
}
