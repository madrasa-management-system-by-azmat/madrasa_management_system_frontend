"use client";

import { useState } from "react";
import { CheckCheck, ClipboardCheck, Save, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAcademicClasses } from "@/hooks/useAcademics";
import { useAllStudents } from "@/hooks/useStudents";
import {
  useSaveStudentAttendance,
  useStudentAttendance,
} from "@/hooks/useAttendance";
import { getApiErrorMessage, toast } from "@/lib/toast";

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";
const statuses = {
  present: { label: "حاضر", className: "bg-success text-success-foreground" },
  absent: {
    label: "غیر حاضر",
    className: "bg-destructive text-destructive-foreground",
  },
  leave: { label: "رخصت", className: "bg-warning text-warning-foreground" },
};

export default function AttendancePage() {
  const [academicClassId, setAcademicClassId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [changes, setChanges] = useState({});
  const { data: classes = [] } = useAcademicClasses();
  const { data: allStudents = [] } = useAllStudents();
  const { data: savedAttendance = [], isLoading } = useStudentAttendance(
    date,
    academicClassId,
  );
  const saveAttendance = useSaveStudentAttendance();
  const students = allStudents.filter(
    (student) =>
      String(student.current_class) === academicClassId &&
      student.status === "active",
  );
  const savedByStudent = Object.fromEntries(
    savedAttendance.map((item) => [item.student, item]),
  );
  const statusFor = (student) =>
    changes[student.id] || savedByStudent[student.id]?.status || "present";
  const totals = students.reduce(
    (result, student) => ({
      ...result,
      [statusFor(student)]: result[statusFor(student)] + 1,
    }),
    { present: 0, absent: 0, leave: 0 },
  );
  function selectClass(value) {
    setAcademicClassId(value);
    setChanges({});
  }
  function setStatus(studentId, status) {
    setChanges((current) => ({ ...current, [studentId]: status }));
  }
  function markAllPresent() {
    setChanges(
      Object.fromEntries(students.map((student) => [student.id, "present"])),
    );
  }
  async function save() {
    if (!students.length) return;
    const records = students.map((student) => ({
      student: student.id,
      date,
      status: statusFor(student),
      remarks: savedByStudent[student.id]?.remarks || "",
    }));
    try {
      await saveAttendance.mutateAsync(records);
      setChanges({});
      toast.success(
        "حاضری محفوظ ہو گئی",
        `${students.length} طلبہ کی حاضری محفوظ کر دی گئی۔`,
      );
    } catch (error) {
      toast.error(
        "حاضری محفوظ نہیں ہو سکی",
        getApiErrorMessage(error, "عمل مکمل نہیں ہو سکا۔"),
      );
    }
  }
  return (
    <div dir="rtl" className="space-y-6 lg:space-y-8">
      <header>
        <p className="flex items-center gap-2 text-sm font-medium text-primary">
          <ClipboardCheck className="size-4" />
          طلبہ کا انتظام
        </p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">روزانہ حاضری</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          جماعت اور تاریخ منتخب کر کے طلبہ کی روزانہ حاضری درج کریں۔
        </p>
      </header>
      <section className="rounded-xl border border-border bg-card p-5">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <label className="grid gap-2 text-sm font-medium">
            جماعت
            <select
              value={academicClassId}
              onChange={(event) => selectClass(event.target.value)}
              className={inputClass}
            >
              <option value="">جماعت منتخب کریں</option>
              {classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} — {item.department_name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            تاریخ
            <input
              type="date"
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
                setChanges({});
              }}
              dir="ltr"
              className={inputClass}
            />
          </label>
          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              onClick={markAllPresent}
              disabled={!students.length}
            >
              <CheckCheck />
              سب حاضر
            </Button>
          </div>
        </div>
      </section>
      {!academicClassId ? (
        <section className="grid min-h-52 place-items-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
          <div className="text-center">
            <UsersRound className="mx-auto size-8" />
            <p className="mt-3">حاضری درج کرنے کے لیے جماعت منتخب کریں۔</p>
          </div>
        </section>
      ) : isLoading ? (
        <section className="space-y-3 rounded-xl border border-border bg-card p-5">
          {[1, 2, 3, 4].map((item) => (
            <Skeleton key={item} className="h-16 w-full" />
          ))}
        </section>
      ) : (
        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold">حاضری رجسٹر</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                <span dir="ltr">{date}</span> · {students.length} فعال طلبہ
              </p>
            </div>
            <div className="flex gap-2 text-xs">
              {Object.entries(statuses).map(([key, item]) => (
                <span
                  key={key}
                  className={`rounded-full px-3 py-1.5 ${item.className}`}
                >
                  {item.label}: {totals[key]}
                </span>
              ))}
            </div>
          </div>
          {students.length ? (
            <div className="divide-y divide-border">
              {students.map((student, index) => (
                <div
                  key={student.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div
                      className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/10 font-bold text-primary"
                      dir="ltr"
                    >
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">
                        {student.full_name}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        <span dir="ltr">{student.registration_number}</span> ·{" "}
                        {student.guardian_name}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(statuses).map(([key, item]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setStatus(student.id, key)}
                        className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${statusFor(student) === key ? item.className : "bg-muted text-muted-foreground hover:bg-accent"}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="p-10 text-center text-sm text-muted-foreground">
              اس جماعت میں کوئی فعال طالب علم موجود نہیں ہے۔
            </p>
          )}
          <div className="flex justify-end border-t border-border p-5">
            <Button
              type="button"
              onClick={save}
              disabled={saveAttendance.isPending || !students.length}
            >
              <Save />
              {saveAttendance.isPending
                ? "محفوظ ہو رہی ہے..."
                : "حاضری محفوظ کریں"}
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
