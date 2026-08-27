import { BookOpenCheck, CircleDollarSign, UserCheck, UsersRound } from "lucide-react";

const stats = [
  { label: "کل طلبہ", value: "1,248", detail: "گزشتہ ماہ سے 4.8٪ اضافہ", icon: UsersRound, tone: "info" },
  { label: "آج حاضر", value: "1,106", detail: "کل طلبہ کا 88.6٪", icon: UserCheck, tone: "success" },
  { label: "حفظ کی پیش رفت", value: "74٪", detail: "173 طلبہ فعال ہیں", icon: BookOpenCheck, tone: "warning" },
  { label: "اس ماہ کی وصولی", value: "8.45 لاکھ", detail: "ہدف کا 84٪ مکمل", icon: CircleDollarSign, tone: "primary" },
];

const toneClasses = {
  info: "bg-card text-info",
  success: "bg-card text-success",
  warning: "bg-card text-warning",
  primary: "bg-card text-primary",
};

const cardToneClasses = {
  info: "border-info bg-info text-info-foreground",
  success: "border-success bg-success text-success-foreground",
  warning: "border-warning bg-warning text-warning-foreground",
  primary: "border-primary bg-primary text-primary-foreground",
};

export default function StatCards() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="اہم اعداد و شمار">
      {stats.map(({ label, value, detail, icon: Icon, tone }) => (
        <article key={label} className={`rounded-xl border p-5 shadow-sm transition-colors duration-200 hover:brightness-95 dark:hover:brightness-110 ${cardToneClasses[tone]}`}>
          <div className="flex flex-row-reverse items-center gap-4">
            <div className={`grid size-10 place-items-center rounded-xl ${toneClasses[tone]}`}>
              <Icon className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="inline-block rounded-full bg-card px-2.5 py-1 text-xs text-foreground">اس ماہ</span>
              <p className="mt-2 text-sm">{label}</p>
              <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
              <p className="mt-2 text-xs">{detail}</p>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
