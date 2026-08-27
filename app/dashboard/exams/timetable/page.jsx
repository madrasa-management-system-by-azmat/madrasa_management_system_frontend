"use client";

import { useState } from "react";
import PrintExamTimetableButton from "@/components/dashboard/exams/PrintExamTimetableButton";
import { Button } from "@/components/ui/button";
import { useSubjects } from "@/hooks/useAcademics";
import { useInternalExams, useUpdateInternalExam } from "@/hooks/useExams";
import { getApiErrorMessage, toast } from "@/lib/toast";

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";

function buildDatesheet(exam) {
  const names = Object.fromEntries(
    (exam.papers || []).map((paper) => [
      paper.academic_class,
      paper.class_name,
    ]),
  );
  const classIds = exam.classes?.length
    ? exam.classes
    : Object.keys(names).map(Number);
  const slots = new Map();
  for (const paper of exam.papers || []) {
    const key = `${paper.paper_date}|${paper.paper_time || ""}`;
    if (!slots.has(key))
      slots.set(key, {
        date: paper.paper_date,
        time: paper.paper_time || "—",
        subjects: {},
      });
    const slot = slots.get(key);
    slot.subjects[paper.academic_class] ??= [];
    slot.subjects[paper.academic_class].push(paper.subject_name);
  }
  return {
    classes: classIds.map((id, index) => ({
      id,
      name: names[id] || exam.class_names?.[index] || "—",
    })),
    slots: [...slots.values()].sort((a, b) =>
      `${a.date}|${a.time}`.localeCompare(`${b.date}|${b.time}`),
    ),
  };
}

export default function ExamTimetablePage() {
  const [examId, setExamId] = useState("");
  const [classId, setClassId] = useState("");
  const [schedule, setSchedule] = useState({});
  const { data: exams = [], isLoading } = useInternalExams();
  const { data: subjects = [] } = useSubjects();
  const updateExam = useUpdateInternalExam();
  const exam = exams.find((item) => String(item.id) === examId);
  const selectedClass = exam?.classes?.find((id) => String(id) === classId);
  const classSubjects = subjects.filter(
    (subject) => subject.academic_class === selectedClass,
  );
  const datesheet = exam ? buildDatesheet(exam) : null;

  function selectClass(nextClassId) {
    const nextClass = exam?.classes?.find((id) => String(id) === nextClassId);
    if (!exam || !nextClass) {
      setClassId(nextClassId);
      setSchedule({});
      return;
    }
    const saved = Object.fromEntries(
      (exam.papers || [])
        .filter((paper) => paper.academic_class === nextClass)
        .map((paper) => [
          paper.subject,
          { date: paper.paper_date, time: paper.paper_time || "" },
        ]),
    );
    const nextSubjects = subjects.filter(
      (subject) => subject.academic_class === nextClass,
    );
    setClassId(nextClassId);
    setSchedule(
      Object.fromEntries(
        nextSubjects.map((subject) => [
          subject.id,
          saved[subject.id] || { date: "", time: "" },
        ]),
      ),
    );
  }

  async function saveSchedule() {
    if (!exam || !selectedClass) return;
    if (
      classSubjects.some(
        (subject) => !schedule[subject.id]?.date || !schedule[subject.id]?.time,
      )
    ) {
      toast.error(
        "تاریخ اور وقت درکار ہے",
        "ہر مضمون کے لیے پرچے کی تاریخ اور وقت منتخب کریں۔",
      );
      return;
    }
    if (
      classSubjects.some(
        (subject) => schedule[subject.id].date < exam.exam_date,
      )
    ) {
      toast.error(
        "غلط پرچے کی تاریخ",
        `پرچے کی تاریخ ${exam.exam_date} سے پہلے نہیں ہو سکتی۔`,
      );
      return;
    }
    const otherPapers = (exam.papers || [])
      .filter((paper) => paper.academic_class !== selectedClass)
      .map(({ subject, paper_date, paper_time }) => ({
        subject,
        paper_date,
        paper_time,
      }));
    const currentPapers = classSubjects.map((subject) => ({
      subject: subject.id,
      paper_date: schedule[subject.id].date,
      paper_time: schedule[subject.id].time,
    }));
    try {
      await updateExam.mutateAsync({
        id: exam.id,
        data: {
          name: exam.name,
          classes: exam.classes,
          subjects: exam.subjects,
          papers: [...otherPapers, ...currentPapers],
          exam_date: [...otherPapers, ...currentPapers]
            .map((paper) => paper.paper_date)
            .sort()[0],
        },
      });
      toast.success("ڈیٹ شیٹ محفوظ ہو گئی");
    } catch (error) {
      toast.error(
        "ڈیٹ شیٹ محفوظ نہیں ہو سکی",
        getApiErrorMessage(error, "عمل مکمل نہیں ہو سکا۔"),
      );
    }
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <header>
        <p className="text-sm font-medium text-primary">امتحانات و نتائج</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">امتحانی ڈیٹ شیٹ</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          پہلے امتحان، پھر جماعت منتخب کریں۔ اس جماعت کے تمام مضامین کے لیے
          تاریخ اور وقت مقرر کریں۔
        </p>
      </header>
      <section className="grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          امتحان
          <select
            value={examId}
            onChange={(event) => {
              setExamId(event.target.value);
              setClassId("");
              setSchedule({});
            }}
            className={inputClass}
          >
            <option value="">منتخب کریں</option>
            {exams.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          جماعت
          <select
            value={classId}
            onChange={(event) => selectClass(event.target.value)}
            disabled={!exam}
            className={inputClass}
          >
            <option value="">منتخب کریں</option>
            {exam?.classes?.map((id, index) => (
              <option key={id} value={id}>
                {exam.class_names?.[index] || id}
              </option>
            ))}
          </select>
        </label>
      </section>
      {isLoading ? (
        <p className="p-8 text-center text-sm text-muted-foreground">
          امتحانات لوڈ ہو رہے ہیں...
        </p>
      ) : !exam || !selectedClass ? (
        <p className="grid min-h-48 place-items-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
          ڈیٹ شیٹ بنانے کے لیے امتحان اور جماعت منتخب کریں۔
        </p>
      ) : (
        <>
          <section className="rounded-xl border border-border bg-card p-5">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold">
                  {exam.name} —{" "}
                  {exam.class_names?.[exam.classes.indexOf(selectedClass)]}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  ہر مضمون کے پرچے کی تاریخ اور وقت درج کریں۔ پرچے کی تاریخ{" "}
                  {exam.exam_date} سے پہلے نہیں ہو سکتی۔
                </p>
              </div>
              <Button
                onClick={saveSchedule}
                disabled={updateExam.isPending || !classSubjects.length}
              >
                {updateExam.isPending
                  ? "محفوظ ہو رہا ہے..."
                  : "ڈیٹ شیٹ محفوظ کریں"}
              </Button>
            </div>
            {classSubjects.length ? (
              <div className="overflow-x-auto">
                <table className="w-full min-w-xl text-right text-sm">
                  <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">مضمون</th>
                      <th className="px-4 py-3">تاریخ</th>
                      <th className="px-4 py-3">وقت</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {classSubjects.map((subject) => (
                      <tr key={subject.id}>
                        <td className="px-4 py-3 font-medium">
                          {subject.name}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="date"
                            min={exam.exam_date}
                            required
                            value={schedule[subject.id]?.date || ""}
                            onChange={(event) =>
                              setSchedule((current) => ({
                                ...current,
                                [subject.id]: {
                                  ...current[subject.id],
                                  date: event.target.value,
                                },
                              }))
                            }
                            dir="ltr"
                            className={inputClass}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="time"
                            required
                            value={schedule[subject.id]?.time || ""}
                            onChange={(event) =>
                              setSchedule((current) => ({
                                ...current,
                                [subject.id]: {
                                  ...current[subject.id],
                                  time: event.target.value,
                                },
                              }))
                            }
                            dir="ltr"
                            className={inputClass}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                اس جماعت کے لیے مضامین موجود نہیں ہیں۔
              </p>
            )}
          </section>
          <section className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-bold">مکمل ڈیٹ شیٹ</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  تمام جماعتوں کا مشترکہ ٹائم ٹیبل
                </p>
              </div>
              <PrintExamTimetableButton exam={exam} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-2xl text-right text-sm">
                <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
                  <tr>
                    <th className="px-5 py-4">تاریخ</th>
                    <th className="px-5 py-4">وقت</th>
                    {datesheet.classes.map((academicClass) => (
                      <th key={academicClass.id} className="min-w-36 px-5 py-4">
                        {academicClass.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {datesheet.slots.length ? (
                    datesheet.slots.map((slot) => (
                      <tr key={`${slot.date}-${slot.time}`}>
                        <td className="px-5 py-4 font-medium" dir="ltr">
                          {slot.date}
                        </td>
                        <td className="px-5 py-4" dir="ltr">
                          {slot.time}
                        </td>
                        {datesheet.classes.map((academicClass) => (
                          <td key={academicClass.id} className="px-5 py-4">
                            {slot.subjects[academicClass.id]?.join("، ") || "—"}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={datesheet.classes.length + 2}
                        className="px-5 py-10 text-center text-muted-foreground"
                      >
                        ابھی کوئی ڈیٹ شیٹ محفوظ نہیں کی گئی۔
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
