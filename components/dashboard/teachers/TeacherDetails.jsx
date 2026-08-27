"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CreditCard,
  House,
  Phone,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTeacher } from "@/hooks/useTeachers";
import { getMediaUrl } from "@/lib/apiClient";

const text = {
  back: "اساتذہ کی فہرست",
  teacher: "استاد",
  phone: "موبائل نمبر",
  cnic: "شناختی کارڈ",
  hireDate: "تاریخ تقرری",
  residential: "رہائشی حیثیت",
  status: "حیثیت",
  yes: "رہائشی",
  no: "غیر رہائشی",
  active: "فعال",
  inactive: "غیر فعال",
  loading: "استاد کا ریکارڈ لوڈ ہو رہا ہے...",
  error: "استاد کا ریکارڈ لوڈ نہیں ہو سکا۔",
};

export default function TeacherDetails({ teacherId }) {
  const { data: teacher, isLoading, isError } = useTeacher(teacherId);
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
    [text.phone, teacher.phone, Phone, true],
    [text.cnic, teacher.cnic, CreditCard, true],
    [text.hireDate, teacher.hire_date, CalendarDays, true],
    [text.residential, teacher.is_residential ? text.yes : text.no, House],
    [
      text.status,
      teacher.is_active ? text.active : text.inactive,
      BriefcaseBusiness,
    ],
  ];
  return (
    <div className="space-y-6 lg:space-y-8">
      <Link
        href="/dashboard/teachers"
        className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:opacity-70"
      >
        <ArrowRight className="size-4" aria-hidden="true" />
        {text.back}
      </Link>
      <section className="rounded-xl border border-border bg-card p-5 sm:p-7">
        <div className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-center">
          {teacher.photo ? (
            <Image
              src={getMediaUrl(teacher.photo)}
              alt={teacher.full_name}
              width={96}
              height={96}
              unoptimized
              className="size-24 rounded-2xl object-cover"
            />
          ) : (
            <div className="grid size-24 place-items-center rounded-2xl bg-primary/10 text-primary">
              <UserRound className="size-10" />
            </div>
          )}
          <div>
            <p className="text-sm text-muted-foreground">{text.teacher}</p>
            <h1 className="mt-1 text-3xl font-bold">{teacher.full_name}</h1>
          </div>
          <Link href={`/dashboard/teachers`} className="sm:mr-auto">
            <Button type="button" variant="outline">
              {text.back}
            </Button>
          </Link>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {details.map(([label, value, Icon, ltr]) => (
            <article
              key={label}
              className="flex items-center gap-3 rounded-xl bg-muted p-4"
            >
              <div className="grid size-10 place-items-center rounded-lg bg-background text-primary">
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p
                  className="mt-1 truncate text-sm font-semibold"
                  dir={ltr ? "ltr" : undefined}
                >
                  {value || "—"}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
