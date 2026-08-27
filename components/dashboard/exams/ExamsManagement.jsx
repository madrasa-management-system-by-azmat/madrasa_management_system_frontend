"use client";

import { useMemo, useState } from "react";
import { ClipboardList, Pencil, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAcademicClasses, useSubjects } from "@/hooks/useAcademics";
import {
  useCreateInternalExam,
  useDeleteInternalExam,
  useInternalExams,
  useUpdateInternalExam,
} from "@/hooks/useExams";
import { getApiErrorMessage, toast } from "@/lib/toast";

const text = {
  title: "داخلی امتحانات",
  description:
    "امتحان بنائیں اور اس کے لیے ایک یا ایک سے زیادہ جماعتیں اور متعلقہ مضامین منتخب کریں۔",
  add: "نیا امتحان",
  edit: "امتحان میں ترمیم",
  name: "امتحان کا نام",
  classes: "جماعتیں",
  date: "امتحان کی تاریخ",
  startDate: "امتحان کی ابتدائی تاریخ",
  choose: "منتخب کریں",
  chooseClasses: "ایک یا ایک سے زیادہ جماعتیں منتخب کریں",
  save: "محفوظ کریں",
  cancel: "منسوخ",
  editAction: "ترمیم کریں",
  delete: "حذف کریں",
  loading: "امتحانات لوڈ ہو رہے ہیں...",
  empty: "ابھی کوئی امتحان موجود نہیں۔",
  created: "امتحان شامل ہو گیا",
  updated: "امتحان میں ترمیم ہو گئی",
  deleted: "امتحان حذف ہو گیا",
  error: "عمل مکمل نہیں ہو سکا۔",
  confirm: "کیا آپ یہ امتحان حذف کرنا چاہتے ہیں؟",
};
const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";

function ExamDialog({
  record,
  open,
  onOpenChange,
  classes,
  subjects,
  isPending,
  error,
  onSubmit,
}) {
  const [selectedClasses, setSelectedClasses] = useState(
    () =>
      record?.classes ||
      (record?.academic_class ? [record.academic_class] : []),
  );
  const filteredSubjects = useMemo(
    () =>
      subjects.filter((subject) =>
        selectedClasses.includes(subject.academic_class),
      ),
    [subjects, selectedClasses],
  );
  function toggleClass(id) {
    setSelectedClasses((current) => {
      const next = current.includes(id)
        ? current.filter((value) => value !== id)
        : [...current, id];
      return next;
    });
  }
  async function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await onSubmit({
        name: values.name,
        classes: selectedClasses,
        subjects: filteredSubjects.map((subject) => subject.id),
        papers: record?.papers || [],
        exam_date: values.exam_date,
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
              {text.name}
              <input
                name="name"
                defaultValue={record?.name || ""}
                required
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.startDate}
              <input
                name="exam_date"
                type="date"
                defaultValue={record?.exam_date || ""}
                dir="ltr"
                required
                className={inputClass}
              />
            </label>
            <fieldset className="grid gap-2 text-right text-sm font-medium">
              <legend>{text.classes}</legend>
              <p className="text-xs font-normal text-muted-foreground">
                {text.chooseClasses}
              </p>
              <div className="grid max-h-36 gap-2 overflow-y-auto rounded-lg border border-input p-3">
                {classes.map((item) => (
                  <label key={item.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedClasses.includes(item.id)}
                      onChange={() => toggleClass(item.id)}
                    />
                    {item.name} — {item.department_name}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="rounded-lg border border-input bg-muted/30 p-3 text-sm">
              <p className="font-medium">
                {filteredSubjects.length} مضامین شامل ہوں گے
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                منتخب جماعتوں کے تمام مضامین خودکار طور پر شامل ہوں گے۔ ڈیٹ شیٹ
                میں امتحان اور جماعت منتخب کر کے ہر مضمون کی تاریخ اور وقت مقرر
                کریں۔
              </p>
            </div>
            {error && (
              <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {getApiErrorMessage(error, text.error)}
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
            <Button
              type="submit"
              disabled={
                isPending || !selectedClasses.length || !filteredSubjects.length
              }
            >
              {isPending ? "..." : text.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function ExamsManagement() {
  const [dialog, setDialog] = useState({ open: false, record: null });
  const { data: exams = [], isLoading } = useInternalExams();
  const { data: classes = [] } = useAcademicClasses();
  const { data: subjects = [] } = useSubjects();
  const createExam = useCreateInternalExam();
  const updateExam = useUpdateInternalExam();
  const deleteExam = useDeleteInternalExam();
  const mutation = dialog.record ? updateExam : createExam;
  function open(record = null) {
    setDialog({ open: true, record });
  }
  async function save(data) {
    try {
      if (dialog.record)
        await updateExam.mutateAsync({ id: dialog.record.id, data });
      else await createExam.mutateAsync(data);
      toast.success(dialog.record ? text.updated : text.created);
    } catch (error) {
      toast.error(text.error, getApiErrorMessage(error, text.error));
      throw error;
    }
  }
  async function remove(record) {
    if (!window.confirm(text.confirm)) return;
    try {
      await deleteExam.mutateAsync(record.id);
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
            <ClipboardList className="size-4" />
            امتحانات و نتائج
          </p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{text.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {text.description}
          </p>
        </div>
        <Button onClick={() => open()}>
          <Plus />
          {text.add}
        </Button>
      </header>
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        {isLoading ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            {text.loading}
          </p>
        ) : !exams.length ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            {text.empty}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-4xl text-right text-sm">
              <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  <th className="px-5 py-4 font-medium">{text.name}</th>
                  <th className="px-5 py-4 font-medium">{text.classes}</th>
                  <th className="px-5 py-4 font-medium">{text.subjects}</th>
                  <th className="px-5 py-4 font-medium">{text.date}</th>
                  <th className="px-5 py-4 font-medium">کارروائی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {exams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-muted/40">
                    <td className="px-5 py-4 font-semibold">{exam.name}</td>
                    <td className="px-5 py-4">
                      {exam.class_names?.join("، ") || exam.class_name || "—"}
                    </td>
                    <td className="px-5 py-4">
                      {exam.subject_names?.join("، ") ||
                        exam.subject_name ||
                        "—"}
                    </td>
                    <td className="px-5 py-4" dir="ltr">
                      {exam.exam_date}
                    </td>
                    <td className="px-5 py-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={text.editAction}
                        onClick={() => open(exam)}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        aria-label={text.delete}
                        onClick={() => remove(exam)}
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
      <ExamDialog
        record={dialog.record}
        open={dialog.open}
        onOpenChange={(openState) =>
          !openState && setDialog({ open: false, record: null })
        }
        classes={classes}
        subjects={subjects}
        isPending={mutation.isPending}
        error={mutation.error}
        onSubmit={save}
      />
    </div>
  );
}
