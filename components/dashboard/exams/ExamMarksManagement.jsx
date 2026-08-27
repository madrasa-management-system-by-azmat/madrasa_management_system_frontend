"use client";

import { useState } from "react";
import { Printer, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAcademicClasses, useSubjects } from "@/hooks/useAcademics";
import { useAllStudents } from "@/hooks/useStudents";
import { useMadrasaProfile } from "@/hooks/useSettings";
import {
  getMadrasaPrintHeaderHtml,
  madrasaPrintHeaderCss,
} from "@/lib/madrasaPrintHeader";
import {
  useCreateInternalExamResult,
  useInternalExamResults,
  useInternalExams,
  useUpdateInternalExamResult,
} from "@/hooks/useExams";
import { getApiErrorMessage, toast } from "@/lib/toast";

const text = {
  title: "طلبہ کے مضامین وار نمبر",
  description:
    "امتحان، جماعت اور مضمون منتخب کریں، پھر ہر طالب علم کے اس مضمون کے نمبر درج کریں۔",
  choose: "منتخب کریں",
  exam: "امتحان",
  class: "جماعت",
  subject: "مضمون",
  student: "طالب علم",
  registration: "رجسٹریشن نمبر",
  marks: "نمبر",
  result: "نتیجہ",
  pass: "پاس",
  fail: "فیل",
  save: "نمبر محفوظ کریں",
  printList: "مارکس لسٹ پرنٹ کریں",
  chooseFlow: "امتحان، جماعت اور مضمون منتخب کریں۔",
  noStudents: "اس جماعت میں کوئی فعال طالب علم نہیں۔",
  loading: "ریکارڈ لوڈ ہو رہا ہے...",
  saved: "نمبر محفوظ ہو گئے۔",
  error: "نمبر محفوظ نہیں ہو سکے۔",
  totalMarks: "کل نمبر",
  passingMarks: "پاسنگ نمبر",
  automatic: "خودکار",
};
const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";
const escapeHtml = (value) =>
  String(value ?? "—")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

function SubjectMarksTable({
  exam,
  selectedClass,
  subject,
  students,
  results,
  isLoading,
  createResult,
  updateResult,
  profile,
}) {
  const resultFor = (studentId) =>
    results.find(
      (item) =>
        item.exam === exam.id &&
        item.student === studentId &&
        item.subject === subject.id,
    );
  async function saveMarks(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    try {
      for (const student of students) {
        const marks = Number(form.get(`marks-${student.id}`));
        if (marks > subject.total_marks)
          throw new Error(`Marks cannot exceed ${subject.total_marks}`);
        const data = {
          exam: exam.id,
          student: student.id,
          subject: subject.id,
          marks,
          result: marks >= subject.passing_marks ? "pass" : "fail",
        };
        const current = resultFor(student.id);
        if (current) await updateResult.mutateAsync({ id: current.id, data });
        else await createResult.mutateAsync(data);
      }
      toast.success(text.saved);
    } catch (error) {
      toast.error(
        text.error,
        error.message || getApiErrorMessage(error, text.error),
      );
    }
  }
  function printList() {
    const rows = students
      .map((student, index) => {
        const result = resultFor(student.id);
        return `<tr><td>${index + 1}</td><td>${escapeHtml(student.full_name)}</td><td dir="ltr">${escapeHtml(student.registration_number)}</td><td dir="ltr">${escapeHtml(result?.marks)}</td><td>${escapeHtml(result?.result)}</td></tr>`;
      })
      .join("");
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(
      `<!doctype html><html lang="ur" dir="rtl"><head><meta charset="utf-8"><title>مارکس لسٹ</title><style>@page{size:A4;margin:10mm}body{font-family:Arial,"Noto Nastaliq Urdu",serif;color:#111}${madrasaPrintHeaderCss}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #777;padding:8px;text-align:right}th{background:#eee}</style></head><body>${getMadrasaPrintHeaderHtml(profile, { title: `مارکس لسٹ — ${exam.name}`, subtitle: `جماعت: ${selectedClass.name} | مضمون: ${subject.name} | کل نمبر: ${subject.total_marks}` })}<table><thead><tr><th>#</th><th>طالب علم</th><th>رجسٹریشن</th><th>نمبر</th><th>نتیجہ</th></tr></thead><tbody>${rows}</tbody></table></body></html>`,
    );
    win.document.close();
    win.focus();
    window.setTimeout(() => win.print(), 350);
  }
  return (
    <form
      onSubmit={saveMarks}
      className="overflow-hidden rounded-xl border border-border bg-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-5">
        <div>
          <h2 className="font-bold">
            {selectedClass.name} — {subject.name}
          </h2>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-md bg-muted px-3 py-2">
              {text.totalMarks}: <b dir="ltr">{subject.total_marks}</b>
            </span>
            <span className="rounded-md bg-warning/10 px-3 py-2 text-warning">
              {text.passingMarks}: <b dir="ltr">{subject.passing_marks}</b>
            </span>
            <span className="rounded-md bg-muted px-3 py-2">
              {text.automatic}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={
              isLoading || createResult.isPending || updateResult.isPending
            }
          >
            <Save />
            {text.save}
          </Button>
          <Button type="button" variant="outline" onClick={printList}>
            <Printer />
            {text.printList}
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[44rem] text-right text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
            <tr>
              <th className="px-5 py-4 font-medium">{text.student}</th>
              <th className="px-5 py-4 font-medium">{text.registration}</th>
              <th className="px-5 py-4 font-medium">
                {text.marks} / {subject.total_marks}
              </th>
              <th className="px-5 py-4 font-medium">{text.result}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {students.map((student) => {
              const current = resultFor(student.id);
              return (
                <tr key={student.id}>
                  <td className="px-5 py-4 font-semibold">
                    {student.full_name}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground" dir="ltr">
                    {student.registration_number}
                  </td>
                  <td className="px-5 py-4">
                    <input
                      name={`marks-${student.id}`}
                      type="number"
                      min="0"
                      max={subject.total_marks}
                      step="0.01"
                      defaultValue={current?.marks ?? ""}
                      required
                      dir="ltr"
                      className="h-10 w-28 rounded-lg border border-input bg-background px-3 text-sm"
                    />
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`font-medium ${current?.result === "pass" ? "text-success" : current?.result === "fail" ? "text-destructive" : "text-muted-foreground"}`}
                    >
                      {current?.result === "pass"
                        ? text.pass
                        : current?.result === "fail"
                          ? text.fail
                          : text.automatic}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </form>
  );
}

export default function ExamMarksManagement() {
  const [examId, setExamId] = useState("");
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const { data: exams = [] } = useInternalExams();
  const { data: classes = [] } = useAcademicClasses();
  const { data: subjectsCatalog = [] } = useSubjects();
  const { data: students = [] } = useAllStudents();
  const { data: results = [], isLoading } = useInternalExamResults();
  const { data: profile } = useMadrasaProfile();
  const createResult = useCreateInternalExamResult();
  const updateResult = useUpdateInternalExamResult();
  const exam = exams.find((item) => String(item.id) === examId);
  const selectedClass = classes.find((item) => String(item.id) === classId);
  const allowedClasses = classes.filter(
    (item) =>
      exam?.classes?.includes(item.id) || exam?.academic_class === item.id,
  );
  const subjects = subjectsCatalog.filter(
    (subject) =>
      exam?.subjects?.includes(subject.id) &&
      String(subject.academic_class) === classId,
  );
  const subject = subjects.find((item) => String(item.id) === subjectId);
  const classStudents = students.filter(
    (student) =>
      String(student.current_class) === classId && student.status === "active",
  );
  const ready = exam && selectedClass && subject;
  return (
    <div className="space-y-6 lg:space-y-8">
      <header>
        <p className="text-sm font-medium text-primary">امتحانات و نتائج</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{text.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{text.description}</p>
      </header>
      <section className="rounded-xl border border-border bg-card p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-right text-sm font-medium">
            {text.exam}
            <select
              value={examId}
              onChange={(event) => {
                setExamId(event.target.value);
                setClassId("");
                setSubjectId("");
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
              onChange={(event) => {
                setClassId(event.target.value);
                setSubjectId("");
              }}
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
          <label className="grid gap-2 text-right text-sm font-medium">
            {text.subject}
            <select
              value={subjectId}
              onChange={(event) => setSubjectId(event.target.value)}
              disabled={!selectedClass}
              className={inputClass}
            >
              <option value="">{text.choose}</option>
              {subjects.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>
      {!ready ? (
        <p className="grid min-h-48 place-items-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
          {text.chooseFlow}
        </p>
      ) : !classStudents.length ? (
        <p className="grid min-h-48 place-items-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
          {text.noStudents}
        </p>
      ) : (
        <SubjectMarksTable
          key={`${examId}-${classId}-${subjectId}`}
          exam={exam}
          selectedClass={selectedClass}
          subject={subject}
          students={classStudents}
          results={results}
          isLoading={isLoading}
          createResult={createResult}
          updateResult={updateResult}
          profile={profile}
        />
      )}
    </div>
  );
}
