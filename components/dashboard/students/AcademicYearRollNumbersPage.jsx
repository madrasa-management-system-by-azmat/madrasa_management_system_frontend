"use client";

import { useState } from "react";
import {
  CalendarDays,
  History,
  Pencil,
  Plus,
  Printer,
  Search,
  Trash2,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAcademicClasses } from "@/hooks/useAcademics";
import {
  useAcademicYears,
  useChangeRollNumber,
  useCreateAcademicYear,
  useDeleteAcademicYear,
  useGenerateRollNumbers,
  useRollNumberHistory,
  useStudentEnrollments,
  useUpdateAcademicYear,
} from "@/hooks/useStudents";
import { useMadrasaProfile } from "@/hooks/useSettings";
import { getApiErrorMessage, toast } from "@/lib/toast";
import { getMediaUrl } from "@/lib/apiClient";

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/50";
const emptyYear = {
  name: "",
  starts_on: "",
  ends_on: "",
  is_current: true,
  status: "open",
};

function Dialog({ title, children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-foreground/30 p-4"
      onMouseDown={onClose}
    >
      <section
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-border bg-card p-5 shadow-xl"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <Button type="button" variant="outline" onClick={onClose}>
            بند کریں
          </Button>
        </div>
        {children}
      </section>
    </div>
  );
}

function escapeHtml(value) {
  return String(value ?? "—")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export default function AcademicYearRollNumbersPage() {
  const [academicYear, setAcademicYear] = useState("");
  const [academicClass, setAcademicClass] = useState("");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [dialog, setDialog] = useState(null);
  const [editingYear, setEditingYear] = useState(null);
  const [yearForm, setYearForm] = useState(emptyYear);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const { data: yearData, isLoading: yearsLoading } = useAcademicYears();
  const { data: classes = [] } = useAcademicClasses();
  const years = yearData?.results || [];
  const effectiveAcademicYear =
    academicYear ||
    String(years.find((item) => item.is_current)?.id || years[0]?.id || "");
  const { data: enrollmentData, isLoading: enrollmentsLoading } =
    useStudentEnrollments({
      academic_year: effectiveAcademicYear || undefined,
      academic_class: academicClass || undefined,
      search: search || undefined,
    });
  const { data: profile } = useMadrasaProfile();
  const createYear = useCreateAcademicYear();
  const updateYear = useUpdateAcademicYear();
  const deleteYear = useDeleteAcademicYear();
  const generate = useGenerateRollNumbers();
  const changeRoll = useChangeRollNumber();
  const { data: history = [], isLoading: historyLoading } =
    useRollNumberHistory(dialog === "history" ? selectedEnrollment?.id : null);
  const enrollments = enrollmentData?.results || [];
  const allSelected =
    enrollments.length > 0 &&
    enrollments.every((item) => selectedIds.includes(item.id));
  const selectedYear = years.find(
    (item) => String(item.id) === String(effectiveAcademicYear),
  );
  const selectedClass = classes.find(
    (item) => String(item.id) === String(academicClass),
  );

  function openYear(year = null) {
    setEditingYear(year);
    setYearForm(
      year
        ? {
            name: year.name,
            starts_on: year.starts_on,
            ends_on: year.ends_on,
            is_current: year.is_current,
            status: year.status,
          }
        : emptyYear,
    );
    setDialog("year");
  }
  async function saveYear(event) {
    event.preventDefault();
    try {
      if (editingYear)
        await updateYear.mutateAsync({ id: editingYear.id, data: yearForm });
      else await createYear.mutateAsync(yearForm);
      setDialog(null);
      toast.success("تعلیمی سال محفوظ ہو گیا");
    } catch (error) {
      toast.error("تعلیمی سال محفوظ نہیں ہو سکا", getApiErrorMessage(error));
    }
  }
  async function removeYear(year) {
    if (!window.confirm(`${year.name} حذف کیا جائے؟`)) return;
    try {
      await deleteYear.mutateAsync(year.id);
      toast.success("تعلیمی سال حذف ہو گیا");
    } catch (error) {
      toast.error("تعلیمی سال حذف نہیں ہو سکا", getApiErrorMessage(error));
    }
  }
  async function generateNumbers(event) {
    event.preventDefault();
    if (!effectiveAcademicYear || !academicClass)
      return toast.error("تعلیمی سال اور جماعت منتخب کریں");
    const data = Object.fromEntries(new FormData(event.currentTarget));
    data.academic_year = Number(effectiveAcademicYear);
    data.academic_class = Number(academicClass);
    data.enrollment_ids = selectedIds;
    data.overwrite = data.overwrite === "on";
    try {
      const result = await generate.mutateAsync(data);
      setDialog(null);
      setSelectedIds([]);
      toast.success(`${result.updated} رول نمبر جاری کیے گئے`);
    } catch (error) {
      toast.error("رول نمبر جاری نہیں ہو سکے", getApiErrorMessage(error));
    }
  }
  async function changeNumber(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await changeRoll.mutateAsync({ id: selectedEnrollment.id, data });
      setDialog(null);
      toast.success("رول نمبر تبدیل ہو گیا");
    } catch (error) {
      toast.error("رول نمبر تبدیل نہیں ہو سکا", getApiErrorMessage(error));
    }
  }

  function printSlips() {
    const rows = enrollments.filter((item) =>
      selectedIds.length ? selectedIds.includes(item.id) : item.roll_number,
    );
    if (!rows.length) return toast.error("رول نمبر سلپ کے لیے طلبہ منتخب کریں");
    const win = window.open("", "_blank");
    if (!win) return toast.error("پرنٹ ونڈو نہیں کھل سکی");
    const logo = profile?.logo
      ? `<img src="${escapeHtml(getMediaUrl(profile.logo))}" alt=""/>`
      : "";
    const cards = rows
      .map(
        (item) =>
          `<article><header>${logo}<div><h1>${escapeHtml(profile?.name || "مدرسہ")}</h1><h2>امتحانی رول نمبر سلپ</h2></div></header><dl><div><dt>طالب علم</dt><dd>${escapeHtml(item.student_name)}</dd></div><div><dt>والد / سرپرست</dt><dd>${escapeHtml(item.guardian_name)}</dd></div><div><dt>Student ID</dt><dd dir="ltr">${escapeHtml(item.registration_number)}</dd></div><div><dt>رول نمبر</dt><dd dir="ltr"><b>${escapeHtml(item.roll_number)}</b></dd></div><div><dt>جماعت</dt><dd>${escapeHtml(item.class_name)}</dd></div><div><dt>تعلیمی سال</dt><dd>${escapeHtml(item.academic_year_name)}</dd></div><div><dt>امتحان</dt><dd>________________</dd></div><div><dt>تاریخ / مرکز</dt><dd>________________</dd></div></dl></article>`,
      )
      .join("");
    win.document.write(
      `<!doctype html><html lang="ur" dir="rtl"><head><meta charset="utf-8"><title>رول نمبر سلپس</title><style>@page{size:A4 portrait;margin:10mm}*{box-sizing:border-box}body{font-family:Arial,sans-serif;margin:0;color:#17233b}.sheet{display:grid;grid-template-columns:1fr 1fr;gap:8mm}article{break-inside:avoid;border:1.5px solid #226ce0;border-radius:3mm;padding:5mm}header{display:flex;align-items:center;gap:4mm;border-bottom:1px solid #ddd;padding-bottom:3mm}header img{width:16mm;height:16mm;object-fit:contain}h1{margin:0;font-size:5mm}h2{margin:1mm 0 0;color:#226ce0;font-size:3mm}dl{display:grid;grid-template-columns:1fr 1fr;margin:4mm 0 0}dl div{border:1px solid #ddd;padding:2mm}dt{font-size:2.3mm;color:#667085}dd{margin:1mm 0 0;font-size:3mm}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body><main class="sheet">${cards}</main></body></html>`,
    );
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  }

  return (
    <div className="space-y-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">تعلیمی نظم</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
            تعلیمی سال اور رول نمبر
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            سالانہ جماعت وار رول نمبر جاری کریں، تبدیل کریں اور مکمل تاریخ محفوظ
            رکھیں۔
          </p>
        </div>
        <Button type="button" onClick={() => openYear()}>
          <Plus /> نیا تعلیمی سال
        </Button>
      </header>
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">تعلیمی سال</h2>
          <CalendarDays className="size-5 text-primary" />
        </div>
        {yearsLoading ? (
          <Skeleton className="mt-4 h-20" />
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {years.map((year) => (
              <article
                key={year.id}
                className={`rounded-xl border p-4 ${year.is_current ? "border-primary bg-primary/5" : "border-border"}`}
              >
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="font-bold">{year.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground" dir="ltr">
                      {year.starts_on} — {year.ends_on}
                    </p>
                  </div>
                  {year.is_current && (
                    <span className="h-fit rounded-full bg-success/10 px-2 py-1 text-xs text-success">
                      موجودہ
                    </span>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openYear(year)}
                  >
                    <Pencil /> ترمیم
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeYear(year)}
                  >
                    <Trash2 /> حذف
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <section className="rounded-2xl border border-border bg-card p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="grid gap-2 text-sm font-medium">
            تعلیمی سال
            <select
              value={effectiveAcademicYear}
              onChange={(e) => {
                setAcademicYear(e.target.value);
                setSelectedIds([]);
              }}
              className={inputClass}
            >
              <option value="">منتخب کریں</option>
              {years.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            جماعت
            <select
              value={academicClass}
              onChange={(e) => {
                setAcademicClass(e.target.value);
                setSelectedIds([]);
              }}
              className={inputClass}
            >
              <option value="">منتخب کریں</option>
              {classes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className="relative grid gap-2 text-sm font-medium lg:col-span-2">
            تلاش
            <span className="relative">
              <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="نام، والد، Student ID، رول نمبر یا جماعت"
                className={`${inputClass} pr-9`}
              />
            </span>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            type="button"
            disabled={!effectiveAcademicYear || !academicClass}
            onClick={() => setDialog("generate")}
          >
            <UsersRound /> خودکار رول نمبر
          </Button>
          <Button type="button" variant="outline" onClick={printSlips}>
            <Printer /> رول نمبر سلپس
          </Button>
        </div>
      </section>
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-212.5 text-right text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="p-4">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked
                          ? enrollments.map((item) => item.id)
                          : [],
                      )
                    }
                  />
                </th>
                <th className="p-4">Student ID</th>
                <th className="p-4">نام</th>
                <th className="p-4">سرپرست</th>
                <th className="p-4">جماعت</th>
                <th className="p-4">تعلیمی سال</th>
                <th className="p-4">رول نمبر</th>
                <th className="p-4">عمل</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {enrollmentsLoading ? (
                <tr>
                  <td colSpan="8" className="p-6">
                    <Skeleton className="h-16" />
                  </td>
                </tr>
              ) : (
                enrollments.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/30">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={(e) =>
                          setSelectedIds((current) =>
                            e.target.checked
                              ? [...current, item.id]
                              : current.filter((id) => id !== item.id),
                          )
                        }
                      />
                    </td>
                    <td className="p-4" dir="ltr">
                      {item.registration_number}
                    </td>
                    <td className="p-4 font-semibold">{item.student_name}</td>
                    <td className="p-4">{item.guardian_name}</td>
                    <td className="p-4">{item.class_name}</td>
                    <td className="p-4">{item.academic_year_name}</td>
                    <td className="p-4 font-bold" dir="ltr">
                      {item.roll_number || "—"}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedEnrollment(item);
                            setDialog("change");
                          }}
                        >
                          <Pencil /> تبدیل
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedEnrollment(item);
                            setDialog("history");
                          }}
                        >
                          <History /> تاریخ
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              {!enrollmentsLoading && !enrollments.length && (
                <tr>
                  <td
                    colSpan="8"
                    className="p-10 text-center text-muted-foreground"
                  >
                    منتخب فلٹر کے لیے کوئی enrollment موجود نہیں۔
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      {dialog === "year" && (
        <Dialog
          title={editingYear ? "تعلیمی سال میں ترمیم" : "نیا تعلیمی سال"}
          onClose={() => setDialog(null)}
        >
          <form onSubmit={saveYear} className="grid gap-4">
            <label className="grid gap-2 text-sm font-medium">
              نام
              <input
                required
                value={yearForm.name}
                onChange={(e) =>
                  setYearForm({ ...yearForm, name: e.target.value })
                }
                placeholder="مثال: 2026–2027"
                className={inputClass}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium">
                آغاز
                <input
                  required
                  type="date"
                  value={yearForm.starts_on}
                  onChange={(e) =>
                    setYearForm({ ...yearForm, starts_on: e.target.value })
                  }
                  className={inputClass}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                اختتام
                <input
                  required
                  type="date"
                  value={yearForm.ends_on}
                  onChange={(e) =>
                    setYearForm({ ...yearForm, ends_on: e.target.value })
                  }
                  className={inputClass}
                />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-medium">
              حیثیت
              <select
                value={yearForm.status}
                onChange={(e) =>
                  setYearForm({ ...yearForm, status: e.target.value })
                }
                className={inputClass}
              >
                <option value="planned">منصوبہ بند</option>
                <option value="open">جاری</option>
                <option value="closed">مکمل</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={yearForm.is_current}
                onChange={(e) =>
                  setYearForm({ ...yearForm, is_current: e.target.checked })
                }
              />{" "}
              موجودہ تعلیمی سال بنائیں
            </label>
            <Button
              type="submit"
              disabled={createYear.isPending || updateYear.isPending}
            >
              محفوظ کریں
            </Button>
          </form>
        </Dialog>
      )}
      {dialog === "generate" && (
        <Dialog
          title="خودکار رول نمبر جاری کریں"
          onClose={() => setDialog(null)}
        >
          <form onSubmit={generateNumbers} className="grid gap-4">
            <p className="rounded-xl bg-primary/10 p-4 text-sm">
              {selectedYear?.name} — {selectedClass?.name}
              <br />
              {selectedIds.length
                ? `${selectedIds.length} منتخب طلبہ`
                : "تمام متعلقہ طلبہ"}
            </p>
            <label className="grid gap-2 text-sm font-medium">
              ابتدائی نمبر
              <input
                name="start_number"
                type="number"
                min="1"
                defaultValue="1"
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              ہندسوں کی تعداد
              <input
                name="padding"
                type="number"
                min="1"
                max="8"
                defaultValue="3"
                className={inputClass}
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input name="overwrite" type="checkbox" /> موجودہ رول نمبر بھی
              دوبارہ جاری کریں
            </label>
            <Button type="submit" disabled={generate.isPending}>
              {generate.isPending ? "جاری ہو رہے ہیں..." : "رول نمبر جاری کریں"}
            </Button>
          </form>
        </Dialog>
      )}
      {dialog === "change" && (
        <Dialog
          title={`${selectedEnrollment?.student_name} — رول نمبر تبدیل کریں`}
          onClose={() => setDialog(null)}
        >
          <form onSubmit={changeNumber} className="grid gap-4">
            <p className="rounded-xl bg-muted p-4 text-sm">
              موجودہ رول نمبر:{" "}
              <b dir="ltr">{selectedEnrollment?.roll_number || "—"}</b>
            </p>
            <label className="grid gap-2 text-sm font-medium">
              نیا رول نمبر
              <input name="roll_number" required className={inputClass} />
            </label>
            <label className="grid gap-2 text-sm font-medium">
              تبدیلی کی وجہ
              <textarea
                name="reason"
                required
                rows="3"
                className={inputClass.replace("h-10", "min-h-20 py-2")}
              />
            </label>
            <Button type="submit" disabled={changeRoll.isPending}>
              رول نمبر تبدیل کریں
            </Button>
          </form>
        </Dialog>
      )}
      {dialog === "history" && (
        <Dialog
          title={`${selectedEnrollment?.student_name} — رول نمبر تاریخ`}
          onClose={() => setDialog(null)}
        >
          {historyLoading ? (
            <Skeleton className="h-40" />
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <article key={item.id} className="rounded-xl border p-4">
                  <div className="flex justify-between">
                    <p dir="ltr">
                      <b>{item.old_roll_number || "—"}</b> →{" "}
                      <b>{item.new_roll_number}</b>
                    </p>
                    <time className="text-xs text-muted-foreground" dir="ltr">
                      {new Date(item.changed_at).toLocaleString("en-PK")}
                    </time>
                  </div>
                  <p className="mt-2 text-sm">{item.reason}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.changed_by_name}
                  </p>
                </article>
              ))}
              {!history.length && (
                <p className="text-sm text-muted-foreground">
                  کوئی تبدیلی موجود نہیں۔
                </p>
              )}
            </div>
          )}
        </Dialog>
      )}
    </div>
  );
}
