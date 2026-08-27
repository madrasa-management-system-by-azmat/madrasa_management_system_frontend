"use client";

import Link from "next/link";
import {
  Activity,
  BedDouble,
  BookOpenCheck,
  CircleDollarSign,
  Plus,
  UsersRound,
  WalletCards,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardSummary } from "@/hooks/useDashboard";
import { useAuthContext } from "@/context/AuthContext";

const money = (value) =>
  Number(value || 0).toLocaleString("en-PK", { maximumFractionDigits: 0 });
const relativeTime = (value) => {
  const seconds = Math.max(
    0,
    Math.floor((Date.now() - new Date(value).getTime()) / 1000),
  );
  if (seconds < 60) return "ابھی";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} منٹ پہلے`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} گھنٹے پہلے`;
  return `${Math.floor(seconds / 86400)} دن پہلے`;
};
const activityIcon = {
  student: UsersRound,
  payment: CircleDollarSign,
  hifz: BookOpenCheck,
};
const activityTone = {
  student: "bg-info/10 text-info",
  payment: "bg-success/10 text-success",
  hifz: "bg-warning/10 text-warning",
};

function DashboardLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-28 w-full" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className="h-40" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthContext();
  const { data, isLoading, isError } = useDashboardSummary();
  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.username ||
    "صارف";
  if (isLoading) return <DashboardLoading />;
  if (isError)
    return (
      <p className="rounded-xl border border-destructive bg-destructive/10 p-5 text-sm text-destructive">
        ڈیش بورڈ کا تازہ ڈیٹا لوڈ نہیں ہو سکا۔ براہِ کرم دوبارہ کوشش کریں۔
      </p>
    );

  const stats = [
    {
      label: "کل طلبہ",
      value: data.students.total,
      detail: `${data.students.active} فعال طلبہ`,
      icon: UsersRound,
      tone: "info",
    },
    {
      label: "ہاسٹل میں مقیم",
      value: data.students.resident,
      detail: `${data.hostel.available_beds} بستر دستیاب`,
      icon: BedDouble,
      tone: "danger",
    },
    {
      label: "حفظ کی سرگرمی",
      value: data.hifz.weekly_logs,
      detail: `${data.hifz.students_logged} طلبہ کی ہفتہ وار ڈائری`,
      icon: BookOpenCheck,
      tone: "success",
    },
    {
      label: "اس ماہ کی آمدن",
      value: money(data.finance.income),
      unit: "روپے",
      detail: `فیس: ${money(data.finance.fees_received)} روپے`,
      icon: CircleDollarSign,
      tone: "primary",
    },
  ];
  const tones = {
    info: "border-warning bg-warning text-warning-foreground",
    danger: "border-destructive bg-destructive text-destructive-foreground",
    success: "border-success bg-success text-success-foreground",
    primary: "border-primary bg-primary text-primary-foreground",
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground" dir="ltr">
            {data.generated_on}
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            السلام علیکم، {fullName}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            یہاں مدرسہ کے آج کے اہم امور کا تازہ خلاصہ ہے۔
          </p>
        </div>
        <Link
          href="/dashboard/students/add"
          className={buttonVariants({
            size: "lg",
            className: "w-full sm:w-auto",
          })}
        >
          <Plus />
          نیا داخلہ
        </Link>
      </section>
      <section
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="اہم اعداد و شمار"
      >
        {stats.map(({ label, value, unit, detail, icon: Icon, tone }) => (
          <article
            key={label}
            className={`rounded-xl border p-5 shadow-sm ${tones[tone]}`}
          >
            <div className="flex flex-row-reverse items-center gap-4">
              <div className="grid size-10 place-items-center rounded-xl bg-card text-foreground">
                <Icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1 text-right">
                <p className="text-sm">{label}</p>
                {unit ? (
                  <p
                    className="mt-1 flex justify-end gap-1 text-2xl font-bold tracking-tight"
                    dir="ltr"
                  >
                    <span className="text-base font-medium" dir="rtl">
                      {unit}
                    </span>
                    <span>{value}</span>
                  </p>
                ) : (
                  <p
                    className="mt-1 text-right text-2xl font-bold tracking-tight"
                    dir="ltr"
                  >
                    {value}
                  </p>
                )}
                <p className="mt-2 text-xs">{detail}</p>
              </div>
            </div>
          </article>
        ))}
      </section>
      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-xl border border-border bg-card p-5 sm:p-6 xl:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-bold">مالی خلاصہ</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                موجودہ ماہ کی حقیقی آمدن اور اخراجات
              </p>
            </div>
            <WalletCards className="size-6 text-primary" />
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-success/10 p-4 text-right">
              <p className="text-sm text-muted-foreground">آمدن</p>
              <p
                className="mt-1 flex justify-end gap-1 text-xl font-bold text-success"
                dir="ltr"
              >
                <span className="text-base font-medium" dir="rtl">
                  روپے
                </span>
                <span>{money(data.finance.income)}</span>
              </p>
            </div>
            <div className="rounded-xl bg-destructive/10 p-4 text-right">
              <p className="text-sm text-muted-foreground">اخراجات</p>
              <p
                className="mt-1 flex justify-end gap-1 text-xl font-bold text-destructive"
                dir="ltr"
              >
                <span className="text-base font-medium" dir="rtl">
                  روپے
                </span>
                <span>{money(data.finance.expenses)}</span>
              </p>
            </div>
            <div className="rounded-xl bg-primary/10 p-4 text-right">
              <p className="text-sm text-muted-foreground">ماہانہ بیلنس</p>
              <p
                className="mt-1 flex justify-end gap-1 text-xl font-bold text-primary"
                dir="ltr"
              >
                <span className="text-base font-medium" dir="rtl">
                  روپے
                </span>
                <span>{money(data.finance.balance)}</span>
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/dashboard/finance/payments"
              className={buttonVariants({ variant: "outline" })}
            >
              فیس وصولی
            </Link>
            <Link
              href="/dashboard/finance"
              className={buttonVariants({ variant: "outline" })}
            >
              مالی تفصیل
            </Link>
          </div>
        </section>
        <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-bold">ہاسٹل کی گنجائش</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                فعال الاٹمنٹس کا خلاصہ
              </p>
            </div>
            <BedDouble className="size-6 text-primary" />
          </div>
          <div className="mt-7 text-center">
            <p className="text-4xl font-bold" dir="ltr">
              {data.hostel.occupied_beds} / {data.hostel.total_beds}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              بستر زیرِ استعمال
            </p>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary"
                style={{
                  width: `${data.hostel.total_beds ? (data.hostel.occupied_beds / data.hostel.total_beds) * 100 : 0}%`,
                }}
              />
            </div>
            <p className="mt-3 text-sm text-success">
              {data.hostel.available_beds} بستر دستیاب ہیں
            </p>
          </div>
        </section>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold">حفظ کی تازہ سرگرمی</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                گزشتہ سات روز کی ڈائری
              </p>
            </div>
            <Link
              href="/dashboard/hifz"
              className={buttonVariants({ variant: "ghost" })}
            >
              سب دیکھیں
            </Link>
          </div>
          <div className="mt-6 space-y-4">
            {data.hifz.recent_logs.length ? (
              data.hifz.recent_logs.map((log, index) => (
                <div
                  key={`${log.student_name}-${log.date}-${index}`}
                  className="flex items-center gap-3"
                >
                  <div className="grid size-9 place-items-center rounded-lg bg-success/10 text-success">
                    <BookOpenCheck className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {log.student_name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {log.portion}
                    </p>
                  </div>
                  <time className="text-xs text-muted-foreground" dir="ltr">
                    {log.date}
                  </time>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                اس ہفتے کوئی حفظ ڈائری درج نہیں ہوئی۔
              </p>
            )}
          </div>
        </section>
        <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold">تازہ سرگرمیاں</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                سسٹم میں حالیہ تبدیلیاں
              </p>
            </div>
            <Activity className="size-5 text-primary" />
          </div>
          <ol className="mt-6 space-y-5">
            {data.activity.length ? (
              data.activity.map((item, index) => {
                const Icon = activityIcon[item.type] || Activity;
                return (
                  <li
                    key={`${item.type}-${item.occurred_at}-${index}`}
                    className="flex gap-3"
                  >
                    <div
                      className={`grid size-9 shrink-0 place-items-center rounded-lg ${activityTone[item.type] || "bg-primary/10 text-primary"}`}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                        <p className="text-sm font-medium">{item.title}</p>
                        <time className="text-xs text-muted-foreground">
                          {relativeTime(item.occurred_at)}
                        </time>
                      </div>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {item.detail}
                      </p>
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="py-8 text-center text-sm text-muted-foreground">
                ابھی کوئی حالیہ سرگرمی موجود نہیں۔
              </li>
            )}
          </ol>
        </section>
      </div>
    </div>
  );
}
