"use client";

import { useState } from "react";
import {
  BarChart3,
  CalendarDays,
  Download,
  FileSpreadsheet,
  Printer,
  RotateCcw,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAcademicClasses } from "@/hooks/useAcademics";
import { useInternalExams } from "@/hooks/useExams";
import { useGenerateReport, useReportCatalogue } from "@/hooks/useReports";
import { useMadrasaProfile } from "@/hooks/useSettings";
import { downloadReportCsv, printReport } from "@/lib/reportExport";
import { getApiErrorMessage, toast } from "@/lib/toast";

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";
const today = () => new Date().toISOString().slice(0, 10);
const monthStart = () => `${today().slice(0, 7)}-01`;
const icons = {
  "student-directory": UsersRound,
  "attendance-summary": CalendarDays,
  "exam-performance": BarChart3,
  "finance-summary": FileSpreadsheet,
  "library-circulation": FileSpreadsheet,
  "leave-register": CalendarDays,
  "inventory-status": FileSpreadsheet,
};

export default function ReportCentrePage() {
  const catalogue = useReportCatalogue();
  const generate = useGenerateReport();
  const classes = useAcademicClasses();
  const exams = useInternalExams();
  const { data: profile } = useMadrasaProfile();
  const [selected, setSelected] = useState(null);
  const [report, setReport] = useState(null);
  const [filters, setFilters] = useState({
    date_from: monthStart(),
    date_to: today(),
    status: "",
    class_id: "",
    exam_id: "",
  });
  async function preview() {
    if (!selected) return;
    try {
      const data = await generate.mutateAsync({
        key: selected.key,
        params: filters,
      });
      setReport(data);
      toast.success("رپورٹ تیار ہو گئی");
    } catch (error) {
      toast.error("رپورٹ تیار نہیں ہو سکی", getApiErrorMessage(error));
    }
  }
  function choose(item) {
    setSelected(item);
    setReport(null);
    setFilters({
      date_from: monthStart(),
      date_to: today(),
      status: item.key === "student-directory" ? "active" : "",
      class_id: "",
      exam_id: "",
    });
  }
  if (catalogue.isLoading)
    return (
      <div className="space-y-4">
        <Skeleton className="h-32" />
        <div className="grid gap-3 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((x) => (
            <Skeleton key={x} className="h-36" />
          ))}
        </div>
      </div>
    );
  return (
    <main className="space-y-6" dir="rtl">
      <header className="overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground">
        <p className="text-sm opacity-80">رپورٹس</p>
        <h1 className="mt-1 text-3xl font-bold">ون کلک رپورٹ مرکز</h1>
        <p className="mt-2 max-w-2xl text-sm opacity-85">
          تعلیمی، حاضری، مالی، لائبریری اور انتظامی رپورٹس ایک جگہ سے بنائیں،
          پرنٹ کریں یا CSV میں محفوظ کریں۔
        </p>
      </header>
      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {(catalogue.data || []).map((item) => {
          const Icon = icons[item.key] || FileSpreadsheet;
          return (
            <button
              key={item.key}
              onClick={() => choose(item)}
              className={`rounded-xl border bg-card p-4 text-right transition hover:-translate-y-0.5 hover:shadow-md ${selected?.key === item.key ? "border-primary ring-2 ring-primary/20" : "border-border"}`}
            >
              <span className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <h2 className="mt-3 font-bold">{item.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.description}
              </p>
            </button>
          );
        })}
      </section>
      {selected && (
        <section className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold">{selected.title}</h2>
              <p className="text-sm text-muted-foreground">
                ضروری فلٹر منتخب کرکے فوراً رپورٹ بنائیں۔
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => {
                setSelected(null);
                setReport(null);
              }}
            >
              <RotateCcw />
              بند کریں
            </Button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {selected.filters.includes("date_from") && (
              <label className="grid gap-1 text-sm">
                ابتدائی تاریخ
                <input
                  type="date"
                  className={inputClass}
                  value={filters.date_from}
                  onChange={(e) =>
                    setFilters({ ...filters, date_from: e.target.value })
                  }
                />
              </label>
            )}
            {selected.filters.includes("date_to") && (
              <label className="grid gap-1 text-sm">
                آخری تاریخ
                <input
                  type="date"
                  className={inputClass}
                  value={filters.date_to}
                  onChange={(e) =>
                    setFilters({ ...filters, date_to: e.target.value })
                  }
                />
              </label>
            )}
            {selected.filters.includes("class_id") && (
              <label className="grid gap-1 text-sm">
                جماعت
                <select
                  className={inputClass}
                  value={filters.class_id}
                  onChange={(e) =>
                    setFilters({ ...filters, class_id: e.target.value })
                  }
                >
                  <option value="">تمام جماعتیں</option>
                  {(classes.data || []).map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {selected.filters.includes("exam_id") && (
              <label className="grid gap-1 text-sm">
                امتحان
                <select
                  className={inputClass}
                  value={filters.exam_id}
                  onChange={(e) =>
                    setFilters({ ...filters, exam_id: e.target.value })
                  }
                >
                  <option value="">امتحان منتخب کریں</option>
                  {(exams.data || []).map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {selected.filters.includes("status") && (
              <label className="grid gap-1 text-sm">
                حیثیت
                <select
                  className={inputClass}
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <option value="">تمام</option>
                  <option value="active">فعال</option>
                  <option value="approved">منظور</option>
                  <option value="pending_approval">زیر التوا</option>
                  <option value="rejected">نامنظور</option>
                </select>
              </label>
            )}
          </div>
          <Button
            className="mt-4"
            onClick={preview}
            disabled={generate.isPending}
          >
            {generate.isPending ? "تیار ہو رہی ہے..." : "رپورٹ تیار کریں"}
          </Button>
        </section>
      )}
      {generate.isPending && (
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-4">
            {[1, 2, 3, 4].map((x) => (
              <Skeleton key={x} className="h-20" />
            ))}
          </div>
          <Skeleton className="h-72" />
        </div>
      )}
      {report && !generate.isPending && (
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold">{report.report.title}</h2>
              <p className="text-sm text-muted-foreground">
                {report.rows.length} ریکارڈ
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  downloadReportCsv(report);
                  toast.success("CSV محفوظ ہو گئی");
                }}
              >
                <Download />
                CSV
              </Button>
              <Button
                onClick={() => {
                  if (!printReport(report, profile))
                    toast.error(
                      "پرنٹ ونڈو نہیں کھل سکی",
                      "Browser میں popups کی اجازت دیں۔",
                    );
                }}
              >
                <Printer />
                پرنٹ
              </Button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {report.summary.map((item) => (
              <article
                key={item.label}
                className="rounded-xl border border-border bg-card p-4"
              >
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <strong className="mt-1 block text-2xl">{item.value}</strong>
              </article>
            ))}
          </div>
          {report.rows.length ? (
            <div className="overflow-x-auto rounded-xl border border-border bg-card">
              <table className="w-full min-w-180 text-right text-sm">
                <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
                  <tr>
                    {report.columns.map((c) => (
                      <th key={c.key} className="p-3">
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {report.rows.map((row, index) => (
                    <tr key={index}>
                      {report.columns.map((c) => (
                        <td key={c.key} className="p-3">
                          {String(row[c.key] ?? "—")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
              منتخب فلٹرز کے مطابق کوئی ریکارڈ نہیں ملا۔
            </p>
          )}
        </section>
      )}
      {!selected && (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-muted-foreground">
          اوپر سے مطلوبہ رپورٹ منتخب کریں۔
        </p>
      )}
    </main>
  );
}
