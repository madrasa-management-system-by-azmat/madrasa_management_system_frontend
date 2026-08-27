"use client";

import { useState } from "react";
import { BookOpenText, Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  useAcademicClasses,
  useCreateSubject,
  useDeleteSubject,
  useSubjects,
  useUpdateSubject,
} from "@/hooks/useAcademics";
import { getApiErrorMessage, toast } from "@/lib/toast";

const text = {
  title: "مضامین کا انتظام",
  description: "ہر جماعت کے مضامین اور ان کے امتحانی نمبر مقرر کریں۔",
  add: "نیا مضمون",
  edit: "مضمون میں ترمیم",
  delete: "حذف کریں",
  save: "محفوظ کریں",
  cancel: "منسوخ",
  subject: "مضمون",
  class: "جماعت",
  totalMarks: "کل نمبر",
  passingMarks: "پاسنگ نمبر",
  choose: "منتخب کریں",
  loading: "مضامین لوڈ ہو رہے ہیں...",
  empty: "ابھی کوئی مضمون موجود نہیں۔",
  created: "مضمون شامل ہو گیا",
  updated: "مضمون میں ترمیم ہو گئی",
  deleted: "مضمون حذف ہو گیا",
  error: "عمل مکمل نہیں ہو سکا۔",
  confirm: "کیا آپ یہ مضمون حذف کرنا چاہتے ہیں؟",
  invalidMarks: "پاسنگ نمبر کل نمبروں سے زیادہ نہیں ہو سکتے۔",
};
const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";

function SubjectDialog({
  record,
  open,
  onOpenChange,
  classes,
  isPending,
  error,
  onSubmit,
}) {
  const [validationError, setValidationError] = useState("");
  async function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const totalMarks = Number(values.total_marks);
    const passingMarks = Number(values.passing_marks);
    if (passingMarks > totalMarks) {
      setValidationError(text.invalidMarks);
      return;
    }
    setValidationError("");
    try {
      await onSubmit({
        name: values.name,
        academic_class: Number(values.academic_class),
        total_marks: totalMarks,
        passing_marks: passingMarks,
      });
      onOpenChange(false);
    } catch {}
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="text-right">
        <DialogHeader>
          <DialogTitle>{record ? text.edit : text.add}</DialogTitle>
          <DialogDescription>{text.description}</DialogDescription>
        </DialogHeader>
        <form key={record?.id || "new"} onSubmit={submit}>
          <div className="grid gap-4 px-5 py-5">
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.subject}
              <input
                name="name"
                defaultValue={record?.name || ""}
                required
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.class}
              <select
                name="academic_class"
                defaultValue={record?.academic_class || ""}
                required
                className={inputClass}
              >
                <option value="">{text.choose}</option>
                {classes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} — {item.department_name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.totalMarks}
              <input
                name="total_marks"
                type="number"
                min="1"
                defaultValue={record?.total_marks || 100}
                required
                dir="ltr"
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.passingMarks}
              <input
                name="passing_marks"
                type="number"
                min="0"
                defaultValue={record?.passing_marks || 40}
                required
                dir="ltr"
                className={inputClass}
              />
            </label>
            {(validationError || error) && (
              <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {validationError || getApiErrorMessage(error, text.error)}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {text.cancel}
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "..." : text.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function SubjectsManagement() {
  const [record, setRecord] = useState(null);
  const [open, setOpen] = useState(false);
  const { data: subjects = [], isLoading } = useSubjects();
  const { data: classes = [] } = useAcademicClasses();
  const createSubject = useCreateSubject();
  const updateSubject = useUpdateSubject();
  const deleteSubject = useDeleteSubject();
  const pending = createSubject.isPending || updateSubject.isPending;
  const error = createSubject.error || updateSubject.error;
  function add() {
    setRecord(null);
    setOpen(true);
  }
  async function save(data) {
    try {
      if (record) await updateSubject.mutateAsync({ id: record.id, data });
      else await createSubject.mutateAsync(data);
      toast.success(record ? text.updated : text.created);
    } catch (error) {
      toast.error(text.error, getApiErrorMessage(error, text.error));
      throw error;
    }
  }
  async function remove(item) {
    if (!window.confirm(text.confirm)) return;
    try {
      await deleteSubject.mutateAsync(item.id);
      toast.success(text.deleted);
    } catch (error) {
      toast.error(text.error, getApiErrorMessage(error, text.error));
    }
  }
  return (
    <div className="space-y-6 lg:space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium text-primary">
            <BookOpenText className="size-4" />
            تعلیمی انتظام
          </p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{text.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {text.description}
          </p>
        </div>
        <Button onClick={add} disabled={!classes.length}>
          <Plus />
          {text.add}
        </Button>
      </header>
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        {isLoading ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            {text.loading}
          </p>
        ) : !subjects.length ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            {text.empty}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[52rem] text-right text-sm">
              <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th className="px-5 py-4 font-medium">{text.subject}</th>
                  <th className="px-5 py-4 font-medium">{text.class}</th>
                  <th className="px-5 py-4 font-medium">{text.totalMarks}</th>
                  <th className="px-5 py-4 font-medium">{text.passingMarks}</th>
                  <th className="px-5 py-4 font-medium">کارروائی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {subjects.map((subject) => (
                  <tr key={subject.id} className="hover:bg-muted/40">
                    <td className="px-5 py-4 font-semibold">{subject.name}</td>
                    <td className="px-5 py-4">{subject.class_name}</td>
                    <td className="px-5 py-4" dir="ltr">
                      {subject.total_marks}
                    </td>
                    <td className="px-5 py-4" dir="ltr">
                      {subject.passing_marks}
                    </td>
                    <td className="px-5 py-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={text.edit}
                        onClick={() => {
                          setRecord(subject);
                          setOpen(true);
                        }}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        aria-label={text.delete}
                        onClick={() => remove(subject)}
                      >
                        <Trash2 />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <SubjectDialog
        record={record}
        open={open}
        onOpenChange={setOpen}
        classes={classes}
        isPending={pending}
        error={error}
        onSubmit={save}
      />
    </div>
  );
}
