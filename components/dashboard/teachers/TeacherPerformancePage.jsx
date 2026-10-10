"use client";

import { useDeferredValue, useState } from "react";
import {
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  Plus,
  Search,
  Target,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAcademicClasses, useSubjects } from "@/hooks/useAcademics";
import { useAcademicYears } from "@/hooks/useStudents";
import {
  useApprovePerformanceReview,
  useCalculatePerformanceReview,
  useCreatePerformanceGoal,
  useCreatePerformanceReview,
  useCreateStaffContribution,
  useCreateSyllabusPlan,
  useCreateTeachingAssignment,
  usePerformanceGoals,
  usePerformanceReviews,
  useStaffContributions,
  useSyllabusPlans,
  useTeachers,
  useTeachingAssignments,
} from "@/hooks/useTeachers";
import { useAuthContext } from "@/context/AuthContext";
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
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex justify-between gap-3">
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
const scoreTone = (score) =>
  score >= 85
    ? "text-success"
    : score >= 70
      ? "text-primary"
      : score >= 55
        ? "text-warning"
        : "text-destructive";

export default function TeacherPerformancePage() {
  const { user } = useAuthContext();
  const [teacherId, setTeacherId] = useState("");
  const [teacherSearch, setTeacherSearch] = useState("");
  const [isTeacherMenuOpen, setIsTeacherMenuOpen] = useState(false);
  const [dialog, setDialog] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const { data: teachers = [], isLoading: teachersLoading } = useTeachers();
  const deferredTeacherSearch = useDeferredValue(
    teacherSearch.trim().toLowerCase(),
  );
  const filteredTeachers = teachers.filter((teacher) =>
    [teacher.full_name, teacher.phone, teacher.cnic].some((value) =>
      String(value || "")
        .toLowerCase()
        .includes(deferredTeacherSearch),
    ),
  );
  const { data: classes = [] } = useAcademicClasses();
  const { data: subjects = [] } = useSubjects();
  const { data: yearData } = useAcademicYears();
  const years = yearData?.results || [];
  const { data: assignments = [] } = useTeachingAssignments({
    teacher: teacherId || undefined,
  });
  const { data: plans = [] } = useSyllabusPlans({
    teacher: teacherId || undefined,
  });
  const { data: contributions = [] } = useStaffContributions({
    staff: teacherId || undefined,
  });
  const { data: reviews = [], isLoading: reviewsLoading } =
    usePerformanceReviews({ staff: teacherId || undefined });
  const { data: goals = [] } = usePerformanceGoals({
    staff: teacherId || undefined,
  });
  const createAssignment = useCreateTeachingAssignment();
  const createPlan = useCreateSyllabusPlan();
  const createContribution = useCreateStaffContribution();
  const createReview = useCreatePerformanceReview();
  const calculate = useCalculatePerformanceReview();
  const approve = useApprovePerformanceReview();
  const createGoal = useCreatePerformanceGoal();
  const selectedTeacher = teachers.find(
    (item) => String(item.id) === String(teacherId),
  );
  const currentYear = years.find((item) => item.is_current) || years[0];
  async function submit(mutation, payload, message) {
    try {
      await mutation.mutateAsync(payload);
      setDialog(null);
      toast.success(message);
    } catch (error) {
      toast.error("عمل مکمل نہیں ہو سکا", getApiErrorMessage(error));
    }
  }
  const activeAssignments = assignments.filter((item) => item.is_active);
  const latestReview = reviews[0];

  return (
    <div className="space-y-7">
      <header>
        <p className="text-sm font-medium text-primary">اساتذہ و عملہ</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
          استاد کی کارکردگی
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          تدریسی بوجھ، نصاب، حاضری، ذمہ داریاں، جائزہ اور اہداف
        </p>
      </header>
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="relative grid max-w-lg gap-2 text-sm font-medium">
          استاد منتخب کریں
          <span className="relative">
            <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              role="combobox"
              aria-expanded={isTeacherMenuOpen}
              aria-controls="teacher-performance-options"
              aria-autocomplete="list"
              value={teacherSearch}
              onChange={(event) => {
                setTeacherSearch(event.target.value);
                setTeacherId("");
                setIsTeacherMenuOpen(true);
              }}
              onFocus={() => setIsTeacherMenuOpen(true)}
              onBlur={() =>
                window.setTimeout(() => setIsTeacherMenuOpen(false), 150)
              }
              placeholder={
                teachersLoading
                  ? "اساتذہ لوڈ ہو رہے ہیں..."
                  : "نام، فون یا شناختی کارڈ سے تلاش کریں"
              }
              className={`${inputClass} pr-9`}
            />
          </span>
          {isTeacherMenuOpen && (
            <div
              id="teacher-performance-options"
              role="listbox"
              className="absolute inset-x-0 top-full z-30 mt-1 max-h-60 overflow-y-auto rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-lg"
            >
              {filteredTeachers.length ? (
                filteredTeachers.map((teacher) => (
                  <button
                    key={teacher.id}
                    type="button"
                    role="option"
                    aria-selected={String(teacher.id) === String(teacherId)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      setTeacherId(String(teacher.id));
                      setTeacherSearch(teacher.full_name);
                      setIsTeacherMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-right text-sm transition-colors hover:bg-accent aria-selected:bg-primary/10 aria-selected:text-primary"
                  >
                    <span className="font-medium">{teacher.full_name}</span>
                    <span className="text-xs text-muted-foreground" dir="ltr">
                      {teacher.phone || teacher.cnic || ""}
                    </span>
                  </button>
                ))
              ) : (
                <p className="px-3 py-4 text-center text-sm text-muted-foreground">
                  کوئی استاد نہیں ملا۔
                </p>
              )}
            </div>
          )}
        </div>
      </section>
      {!teacherId ? (
        <section className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-border text-center text-muted-foreground">
          <div>
            <UsersRound className="mx-auto size-10" />
            <p className="mt-3">کارکردگی دیکھنے کے لیے استاد منتخب کریں۔</p>
          </div>
        </section>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <article className="rounded-2xl border bg-card p-5">
              <GraduationCap className="size-6 text-primary" />
              <p className="mt-3 text-sm text-muted-foreground">
                فعال تدریسی ذمہ داریاں
              </p>
              <p className="mt-1 text-3xl font-bold">
                {activeAssignments.length}
              </p>
            </article>
            <article className="rounded-2xl border bg-card p-5">
              <BookOpenCheck className="size-6 text-success" />
              <p className="mt-3 text-sm text-muted-foreground">نصاب منصوبے</p>
              <p className="mt-1 text-3xl font-bold">{plans.length}</p>
            </article>
            <article className="rounded-2xl border bg-card p-5">
              <BriefcaseBusiness className="size-6 text-warning" />
              <p className="mt-3 text-sm text-muted-foreground">
                ذمہ داریاں / تربیت
              </p>
              <p className="mt-1 text-3xl font-bold">{contributions.length}</p>
            </article>
            <article className="rounded-2xl border bg-card p-5">
              <BarChart3 className="size-6 text-info" />
              <p className="mt-3 text-sm text-muted-foreground">تازہ اسکور</p>
              <p
                className={`mt-1 text-3xl font-bold ${scoreTone(Number(latestReview?.overall_score || 0))}`}
                dir="ltr"
              >
                {latestReview?.overall_score || "—"}
              </p>
            </article>
          </section>
          <section className="grid gap-6 xl:grid-cols-2">
            <article className="rounded-2xl border bg-card p-5">
              <div className="flex justify-between">
                <div>
                  <h2 className="font-bold">تدریسی ذمہ داریاں</h2>
                  <p className="text-sm text-muted-foreground">
                    کلاس، مضمون اور ہفتہ وار پیریڈ
                  </p>
                </div>
                <Button size="sm" onClick={() => setDialog("assignment")}>
                  <Plus /> شامل کریں
                </Button>
              </div>
              <div className="mt-4 space-y-3">
                {assignments.map((item) => (
                  <div key={item.id} className="rounded-xl bg-muted p-3">
                    <p className="font-semibold">
                      {item.class_name} — {item.subject_name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.academic_year_name} · {item.weekly_periods} پیریڈ فی
                      ہفتہ
                    </p>
                  </div>
                ))}
                {!assignments.length && (
                  <p className="text-sm text-muted-foreground">
                    کوئی ذمہ داری موجود نہیں۔
                  </p>
                )}
              </div>
            </article>
            <article className="rounded-2xl border bg-card p-5">
              <div className="flex justify-between">
                <div>
                  <h2 className="font-bold">نصاب کی پیش رفت</h2>
                  <p className="text-sm text-muted-foreground">
                    تصدیق شدہ تکمیل کی شرح
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setDialog("plan")}
                  disabled={!assignments.length}
                >
                  <Plus /> منصوبہ
                </Button>
              </div>
              <div className="mt-4 space-y-3">
                {plans.map((plan) => (
                  <div key={plan.id}>
                    <div className="flex justify-between text-sm">
                      <span>{plan.title}</span>
                      <span dir="ltr">{plan.completion_percentage}%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${plan.completion_percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
                {!plans.length && (
                  <p className="text-sm text-muted-foreground">
                    کوئی نصاب منصوبہ موجود نہیں۔
                  </p>
                )}
              </div>
            </article>
          </section>
          <section className="grid gap-6 xl:grid-cols-2">
            <article className="rounded-2xl border bg-card p-5">
              <div className="flex justify-between">
                <div>
                  <h2 className="font-bold">اجلاس، تربیت اور ذمہ داریاں</h2>
                </div>
                <Button size="sm" onClick={() => setDialog("contribution")}>
                  <Plus /> شامل کریں
                </Button>
              </div>
              <div className="mt-4 space-y-3">
                {contributions.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between rounded-xl bg-muted p-3"
                  >
                    <div>
                      <p className="font-semibold">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.category}
                      </p>
                    </div>
                    <span className="text-xs">{item.participation_status}</span>
                  </div>
                ))}
                {!contributions.length && (
                  <p className="text-sm text-muted-foreground">
                    کوئی ریکارڈ نہیں۔
                  </p>
                )}
              </div>
            </article>
            <article className="rounded-2xl border bg-card p-5">
              <div className="flex justify-between">
                <h2 className="font-bold">اہداف</h2>
                <Button size="sm" onClick={() => setDialog("goal")}>
                  <Target /> نیا ہدف
                </Button>
              </div>
              <div className="mt-4 space-y-3">
                {goals.map((goal) => (
                  <div key={goal.id} className="rounded-xl border p-3">
                    <p className="font-semibold">{goal.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      آخری تاریخ: <span dir="ltr">{goal.target_date}</span> ·{" "}
                      {goal.progress_percentage}%
                    </p>
                  </div>
                ))}
                {!goals.length && (
                  <p className="text-sm text-muted-foreground">
                    کوئی ہدف موجود نہیں۔
                  </p>
                )}
              </div>
            </article>
          </section>
          <section className="rounded-2xl border bg-card p-5">
            <div className="flex justify-between">
              <div>
                <h2 className="font-bold">کارکردگی جائزے</h2>
                <p className="text-sm text-muted-foreground">
                  سرور پر حساب شدہ ماہانہ اور سالانہ اسکور
                </p>
              </div>
              <Button onClick={() => setDialog("review")}>
                <Plus /> نیا جائزہ
              </Button>
            </div>
            {reviewsLoading ? (
              <Skeleton className="mt-4 h-40" />
            ) : (
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {reviews.map((review) => (
                  <article key={review.id} className="rounded-xl border p-4">
                    <div className="flex justify-between">
                      <span className="font-semibold">
                        {review.review_type === "monthly" ? "ماہانہ" : "سالانہ"}{" "}
                        جائزہ
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {review.status}
                      </span>
                    </div>
                    <p
                      className={`mt-3 text-4xl font-bold ${scoreTone(Number(review.overall_score))}`}
                      dir="ltr"
                    >
                      {review.overall_score}
                    </p>
                    <p className="mt-1 text-sm">
                      {review.rating || "ابھی حساب نہیں ہوا"}
                    </p>
                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => calculate.mutateAsync(review.id)}
                        disabled={calculate.isPending}
                      >
                        حساب کریں
                      </Button>
                      {user?.role === "admin" && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedReview(review);
                            setDialog("approve");
                          }}
                        >
                          <CheckCircle2 /> منظور
                        </Button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}
      {dialog === "assignment" && (
        <Dialog title="تدریسی ذمہ داری" onClose={() => setDialog(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(
                createAssignment,
                {
                  ...Object.fromEntries(new FormData(e.currentTarget)),
                  teacher: Number(teacherId),
                  weekly_periods: Number(
                    new FormData(e.currentTarget).get("weekly_periods"),
                  ),
                },
                "تدریسی ذمہ داری محفوظ ہو گئی",
              );
            }}
            className="grid gap-4"
          >
            <label className="grid gap-2 text-sm">
              تعلیمی سال
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
            </label>
            <label className="grid gap-2 text-sm">
              جماعت
              <select name="academic_class" className={inputClass}>
                {classes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              مضمون
              <select name="subject" className={inputClass}>
                {subjects.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              ہفتہ وار پیریڈ
              <input
                name="weekly_periods"
                type="number"
                min="1"
                defaultValue="1"
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-sm">
              آغاز
              <input
                name="starts_on"
                type="date"
                defaultValue={new Date().toISOString().slice(0, 10)}
                className={inputClass}
              />
            </label>
            <Button type="submit">محفوظ کریں</Button>
          </form>
        </Dialog>
      )}
      {dialog === "plan" && (
        <Dialog title="نصاب منصوبہ" onClose={() => setDialog(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const data = Object.fromEntries(new FormData(e.currentTarget));
              data.total_units = Number(data.total_units);
              submit(createPlan, data, "نصاب منصوبہ محفوظ ہو گیا");
            }}
            className="grid gap-4"
          >
            <label className="grid gap-2 text-sm">
              ذمہ داری
              <select name="assignment" className={inputClass}>
                {assignments.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.class_name} — {item.subject_name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              عنوان
              <input name="title" required className={inputClass} />
            </label>
            <label className="grid gap-2 text-sm">
              کل اکائیاں
              <input
                name="total_units"
                type="number"
                min="1"
                required
                className={inputClass}
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <input
                name="starts_on"
                type="date"
                required
                className={inputClass}
              />
              <input
                name="ends_on"
                type="date"
                required
                className={inputClass}
              />
            </div>
            <Button type="submit">محفوظ کریں</Button>
          </form>
        </Dialog>
      )}
      {dialog === "contribution" && (
        <Dialog title="ذمہ داری / تربیت" onClose={() => setDialog(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(
                createContribution,
                {
                  ...Object.fromEntries(new FormData(e.currentTarget)),
                  staff: Number(teacherId),
                },
                "ریکارڈ محفوظ ہو گیا",
              );
            }}
            className="grid gap-4"
          >
            <select name="category" className={inputClass}>
              <option value="meeting">اجلاس</option>
              <option value="training">تربیت</option>
              <option value="administrative">انتظامی ذمہ داری</option>
              <option value="exam">امتحانی ذمہ داری</option>
            </select>
            <input
              name="title"
              required
              placeholder="عنوان"
              className={inputClass}
            />
            <input
              name="scheduled_at"
              type="datetime-local"
              required
              className={inputClass}
            />
            <select name="participation_status" className={inputClass}>
              <option value="assigned">مقرر</option>
              <option value="attended">شرکت</option>
              <option value="completed">مکمل</option>
              <option value="missed">غیر حاضر</option>
            </select>
            <Button type="submit">محفوظ کریں</Button>
          </form>
        </Dialog>
      )}
      {dialog === "review" && (
        <Dialog
          title={`${selectedTeacher?.full_name} — نیا جائزہ`}
          onClose={() => setDialog(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(
                createReview,
                {
                  ...Object.fromEntries(new FormData(e.currentTarget)),
                  staff: Number(teacherId),
                },
                "جائزہ بنایا گیا",
              );
            }}
            className="grid gap-4"
          >
            <select name="review_type" className={inputClass}>
              <option value="monthly">ماہانہ</option>
              <option value="annual">سالانہ</option>
            </select>
            <div className="grid grid-cols-2 gap-3">
              <input
                name="period_start"
                type="date"
                required
                className={inputClass}
              />
              <input
                name="period_end"
                type="date"
                required
                className={inputClass}
              />
            </div>
            <textarea
              name="manager_comments"
              placeholder="منتظم کے نوٹس"
              className={inputClass.replace("h-10", "min-h-24 py-2")}
            />
            <Button type="submit">جائزہ بنائیں</Button>
          </form>
        </Dialog>
      )}
      {dialog === "goal" && (
        <Dialog title="نیا کارکردگی ہدف" onClose={() => setDialog(null)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(
                createGoal,
                {
                  ...Object.fromEntries(new FormData(e.currentTarget)),
                  staff: Number(teacherId),
                },
                "ہدف محفوظ ہو گیا",
              );
            }}
            className="grid gap-4"
          >
            <input
              name="title"
              required
              placeholder="ہدف"
              className={inputClass}
            />
            <textarea
              name="description"
              placeholder="تفصیل"
              className={inputClass.replace("h-10", "min-h-20 py-2")}
            />
            <input
              name="target_date"
              type="date"
              required
              className={inputClass}
            />
            <Button type="submit">محفوظ کریں</Button>
          </form>
        </Dialog>
      )}
      {dialog === "approve" && (
        <Dialog
          title="کارکردگی جائزہ منظور کریں"
          onClose={() => setDialog(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(
                approve,
                {
                  id: selectedReview.id,
                  manager_comments: new FormData(e.currentTarget).get(
                    "manager_comments",
                  ),
                },
                "جائزہ منظور ہو گیا",
              );
            }}
            className="grid gap-4"
          >
            <textarea
              name="manager_comments"
              defaultValue={selectedReview?.manager_comments}
              placeholder="منتظم کے تبصرے"
              className={inputClass.replace("h-10", "min-h-24 py-2")}
            />
            <Button type="submit">منظور کریں</Button>
          </form>
        </Dialog>
      )}
    </div>
  );
}
