"use client";

import Link from "next/link";
import {
  AlertTriangle,
  BadgeDollarSign,
  BookOpenText,
  CalendarClock,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FilePlus2,
  FileText,
  GraduationCap,
  Library,
  ListChecks,
  Megaphone,
  ReceiptText,
  RefreshCw,
  School,
  UsersRound,
  UserRoundCheck,
  UserRoundX,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { useAuthContext } from "@/context/AuthContext";
import { useDashboardSummary } from "@/hooks/useDashboard";

const money = (value) =>
  Number(value || 0).toLocaleString("en-PK", { maximumFractionDigits: 0 });

function MetricCard({ label, value, detail, icon: Icon, tone = "primary" }) {
  const tones = {
    primary: "bg-primary text-primary-foreground",
    success: "bg-success text-success-foreground",
    warning: "bg-warning text-warning-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    info: "bg-info text-info-foreground",
  };
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <span
        className={`absolute inset-y-0 right-0 w-1 ${tones[tone].split(" ")[0]}`}
      />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold" dir="ltr">
            {value ?? "—"}
          </p>
          {detail && (
            <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
          )}
        </div>
        <span
          className={`grid size-11 shrink-0 place-items-center rounded-xl shadow-sm ${tones[tone]}`}
        >
          <Icon className="size-5" aria-hidden="true" />
        </span>
      </div>
    </article>
  );
}

function DashboardLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 w-full" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} className="h-36" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    </div>
  );
}

function CapabilityCard({ icon: Icon, title, href }) {
  const content = (
    <>
      <span className="grid size-9 place-items-center rounded-lg bg-background text-muted-foreground">
        <Icon className="size-4" />
      </span>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">
          {href ? "ماڈیول کھولیں" : "ماڈیول آئندہ مرحلے میں شامل ہوگا"}
        </p>
      </div>
    </>
  );
  if (href) {
    return (
      <Link
        href={href}
        className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent"
      >
        {content}
      </Link>
    );
  }
  return (
    <article className="rounded-xl border border-dashed border-border bg-muted/35 p-4">
      <div className="flex items-center gap-3">{content}</div>
    </article>
  );
}

export default function DashboardHomePage() {
  const { user } = useAuthContext();
  const { data, isLoading, isError, refetch } = useDashboardSummary();
  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.username ||
    "صارف";

  if (isLoading) return <DashboardLoading />;
  if (isError)
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-destructive">
        <p className="font-semibold">ڈیش بورڈ کا ڈیٹا لوڈ نہیں ہو سکا۔</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-3 text-sm underline"
        >
          دوبارہ کوشش کریں
        </button>
      </div>
    );

  const attendance = data.attendance_today;
  const finance = data.finance;
  const attendanceMarkedPercentage = attendance.active_students
    ? Math.round((attendance.marked / attendance.active_students) * 100)
    : 0;

  return (
    <div className="space-y-7 lg:space-y-9">
      <header className="relative overflow-hidden rounded-3xl bg-primary px-5 py-7 text-primary-foreground shadow-lg sm:px-8 sm:py-9">
        <span className="absolute -right-16 -top-20 size-64 rounded-full border-[2.5rem] border-primary-foreground/10" />
        <span className="absolute -bottom-24 left-12 size-56 rounded-full bg-primary-foreground/5" />
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold">
                آج مدرسہ
              </span>
              <time className="text-xs text-primary-foreground/75" dir="ltr">
                {data.generated_on}
              </time>
            </div>
            <h1 className="mt-4 text-3xl font-bold leading-relaxed sm:text-4xl">
              السلام علیکم، {fullName}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-primary-foreground/80 sm:text-base">
              ادارے کی موجودہ تعلیمی، حاضری، امتحانی اور مالی صورتحال ایک نظر
              میں۔
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <Link
              href="/dashboard/students/admissions"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary-foreground px-4 text-sm font-bold text-primary transition-opacity hover:opacity-90"
            >
              <FilePlus2 className="size-4" /> نئی درخواست
            </Link>
            <Link
              href="/dashboard/attendance"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-primary-foreground/25 bg-primary-foreground/10 px-4 text-sm font-bold transition-colors hover:bg-primary-foreground/20"
            >
              <ClipboardCheck className="size-4" /> حاضری
            </Link>
            <Link
              href="/dashboard/finance/payments"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-primary-foreground/25 bg-primary-foreground/10 px-4 text-sm font-bold transition-colors hover:bg-primary-foreground/20"
            >
              <ReceiptText className="size-4" /> فیس وصولی
            </Link>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-primary-foreground/25 bg-primary-foreground/10 px-4 text-sm font-bold transition-colors hover:bg-primary-foreground/20"
            >
              <RefreshCw className="size-4" /> تازہ کریں
            </button>
          </div>
        </div>
      </header>

      <section aria-labelledby="student-summary-title">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-primary">ادارے کا خلاصہ</p>
            <h2 id="student-summary-title" className="mt-1 text-xl font-bold">
              طلبہ اور ادارہ
            </h2>
          </div>
          <Link
            href="/dashboard/menu/students"
            className="text-sm font-semibold text-primary hover:underline"
          >
            تمام طلبہ امور
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <MetricCard
            label="کل طلبہ"
            value={data.students.total}
            detail={`${data.students.active} فعال`}
            icon={UsersRound}
            tone="info"
          />
          <MetricCard
            label="نئے داخلے"
            value={data.students.new_this_month}
            detail="موجودہ ماہ"
            icon={GraduationCap}
            tone="success"
          />
          <MetricCard
            label="رخصت پر"
            value={data.students.on_leave}
            icon={Clock3}
            tone="warning"
          />
          <MetricCard
            label="غیر فعال / خارج"
            value={data.students.inactive}
            icon={UserRoundX}
            tone="destructive"
          />
          <MetricCard
            label="کل اساتذہ"
            value={data.staff.teachers_total}
            detail={`${data.staff.teachers_active} فعال`}
            icon={UserRoundCheck}
            tone="primary"
          />
          <MetricCard
            label="کل کلاسیں"
            value={data.academics.classes_total}
            icon={School}
            tone="info"
          />
          <MetricCard
            label="فارغ التحصیل"
            value={data.students.graduated}
            detail="اسٹیٹس ماڈیول میں شامل ہونا باقی ہے"
            icon={GraduationCap}
          />
          <MetricCard
            label="خارج شدہ"
            value={data.students.withdrawn}
            detail="اسٹیٹس ماڈیول میں شامل ہونا باقی ہے"
            icon={UserRoundX}
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm xl:col-span-2">
          <div className="h-1 bg-primary" />
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">آج کی حاضری</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  فعال طلبہ کی موجودہ حاضری کی صورتحال
                </p>
              </div>
              <ClipboardCheck className="size-6 text-primary" />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-success/10 p-4">
                <p className="text-sm text-muted-foreground">حاضر</p>
                <p className="mt-1 text-2xl font-bold text-success">
                  {attendance.present}
                </p>
              </div>
              <div className="rounded-xl bg-destructive/10 p-4">
                <p className="text-sm text-muted-foreground">غیر حاضر</p>
                <p className="mt-1 text-2xl font-bold text-destructive">
                  {attendance.absent}
                </p>
              </div>
              <div className="rounded-xl bg-warning/10 p-4">
                <p className="text-sm text-muted-foreground">رخصت</p>
                <p className="mt-1 text-2xl font-bold text-warning">
                  {attendance.leave}
                </p>
              </div>
              <div className="rounded-xl bg-muted p-4">
                <p className="text-sm text-muted-foreground">ابھی درج نہیں</p>
                <p className="mt-1 text-2xl font-bold">{attendance.unmarked}</p>
              </div>
            </div>
            <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4">
              <div className="mb-2 flex justify-between text-sm">
                <span>آج حاضری درج ہونے کی شرح</span>
                <span dir="ltr">{attendanceMarkedPercentage}%</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${Math.min(attendanceMarkedPercentage, 100)}%`,
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                حاضر طلبہ کی شرح:{" "}
                <span dir="ltr">{attendance.percentage}%</span>
              </p>
            </div>
            <Link
              href="/dashboard/attendance"
              className="mt-5 inline-flex text-sm font-semibold text-primary hover:underline"
            >
              حاضری درج کریں
            </Link>
          </div>
        </article>

        <article className="overflow-hidden rounded-2xl border border-warning/30 bg-card shadow-sm">
          <div className="h-1 bg-warning" />
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold">خصوصی توجہ</h2>
              <AlertTriangle className="size-6 text-warning" />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              کھلے حاضری الرٹس اور فوری توجہ کے ریکارڈ
            </p>
            <div className="mt-5 space-y-3">
              {data.early_warnings.students.length ? (
                data.early_warnings.students.map((student) => (
                  <Link
                    key={student.id}
                    href={`/dashboard/students/${student.id}`}
                    className="block rounded-xl bg-warning/10 p-3 transition-colors hover:bg-warning/15"
                  >
                    <p className="text-sm font-semibold">{student.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {student.registration_number} · {student.reason}
                    </p>
                  </Link>
                ))
              ) : (
                <p className="rounded-xl bg-success/10 p-4 text-sm text-success">
                  کوئی طالب علم فوری توجہ کی فہرست میں نہیں۔
                </p>
              )}
            </div>
            <Link
              href="/dashboard/attendance/alerts"
              className="mt-5 inline-flex text-sm font-semibold text-warning hover:underline"
            >
              تمام حاضری الرٹس
            </Link>
          </div>
        </article>
      </section>

      {finance && (
        <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="h-1 bg-success" />
          <div className="p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold">فیس و مالیات</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  وصولی، بقایا اور ماہانہ مالی صورتحال
                </p>
              </div>
              <BadgeDollarSign className="size-6 text-primary" />
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              <MetricCard
                label="آج کی فیس وصولی"
                value={money(finance.collected_today)}
                detail="روپے"
                icon={ReceiptText}
                tone="success"
              />
              <MetricCard
                label="ماہانہ فیس وصولی"
                value={money(finance.collected_month)}
                detail="روپے"
                icon={BadgeDollarSign}
                tone="primary"
              />
              <MetricCard
                label="کل بقایا فیس"
                value={money(finance.outstanding_total)}
                detail="روپے"
                icon={AlertTriangle}
                tone="warning"
              />
              <MetricCard
                label="بقایا طالب علم"
                value={finance.overdue_students}
                icon={UsersRound}
                tone="destructive"
              />
              <MetricCard
                label="ماہانہ عطیات"
                value={money(finance.donations_month)}
                detail="روپے"
                icon={CheckCircle2}
                tone="success"
              />
              <MetricCard
                label="ماہانہ اخراجات"
                value={money(finance.expenses_month)}
                detail="روپے"
                icon={FileText}
                tone="destructive"
              />
            </div>
            <div className="mt-5 flex flex-wrap gap-3 border-t border-border pt-4">
              <Link
                href="/dashboard/finance/payments"
                className="text-sm font-semibold text-primary hover:underline"
              >
                فیس وصولی
              </Link>
              <Link
                href="/dashboard/finance/history"
                className="text-sm font-semibold text-primary hover:underline"
              >
                ادائیگی کی تاریخ
              </Link>
              <Link
                href="/dashboard/finance"
                className="text-sm font-semibold text-primary hover:underline"
              >
                مالی تفصیل
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">آج کے امتحانات</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                آج مقرر کیے گئے امتحانی پرچے
              </p>
            </div>
            <CalendarClock className="size-6 text-primary" />
          </div>
          <div className="mt-5 space-y-3">
            {data.exams.today.length ? (
              data.exams.today.map((exam) => (
                <div key={exam.id} className="rounded-xl bg-primary/5 p-4">
                  <p className="font-semibold">
                    {exam.exam_name} — {exam.subject}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {exam.class_name} ·{" "}
                    <span dir="ltr">{exam.time || "—"}</span>
                  </p>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                آج کوئی امتحان مقرر نہیں۔
              </p>
            )}
          </div>
        </article>
        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">آنے والے امتحانات</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                اگلے چودہ دن کا شیڈول
              </p>
            </div>
            <BookOpenText className="size-6 text-primary" />
          </div>
          <div className="mt-5 space-y-3">
            {data.exams.upcoming.length ? (
              data.exams.upcoming.map((exam) => (
                <div
                  key={exam.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border p-3"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {exam.exam_name} — {exam.subject}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {exam.class_name}
                    </p>
                  </div>
                  <time className="text-xs text-muted-foreground" dir="ltr">
                    {exam.date}
                  </time>
                </div>
              ))
            ) : (
              <p className="py-8 text-center text-sm text-muted-foreground">
                قریب کوئی امتحان مقرر نہیں۔
              </p>
            )}
          </div>
        </article>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-bold">
          آئندہ شامل ہونے والے انتظامی ماڈیولز
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <CapabilityCard
            icon={Library}
            title="لائبریری"
            href="/dashboard/library"
          />
          <CapabilityCard
            icon={ListChecks}
            title="انتظامی کام"
            href="/dashboard/tasks"
          />
          <CapabilityCard
            icon={CalendarClock}
            title="اجلاس"
            href="/dashboard/meetings"
          />
          <CapabilityCard
            icon={CheckCircle2}
            title="فیصلے"
            href="/dashboard/meetings"
          />
          <CapabilityCard icon={Megaphone} title="اعلانات" />
        </div>
      </section>
    </div>
  );
}
