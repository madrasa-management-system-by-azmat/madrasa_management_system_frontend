"use client";

import { useState } from "react";
import {
  CalendarDays,
  Pencil,
  Plus,
  Printer,
  Search,
  Trash2,
} from "lucide-react";

import HifzLogDialog from "@/components/dashboard/hifz/HifzLogDialog";
import PrintHifzReportDialog from "@/components/dashboard/hifz/PrintHifzReportDialog";
import { Button } from "@/components/ui/button";
import {
  useHifzLogs,
  useHifzStudents,
  useTeachers,
  useCreateHifzLog,
  useUpdateHifzLog,
  useDeleteHifzLog,
} from "@/hooks/useHifz";
import { getApiErrorMessage, toast } from "@/lib/toast";

const text = {
  eyebrow: "حفظ و ناظرہ",
  title: "حفظ ڈائری",
  description: "طلبہ کے روزانہ سبق، سبقی اور منزل کا ریکارڈ منظم کریں۔",
  add: "نیا ڈائری لاگ",
  search: "طالب علم تلاش کریں",
  date: "تاریخ",
  allDates: "تمام تاریخیں",
  student: "طالب علم",
  sabaq: "سبق",
  sabaqi: "سبقی",
  manzil: "منزل",
  verifier: "تصدیق کنندہ",
  actions: "کارروائی",
  edit: "ترمیم کریں",
  delete: "حذف کریں",
  loading: "ریکارڈ لوڈ ہو رہا ہے...",
  error: "حفظ ڈائری لوڈ نہیں ہو سکی۔",
  empty: "اس تلاش کے مطابق کوئی ریکارڈ نہیں ملا۔",
  createSuccess: "ڈائری لاگ محفوظ ہو گیا",
  updateSuccess: "ڈائری لاگ میں ترمیم ہو گئی",
  deleteSuccess: "ڈائری لاگ حذف ہو گیا",
  saveError: "ڈائری لاگ محفوظ نہیں ہو سکا۔",
  deleteError: "ڈائری لاگ حذف نہیں ہو سکا۔",
  deleteConfirm: "کیا آپ یہ ڈائری لاگ حذف کرنا چاہتے ہیں؟",
};

export default function HifzManagement() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const {
    data: logsData,
    isLoading,
    isError,
    refetch,
  } = useHifzLogs({ date: date || undefined, search: search || undefined });
  const { data: students = [] } = useHifzStudents();
  const { data: teachers = [] } = useTeachers();
  const createLog = useCreateHifzLog();
  const updateLog = useUpdateHifzLog();
  const deleteLog = useDeleteHifzLog();
  const logs = logsData?.results ?? [];
  const isPending = createLog.isPending || updateLog.isPending;
  const mutationError = createLog.error || updateLog.error;

  function openCreate() {
    setEditingRecord(null);
    setDialogOpen(true);
  }

  function openEdit(record) {
    setEditingRecord(record);
    setDialogOpen(true);
  }

  async function handleSubmit(data) {
    try {
      if (editingRecord) {
        await updateLog.mutateAsync({ id: editingRecord.id, data });
        toast.success(text.updateSuccess);
      } else {
        await createLog.mutateAsync(data);
        toast.success(text.createSuccess);
      }
    } catch (error) {
      toast.error(text.saveError, getApiErrorMessage(error, text.saveError));
      throw error;
    }
  }

  async function handleDelete(record) {
    if (!window.confirm(text.deleteConfirm)) return;
    try {
      await deleteLog.mutateAsync(record.id);
      toast.success(text.deleteSuccess);
    } catch (error) {
      toast.error(
        text.deleteError,
        getApiErrorMessage(error, text.deleteError),
      );
    }
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">{text.eyebrow}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            {text.title}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {text.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setReportDialogOpen(true)}
          >
            <Printer aria-hidden="true" />
            حفظ رپورٹ
          </Button>
          <Button type="button" onClick={openCreate}>
            <Plus aria-hidden="true" />
            {text.add}
          </Button>
        </div>
      </header>

      <section className="rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="relative min-w-0 sm:w-72">
            <Search
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={text.search}
              aria-label={text.search}
              className="h-10 w-full rounded-lg border border-input bg-background pr-9 pl-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-3 focus:ring-ring/50"
            />
          </div>
          <label className="relative flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="size-4" aria-hidden="true" />
            <span className="sr-only">{text.date}</span>
            <input
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              aria-label={text.date}
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-3 focus:ring-ring/50"
            />
            {date && (
              <button
                type="button"
                className="text-xs text-primary hover:underline"
                onClick={() => setDate("")}
              >
                {text.allDates}
              </button>
            )}
          </label>
        </div>
        {isError ? (
          <div className="flex flex-col items-center gap-3 px-5 py-16 text-center">
            <p className="text-sm text-destructive">{text.error}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => refetch()}
            >
              دوبارہ کوشش کریں
            </Button>
          </div>
        ) : isLoading ? (
          <div className="px-5 py-16 text-center text-sm text-muted-foreground">
            {text.loading}
          </div>
        ) : logs.length === 0 ? (
          <p className="px-5 py-16 text-center text-sm text-muted-foreground">
            {text.empty}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[62rem] text-right text-sm">
              <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  {[
                    text.date,
                    text.student,
                    text.sabaq,
                    text.sabaqi,
                    text.manzil,
                    text.verifier,
                    text.actions,
                  ].map((label) => (
                    <th key={label} className="px-5 py-4 font-medium">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/40">
                    <td className="px-5 py-4" dir="ltr">
                      {log.date}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold">{log.student_name}</p>
                    </td>
                    <td className="max-w-48 px-5 py-4">
                      {log.sabaq_portion || "—"}
                    </td>
                    <td className="max-w-48 px-5 py-4">
                      {log.sabaqi_portion || "—"}
                    </td>
                    <td className="max-w-48 px-5 py-4">
                      {log.manzil_portion || "—"}
                    </td>
                    <td className="px-5 py-4">{log.verified_by_name || "—"}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={text.edit}
                          onClick={() => openEdit(log)}
                        >
                          <Pencil aria-hidden="true" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          aria-label={text.delete}
                          disabled={deleteLog.isPending}
                          onClick={() => handleDelete(log)}
                        >
                          <Trash2 aria-hidden="true" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <HifzLogDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        record={editingRecord}
        students={students}
        teachers={teachers}
        isPending={isPending}
        error={mutationError}
        onSubmit={handleSubmit}
      />
      <PrintHifzReportDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        students={students}
      />
    </div>
  );
}
