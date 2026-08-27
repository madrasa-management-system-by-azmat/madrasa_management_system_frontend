"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  GraduationCap,
  Pencil,
  Phone,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import PrintAdmissionButton from "@/components/dashboard/students/PrintAdmissionButton";
import { useStudent } from "@/hooks/useStudents";
import { getMediaUrl } from "@/lib/apiClient";

const text = {
  admissionDate:
    "\u062A\u0627\u0631\u06CC\u062E \u062F\u0627\u062E\u0644\u06C1",
  admissionForm:
    "\u062F\u0627\u062E\u0644\u06C1 \u0641\u0627\u0631\u0645 \u067E\u0631\u0646\u0679 \u06A9\u0631\u06CC\u06BA",
  back: "\u0637\u0644\u0628\u06C1 \u06A9\u06CC \u0641\u06C1\u0631\u0633\u062A",
  class: "\u062C\u0645\u0627\u0639\u062A",
  edit: "\u062A\u0631\u0645\u06CC\u0645 \u06A9\u0631\u06CC\u06BA",
  error:
    "\u0637\u0627\u0644\u0628 \u0639\u0644\u0645 \u06A9\u0627 \u0631\u06CC\u06A9\u0627\u0631\u0688 \u0644\u0648\u0688 \u0646\u06C1\u06CC\u06BA \u06C1\u0648 \u0633\u06A9\u0627\u06D4",
  guardian: "\u0648\u0627\u0644\u062F / \u0633\u0631\u067E\u0631\u0633\u062A",
  halaqa: "\u062D\u0644\u0642\u06C1",
  loading:
    "\u0631\u06CC\u06A9\u0627\u0631\u0688 \u0644\u0648\u0688 \u06C1\u0648 \u0631\u06C1\u0627 \u06C1\u06D2...",
  phone: "\u0645\u0648\u0628\u0627\u0626\u0644 \u0646\u0645\u0628\u0631",
  notes: "\u062E\u0635\u0648\u0635\u06CC \u0646\u0648\u0679\u0633",
  registration:
    "\u0631\u062C\u0633\u0679\u0631\u06CC\u0634\u0646 \u0646\u0645\u0628\u0631",
  student: "\u0637\u0627\u0644\u0628 \u0639\u0644\u0645",
};

export default function StudentDetails({ studentId }) {
  const { data: student, isLoading, isError } = useStudent(studentId);
  if (isLoading)
    return (
      <div className="grid min-h-64 place-items-center text-sm text-muted-foreground">
        {text.loading}
      </div>
    );
  if (isError)
    return (
      <p className="rounded-xl border border-destructive bg-destructive/10 p-5 text-sm text-destructive">
        {text.error}
      </p>
    );

  const details = [
    { label: text.guardian, value: student.guardian_name, icon: UserRound },
    { label: text.phone, value: student.phone, icon: Phone, ltr: true },
    {
      label: text.class,
      value: student.class_name || "—",
      icon: GraduationCap,
    },
    {
      label: text.halaqa,
      value: student.halaqa_name || "—",
      icon: GraduationCap,
    },
    {
      label: text.admissionDate,
      value: student.admission_date,
      icon: CalendarDays,
      ltr: true,
    },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/dashboard/students"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:opacity-70"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {text.back}
        </Link>
        <div className="flex gap-2">
          <PrintAdmissionButton studentId={student.id} variant="outline" />
          <Link href={`/dashboard/students/${student.id}/edit`}>
            <Button type="button">
              <Pencil aria-hidden="true" />
              {text.edit}
            </Button>
          </Link>
        </div>
      </div>
      <section className="rounded-xl border border-border bg-card p-5 sm:p-7">
        <div className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-center">
          {student.photo ? (
            <Image
              src={getMediaUrl(student.photo)}
              alt={student.full_name}
              width={96}
              height={96}
              unoptimized
              className="size-24 rounded-2xl object-cover"
            />
          ) : (
            <div className="grid size-24 place-items-center rounded-2xl bg-primary/10 text-primary">
              <UserRound className="size-10" aria-hidden="true" />
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">{text.student}</p>
            <h1 className="mt-1 text-3xl font-bold">{student.full_name}</h1>
            <p className="mt-2 text-sm text-muted-foreground" dir="ltr">
              {student.registration_number}
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {details.map(({ label, value, icon: Icon, ltr }) => (
            <article
              key={label}
              className="flex items-center gap-3 rounded-xl bg-muted p-4"
            >
              <div className="grid size-10 place-items-center rounded-lg bg-background text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p
                  className="mt-1 truncate text-sm font-semibold"
                  dir={ltr ? "ltr" : undefined}
                >
                  {value}
                </p>
              </div>
            </article>
          ))}
        </div>
        <section className="mt-6 border-t border-border pt-5">
          <h2 className="font-bold">داخلہ فارم کی اضافی معلومات</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["سرپرست سے رشتہ", student.guardian_relation],
              ["سرپرست کا شناختی کارڈ", student.guardian_cnic, true],
              ["سرپرست کا رابطہ نمبر", student.guardian_phone, true],
              ["قوم", student.caste],
              ["مذہب", student.religion],
              ["قومیت", student.nationality],
              ["ملک", student.country],
              ["مطلوبہ درجہ", student.requested_class],
              ["موجودہ پتہ", student.current_address],
              ["مستقل پتہ", student.permanent_address],
              ["کوئی بیماری / طبی کیفیت", student.health_conditions],
              ["عصری تعلیم", student.modern_education],
              ["دیگر اسناد", student.other_certificates],
              ["داخلہ ٹیسٹ کی رپورٹ", student.admission_test_report],
              ["داخلہ فیصلہ", student.admission_decision],
              ["دفتری نوٹس", student.office_notes],
            ].map(([label, value, ltr]) => (
              <article key={label} className="rounded-xl bg-muted p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p
                  className="mt-1 text-sm font-semibold"
                  dir={ltr ? "ltr" : undefined}
                >
                  {value || "—"}
                </p>
              </article>
            ))}
          </div>
        </section>
        <section className="mt-6 border-t border-border pt-5">
          <h2 className="font-bold">سابقہ مدارس</h2>
          {student.previous_madrasas?.length ? (
            <div className="mt-3 space-y-2">
              {student.previous_madrasas.map((item, index) => (
                <p key={index} className="rounded-lg bg-muted p-3 text-sm">
                  {item.name || "—"} · {item.year || "—"} · {item.grade || "—"}{" "}
                  · {item.result || "—"}
                </p>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              کوئی سابقہ مدرسہ ریکارڈ موجود نہیں۔
            </p>
          )}
        </section>
        <section className="mt-6 border-t border-border pt-5">
          <h2 className="font-bold">رشتہ دار اور ایمرجنسی رابطہ</h2>
          {student.relatives?.length ? (
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {student.relatives.map((item, index) => (
                <div key={index} className="rounded-lg bg-muted p-3 text-sm">
                  <p className="font-semibold">
                    {item.name || "—"}{" "}
                    {item.is_emergency && (
                      <span className="text-primary">(ایمرجنسی رابطہ)</span>
                    )}
                  </p>
                  <p className="mt-1">
                    {item.relation || "—"} ·{" "}
                    <span dir="ltr">{item.phone || "—"}</span>
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    {item.address || "—"} · {item.occupation || "—"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              کوئی رشتہ دار ریکارڈ موجود نہیں۔
            </p>
          )}
        </section>
        {student.notes && (
          <div className="mt-6 rounded-xl bg-muted p-4">
            <p className="text-xs text-muted-foreground">{text.notes}</p>
            <p className="mt-2 text-sm">{student.notes}</p>
          </div>
        )}
      </section>
    </div>
  );
}
