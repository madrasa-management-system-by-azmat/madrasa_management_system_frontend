"use client";

import { useState } from "react";
import { CalendarDays, FileBarChart, UsersRound } from "lucide-react";
import AttendanceReportButton from "@/components/dashboard/attendance/AttendanceReportButton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAcademicClasses } from "@/hooks/useAcademics";
import { useStudentAttendanceReport } from "@/hooks/useAttendance";

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";
const periods = [
  { value: "weekly", label: "ہفتہ وار" },
  { value: "monthly", label: "ماہانہ" },
  { value: "yearly", label: "سالانہ" },
];

export default function AttendanceReportsPage() {
  const [academicClassId, setAcademicClassId] = useState("");
  const [period, setPeriod] = useState("weekly");
  const [endDate, setEndDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [requested, setRequested] = useState(false);
  const { data: classes = [] } = useAcademicClasses();
  const { data: report, isLoading } = useStudentAttendanceReport(
    academicClassId,
    period,
    endDate,
    requested,
  );
  function selectClass(value) {
    setAcademicClassId(value);
    setRequested(false);
  }
  return (
    <div dir="rtl" className="mx-auto max-w-5xl space-y-6 lg:space-y-8">
      <header>
        <p className="flex items-center gap-2 text-sm font-medium text-primary">
          <FileBarChart className="size-4" />
          حاضری
        </p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">حاضری رپورٹس</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          منتخب جماعت کی ہفتہ وار، ماہانہ اور سالانہ حاضری رپورٹ تیار اور پرنٹ
          کریں۔
        </p>
      </header>
      <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <div className="grid gap-4 md:grid-cols-3">
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
            مدت
            <select
              value={period}
              onChange={(event) => {
                setPeriod(event.target.value);
                setRequested(false);
              }}
              className={inputClass}
            >
              {periods.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            آخری تاریخ
            <input
              type="date"
              value={endDate}
              onChange={(event) => {
                setEndDate(event.target.value);
                setRequested(false);
              }}
              dir="ltr"
              className={inputClass}
            />
          </label>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button
            type="button"
            onClick={() => setRequested(true)}
            disabled={!academicClassId}
          >
            <CalendarDays />
            رپورٹ تیار کریں
          </Button>
          <AttendanceReportButton report={report} disabled={isLoading} />
        </div>
      </section>
      {!requested ? (
        <section className="grid min-h-52 place-items-center rounded-xl border border-dashed border-border text-center">
          <div>
            <UsersRound className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              جماعت اور مدت منتخب کر کے رپورٹ تیار کریں۔
            </p>
          </div>
        </section>
      ) : isLoading ? (
        <section className="space-y-3 rounded-xl border border-border bg-card p-5">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-16 w-full" />
          ))}
        </section>
      ) : report ? (
        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold">{report.label}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {report.class_name} · <span dir="ltr">{report.date_from}</span>{" "}
                تا <span dir="ltr">{report.date_to}</span>
              </p>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="rounded-full bg-success/10 px-3 py-1.5 text-success">
                حاضر: {report.totals.present}
              </span>
              <span className="rounded-full bg-destructive/10 px-3 py-1.5 text-destructive">
                غیر حاضر: {report.totals.absent}
              </span>
              <span className="rounded-full bg-warning/10 px-3 py-1.5 text-warning">
                رخصت: {report.totals.leave}
              </span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-2xl text-right text-sm">
              <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th className="px-5 py-4">طالب علم</th>
                  <th className="px-5 py-4">رجسٹریشن</th>
                  <th className="px-5 py-4">حاضر</th>
                  <th className="px-5 py-4">غیر حاضر</th>
                  <th className="px-5 py-4">رخصت</th>
                  <th className="px-5 py-4">فیصد</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {report.students.map((student) => (
                  <tr key={student.student}>
                    <td className="px-5 py-4 font-semibold">
                      {student.student_name}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground" dir="ltr">
                      {student.registration_number}
                    </td>
                    <td className="px-5 py-4 text-success" dir="ltr">
                      {student.present}
                    </td>
                    <td className="px-5 py-4 text-destructive" dir="ltr">
                      {student.absent}
                    </td>
                    <td className="px-5 py-4 text-warning" dir="ltr">
                      {student.leave}
                    </td>
                    <td className="px-5 py-4 font-semibold" dir="ltr">
                      {student.percentage}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}
