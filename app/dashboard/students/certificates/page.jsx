"use client";

import { useState } from "react";
import { Award, FileText, GraduationCap, ScrollText } from "lucide-react";
import PrintStudentCertificateButton, {
  certificateTitles,
} from "@/components/dashboard/students/PrintStudentCertificateButton";
import { useAcademicClasses } from "@/hooks/useAcademics";
import { getAllStudents } from "@/lib/api/students";
import { getApiErrorMessage, toast } from "@/lib/toast";

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";
const certificateOptions = [
  {
    value: "leaving",
    title: "مدرسہ چھوڑنے کا سرٹیفکیٹ",
    description: "مدرسہ سے رخصتی / ترکِ تعلیم کا سرٹیفکیٹ",
    icon: FileText,
  },
  {
    value: "nazera",
    title: "سندِ ناظرۂ قرآن",
    description: "ناظرۂ قرآن کی تکمیل کی سند",
    icon: ScrollText,
  },
  {
    value: "hifz",
    title: "سندِ حفظِ قرآن",
    description: "حفظِ قرآن کی تکمیل کی سند",
    icon: GraduationCap,
  },
  {
    value: "tarjama",
    title: "سندِ ترجمۂ قرآن",
    description: "ترجمۂ قرآن کی تکمیل کی سند",
    icon: Award,
  },
];

export default function StudentCertificatesPage() {
  const [academicClassId, setAcademicClassId] = useState("");
  const [studentId, setStudentId] = useState("");
  const [certificateType, setCertificateType] = useState("");
  const [students, setStudents] = useState([]);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const { data: classes = [], isLoading: isLoadingClasses } =
    useAcademicClasses();
  const student = students.find((item) => String(item.id) === studentId);

  function selectClass(nextClassId) {
    setAcademicClassId(nextClassId);
    setStudentId("");
    setStudents([]);
    if (!nextClassId) return;
    setIsLoadingStudents(true);
    getAllStudents({ currentClass: nextClassId, status: "active" })
      .then(setStudents)
      .catch((error) =>
        toast.error(
          "طلبہ لوڈ نہیں ہو سکے",
          getApiErrorMessage(error, "عمل مکمل نہیں ہو سکا۔"),
        ),
      )
      .finally(() => setIsLoadingStudents(false));
  }

  return (
    <div dir="rtl" className="mx-auto max-w-5xl space-y-6 lg:space-y-8">
      <header>
        <p className="flex items-center gap-2 text-sm font-medium text-primary">
          <Award className="size-4" />
          طلبہ کا انتظام
        </p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
          اسناد اور سرٹیفکیٹس
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          جماعت، طالب علم اور مطلوبہ سند منتخب کریں، پھر مدرسہ کی معلومات کے
          ساتھ پرنٹ کریں۔
        </p>
      </header>
      <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="grid gap-2 text-sm font-medium">
            جماعت
            <select
              value={academicClassId}
              onChange={(event) => selectClass(event.target.value)}
              disabled={isLoadingClasses}
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
            طالب علم
            <select
              value={studentId}
              onChange={(event) => setStudentId(event.target.value)}
              disabled={!academicClassId || isLoadingStudents}
              className={inputClass}
            >
              <option value="">
                {isLoadingStudents
                  ? "طلبہ لوڈ ہو رہے ہیں..."
                  : "طالب علم منتخب کریں"}
              </option>
              {students.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.full_name} — {item.registration_number}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            سند
            <select
              value={certificateType}
              onChange={(event) => setCertificateType(event.target.value)}
              className={inputClass}
            >
              <option value="">سند منتخب کریں</option>
              {Object.entries(certificateTitles).map(([value, title]) => (
                <option key={value} value={value}>
                  {title}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-5 flex justify-end">
          <PrintStudentCertificateButton
            student={student}
            certificateType={certificateType}
          />
        </div>
      </section>
      <section className="grid gap-4 sm:grid-cols-2">
        {certificateOptions.map(({ value, title, description, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => setCertificateType(value)}
            className={`rounded-xl border p-5 text-right transition-colors ${certificateType === value ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-muted"}`}
          >
            <div className="flex items-start gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <div>
                <h2 className="font-bold">{title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </section>
    </div>
  );
}
