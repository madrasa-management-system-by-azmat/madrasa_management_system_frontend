"use client";

import { useState } from "react";
import {
  AlertTriangle,
  BookOpenCheck,
  CalendarClock,
  GraduationCap,
  Plus,
  Printer,
  School,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useAcademicClasses,
  useClassOfferingProfile,
  useClassOfferings,
  useCreateClassOffering,
  useCreateCurriculumPlan,
  useCreateCurriculumUnit,
  useCreateDailyLesson,
  useCreateTimetablePeriod,
  useCurriculumPlans,
  useDailyLessons,
  useGenerateTimetable,
  useSubjects,
  useTimetableEntries,
  useTimetablePeriods,
} from "@/hooks/useAcademics";
import { useAcademicYears } from "@/hooks/useStudents";
import { useTeachers, useTeachingAssignments } from "@/hooks/useTeachers";
import { getApiErrorMessage, toast } from "@/lib/toast";

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/50";
function Dialog({ title, children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 p-4"
      onMouseDown={onClose}
    >
      <section
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <Button variant="outline" onClick={onClose}>
            بند کریں
          </Button>
        </div>
        {children}
      </section>
    </div>
  );
}
const weekdays = [
  [1, "پیر"],
  [2, "منگل"],
  [3, "بدھ"],
  [4, "جمعرات"],
  [5, "جمعہ"],
  [6, "ہفتہ"],
  [7, "اتوار"],
];

export default function AcademicWorkflowPage() {
  const [offeringId, setOfferingId] = useState("");
  const [dialog, setDialog] = useState(null);
  const { data: yearData } = useAcademicYears();
  const years = yearData?.results || [];
  const currentYear = years.find((y) => y.is_current) || years[0];
  const { data: classes = [] } = useAcademicClasses();
  const { data: teachers = [] } = useTeachers();
  const { data: subjects = [] } = useSubjects();
  const { data: offerings = [], isLoading } = useClassOfferings({
    academic_year: currentYear?.id,
  });
  const { data: profile } = useClassOfferingProfile(offeringId);
  const { data: assignments = [] } = useTeachingAssignments({
    academic_year: currentYear?.id,
  });
  const { data: plans = [] } = useCurriculumPlans({
    class_offering: offeringId || undefined,
  });
  const { data: periods = [] } = useTimetablePeriods({
    academic_year: currentYear?.id,
  });
  const { data: entries = [] } = useTimetableEntries({
    class_offering: offeringId || undefined,
  });
  const { data: lessons = [] } = useDailyLessons({
    class_offering: offeringId || undefined,
  });
  const createOffering = useCreateClassOffering();
  const createPlan = useCreateCurriculumPlan();
  const createUnit = useCreateCurriculumUnit();
  const createPeriod = useCreateTimetablePeriod();
  const generate = useGenerateTimetable();
  const createLesson = useCreateDailyLesson();
  const selectedOffering = offerings.find(
    (item) => String(item.id) === String(offeringId),
  );
  async function submit(mutation, payload, message) {
    try {
      await mutation.mutateAsync(payload);
      setDialog(null);
      toast.success(message);
    } catch (error) {
      toast.error("عمل مکمل نہیں ہو سکا", getApiErrorMessage(error));
    }
  }
  function printReport() {
    if (!profile) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(
      `<!doctype html><html lang="ur" dir="rtl"><head><meta charset="utf-8"><title>کلاس رپورٹ</title><style>@page{size:A4;margin:12mm}body{font-family:Arial,sans-serif}h1{text-align:center}section{border:1px solid #ddd;margin:8px 0;padding:12px}dl{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}dt{color:#666}dd{font-weight:bold}</style></head><body><h1>${profile.offering.class_name} — ${profile.offering.academic_year_name}</h1><section><dl><div><dt>طلبہ</dt><dd>${profile.students}</dd></div><div><dt>مضامین</dt><dd>${profile.subjects}</dd></div><div><dt>نصاب تکمیل</dt><dd>${profile.curriculum.completion}%</dd></div><div><dt>سبق</dt><dd>${profile.lessons.delivered}/${profile.lessons.total}</dd></div><div><dt>حاضری</dt><dd>${profile.attendance.present}/${profile.attendance.marked}</dd></div><div><dt>نتائج اوسط</dt><dd>${profile.results.average_marks}</dd></div></dl></section></body></html>`,
    );
    win.document.close();
    setTimeout(() => win.print(), 300);
  }

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">تعلیمی امور</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            کلاس، نصاب، سبق اور ٹائم ٹیبل
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            تعلیمی سال کے مطابق کلاس کی مکمل تدریسی نگرانی
          </p>
        </div>
        <Button onClick={() => setDialog("offering")}>
          <Plus /> کلاس پروفائل
        </Button>
      </header>
      <section className="rounded-2xl border bg-card p-5">
        <label className="grid max-w-lg gap-2 text-sm font-medium">
          کلاس پروفائل
          <select
            value={offeringId}
            onChange={(e) => setOfferingId(e.target.value)}
            className={inputClass}
          >
            <option value="">منتخب کریں</option>
            {offerings.map((item) => (
              <option key={item.id} value={item.id}>
                {item.class_name} — {item.academic_year_name}
                {item.section ? ` (${item.section})` : ""}
              </option>
            ))}
          </select>
        </label>
      </section>
      {!offeringId ? (
        isLoading ? (
          <Skeleton className="h-64" />
        ) : (
          <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed text-muted-foreground">
            <div className="text-center">
              <School className="mx-auto size-10" />
              <p className="mt-3">کلاس پروفائل منتخب کریں۔</p>
            </div>
          </div>
        )
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-2xl border bg-card p-5">
              <UsersRound className="size-6 text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">طلبہ</p>
              <p className="text-3xl font-bold">{profile?.students ?? "—"}</p>
            </article>
            <article className="rounded-2xl border bg-card p-5">
              <BookOpenCheck className="size-6 text-success" />
              <p className="mt-3 text-sm text-muted-foreground">نصاب تکمیل</p>
              <p className="text-3xl font-bold" dir="ltr">
                {profile?.curriculum.completion ?? 0}%
              </p>
            </article>
            <article className="rounded-2xl border bg-card p-5">
              <GraduationCap className="size-6 text-warning" />
              <p className="mt-3 text-sm text-muted-foreground">
                پڑھائے گئے سبق
              </p>
              <p className="text-3xl font-bold">
                {profile?.lessons.delivered ?? 0}
              </p>
            </article>
            <article className="rounded-2xl border bg-card p-5">
              <CalendarClock className="size-6 text-info" />
              <p className="mt-3 text-sm text-muted-foreground">
                ٹائم ٹیبل اندراجات
              </p>
              <p className="text-3xl font-bold">{entries.length}</p>
            </article>
          </section>
          <div className="flex justify-end">
            <Button variant="outline" onClick={printReport}>
              <Printer /> سالانہ کلاس رپورٹ
            </Button>
          </div>
          <Tabs defaultValue="curriculum">
            <TabsList>
              <TabsTrigger value="curriculum">نصاب</TabsTrigger>
              <TabsTrigger value="lessons">روزانہ سبق</TabsTrigger>
              <TabsTrigger value="timetable">ٹائم ٹیبل</TabsTrigger>
            </TabsList>
            <TabsContent value="curriculum" className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={() => setDialog("plan")}>
                  <Plus /> نصاب منصوبہ
                </Button>
              </div>
              {plans.map((plan) => (
                <article
                  key={plan.id}
                  className="rounded-2xl border bg-card p-5"
                >
                  <div className="flex justify-between">
                    <div>
                      <h2 className="font-bold">{plan.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        {plan.subject_name}
                      </p>
                    </div>
                    <span dir="ltr">{plan.completion_percentage}%</span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${plan.completion_percentage}%` }}
                    />
                  </div>
                  <div className="mt-4 flex justify-between">
                    <p className="text-sm text-muted-foreground">
                      {plan.units.length} اکائیاں · {plan.delayed_units} تاخیر
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setDialog("unit");
                        window.__curriculumPlan = plan.id;
                      }}
                    >
                      اکائی شامل کریں
                    </Button>
                  </div>
                </article>
              ))}
            </TabsContent>
            <TabsContent value="lessons" className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={() => setDialog("lesson")}>
                  <Plus /> آج کا سبق
                </Button>
              </div>
              {lessons.map((lesson) => (
                <article
                  key={lesson.id}
                  className="rounded-xl border bg-card p-4"
                >
                  <div className="flex justify-between">
                    <p className="font-bold">
                      {lesson.subject_name} — {lesson.teacher_name}
                    </p>
                    <time dir="ltr" className="text-xs text-muted-foreground">
                      {lesson.lesson_date}
                    </time>
                  </div>
                  <p className="mt-2 text-sm">{lesson.portion_taught}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    ہوم ورک: {lesson.homework || "—"}
                  </p>
                </article>
              ))}
            </TabsContent>
            <TabsContent value="timetable" className="space-y-4">
              <div className="flex flex-wrap justify-end gap-2">
                <Button variant="outline" onClick={() => setDialog("period")}>
                  <Plus /> پیریڈ
                </Button>
                <Button
                  onClick={() =>
                    submit(
                      generate,
                      { class_offering: Number(offeringId) },
                      "ٹائم ٹیبل تیار ہو گیا",
                    )
                  }
                  disabled={generate.isPending}
                >
                  خودکار ٹائم ٹیبل
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-3xl text-right text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-3">دن</th>
                      <th className="p-3">پیریڈ</th>
                      <th className="p-3">وقت</th>
                      <th className="p-3">مضمون</th>
                      <th className="p-3">استاد</th>
                      <th className="p-3">کمرہ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {entries.map((entry) => (
                      <tr key={entry.id}>
                        <td className="p-3">{entry.weekday_label}</td>
                        <td className="p-3">{entry.period_number}</td>
                        <td className="p-3" dir="ltr">
                          {entry.starts_at}–{entry.ends_at}
                        </td>
                        <td className="p-3">{entry.subject_name}</td>
                        <td className="p-3">{entry.teacher_name}</td>
                        <td className="p-3">{entry.room || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
      {dialog === "offering" && (
        <Dialog title="نیا کلاس پروفائل" onClose={() => setDialog(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(
                createOffering,
                Object.fromEntries(new FormData(e.currentTarget)),
                "کلاس پروفائل محفوظ ہو گیا",
              );
            }}
            className="grid gap-4"
          >
            <select
              name="academic_year"
              defaultValue={currentYear?.id}
              className={inputClass}
            >
              {years.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <select name="academic_class" className={inputClass}>
              {classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
            <input
              name="section"
              placeholder="سیکشن (اختیاری)"
              className={inputClass}
            />
            <select name="class_teacher" className={inputClass}>
              <option value="">کلاس انچارج</option>
              {teachers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.full_name}
                </option>
              ))}
            </select>
            <select name="assistant_teacher" className={inputClass}>
              <option value="">معاون استاد</option>
              {teachers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.full_name}
                </option>
              ))}
            </select>
            <input name="room" placeholder="کمرہ" className={inputClass} />
            <input
              name="capacity"
              type="number"
              min="0"
              placeholder="گنجائش"
              className={inputClass}
            />
            <Button type="submit">محفوظ کریں</Button>
          </form>
        </Dialog>
      )}
      {dialog === "plan" && (
        <Dialog title="نصاب منصوبہ" onClose={() => setDialog(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(
                createPlan,
                {
                  ...Object.fromEntries(new FormData(e.currentTarget)),
                  class_offering: Number(offeringId),
                },
                "نصاب منصوبہ محفوظ ہو گیا",
              );
            }}
            className="grid gap-4"
          >
            <select name="subject" className={inputClass}>
              {subjects
                .filter(
                  (s) => s.academic_class === selectedOffering?.academic_class,
                )
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
            <select name="teaching_assignment" className={inputClass}>
              <option value="">تدریسی ذمہ داری</option>
              {assignments
                .filter(
                  (a) => a.academic_class === selectedOffering?.academic_class,
                )
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.subject_name} — {a.teacher_name}
                  </option>
                ))}
            </select>
            <input
              name="title"
              required
              placeholder="منصوبے کا عنوان"
              className={inputClass}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                name="planned_start"
                type="date"
                required
                className={inputClass}
              />
              <input
                name="planned_end"
                type="date"
                required
                className={inputClass}
              />
            </div>
            <Button type="submit">محفوظ کریں</Button>
          </form>
        </Dialog>
      )}
      {dialog === "unit" && (
        <Dialog title="نصاب اکائی" onClose={() => setDialog(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(
                createUnit,
                {
                  ...Object.fromEntries(new FormData(e.currentTarget)),
                  plan: window.__curriculumPlan,
                },
                "نصاب اکائی محفوظ ہو گئی",
              );
            }}
            className="grid gap-4"
          >
            <input
              name="title"
              required
              placeholder="باب / موضوع"
              className={inputClass}
            />
            <input
              name="sequence"
              type="number"
              min="1"
              defaultValue="1"
              className={inputClass}
            />
            <input
              name="planned_month"
              type="number"
              min="1"
              max="12"
              placeholder="منصوبہ شدہ مہینہ"
              className={inputClass}
            />
            <div className="grid grid-cols-2 gap-3">
              <input name="target_start" type="date" className={inputClass} />
              <input name="target_end" type="date" className={inputClass} />
            </div>
            <Button type="submit">محفوظ کریں</Button>
          </form>
        </Dialog>
      )}
      {dialog === "period" && (
        <Dialog title="ٹائم ٹیبل پیریڈ" onClose={() => setDialog(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(
                createPeriod,
                {
                  ...Object.fromEntries(new FormData(e.currentTarget)),
                  academic_year: currentYear.id,
                },
                "پیریڈ محفوظ ہو گیا",
              );
            }}
            className="grid gap-4"
          >
            <select name="weekday" className={inputClass}>
              {weekdays.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <input
              name="period_number"
              type="number"
              min="1"
              required
              placeholder="پیریڈ نمبر"
              className={inputClass}
            />
            <input name="label" placeholder="عنوان" className={inputClass} />
            <div className="grid grid-cols-2 gap-3">
              <input
                name="starts_at"
                type="time"
                required
                className={inputClass}
              />
              <input
                name="ends_at"
                type="time"
                required
                className={inputClass}
              />
            </div>
            <Button type="submit">محفوظ کریں</Button>
          </form>
        </Dialog>
      )}
      {dialog === "lesson" && (
        <Dialog title="روزانہ سبق" onClose={() => setDialog(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(
                createLesson,
                {
                  ...Object.fromEntries(new FormData(e.currentTarget)),
                  class_offering: Number(offeringId),
                },
                "سبق محفوظ ہو گیا",
              );
            }}
            className="grid gap-4"
          >
            <select name="teaching_assignment" className={inputClass}>
              {assignments
                .filter(
                  (a) => a.academic_class === selectedOffering?.academic_class,
                )
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.subject_name} — {a.teacher_name}
                  </option>
                ))}
            </select>
            <input
              name="lesson_date"
              type="date"
              defaultValue={new Date().toISOString().slice(0, 10)}
              className={inputClass}
            />
            <textarea
              name="portion_taught"
              required
              placeholder="پڑھایا گیا حصہ"
              className={inputClass.replace("h-10", "min-h-24 py-2")}
            />
            <textarea
              name="homework"
              placeholder="ہوم ورک"
              className={inputClass.replace("h-10", "min-h-20 py-2")}
            />
            <Button type="submit">محفوظ کریں</Button>
          </form>
        </Dialog>
      )}
    </div>
  );
}
