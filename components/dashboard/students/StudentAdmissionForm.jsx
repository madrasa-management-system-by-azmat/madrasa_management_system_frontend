"use client";

import Image from "next/image";
import { Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useStudent } from "@/hooks/useStudents";
import { useMadrasaProfile } from "@/hooks/useSettings";
import { getMediaUrl } from "@/lib/apiClient";

const text = {
  admission: "\u062F\u0627\u062E\u0644\u06C1 \u0641\u0627\u0631\u0645",
  admissionDate:
    "\u062A\u0627\u0631\u06CC\u062E \u062F\u0627\u062E\u0644\u06C1",
  class: "\u062C\u0645\u0627\u0639\u062A",
  guardian: "\u0648\u0627\u0644\u062F / \u0633\u0631\u067E\u0631\u0633\u062A",
  halaqa: "\u062D\u0644\u0642\u06C1",
  loading:
    "\u062F\u0627\u062E\u0644\u06C1 \u0641\u0627\u0631\u0645 \u062A\u06CC\u0627\u0631 \u06C1\u0648 \u0631\u06C1\u0627 \u06C1\u06D2...",
  madrasa:
    "\u0645\u062F\u0631\u0633\u06C1 \u0641\u06CC\u0636\u0627\u0646 \u0627\u0644\u0642\u0631\u0622\u0646",
  phone: "\u0645\u0648\u0628\u0627\u0626\u0644 \u0646\u0645\u0628\u0631",
  print: "\u067E\u0631\u0646\u0679 \u06A9\u0631\u06CC\u06BA",
  registration:
    "\u0631\u062C\u0633\u0679\u0631\u06CC\u0634\u0646 \u0646\u0645\u0628\u0631",
  guardianSignature:
    "\u0648\u0627\u0644\u062F / \u0633\u0631\u067E\u0631\u0633\u062A \u06A9\u06D2 \u062F\u0633\u062A\u062E\u0637",
  adminSignature:
    "\u0645\u0646\u062A\u0638\u0645 \u06A9\u06D2 \u062F\u0633\u062A\u062E\u0637",
  studentName:
    "\u0637\u0627\u0644\u0628 \u0639\u0644\u0645 \u06A9\u0627 \u0646\u0627\u0645",
  title:
    "\u0637\u0644\u0628\u06C1 \u062F\u0627\u062E\u0644\u06C1 \u0641\u0627\u0631\u0645",
};

function Field({ label, value, ltr = false }) {
  return (
    <div className="border-b border-border py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-semibold" dir={ltr ? "ltr" : undefined}>
        {value || "—"}
      </p>
    </div>
  );
}

export default function StudentAdmissionForm({ studentId }) {
  const { data: student, isLoading, isError } = useStudent(studentId);
  const { data: profile } = useMadrasaProfile();
  if (isLoading)
    return (
      <div className="grid min-h-64 place-items-center text-sm text-muted-foreground">
        {text.loading}
      </div>
    );
  if (isError)
    return (
      <p className="rounded-xl border border-destructive bg-destructive/10 p-5 text-sm text-destructive">
        {text.loading}
      </p>
    );

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div data-print-controls className="flex justify-start">
        <Button type="button" onClick={() => window.print()}>
          <Printer aria-hidden="true" />
          {text.print}
        </Button>
      </div>
      <article
        data-admission-form
        className="border-2 border-foreground bg-background p-6 sm:p-10"
      >
        <header className="flex items-start justify-between gap-5 border-b-2 border-foreground pb-6">
          <div className="flex items-start gap-4">
            {profile?.logo && (
              <Image
                src={getMediaUrl(profile.logo)}
                alt={profile.name || text.madrasa}
                width={72}
                height={72}
                unoptimized
                className="size-18 object-contain"
              />
            )}
            <div>
              <p className="text-sm font-semibold">
                {profile?.name || text.madrasa}
              </p>
              {profile?.name_english && (
                <p className="text-xs text-muted-foreground" dir="ltr">
                  {profile.name_english}
                </p>
              )}
              <h1 className="mt-2 text-3xl font-bold">{text.title}</h1>
              <p className="mt-2 text-sm text-muted-foreground" dir="ltr">
                {student.registration_number}
              </p>
            </div>
          </div>
          {student.photo ? (
            <Image
              src={student.photo}
              alt={student.full_name}
              width={110}
              height={110}
              unoptimized
              className="size-28 border border-foreground object-cover"
            />
          ) : (
            <div className="grid size-28 place-items-center border border-foreground text-xs text-muted-foreground">
              {text.studentName}
            </div>
          )}
        </header>
        <div className="mt-6 grid gap-x-8 sm:grid-cols-2">
          <Field label={text.studentName} value={student.full_name} />
          <Field label={text.guardian} value={student.guardian_name} />
          <Field label="سرپرست سے رشتہ" value={student.guardian_relation} />
          <Field
            label={text.registration}
            value={student.registration_number}
            ltr
          />
          <Field label={text.phone} value={student.phone} ltr />
          <Field
            label="سرپرست کا رابطہ نمبر"
            value={student.guardian_phone}
            ltr
          />
          <Field label="شناختی کارڈ / ب فارم نمبر" value={student.cnic} ltr />
          <Field
            label="سرپرست کا شناختی کارڈ"
            value={student.guardian_cnic}
            ltr
          />
          <Field label="قوم" value={student.caste} />
          <Field label="مذہب" value={student.religion} />
          <Field label="قومیت" value={student.nationality} />
          <Field label="ملک" value={student.country} />
          <Field label={text.class} value={student.class_name} />
          <Field label="مطلوبہ درجہ" value={student.requested_class} />
          <Field label={text.halaqa} value={student.halaqa_name} />
          <Field
            label={text.admissionDate}
            value={student.admission_date}
            ltr
          />
        </div>
        <section className="mt-6 border-t border-border pt-5">
          <h2 className="font-bold">رہائشی، تعلیمی اور صحت کی معلومات</h2>
          <div className="mt-3 grid gap-x-8 sm:grid-cols-2">
            <Field label="موجودہ پتہ" value={student.current_address} />
            <Field label="مستقل پتہ" value={student.permanent_address} />
            <Field
              label="رہائشی کیفیت"
              value={
                student.residential_status === "resident"
                  ? "ہاسٹل میں مقیم"
                  : "روزانہ آنے والا"
              }
            />
            <Field
              label="کوئی بیماری / طبی کیفیت"
              value={student.health_conditions}
            />
            <Field label="عصری تعلیم" value={student.modern_education} />
            <Field label="دیگر اسناد" value={student.other_certificates} />
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
        <section className="mt-6 border-t border-border pt-5">
          <h2 className="font-bold">دفتری استعمال کے لیے</h2>
          <div className="mt-3 grid gap-x-8 sm:grid-cols-2">
            <Field
              label="داخلہ ٹیسٹ کی رپورٹ"
              value={student.admission_test_report}
            />
            <Field label="داخلہ فیصلہ" value={student.admission_decision} />
            <Field
              label="دفتری نوٹس"
              value={student.office_notes || student.notes}
            />
          </div>
        </section>
        <footer className="mt-20 grid grid-cols-2 gap-10 text-center text-sm">
          <div className="border-t border-foreground pt-2">
            {text.guardianSignature}
          </div>
          <div className="border-t border-foreground pt-2">
            {text.adminSignature}
          </div>
        </footer>
      </article>
    </div>
  );
}
