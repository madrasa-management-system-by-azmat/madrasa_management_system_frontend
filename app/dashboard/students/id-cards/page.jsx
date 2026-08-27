"use client";

import { useState } from "react";
import Image from "next/image";
import { CreditCard, Info, Printer, UsersRound } from "lucide-react";
import PrintStudentIdCardsButton, {
  PrintSingleStudentIdCardButton,
} from "@/components/dashboard/students/PrintStudentIdCardsButton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAcademicClasses } from "@/hooks/useAcademics";
import { getAllStudents } from "@/lib/api/students";
import { getMadrasaProfile } from "@/lib/api/settings";
import { getMediaUrl } from "@/lib/apiClient";
import { getApiErrorMessage, toast } from "@/lib/toast";

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";
const initials = (name) =>
  name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join(" ") || "—";

export default function StudentIdCardsPage() {
  const [academicClassId, setAcademicClassId] = useState("");
  const [students, setStudents] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const { data: classes = [], isLoading } = useAcademicClasses();
  const selectedClass = classes.find(
    (item) => String(item.id) === academicClassId,
  );

  function selectClass(nextClassId) {
    setAcademicClassId(nextClassId);
    setStudents([]);
    setProfile(null);
    if (!nextClassId) return;
    setIsLoadingStudents(true);
    Promise.all([
      getAllStudents({ currentClass: nextClassId, status: "active" }),
      getMadrasaProfile(),
    ])
      .then(([nextStudents, nextProfile]) => {
        setStudents(nextStudents);
        setProfile(nextProfile);
      })
      .catch((error) => {
        setStudents([]);
        toast.error(
          "طلبہ لوڈ نہیں ہو سکے",
          getApiErrorMessage(error, "عمل مکمل نہیں ہو سکا۔"),
        );
      })
      .finally(() => setIsLoadingStudents(false));
  }

  return (
    <div dir="rtl" className="mx-auto max-w-5xl space-y-6 lg:space-y-8">
      <header>
        <p className="flex items-center gap-2 text-sm font-medium text-primary">
          <CreditCard className="size-4" />
          طلبہ کا انتظام
        </p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
          طالب علم شناختی کارڈ
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          جماعت منتخب کریں، طلبہ کی فہرست دیکھیں، اور تمام یا کسی ایک طالب علم
          کا کارڈ پرنٹ کریں۔
        </p>
      </header>
      <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <label className="grid gap-2 text-sm font-medium">
            جماعت
            <select
              value={academicClassId}
              onChange={(event) => selectClass(event.target.value)}
              disabled={isLoading}
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
          <PrintStudentIdCardsButton
            academicClassId={academicClassId}
            disabled={isLoading || isLoadingStudents || !students.length}
          />
        </div>
        {selectedClass && (
          <div className="mt-5 rounded-xl bg-primary/10 p-4 text-sm text-primary">
            <p className="font-semibold">
              {selectedClass.name} کے {students.length} فعال طلبہ
            </p>
            <p className="mt-1 text-primary/80">
              A4 پر ہر قطار میں ایک کارڈ کا فرنٹ اور اسی طالب علم کا بیک پرنٹ
              ہوگا: Front → Back۔ ایک شیٹ پر 4 قطاریں ہیں۔
            </p>
          </div>
        )}
      </section>
      {!academicClassId ? (
        <section className="grid min-h-52 place-items-center rounded-xl border border-dashed border-border text-center">
          <div>
            <UsersRound className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              طلبہ کے کارڈ دیکھنے کے لیے جماعت منتخب کریں۔
            </p>
          </div>
        </section>
      ) : isLoadingStudents ? (
        <section className="space-y-3 rounded-xl border border-border bg-card p-5">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="h-20 w-full" />
          ))}
        </section>
      ) : (
        <section className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border p-5">
            <div>
              <h2 className="font-bold">طالب علم</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                ہر طالب علم کے لیے A6 سائز میں الگ فرنٹ اور بیک پرنٹ کیا جا سکتا
                ہے۔
              </p>
            </div>
            <span className="rounded-full bg-muted px-3 py-1 text-sm" dir="ltr">
              {students.length}
            </span>
          </div>
          {students.length ? (
            <div className="divide-y divide-border">
              {students.map((student, index) => (
                <div
                  key={student.id}
                  className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    {student.photo ? (
                      <Image
                        src={getMediaUrl(student.photo)}
                        alt={student.full_name}
                        width={48}
                        height={48}
                        unoptimized
                        className="size-12 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className={`grid size-12 place-items-center rounded-full text-sm font-bold ${index % 2 ? "bg-success/10 text-success" : "bg-info/10 text-info"}`}
                      >
                        {initials(student.full_name)}
                      </div>
                    )}
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
                  <PrintSingleStudentIdCardButton
                    student={student}
                    profile={profile}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="p-10 text-center text-sm text-muted-foreground">
              اس جماعت میں کوئی فعال طالب علم موجود نہیں ہے۔
            </p>
          )}
        </section>
      )}
      <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-info/10 text-info">
            <Info className="size-5" />
          </div>
          <div>
            <h2 className="font-bold">پرنٹ ترتیب</h2>
            <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>
                A4: ہر صف میں <span dir="ltr">Front → Back</span> ہے، چار صفوں
                میں 4 مکمل کارڈ شامل ہیں۔
              </li>
              <li>
                A6: ایک طالب علم کے لیے پہلا صفحہ فرنٹ اور دوسرا صفحہ بیک ہے۔
              </li>
              <li>کارڈ کا اصل سائز 85.6 × 54 ملی میٹر رکھا گیا ہے۔</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
