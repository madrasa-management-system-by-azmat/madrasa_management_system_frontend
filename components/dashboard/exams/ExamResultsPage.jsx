"use client";

import { useState } from "react";
import { FileCheck2, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAcademicClasses } from "@/hooks/useAcademics";
import { useInternalExams, useInternalExamSummary } from "@/hooks/useExams";
import { useMadrasaProfile } from "@/hooks/useSettings";
import {
  getMadrasaPrintHeaderHtml,
  madrasaPrintHeaderCss,
} from "@/lib/madrasaPrintHeader";

const text = {
  title: "نتائج",
  description:
    "امتحان اور جماعت منتخب کر کے مجموعی نتائج دیکھیں اور ہر طالب علم کی مارک شیٹ پرنٹ کریں۔",
  exam: "امتحان",
  class: "جماعت",
  choose: "منتخب کریں",
  student: "طالب علم",
  registration: "رجسٹریشن نمبر",
  obtained: "حاصل کردہ نمبر",
  total: "کل نمبر",
  percentage: "فیصد",
  result: "نتیجہ",
  pass: "پاس",
  fail: "فیل",
  pending: "زیرِ التوا",
  print: "مارک شیٹ پرنٹ کریں",
  loading: "نتائج لوڈ ہو رہے ہیں...",
  chooseFlow: "امتحان اور جماعت منتخب کریں۔",
  empty: "اس جماعت کے لیے کوئی نتیجہ موجود نہیں۔",
};
const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";
const escapeHtml = (value) =>
  String(value ?? "—")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

function printMarksheet(summary, student, profile) {
  const win = window.open("", "_blank");
  if (!win) return;
  const subjectRows = student.subjects
    .map(
      (subject) =>
        `<tr><td>${escapeHtml(subject.subject_name)}</td><td dir="ltr">${escapeHtml(subject.total_marks)}</td><td dir="ltr">${escapeHtml(subject.passing_marks)}</td><td dir="ltr">${escapeHtml(subject.marks)}</td><td>${subject.result === "pass" ? text.pass : subject.result === "fail" ? text.fail : text.pending}</td></tr>`,
    )
    .join("");
  const resultLabel =
    student.result === "pass"
      ? text.pass
      : student.result === "fail"
        ? text.fail
        : text.pending;
  win.document.write(
    `<!doctype html><html lang="ur" dir="rtl"><head><meta charset="utf-8"><title>مارک شیٹ — ${escapeHtml(student.student_name)}</title><style>@page{size:A4;margin:10mm}body{font-family:Arial,"Noto Nastaliq Urdu",serif;color:#111}.sheet{border:2px solid #111;padding:18px}h1,h2{text-align:center;margin:0 0 8px}.info{display:grid;grid-template-columns:1fr 1fr;border:1px solid #777;margin-top:18px}.field{padding:9px;border-bottom:1px solid #777}.field:nth-child(odd){border-left:1px solid #777}.label{display:block;color:#555;font-size:12px;margin-bottom:4px}table{width:100%;border-collapse:collapse;margin-top:18px}th,td{border:1px solid #777;padding:8px;text-align:right}th{background:#eee}.summary{margin-top:18px;display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.card{border:1px solid #777;padding:8px;text-align:center}.result{font-size:18px;font-weight:700;margin-top:16px;text-align:center;padding:10px;background:#eee}</style></head><body><main class="sheet"><h1>مدرسہ فیضان القرآن</h1><h2>مارک شیٹ — ${escapeHtml(summary.exam_name)}</h2><div class="info"><div class="field"><span class="label">طالب علم</span>${escapeHtml(student.student_name)}</div><div class="field"><span class="label">رجسٹریشن نمبر</span><span dir="ltr">${escapeHtml(student.registration_number)}</span></div><div class="field"><span class="label">جماعت</span>${escapeHtml(student.class_name)}</div><div class="field"><span class="label">امتحان کی تاریخ</span><span dir="ltr">${escapeHtml(summary.exam_date)}</span></div></div><table><thead><tr><th>مضمون</th><th>کل نمبر</th><th>پاسنگ نمبر</th><th>حاصل کردہ نمبر</th><th>نتیجہ</th></tr></thead><tbody>${subjectRows}</tbody></table><div class="summary"><div class="card">کل نمبر<br><b dir="ltr">${student.total_marks}</b></div><div class="card">حاصل کردہ<br><b dir="ltr">${student.obtained_marks}</b></div><div class="card">فیصد<br><b dir="ltr">${student.percentage}%</b></div><div class="card">پاسنگ نمبر<br><b dir="ltr">${student.passing_marks}</b></div></div><div class="result">مجموعی نتیجہ: ${resultLabel}</div></main></body></html>`,
  );
  win.document.head.insertAdjacentHTML(
    "beforeend",
    `<style>${madrasaPrintHeaderCss}</style>`,
  );
  win.document.querySelector(".sheet h1")?.remove();
  win.document.querySelector(".sheet h2")?.remove();
  win.document.querySelector(".sheet")?.insertAdjacentHTML(
    "afterbegin",
    getMadrasaPrintHeaderHtml(profile, {
      title: `مارک شیٹ — ${summary.exam_name}`,
    }),
  );
  win.document.close();
  win.focus();
  window.setTimeout(() => win.print(), 350);
}

function printClassResultList(summary, profile) {
  const win = window.open("", "_blank");
  if (!win) return;
  const rows = summary.students
    .map(
      (student, index) =>
        `<tr><td>${index + 1}</td><td>${escapeHtml(student.student_name)}</td><td dir="ltr">${escapeHtml(student.registration_number)}</td><td dir="ltr">${student.obtained_marks}</td><td dir="ltr">${student.total_marks}</td><td dir="ltr">${student.percentage}%</td><td>${student.result === "pass" ? text.pass : student.result === "fail" ? text.fail : text.pending}</td></tr>`,
    )
    .join("");
  const passed = summary.students.filter(
    (student) => student.result === "pass",
  ).length;
  const failed = summary.students.filter(
    (student) => student.result === "fail",
  ).length;
  const pending = summary.students.filter(
    (student) => student.result === "pending",
  ).length;
  win.document.write(
    `<!doctype html><html lang="ur" dir="rtl"><head><meta charset="utf-8"><title>مجموعی نتائج کی فہرست</title><style>@page{size:A4 landscape;margin:10mm}body{font-family:Arial,"Noto Nastaliq Urdu",serif;color:#111}${madrasaPrintHeaderCss}.summary{display:flex;justify-content:center;gap:12px;margin-top:12px;font-size:12px}.summary span{border:1px solid #777;padding:5px 10px}table{width:100%;border-collapse:collapse;margin-top:16px;font-size:12px}th,td{border:1px solid #777;padding:8px;text-align:right}th{background:#eee}</style></head><body>${getMadrasaPrintHeaderHtml(profile, { title: `مجموعی نتائج کی فہرست — ${summary.exam_name}`, subtitle: `${summary.students[0]?.class_name || ""} · ${summary.exam_date}` })}<div class="summary"><span>کل طلبہ: ${summary.students.length}</span><span>پاس: ${passed}</span><span>فیل: ${failed}</span><span>زیرِ التوا: ${pending}</span></div><table><thead><tr><th>#</th><th>طالب علم</th><th>رجسٹریشن نمبر</th><th>حاصل کردہ نمبر</th><th>کل نمبر</th><th>فیصد</th><th>نتیجہ</th></tr></thead><tbody>${rows}</tbody></table></body></html>`,
  );
  win.document.close();
  win.focus();
  window.setTimeout(() => win.print(), 350);
}

export default function ExamResultsPage() {
  const [examId, setExamId] = useState("");
  const [classId, setClassId] = useState("");
  const { data: exams = [] } = useInternalExams();
  const { data: classes = [] } = useAcademicClasses();
  const { data: profile } = useMadrasaProfile();
  const exam = exams.find((item) => String(item.id) === examId);
  const allowedClasses = classes.filter(
    (item) =>
      exam?.classes?.includes(item.id) || exam?.academic_class === item.id,
  );
  const { data: summary, isLoading } = useInternalExamSummary(examId, classId);
  return (
    <div className="space-y-6 lg:space-y-8">
      <header>
        <p className="flex items-center gap-2 text-sm font-medium text-primary">
          <FileCheck2 className="size-4" />
          امتحانات و نتائج
        </p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{text.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{text.description}</p>
      </header>
      <section className="rounded-xl border border-border bg-card p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-right text-sm font-medium">
            {text.exam}
            <select
              value={examId}
              onChange={(event) => {
                setExamId(event.target.value);
                setClassId("");
              }}
              className={inputClass}
            >
              <option value="">{text.choose}</option>
              {exams.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-right text-sm font-medium">
            {text.class}
            <select
              value={classId}
              onChange={(event) => setClassId(event.target.value)}
              disabled={!exam}
              className={inputClass}
            >
              <option value="">{text.choose}</option>
              {allowedClasses.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>
      {!examId || !classId ? (
        <p className="grid min-h-48 place-items-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
          {text.chooseFlow}
        </p>
      ) : isLoading ? (
        <p className="grid min-h-48 place-items-center rounded-xl border border-border text-sm text-muted-foreground">
          {text.loading}
        </p>
      ) : !summary?.students?.length ? (
        <p className="grid min-h-48 place-items-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
          {text.empty}
        </p>
      ) : (
        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-bold">
              {summary.exam_name} —{" "}
              {classId &&
                allowedClasses.find((item) => String(item.id) === classId)
                  ?.name}
            </h2>
            <Button
              variant="outline"
              onClick={() => printClassResultList(summary, profile)}
            >
              <Printer />
              مجموعی نتیجہ فہرست پرنٹ کریں
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[58rem] text-right text-sm">
              <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  {[
                    text.student,
                    text.registration,
                    text.obtained,
                    text.total,
                    text.percentage,
                    text.result,
                    text.print,
                  ].map((label) => (
                    <th key={label} className="px-5 py-4 font-medium">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {summary.students.map((student) => (
                  <tr key={student.student} className="hover:bg-muted/40">
                    <td className="px-5 py-4 font-semibold">
                      {student.student_name}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground" dir="ltr">
                      {student.registration_number}
                    </td>
                    <td className="px-5 py-4" dir="ltr">
                      {student.obtained_marks}
                    </td>
                    <td className="px-5 py-4" dir="ltr">
                      {student.total_marks}
                    </td>
                    <td className="px-5 py-4" dir="ltr">
                      {student.percentage}%
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={
                          student.result === "pass"
                            ? "text-success"
                            : student.result === "fail"
                              ? "text-destructive"
                              : "text-muted-foreground"
                        }
                      >
                        {student.result === "pass"
                          ? text.pass
                          : student.result === "fail"
                            ? text.fail
                            : text.pending}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={text.print}
                        onClick={() =>
                          printMarksheet(summary, student, profile)
                        }
                      >
                        <Printer />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
