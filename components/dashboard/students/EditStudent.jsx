"use client";

import Link from "next/link";
import { ChevronRight, Pencil } from "lucide-react";

import StudentForm from "@/components/dashboard/students/StudentForm";
import { useStudent } from "@/hooks/useStudents";

const text = {
  back: "\u0637\u0644\u0628\u06C1 \u06A9\u06CC \u0641\u06C1\u0631\u0633\u062A \u067E\u0631 \u0648\u0627\u067E\u0633 \u062C\u0627\u0626\u06CC\u06BA",
  description: "\u0637\u0627\u0644\u0628 \u0639\u0644\u0645 \u06A9\u06CC \u0628\u0646\u06CC\u0627\u062F\u06CC\u060C \u062A\u0639\u0644\u06CC\u0645\u06CC \u0627\u0648\u0631 \u0631\u06C1\u0627\u0626\u0634\u06CC \u0645\u0639\u0644\u0648\u0645\u0627\u062A \u062A\u0631\u0645\u06CC\u0645 \u06A9\u0631\u06CC\u06BA\u06D4",
  error: "\u0637\u0627\u0644\u0628 \u0639\u0644\u0645 \u06A9\u0627 \u0631\u06CC\u06A9\u0627\u0631\u0688 \u0644\u0648\u0688 \u0646\u06C1\u06CC\u06BA \u06C1\u0648 \u0633\u06A9\u0627\u06D4",
  loading: "\u0631\u06CC\u06A9\u0627\u0631\u0688 \u0644\u0648\u0688 \u06C1\u0648 \u0631\u06C1\u0627 \u06C1\u06D2...",
  title: "\u0637\u0627\u0644\u0628 \u0639\u0644\u0645 \u06A9\u06CC \u0645\u0639\u0644\u0648\u0645\u0627\u062A \u062A\u0631\u0645\u06CC\u0645 \u06A9\u0631\u06CC\u06BA",
};

export default function EditStudent({ studentId }) {
  const { data: student, isLoading, isError } = useStudent(studentId);

  if (isLoading) return <div className="grid min-h-64 place-items-center text-sm text-muted-foreground">{text.loading}</div>;
  if (isError) return <p className="rounded-xl border border-destructive bg-destructive/10 p-5 text-sm text-destructive">{text.error}</p>;

  return (
    <div className="space-y-6 lg:space-y-8">
      <section><Link href="/dashboard/students" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:opacity-70"><ChevronRight className="size-4" aria-hidden="true" />{text.back}</Link><div className="mt-5 flex items-start gap-3"><div className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground"><Pencil className="size-5" aria-hidden="true" /></div><div><h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{text.title}</h1><p className="mt-2 text-sm text-muted-foreground">{text.description}</p></div></div></section>
      <StudentForm key={student.id} student={student} />
    </div>
  );
}
