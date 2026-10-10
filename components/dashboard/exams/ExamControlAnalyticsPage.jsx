"use client";

import { useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  FileLock2,
  GraduationCap,
  Send,
  ShieldCheck,
  TrendingUp,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAcademicClasses } from "@/hooks/useAcademics";
import { useAcademicYears } from "@/hooks/useStudents";
import {
  useExamAnalytics,
  useFinalizeExam,
  useGenerateAnnualResults,
  useInternalExams,
  usePublishExam,
  useVerifyExam,
} from "@/hooks/useExams";
import { getApiErrorMessage, toast } from "@/lib/toast";

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/50";
const statusLabels = {
  draft: "مسودہ",
  planned: "منصوبہ بند",
  open: "نمبر اندراج جاری",
  verified: "تصدیق شدہ",
  finalized: "حتمی",
  published: "جاری شدہ",
  cancelled: "منسوخ",
};

export default function ExamControlAnalyticsPage() {
  const [examId, setExamId] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [academicClass, setAcademicClass] = useState("");
  const { data: exams = [], isLoading } = useInternalExams();
  const { data: analytics, isLoading: analyticsLoading } =
    useExamAnalytics(examId);
  const { data: yearData } = useAcademicYears();
  const { data: classes = [] } = useAcademicClasses();
  const years = yearData?.results || [];
  const verify = useVerifyExam();
  const finalize = useFinalizeExam();
  const publish = usePublishExam();
  const generateAnnual = useGenerateAnnualResults();
  const selectedExam = exams.find((item) => String(item.id) === String(examId));
  async function workflow(mutation, message) {
    try {
      await mutation.mutateAsync(Number(examId));
      toast.success(message);
    } catch (error) {
      toast.error("عمل مکمل نہیں ہو سکا", getApiErrorMessage(error));
    }
  }
  async function annual() {
    try {
      const results = await generateAnnual.mutateAsync({
        academic_year: Number(academicYear),
        academic_class: Number(academicClass),
      });
      toast.success(`${results.length} سالانہ نتائج تیار ہو گئے`);
    } catch (error) {
      toast.error("سالانہ نتائج تیار نہیں ہو سکے", getApiErrorMessage(error));
    }
  }
  return (
    <div className="space-y-7">
      <header>
        <p className="text-sm font-medium text-primary">امتحانی کنٹرول روم</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
          امتحانی ورک فلو اور تجزیات
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          منصوبہ بندی سے حتمی نتیجہ، اشاعت اور تعلیمی تجزیے تک
        </p>
      </header>
      <section className="rounded-2xl border bg-card p-5">
        <label className="grid max-w-xl gap-2 text-sm font-medium">
          امتحان منتخب کریں
          <select
            value={examId}
            onChange={(e) => setExamId(e.target.value)}
            className={inputClass}
          >
            <option value="">منتخب کریں</option>
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>
                {exam.name} — {statusLabels[exam.status] || exam.status}
              </option>
            ))}
          </select>
        </label>
        {selectedExam && (
          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => workflow(verify, "امتحان تصدیق ہو گیا")}
              disabled={verify.isPending}
            >
              <ShieldCheck /> تصدیق
            </Button>
            <Button
              onClick={() => workflow(finalize, "امتحان حتمی ہو گیا")}
              disabled={finalize.isPending}
            >
              <FileLock2 /> حتمی کریں
            </Button>
            <Button
              variant="outline"
              onClick={() => workflow(publish, "نتائج جاری ہو گئے")}
              disabled={publish.isPending}
            >
              <Send /> نتائج جاری کریں
            </Button>
          </div>
        )}
      </section>
      {!examId ? (
        isLoading ? (
          <Skeleton className="h-80" />
        ) : (
          <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed text-muted-foreground">
            امتحان منتخب کریں۔
          </div>
        )
      ) : analyticsLoading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : (
        analytics && (
          <>
            <section className="grid gap-4 sm:grid-cols-3">
              <article className="rounded-2xl border bg-card p-5">
                <UsersRound className="size-6 text-primary" />
                <p className="mt-3 text-sm text-muted-foreground">طلبہ</p>
                <p className="text-3xl font-bold">
                  {analytics.overview.students}
                </p>
              </article>
              <article className="rounded-2xl border bg-card p-5">
                <CheckCircle2 className="size-6 text-success" />
                <p className="mt-3 text-sm text-muted-foreground">
                  کامیابی کی شرح
                </p>
                <p className="text-3xl font-bold" dir="ltr">
                  {analytics.overview.pass_rate}%
                </p>
              </article>
              <article className="rounded-2xl border bg-card p-5">
                <TrendingUp className="size-6 text-info" />
                <p className="mt-3 text-sm text-muted-foreground">اوسط فیصد</p>
                <p className="text-3xl font-bold" dir="ltr">
                  {analytics.overview.average_percentage}%
                </p>
              </article>
            </section>
            <section className="grid gap-6 lg:grid-cols-2">
              <article className="rounded-2xl border bg-card p-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold">مضمون وار تجزیہ</h2>
                  <BarChart3 className="size-5 text-primary" />
                </div>
                <div className="mt-4 space-y-4">
                  {analytics.subjects.map((subject) => (
                    <div key={subject.subject}>
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold">{subject.name}</span>
                        <span dir="ltr">
                          {subject.pass_rate}% پاس · اوسط {subject.average}
                        </span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-success"
                          style={{ width: `${subject.pass_rate}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </article>
              <article className="rounded-2xl border bg-card p-5">
                <h2 className="font-bold">طالب علم درجہ بندی</h2>
                <div className="mt-4 space-y-2">
                  {analytics.students.slice(0, 10).map((student) => (
                    <div
                      key={student.student}
                      className="flex items-center justify-between rounded-xl bg-muted p-3"
                    >
                      <div>
                        <p className="font-semibold">
                          {student.rank}. {student.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {student.all_passed ? "کامیاب" : "کمزور مضامین موجود"}
                        </p>
                      </div>
                      <span className="font-bold" dir="ltr">
                        {student.percentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </>
        )
      )}
      <section className="rounded-2xl border bg-card p-5">
        <div className="flex items-center gap-3">
          <GraduationCap className="size-6 text-primary" />
          <div>
            <h2 className="font-bold">سالانہ نتیجہ</h2>
            <p className="text-sm text-muted-foreground">
              حتمی امتحانات سے ترقی کے لیے سالانہ نتیجہ تیار کریں
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]">
          <select
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className={inputClass}
          >
            <option value="">تعلیمی سال</option>
            {years.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <select
            value={academicClass}
            onChange={(e) => setAcademicClass(e.target.value)}
            className={inputClass}
          >
            <option value="">جماعت</option>
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <Button
            onClick={annual}
            disabled={
              !academicYear || !academicClass || generateAnnual.isPending
            }
          >
            سالانہ نتیجہ تیار کریں
          </Button>
        </div>
      </section>
    </div>
  );
}
