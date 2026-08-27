import { BellRing, ClipboardList, FileText, UserPlus } from "lucide-react";

const activities = [
  { title: "نیا طالب علم داخل کیا گیا", detail: "احمد رضا — درجہ حفظ", time: "12 منٹ پہلے", icon: UserPlus, tone: "info" },
  { title: "حاضری مکمل ہوئی", detail: "جماعت درجہ ثالثہ", time: "35 منٹ پہلے", icon: ClipboardList, tone: "success" },
  { title: "فیس کی رسید بنائی گئی", detail: "رسید نمبر #F-2048", time: "1 گھنٹہ پہلے", icon: FileText, tone: "warning" },
  { title: "ایک نئی اطلاع شامل ہوئی", detail: "والدین کے لیے اعلان", time: "2 گھنٹے پہلے", icon: BellRing, tone: "primary" },
];

const toneClasses = {
  info: "bg-info/10 text-info",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  primary: "bg-primary/10 text-primary",
};

export default function ActivityPanel() {
  return (
    <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-bold">تازہ سرگرمیاں</h2>
          <p className="mt-1 text-sm text-muted-foreground">مدرسہ میں ہونے والی حالیہ تبدیلیاں</p>
        </div>
        <a href="#activity" className="text-sm font-medium text-primary transition-opacity duration-200 hover:opacity-70 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50">تمام دیکھیں</a>
      </div>

      <ol className="mt-6 space-y-5">
        {activities.map(({ title, detail, time, icon: Icon, tone }) => (
          <li key={title} className="flex gap-3">
            <div className={`grid size-9 shrink-0 place-items-center rounded-lg ${toneClasses[tone]}`}>
              <Icon className="size-4" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className="text-sm font-medium">{title}</p>
                <time className="text-xs text-muted-foreground">{time}</time>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
