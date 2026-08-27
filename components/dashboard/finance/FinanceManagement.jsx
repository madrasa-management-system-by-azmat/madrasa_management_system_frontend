"use client";

import { useMemo, useState } from "react";
import {
  BadgeDollarSign,
  BanknoteArrowDown,
  CheckCircle2,
  Pencil,
  Plus,
  Printer,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useStudentFeeLogs,
  useCreateStudentFeeLog,
  useUpdateStudentFeeLog,
  useDeleteStudentFeeLog,
  useTeacherSalaries,
  useCreateTeacherSalary,
  useUpdateTeacherSalary,
  useDeleteTeacherSalary,
} from "@/hooks/useFinance";
import { useAllStudents } from "@/hooks/useStudents";
import { useTeachers } from "@/hooks/useTeachers";
import { getStudent } from "@/lib/api/students";
import { getMadrasaProfile } from "@/lib/api/settings";
import { getStudentFeeVoucherHtml } from "@/lib/printStudentFeeVoucher";
import { getApiErrorMessage, toast } from "@/lib/toast";

const text = {
  eyebrow: "مالیاتی انتظام",
  title: "فیس اور تنخواہیں",
  description:
    "طلبہ کی فیس اور اساتذہ کی ماہانہ تنخواہوں کا مکمل ریکارڈ رکھیں۔",
  fees: "طلبہ کی فیس",
  salaries: "اساتذہ کی تنخواہیں",
  addFee: "فیس شامل کریں",
  addSalary: "تنخواہ شامل کریں",
  editFee: "فیس میں ترمیم",
  editSalary: "تنخواہ میں ترمیم",
  student: "طالب علم",
  teacher: "استاد",
  amount: "رقم (روپے)",
  dueDate: "آخری تاریخ",
  month: "تنخواہ کا مہینہ",
  paymentDate: "ادائیگی کی تاریخ",
  paid: "ادا شدہ",
  unpaid: "غیر ادا شدہ",
  status: "حیثیت",
  notes: "نوٹس",
  save: "محفوظ کریں",
  cancel: "منسوخ",
  delete: "حذف کریں",
  edit: "ترمیم کریں",
  markPaid: "ادا شدہ نشان زد کریں",
  searchStudent: "طالب علم تلاش کریں",
  searchTeacher: "استاد تلاش کریں",
  noResults: "کوئی ریکارڈ موجود نہیں۔",
  loading: "ریکارڈ لوڈ ہو رہا ہے...",
  created: "ریکارڈ شامل ہو گیا",
  updated: "ریکارڈ میں ترمیم ہو گئی",
  deleted: "ریکارڈ حذف ہو گیا",
  operationError: "عمل مکمل نہیں ہو سکا۔",
  confirm: "کیا آپ یہ ریکارڈ حذف کرنا چاہتے ہیں؟",
};
const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";

function SearchablePerson({ name, label, options, record, placeholder }) {
  const initial = options.find(
    (option) => String(option.id) === String(record?.[name] ?? ""),
  );
  const [query, setQuery] = useState(initial?.label || "");
  const [value, setValue] = useState(
    record?.[name] ? String(record[name]) : "",
  );
  const [isOpen, setIsOpen] = useState(false);
  const matches = useMemo(() => {
    const search = query.toLowerCase().trim();
    return options
      .filter(
        (option) => !search || option.label.toLowerCase().includes(search),
      )
      .slice(0, 30);
  }, [options, query]);
  return (
    <label className="grid gap-2 text-right text-sm font-medium">
      {label}
      <input type="hidden" name={name} value={value} />
      <div className="relative">
        <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          role="combobox"
          dir="rtl"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setValue("");
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          aria-controls={`${name}-options`}
          aria-expanded={isOpen}
          aria-autocomplete="list"
          placeholder={placeholder}
          className={`${inputClass} pr-9 pl-9`}
        />
        {query && (
          <button
            type="button"
            aria-label="تلاش صاف کریں"
            onClick={() => {
              setQuery("");
              setValue("");
              setIsOpen(false);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <XCircle className="size-4" />
          </button>
        )}
      </div>
      {isOpen && (
        <div
          id={`${name}-options`}
          role="listbox"
          className="max-h-48 overflow-y-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg"
        >
          {matches.length ? (
            matches.map((option) => (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={String(option.id) === value}
                onClick={() => {
                  setValue(String(option.id));
                  setQuery(option.label);
                  setIsOpen(false);
                }}
                className="flex w-full rounded-md px-3 py-2 text-right hover:bg-accent hover:text-accent-foreground"
              >
                {option.label}
              </button>
            ))
          ) : (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              کوئی نتیجہ نہیں ملا
            </p>
          )}
        </div>
      )}
    </label>
  );
}

function FinanceDialog({
  open,
  onOpenChange,
  type,
  record,
  students,
  teachers,
  isPending,
  error,
  onSubmit,
}) {
  const isFee = type === "fee";
  async function submit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    data[isFee ? "student" : "teacher"] = Number(
      data[isFee ? "student" : "teacher"],
    );
    if (isFee) {
      data.amount_due = Number(data.amount);
      delete data.amount;
    } else {
      data.amount = Number(data.amount);
      data.month = `${data.month}-01`;
    }
    data.is_paid = data.is_paid === "true";
    if (!data.payment_date) delete data.payment_date;
    try {
      await onSubmit(data);
      onOpenChange(false);
    } catch {}
  }
  const personOptions = isFee
    ? students.map((item) => ({
        id: item.id,
        label: `${item.full_name} — ${item.registration_number}`,
      }))
    : teachers.map((item) => ({ id: item.id, label: item.full_name }));
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="text-right">
        <DialogHeader>
          <DialogTitle>
            {record
              ? isFee
                ? text.editFee
                : text.editSalary
              : isFee
                ? text.addFee
                : text.addSalary}
          </DialogTitle>
          <DialogDescription>{text.description}</DialogDescription>
        </DialogHeader>
        <form key={record?.id || "new"} onSubmit={submit}>
          <div className="grid gap-4 px-5 py-5">
            <SearchablePerson
              name={isFee ? "student" : "teacher"}
              label={isFee ? text.student : text.teacher}
              options={personOptions}
              record={record}
              placeholder={isFee ? text.searchStudent : text.searchTeacher}
            />
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.amount}
              <input
                name="amount"
                type="number"
                min="0"
                step="0.01"
                dir="ltr"
                defaultValue={record?.[isFee ? "amount_due" : "amount"] || ""}
                required
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-right text-sm font-medium">
              {isFee ? text.dueDate : text.month}
              <input
                name={isFee ? "due_date" : "month"}
                type={isFee ? "date" : "month"}
                dir="ltr"
                defaultValue={
                  isFee
                    ? record?.due_date || new Date().toISOString().slice(0, 10)
                    : record?.month?.slice(0, 7) ||
                      new Date().toISOString().slice(0, 7)
                }
                required
                className={inputClass}
              />
            </label>
            {!isFee && (
              <>
                <label className="grid gap-2 text-right text-sm font-medium">
                  {text.paymentDate}
                  <input
                    name="payment_date"
                    type="date"
                    dir="ltr"
                    defaultValue={record?.payment_date || ""}
                    className={inputClass}
                  />
                </label>
                <label className="grid gap-2 text-right text-sm font-medium">
                  {text.notes}
                  <textarea
                    name="notes"
                    defaultValue={record?.notes || ""}
                    className="min-h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50"
                  />
                </label>
              </>
            )}
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.status}
              <select
                name="is_paid"
                defaultValue={String(record?.is_paid ?? false)}
                className={inputClass}
              >
                <option value="false">{text.unpaid}</option>
                <option value="true">{text.paid}</option>
              </select>
            </label>
            {error && (
              <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {getApiErrorMessage(error, text.operationError)}
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

function FinanceTable({
  columns,
  items,
  isLoading,
  onEdit,
  onDelete,
  onMarkPaid,
  onPrintVoucher,
}) {
  if (isLoading)
    return (
      <p className="p-8 text-center text-sm text-muted-foreground">
        {text.loading}
      </p>
    );
  if (!items.length)
    return (
      <p className="p-8 text-center text-sm text-muted-foreground">
        {text.noResults}
      </p>
    );
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[48rem] text-right text-sm">
        <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className="px-5 py-4 font-medium">
                {column.label}
              </th>
            ))}
            <th className="px-5 py-4 font-medium">کارروائی</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-muted/40">
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="px-5 py-4"
                  dir={column.ltr ? "ltr" : undefined}
                >
                  {column.render
                    ? column.render(item)
                    : item[column.key] || "—"}
                </td>
              ))}
              <td className="px-5 py-4">
                {onPrintVoucher && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="فیس واؤچر پرنٹ کریں"
                    onClick={() => onPrintVoucher(item)}
                  >
                    <Printer />
                  </Button>
                )}
                {!item.is_paid && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-success hover:text-success"
                    aria-label={text.markPaid}
                    onClick={() => onMarkPaid(item)}
                  >
                    <CheckCircle2 />
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={text.edit}
                  onClick={() => onEdit(item)}
                >
                  <Pencil />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  aria-label={text.delete}
                  onClick={() => onDelete(item)}
                >
                  <Trash2 />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function FinanceManagement({
  defaultTab = "fees",
  showFees = true,
}) {
  const [dialog, setDialog] = useState({ type: null, record: null });
  const { data: feeLogs = [], isLoading: feesLoading } = useStudentFeeLogs();
  const { data: salaries = [], isLoading: salariesLoading } =
    useTeacherSalaries();
  const { data: students = [] } = useAllStudents();
  const { data: teachers = [] } = useTeachers();
  const createFee = useCreateStudentFeeLog();
  const updateFee = useUpdateStudentFeeLog();
  const deleteFee = useDeleteStudentFeeLog();
  const createSalary = useCreateTeacherSalary();
  const updateSalary = useUpdateTeacherSalary();
  const deleteSalary = useDeleteTeacherSalary();
  const resource =
    dialog.type === "fee"
      ? { create: createFee, update: updateFee, remove: deleteFee }
      : { create: createSalary, update: updateSalary, remove: deleteSalary };
  function open(type, record = null) {
    setDialog({ type, record });
  }
  async function save(data) {
    try {
      if (dialog.record)
        await resource.update.mutateAsync({ id: dialog.record.id, data });
      else await resource.create.mutateAsync(data);
      toast.success(dialog.record ? text.updated : text.created);
    } catch (error) {
      toast.error(
        text.operationError,
        getApiErrorMessage(error, text.operationError),
      );
      throw error;
    }
  }
  async function remove(type, item) {
    if (!window.confirm(text.confirm)) return;
    const target = type === "fee" ? deleteFee : deleteSalary;
    try {
      await target.mutateAsync(item.id);
      toast.success(text.deleted);
    } catch (error) {
      toast.error(
        text.operationError,
        getApiErrorMessage(error, text.operationError),
      );
    }
  }
  async function markPaid(type, item) {
    const updateMutation = type === "fee" ? updateFee : updateSalary;
    const data = { ...item, is_paid: true };
    if (type === "fee") {
      data.amount_due = Number(item.amount_due);
    } else {
      data.amount = Number(item.amount);
      data.teacher = Number(item.teacher);
      data.payment_date = new Date().toISOString().slice(0, 10);
    }
    try {
      await updateMutation.mutateAsync({ id: item.id, data });
      toast.success(text.updated);
    } catch (error) {
      toast.error(
        text.operationError,
        getApiErrorMessage(error, text.operationError),
      );
    }
  }
  async function printVoucher(feeLog) {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error(
        text.operationError,
        "براہ کرم browser میں popups کی اجازت دیں۔",
      );
      return;
    }
    printWindow.document.write(
      "<p style='font-family:sans-serif;padding:24px'>واؤچر تیار ہو رہا ہے...</p>",
    );
    try {
      const [student, profile] = await Promise.all([
        getStudent(feeLog.student),
        getMadrasaProfile(),
      ]);
      printWindow.document.open();
      printWindow.document.write(
        getStudentFeeVoucherHtml(student, feeLog, profile),
      );
      printWindow.document.close();
      printWindow.focus();
      window.setTimeout(() => printWindow.print(), 350);
    } catch (error) {
      printWindow.close();
      toast.error(
        text.operationError,
        getApiErrorMessage(error, text.operationError),
      );
    }
  }
  const status = (item) =>
    item.is_paid ? (
      <span className="text-success">{text.paid}</span>
    ) : (
      <span className="text-warning">{text.unpaid}</span>
    );
  return (
    <div className="space-y-6 lg:space-y-8">
      <header>
        <p className="text-sm font-medium text-primary">{text.eyebrow}</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{text.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{text.description}</p>
      </header>
      <Tabs defaultValue={defaultTab}>
        <TabsList>
          {showFees && (
            <TabsTrigger value="fees">
              <BadgeDollarSign className="size-4" />
              {text.fees}
            </TabsTrigger>
          )}
          <TabsTrigger value="salaries">
            <BanknoteArrowDown className="size-4" />
            {text.salaries}
          </TabsTrigger>
        </TabsList>
        {showFees && (
          <TabsContent value="fees">
            <section className="rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border p-5">
                <h2 className="font-bold">{text.fees}</h2>
                <Button
                  size="sm"
                  disabled={!students.length}
                  onClick={() => open("fee")}
                >
                  <Plus />
                  {text.addFee}
                </Button>
              </div>
              <FinanceTable
                items={feeLogs}
                isLoading={feesLoading}
                columns={[
                  { key: "student_name", label: text.student },
                  { key: "amount_due", label: text.amount, ltr: true },
                  { key: "due_date", label: text.dueDate, ltr: true },
                  { key: "is_paid", label: text.status, render: status },
                ]}
                onEdit={(item) => open("fee", item)}
                onDelete={(item) => remove("fee", item)}
                onMarkPaid={(item) => markPaid("fee", item)}
                onPrintVoucher={printVoucher}
              />
            </section>
          </TabsContent>
        )}
        <TabsContent value="salaries">
          <section className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border p-5">
              <h2 className="font-bold">{text.salaries}</h2>
              <Button
                size="sm"
                disabled={!teachers.length}
                onClick={() => open("salary")}
              >
                <Plus />
                {text.addSalary}
              </Button>
            </div>
            <FinanceTable
              items={salaries}
              isLoading={salariesLoading}
              columns={[
                { key: "teacher_name", label: text.teacher },
                { key: "amount", label: text.amount, ltr: true },
                { key: "month", label: text.month, ltr: true },
                { key: "payment_date", label: text.paymentDate, ltr: true },
                { key: "is_paid", label: text.status, render: status },
              ]}
              onEdit={(item) => open("salary", item)}
              onDelete={(item) => remove("salary", item)}
              onMarkPaid={(item) => markPaid("salary", item)}
            />
          </section>
        </TabsContent>
      </Tabs>
      <FinanceDialog
        open={Boolean(dialog.type)}
        onOpenChange={(isOpen) =>
          !isOpen && setDialog({ type: null, record: null })
        }
        type={dialog.type}
        record={dialog.record}
        students={students}
        teachers={teachers}
        isPending={resource.create.isPending || resource.update.isPending}
        error={resource.create.error || resource.update.error}
        onSubmit={save}
      />
    </div>
  );
}
