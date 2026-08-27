"use client";

import { useMemo, useState } from "react";
import { Save, Search, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const text = {
  cancel: "منسوخ",
  date: "تاریخ",
  log: "حفظ ڈائری",
  manzil: "منزل",
  sabaq: "سبق",
  sabaqi: "سبقی",
  save: "محفوظ کریں",
  student: "طالب علم",
  teacher: "تصدیق کرنے والا استاد",
  optional: "بعد میں نشان زد کریں",
  searchStudent: "طالب علم تلاش کریں",
  noStudents: "کوئی طالب علم نہیں ملا",
  clearSearch: "تلاش صاف کریں",
};

const inputClassName =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";

export default function HifzLogDialog({
  open,
  onOpenChange,
  record,
  students,
  teachers,
  isPending,
  error,
  onSubmit,
}) {
  const initialStudent = students.find(
    (student) => student.id === record?.student,
  );
  const [studentSearch, setStudentSearch] = useState(
    initialStudent?.full_name || "",
  );
  const [selectedStudentId, setSelectedStudentId] = useState(
    record?.student ? String(record.student) : "",
  );
  const [isStudentListOpen, setIsStudentListOpen] = useState(false);
  const filteredStudents = useMemo(() => {
    const query = studentSearch.trim().toLowerCase();
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
  }, [studentSearch, students]);

  function selectStudent(student) {
    setSelectedStudentId(String(student.id));
    setStudentSearch(student.full_name);
    setIsStudentListOpen(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    if (!values.verified_by) delete values.verified_by;

    try {
      await onSubmit({
        ...values,
        student: Number(values.student),
        verified_by: values.verified_by
          ? Number(values.verified_by)
          : undefined,
      });
      onOpenChange(false);
    } catch {
      // The API error remains visible in the dialog.
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="text-right">
        <DialogHeader>
          <DialogTitle>{record ? "حفظ ڈائری میں ترمیم" : text.log}</DialogTitle>
          <DialogDescription>
            طالب علم کا روزانہ سبق، سبقی اور منزل درج کریں۔
          </DialogDescription>
        </DialogHeader>
        <form key={record?.id || "new"} onSubmit={handleSubmit}>
          <div className="grid gap-4 px-5 py-5">
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.student}
              <input type="hidden" name="student" value={selectedStudentId} />
              <div className="relative">
                <Search
                  className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  role="combobox"
                  dir="rtl"
                  value={studentSearch}
                  onChange={(event) => {
                    setStudentSearch(event.target.value);
                    setSelectedStudentId("");
                    setIsStudentListOpen(true);
                  }}
                  onFocus={() => setIsStudentListOpen(true)}
                  aria-controls="hifz-student-options"
                  aria-expanded={isStudentListOpen}
                  aria-autocomplete="list"
                  placeholder={text.searchStudent}
                  className={`${inputClassName} pr-9 pl-9`}
                />
                {studentSearch && (
                  <button
                    type="button"
                    aria-label={text.clearSearch}
                    onClick={() => {
                      setStudentSearch("");
                      setSelectedStudentId("");
                      setIsStudentListOpen(false);
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <XCircle className="size-4" />
                  </button>
                )}
              </div>
              {isStudentListOpen && (
                <div
                  id="hifz-student-options"
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
                        onClick={() => selectStudent(student)}
                        className="flex w-full flex-col rounded-md px-3 py-2 text-right hover:bg-accent hover:text-accent-foreground"
                      >
                        <span className="font-medium">{student.full_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {student.registration_number} ·{" "}
                          {student.guardian_name}
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
              {text.date}
              <input
                className={inputClassName}
                name="date"
                type="date"
                defaultValue={
                  record?.date || new Date().toISOString().slice(0, 10)
                }
                required
                dir="ltr"
              />
            </label>
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.sabaq}
              <input
                className={inputClassName}
                name="sabaq_portion"
                defaultValue={record?.sabaq_portion || ""}
                placeholder="مثلاً سورۃ البقرہ: آیات 1 تا 10"
              />
            </label>
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.sabaqi}
              <input
                className={inputClassName}
                name="sabaqi_portion"
                defaultValue={record?.sabaqi_portion || ""}
              />
            </label>
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.manzil}
              <input
                className={inputClassName}
                name="manzil_portion"
                defaultValue={record?.manzil_portion || ""}
              />
            </label>
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.teacher}
              <select
                className={inputClassName}
                name="verified_by"
                defaultValue={record?.verified_by || ""}
              >
                <option value="">{text.optional}</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.full_name}
                  </option>
                ))}
              </select>
            </label>
            {error && (
              <p className="rounded-lg border border-destructive bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error?.response?.data?.detail || text.log}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              {text.cancel}
            </Button>
            <Button type="submit" disabled={isPending || !selectedStudentId}>
              <Save aria-hidden="true" />
              {isPending ? "..." : text.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
