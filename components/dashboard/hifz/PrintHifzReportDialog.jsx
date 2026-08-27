"use client";

import { useMemo, useState } from "react";
import { Printer, Search, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getAllHifzLogs } from "@/lib/api/hifz";
import { getMadrasaProfile } from "@/lib/api/settings";
import { getHifzReportHtml } from "@/lib/printStudentAdmissionForm";
import { getApiErrorMessage, toast } from "@/lib/toast";

const text = {
  title: "حفظ رپورٹ پرنٹ کریں",
  description: "طالب علم اور رپورٹ کی مدت منتخب کریں۔",
  student: "طالب علم",
  searchStudent: "طالب علم تلاش کریں",
  noStudents: "کوئی طالب علم نہیں ملا",
  period: "رپورٹ کی مدت",
  week: "ایک ہفتہ",
  twoWeeks: "دو ہفتے",
  month: "ایک ماہ",
  year: "ایک سال",
  cancel: "منسوخ",
  print: "رپورٹ پرنٹ کریں",
  preparing: "رپورٹ تیار ہو رہی ہے...",
  error: "حفظ رپورٹ پرنٹ نہیں ہو سکی۔",
  clearSearch: "تلاش صاف کریں",
};
const periods = {
  week: { label: text.week, days: 7 },
  twoWeeks: { label: text.twoWeeks, days: 14 },
  month: { label: text.month, months: 1 },
  year: { label: text.year, years: 1 },
};

function toDateInput(date) {
  return date.toISOString().slice(0, 10);
}
function getRange(period) {
  const end = new Date();
  const start = new Date(end);
  if (period.days) start.setDate(start.getDate() - (period.days - 1));
  if (period.months) start.setMonth(start.getMonth() - period.months);
  if (period.years) start.setFullYear(start.getFullYear() - period.years);
  return { dateFrom: toDateInput(start), dateTo: toDateInput(end) };
}

export default function PrintHifzReportDialog({
  open,
  onOpenChange,
  students,
}) {
  const [search, setSearch] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [periodKey, setPeriodKey] = useState("week");
  const [isListOpen, setIsListOpen] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return students
      .filter(
        (student) =>
          !query ||
          [
            student.full_name,
            student.registration_number,
            student.guardian_name,
          ].some((value) => value?.toLowerCase().includes(query)),
      )
      .slice(0, 30);
  }, [search, students]);

  function chooseStudent(student) {
    setSelectedStudentId(String(student.id));
    setSearch(student.full_name);
    setIsListOpen(false);
  }

  async function printReport() {
    const student = students.find(
      (item) => String(item.id) === selectedStudentId,
    );
    const period = periods[periodKey];
    if (!student) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error(text.error, "براہ کرم browser میں popups کی اجازت دیں۔");
      return;
    }
    printWindow.document.write(
      `<title>${text.print}</title><p style="font-family: sans-serif; padding: 24px">${text.preparing}</p>`,
    );
    setIsPrinting(true);
    try {
      const { dateFrom, dateTo } = getRange(period);
      const [logs, profile] = await Promise.all([
        getAllHifzLogs({
          student: student.id,
          date_from: dateFrom,
          date_to: dateTo,
        }),
        getMadrasaProfile(),
      ]);
      printWindow.document.open();
      printWindow.document.write(
        getHifzReportHtml(
          student,
          logs,
          period.label,
          dateFrom,
          dateTo,
          profile,
        ),
      );
      printWindow.document.close();
      printWindow.focus();
      window.setTimeout(() => printWindow.print(), 350);
      onOpenChange(false);
    } catch (error) {
      printWindow.close();
      toast.error(text.error, getApiErrorMessage(error, text.error));
    } finally {
      setIsPrinting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="text-right">
        <DialogHeader>
          <DialogTitle>{text.title}</DialogTitle>
          <DialogDescription>{text.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 px-5 py-5">
          <label className="grid gap-2 text-right text-sm font-medium">
            {text.student}
            <div className="relative">
              <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                role="combobox"
                dir="rtl"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setSelectedStudentId("");
                  setIsListOpen(true);
                }}
                onFocus={() => setIsListOpen(true)}
                aria-controls="report-student-options"
                aria-expanded={isListOpen}
                aria-autocomplete="list"
                placeholder={text.searchStudent}
                className="h-10 w-full rounded-lg border border-input bg-background pr-9 pl-9 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50"
              />
              {search && (
                <button
                  type="button"
                  aria-label={text.clearSearch}
                  onClick={() => {
                    setSearch("");
                    setSelectedStudentId("");
                    setIsListOpen(false);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <XCircle className="size-4" />
                </button>
              )}
            </div>
            {isListOpen && (
              <div
                id="report-student-options"
                role="listbox"
                className="max-h-48 overflow-y-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg"
              >
                {filteredStudents.length ? (
                  filteredStudents.map((student) => (
                    <button
                      key={student.id}
                      type="button"
                      role="option"
                      aria-selected={String(student.id) === selectedStudentId}
                      onClick={() => chooseStudent(student)}
                      className="flex w-full flex-col rounded-md px-3 py-2 text-right hover:bg-accent hover:text-accent-foreground"
                    >
                      <span className="font-medium">{student.full_name}</span>
                      <span className="text-xs text-muted-foreground">
                        {student.registration_number} · {student.guardian_name}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-2 text-sm text-muted-foreground">
                    {text.noStudents}
                  </p>
                )}
              </div>
            )}
          </label>
          <label className="grid gap-2 text-right text-sm font-medium">
            {text.period}
            <select
              value={periodKey}
              onChange={(event) => setPeriodKey(event.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50"
            >
              {Object.entries(periods).map(([key, period]) => (
                <option key={key} value={key}>
                  {period.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPrinting}
          >
            {text.cancel}
          </Button>
          <Button
            type="button"
            onClick={printReport}
            disabled={isPrinting || !selectedStudentId}
          >
            <Printer aria-hidden="true" />
            {isPrinting ? text.preparing : text.print}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
