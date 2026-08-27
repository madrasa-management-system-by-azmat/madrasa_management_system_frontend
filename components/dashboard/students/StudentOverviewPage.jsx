"use client";

import { useDeferredValue, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  CreditCard,
  GraduationCap,
  Home,
  Search,
  UserRound,
  UsersRound,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAllStudents, useStudentOverview } from "@/hooks/useStudents";
import { getMediaUrl } from "@/lib/apiClient";

const text = {
  title: "طالب علم کی تفصیلات",
  description: "کسی طالب علم کو تلاش کر کے اس کا مکمل ریکارڈ دیکھیں",
  chooseStudent: "طالب علم منتخب کریں",
  searchStudent: "نام، رجسٹریشن نمبر یا سرپرست کا نام تلاش کریں",
  noStudents: "کوئی طالب علم نہیں ملا",
  selectPrompt: "تفصیلات دیکھنے کے لیے طالب علم منتخب کریں",
  loading: "ریکارڈ لوڈ ہو رہا ہے...",
  error: "طالب علم کا مکمل ریکارڈ لوڈ نہیں ہو سکا۔",
  retry: "دوبارہ کوشش کریں",
  personal: "ذاتی معلومات",
  results: "امتحانی نتائج",
  fees: "فیس ریکارڈ",
  sponsorships: "اسپانسرشپ ریکارڈ",
  hifz: "حفظ کا ریکارڈ",
  hostel: "ہاسٹل ریکارڈ",
  gatePasses: "گیٹ پاس ریکارڈ",
  wafaq: "وفاقی ریکارڈ",
  guardian: "والد / سرپرست",
  phone: "موبائل نمبر",
  cnic: "شناختی کارڈ",
  gender: "جنس",
  dateOfBirth: "تاریخ پیدائش",
  admissionDate: "تاریخ داخلہ",
  class: "جماعت",
  department: "شعبہ",
  halaqa: "حلقہ",
  status: "حیثیت",
  residentialStatus: "رہائشی حیثیت",
  mustahiq: "مستحق",
  yes: "ہاں",
  no: "نہیں",
  date: "تاریخ",
  amount: "رقم",
  dueDate: "آخری تاریخ",
  paid: "ادا شدہ",
  unpaid: "غیر ادا شدہ",
  exam: "امتحان",
  marks: "نمبر",
  result: "نتیجہ",
  donor: "عطیہ دہندہ",
  fund: "فنڈ",
  startDate: "آغاز",
  endDate: "اختتام",
  sabaq: "سبق",
  sabaqi: "سبقی",
  manzil: "منزل",
  verifier: "تصدیق کنندہ",
  room: "کمرہ",
  bed: "بستر",
  allocatedDate: "الاٹمنٹ تاریخ",
  purpose: "مقصد",
  outDate: "باہر جانے کا وقت",
  inDate: "واپسی کا وقت",
  authorizedBy: "اجازت دینے والا",
  board: "بورڈ",
  rollNumber: "رول نمبر",
  passingYear: "پاسنگ سال",
  noRecords: "کوئی ریکارڈ موجود نہیں",
};

function displayValue(value) {
  return value === null || value === undefined || value === "" ? "—" : value;
}

function RecordTable({ columns, rows }) {
  if (!rows?.length)
    return (
      <p className="p-5 text-sm text-muted-foreground">{text.noRecords}</p>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[40rem] text-right text-sm">
        <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
          <tr>
            {columns.map(({ key, label }) => (
              <th key={key} className="px-5 py-3 font-medium">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, index) => (
            <tr key={row.id ?? index} className="hover:bg-muted/40">
              {columns.map(({ key, render }) => (
                <td key={key} className="px-5 py-3 align-top">
                  {render ? render(row) : displayValue(row[key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecordSection({ title, icon: Icon, columns, rows }) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center gap-3 border-b border-border px-5 py-4">
        <div className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4" aria-hidden="true" />
        </div>
        <h2 className="font-bold">{title}</h2>
        <span className="mr-auto rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
          {rows?.length ?? 0}
        </span>
      </div>
      <RecordTable columns={columns} rows={rows} />
    </section>
  );
}

function getOverallExamRecords(results = []) {
  const exams = new Map();
  for (const result of results) {
    const current = exams.get(result.exam) || {
      id: result.exam,
      exam_name: result.exam_name,
      exam_date: result.exam_date,
      obtained_marks: 0,
      total_marks: 0,
      passing_marks: 0,
      subject_count: 0,
      passed_subjects: 0,
    };
    current.obtained_marks += Number(result.marks || 0);
    current.total_marks += Number(result.total_marks || 0);
    current.passing_marks += Number(result.passing_marks || 0);
    current.subject_count += 1;
    if (result.result === "pass") current.passed_subjects += 1;
    exams.set(result.exam, current);
  }
  return [...exams.values()].map((exam) => ({
    ...exam,
    percentage: exam.total_marks
      ? ((exam.obtained_marks / exam.total_marks) * 100).toFixed(1)
      : "0.0",
    overall_result:
      exam.passed_subjects === exam.subject_count ? "pass" : "fail",
  }));
}

export default function StudentOverviewPage() {
  const [search, setSearch] = useState("");
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());
  const { data: students = [], isLoading: isLoadingStudents } =
    useAllStudents();
  const {
    data: student,
    isLoading,
    isError,
    refetch,
  } = useStudentOverview(selectedStudentId);
  const filteredStudents = students
    .filter((item) =>
      [item.full_name, item.registration_number, item.guardian_name].some(
        (value) => value?.toLowerCase().includes(deferredSearch),
      ),
    )
    .slice(0, 30);
  const overallExamRecords = getOverallExamRecords(
    student?.internal_exam_results,
  );

  function selectStudent(item) {
    setSelectedStudentId(String(item.id));
    setSearch(item.full_name);
    setIsOptionsOpen(false);
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <header>
        <p className="text-sm font-medium text-primary">{text.chooseStudent}</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {text.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{text.description}</p>
      </header>

      <section className="relative rounded-xl border border-border bg-card p-5 sm:p-6">
        <label
          htmlFor="student-search"
          className="mb-2 block text-sm font-semibold"
        >
          {text.chooseStudent}
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id="student-search"
            type="search"
            role="combobox"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setSelectedStudentId("");
              setIsOptionsOpen(true);
            }}
            onFocus={() => setIsOptionsOpen(true)}
            placeholder={isLoadingStudents ? text.loading : text.searchStudent}
            aria-controls="student-options"
            aria-expanded={isOptionsOpen}
            aria-autocomplete="list"
            className="h-11 w-full rounded-lg border border-input bg-background pr-10 pl-20 text-sm outline-none placeholder:text-muted-foreground focus:ring-3 focus:ring-ring/50"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedStudentId("");
                setIsOptionsOpen(false);
              }}
              className="absolute left-10 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="تلاش صاف کریں"
            >
              <XCircle className="size-4" />
            </button>
          )}
          <ChevronDown
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
        </div>
        {isOptionsOpen && (
          <div
            id="student-options"
            role="listbox"
            className="absolute inset-x-5 top-[7.35rem] z-20 max-h-72 overflow-y-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg sm:inset-x-6"
          >
            {filteredStudents.length ? (
              filteredStudents.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={String(item.id) === selectedStudentId}
                  onClick={() => selectStudent(item)}
                  className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-right hover:bg-accent hover:text-accent-foreground"
                >
                  <UsersRound
                    className="size-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">
                      {item.full_name}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {item.registration_number} · {item.class_name || "—"} ·{" "}
                      {item.guardian_name}
                    </span>
                  </span>
                </button>
              ))
            ) : (
              <p className="px-3 py-4 text-sm text-muted-foreground">
                {text.noStudents}
              </p>
            )}
          </div>
        )}
      </section>

      {!selectedStudentId && (
        <div className="grid min-h-48 place-items-center rounded-xl border border-dashed border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
          {text.selectPrompt}
        </div>
      )}
      {selectedStudentId && isLoading && (
        <div className="grid min-h-48 place-items-center rounded-xl border border-border bg-card text-sm text-muted-foreground">
          {text.loading}
        </div>
      )}
      {selectedStudentId && isError && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive bg-destructive/10 p-8 text-center text-sm text-destructive">
          <p>{text.error}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
          >
            {text.retry}
          </Button>
        </div>
      )}
      {student && !isLoading && !isError && (
        <>
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
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">{text.personal}</p>
                <h2 className="mt-1 truncate text-2xl font-bold sm:text-3xl">
                  {student.full_name}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground" dir="ltr">
                  {student.registration_number}
                </p>
              </div>
              <Link
                href={`/dashboard/students/${student.id}`}
                className="sm:mr-auto"
              >
                <Button type="button" variant="outline">
                  مکمل پروفائل
                </Button>
              </Link>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [text.guardian, student.guardian_name, UserRound],
                ["سرپرست سے رشتہ", student.guardian_relation, UserRound],
                [text.phone, student.phone, CreditCard],
                ["سرپرست کا رابطہ", student.guardian_phone, CreditCard],
                [text.class, student.class_name, GraduationCap],
                [text.department, student.department_name, GraduationCap],
                [text.halaqa, student.halaqa_name, UsersRound],
                [text.admissionDate, student.admission_date, CalendarDays],
                [text.status, student.status, CheckCircle2],
                [text.residentialStatus, student.residential_status, Home],
                [text.cnic, student.cnic, CreditCard],
                ["سرپرست کا شناختی کارڈ", student.guardian_cnic, CreditCard],
                [
                  text.gender,
                  student.gender === "male"
                    ? "طالب"
                    : student.gender === "female"
                      ? "طالبہ"
                      : student.gender,
                  UserRound,
                ],
                [text.dateOfBirth, student.date_of_birth, CalendarDays],
                ["قوم", student.caste, UserRound],
                ["مذہب", student.religion, UserRound],
                ["قومیت", student.nationality, UserRound],
                ["ملک", student.country, UserRound],
                ["مطلوبہ درجہ", student.requested_class, GraduationCap],
                [
                  text.mustahiq,
                  student.is_mustahiq ? text.yes : text.no,
                  CheckCircle2,
                ],
              ].map(([label, value, Icon]) => (
                <article
                  key={label}
                  className="flex items-center gap-3 rounded-lg bg-muted p-3"
                >
                  <div className="grid size-9 shrink-0 place-items-center rounded-md bg-background text-primary">
                    <Icon className="size-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p
                      className="mt-1 truncate text-sm font-semibold"
                      dir={
                        label === text.phone || label === text.cnic
                          ? "ltr"
                          : undefined
                      }
                    >
                      {displayValue(value)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
            {student.notes && (
              <p className="mt-5 rounded-lg bg-muted p-4 text-sm">
                {student.notes}
              </p>
            )}
            <section className="mt-6 border-t border-border pt-5">
              <h2 className="font-bold">داخلہ فارم کی اضافی معلومات</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <article className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">موجودہ پتہ</p>
                  <p className="mt-1 text-sm font-semibold">
                    {displayValue(student.current_address)}
                  </p>
                </article>
                <article className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">مستقل پتہ</p>
                  <p className="mt-1 text-sm font-semibold">
                    {displayValue(student.permanent_address)}
                  </p>
                </article>
                <article className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">
                    کوئی بیماری / طبی کیفیت
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {displayValue(student.health_conditions)}
                  </p>
                </article>
                <article className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">عصری تعلیم</p>
                  <p className="mt-1 text-sm font-semibold">
                    {displayValue(student.modern_education)}
                  </p>
                </article>
                <article className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">دیگر اسناد</p>
                  <p className="mt-1 text-sm font-semibold">
                    {displayValue(student.other_certificates)}
                  </p>
                </article>
                <article className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">
                    داخلہ ٹیسٹ کی رپورٹ
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {displayValue(student.admission_test_report)}
                  </p>
                </article>
                <article className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">داخلہ فیصلہ</p>
                  <p className="mt-1 text-sm font-semibold">
                    {displayValue(student.admission_decision)}
                  </p>
                </article>
                <article className="rounded-lg bg-muted p-3">
                  <p className="text-xs text-muted-foreground">دفتری نوٹس</p>
                  <p className="mt-1 text-sm font-semibold">
                    {displayValue(student.office_notes)}
                  </p>
                </article>
              </div>
            </section>
            <section className="mt-6 border-t border-border pt-5">
              <h2 className="font-bold">سابقہ مدارس</h2>
              {student.previous_madrasas?.length ? (
                <div className="mt-3 space-y-2">
                  {student.previous_madrasas.map((item, index) => (
                    <p key={index} className="rounded-lg bg-muted p-3 text-sm">
                      {item.name || "—"} · {item.year || "—"} ·{" "}
                      {item.grade || "—"} · {item.result || "—"}
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
                    <div
                      key={index}
                      className="rounded-lg bg-muted p-3 text-sm"
                    >
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
          </section>

          <div className="grid gap-6 xl:grid-cols-2">
            <RecordSection
              title={text.fees}
              icon={CreditCard}
              rows={student.fee_logs}
              columns={[
                { key: "due_date", label: text.dueDate },
                { key: "amount_due", label: text.amount },
                {
                  key: "is_paid",
                  label: text.paid,
                  render: (row) =>
                    row.is_paid ? (
                      <span className="text-success">{text.paid}</span>
                    ) : (
                      <span className="text-warning">{text.unpaid}</span>
                    ),
                },
              ]}
            />
            <RecordSection
              title={text.results}
              icon={ClipboardList}
              rows={overallExamRecords}
              columns={[
                { key: "exam_name", label: text.exam },
                { key: "exam_date", label: text.date },
                {
                  key: "obtained_marks",
                  label: "حاصل کردہ / کل نمبر",
                  render: (row) => (
                    <span dir="ltr">
                      {row.obtained_marks} / {row.total_marks}
                    </span>
                  ),
                },
                {
                  key: "percentage",
                  label: "فیصد",
                  render: (row) => <span dir="ltr">{row.percentage}%</span>,
                },
                {
                  key: "overall_result",
                  label: text.result,
                  render: (row) =>
                    row.overall_result === "pass" ? (
                      <span className="text-success">پاس</span>
                    ) : (
                      <span className="text-destructive">فیل</span>
                    ),
                },
              ]}
            />
            <RecordSection
              title={text.hifz}
              icon={GraduationCap}
              rows={student.hifz_logs}
              columns={[
                { key: "date", label: text.date },
                { key: "sabaq_portion", label: text.sabaq },
                { key: "sabaqi_portion", label: text.sabaqi },
                { key: "manzil_portion", label: text.manzil },
                { key: "verified_by_name", label: text.verifier },
              ]}
            />
            <RecordSection
              title={text.sponsorships}
              icon={UsersRound}
              rows={student.sponsorships}
              columns={[
                { key: "donor_name", label: text.donor },
                { key: "fund_name", label: text.fund },
                { key: "start_date", label: text.startDate },
                { key: "end_date", label: text.endDate },
              ]}
            />
            <RecordSection
              title={text.wafaq}
              icon={GraduationCap}
              rows={student.wafaq_registrations}
              columns={[
                { key: "wafaq_name", label: text.board },
                { key: "roll_number", label: text.rollNumber },
                { key: "status", label: text.status },
              ]}
            />
            <RecordSection
              title={text.hostel}
              icon={Home}
              rows={student.hostel_allocations}
              columns={[
                { key: "room_number", label: text.room },
                { key: "bed_number", label: text.bed },
                { key: "allocated_date", label: text.allocatedDate },
                {
                  key: "is_active",
                  label: text.status,
                  render: (row) => (row.is_active ? text.yes : text.no),
                },
              ]}
            />
            <RecordSection
              title={text.gatePasses}
              icon={Home}
              rows={student.gate_passes}
              columns={[
                { key: "purpose", label: text.purpose },
                { key: "out_date", label: text.outDate },
                { key: "in_date", label: text.inDate },
                { key: "authorized_by_name", label: text.authorizedBy },
              ]}
            />
            <RecordSection
              title={`${text.wafaq} نتائج`}
              icon={ClipboardList}
              rows={student.wafaq_results}
              columns={[
                { key: "passing_year", label: text.passingYear },
                { key: "result", label: text.result },
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
}
