"use client";

import { useDeferredValue, useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Plus,
  Printer,
  Save,
  Search,
  X,
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
import {
  useCreateMonthlyFeePayment,
  useGenerateMonthlyFees,
  useMonthlyFees,
} from "@/hooks/useFinance";
import { useAcademicClasses } from "@/hooks/useAcademics";
import { getStudent } from "@/lib/api/students";
import { getMadrasaProfile } from "@/lib/api/settings";
import { getStudentFeeVoucherHtml } from "@/lib/printStudentFeeVoucher";
import { getApiErrorMessage, toast } from "@/lib/toast";

const text = {
  title: "ماہانہ طلبہ فیس",
  description:
    "فیس کا مسودہ بنائیں، ہر طالب علم کی رقم یا ڈسکاؤنٹ تبدیل کریں، پھر تصدیق کے بعد بل محفوظ کریں۔",
  month: "بلنگ مہینہ",
  academicClass: "جماعت",
  selectClass: "جماعت منتخب کریں",
  dueDate: "آخری تاریخ",
  prepare: "فیس مسودہ تیار کریں",
  review: "فیس بل کا جائزہ",
  confirm: "بل محفوظ کریں",
  cancel: "منسوخ",
  student: "طالب علم",
  tuition: "ٹیوشن",
  hostel: "ہاسٹل",
  discount: "ڈسکاؤنٹ",
  arrears: "پچھلا بقایا",
  total: "کل قابلِ ادا",
  paid: "وصول شدہ",
  balance: "بقایا",
  actions: "کارروائی",
  pay: "ادائیگی وصول کریں",
  payment: "ادائیگی",
  amount: "وصول شدہ رقم",
  paymentDate: "ادائیگی کی تاریخ",
  receipt: "رسید نمبر",
  notes: "نوٹس",
  save: "محفوظ کریں",
  loading: "فیس ریکارڈ لوڈ ہو رہا ہے...",
  empty: "اس مہینے کے لیے ابھی کوئی فیس بل نہیں بنا۔",
  prepared: "فیس مسودہ تیار ہے",
  generated: "ماہانہ فیس بل محفوظ ہو گئے",
  paymentSuccess: "ادائیگی محفوظ ہو گئی",
  error: "عمل مکمل نہیں ہو سکا۔",
  print: "واؤچر پرنٹ کریں",
};
const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50";
const today = () => new Date().toISOString().slice(0, 10);
const currentMonth = () => today().slice(0, 7);
const money = (value) =>
  Number(value || 0).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function FeeSetupDialog({
  open,
  onOpenChange,
  academicClasses,
  isLoadingClasses,
  onPrepare,
  isPending,
}) {
  const [academicClass, setAcademicClass] = useState("");
  const [month, setMonth] = useState(currentMonth());
  const [dueDate, setDueDate] = useState(today());

  function submit(event) {
    event.preventDefault();
    onPrepare({ academicClass, month, dueDate });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="text-right">
        <DialogHeader>
          <DialogTitle>{text.prepare}</DialogTitle>
          <DialogDescription>
            جماعت، بلنگ مہینہ اور آخری تاریخ منتخب کریں، پھر فیس کا قابلِ ترمیم
            مسودہ دیکھیں۔
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit}>
          <div className="grid gap-4 px-5 py-5">
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.academicClass}
              <select
                value={academicClass}
                onChange={(event) => setAcademicClass(event.target.value)}
                disabled={isLoadingClasses}
                required
                className={inputClass}
              >
                <option value="">{text.selectClass}</option>
                {academicClasses.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} — {item.department_name}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.month}
              <input
                type="month"
                value={month}
                onChange={(event) => setMonth(event.target.value)}
                dir="ltr"
                required
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.dueDate}
              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                dir="ltr"
                required
                className={inputClass}
              />
            </label>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {text.cancel}
            </Button>
            <Button type="submit" disabled={isPending || !academicClass}>
              <Plus />
              {isPending ? "..." : text.prepare}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PaymentDialog({
  fee,
  open,
  onOpenChange,
  isPending,
  error,
  onSubmit,
}) {
  async function submit(event) {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    try {
      await onSubmit({
        amount: Number(values.amount),
        payment_date: values.payment_date,
        receipt_number: values.receipt_number,
        notes: values.notes,
      });
      onOpenChange(false);
    } catch {}
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="text-right">
        <DialogHeader>
          <DialogTitle>{text.payment}</DialogTitle>
          <DialogDescription>
            {fee?.student_name} — قابلِ وصول بقایا:{" "}
            {money(fee?.outstanding_balance)} روپے
          </DialogDescription>
        </DialogHeader>
        <form key={fee?.id} onSubmit={submit}>
          <div className="grid gap-4 px-5 py-5">
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.amount}
              <input
                name="amount"
                type="number"
                min="0.01"
                max={fee?.outstanding_balance}
                step="0.01"
                dir="ltr"
                required
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.paymentDate}
              <input
                name="payment_date"
                type="date"
                dir="ltr"
                defaultValue={today()}
                required
                className={inputClass}
              />
            </label>
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.receipt}
              <input name="receipt_number" className={inputClass} />
            </label>
            <label className="grid gap-2 text-right text-sm font-medium">
              {text.notes}
              <textarea
                name="notes"
                className="min-h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-right text-sm outline-none focus:ring-3 focus:ring-ring/50"
              />
            </label>
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
            <Button type="submit" disabled={isPending}>
              {isPending ? "..." : text.save}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DraftDialog({
  open,
  onOpenChange,
  invoices,
  onChange,
  isPending,
  onConfirm,
}) {
  function update(index, field, value) {
    onChange(
      invoices.map((invoice, itemIndex) =>
        itemIndex === index
          ? {
              ...invoice,
              [field]: field === "due_date" ? value : Number(value || 0),
            }
          : invoice,
      ),
    );
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-6xl text-right">
        <DialogHeader>
          <DialogTitle>{text.review}</DialogTitle>
          <DialogDescription>
            بل محفوظ ہونے سے پہلے رقم، ڈسکاؤنٹ اور آخری تاریخ تبدیل کریں۔
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-auto px-5 py-5">
          <table className="w-full min-w-[62rem] text-right text-sm">
            <thead className="sticky top-0 bg-muted text-xs text-muted-foreground">
              <tr>
                {[
                  text.student,
                  text.tuition,
                  text.hostel,
                  text.discount,
                  text.arrears,
                  text.total,
                  text.dueDate,
                ].map((label) => (
                  <th key={label} className="px-3 py-3 font-medium">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map((invoice, index) => {
                const total =
                  Math.max(
                    Number(invoice.tuition_fee) +
                      Number(invoice.hostel_fee) -
                      Number(invoice.discount),
                    0,
                  ) + Number(invoice.previous_balance);
                return (
                  <tr key={invoice.student}>
                    <td className="px-3 py-3">
                      <p className="font-semibold">{invoice.student_name}</p>
                      <p className="text-xs text-muted-foreground" dir="ltr">
                        {invoice.registration_number}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={invoice.tuition_fee}
                        onChange={(event) =>
                          update(index, "tuition_fee", event.target.value)
                        }
                        dir="ltr"
                        className="h-9 w-28 rounded-md border border-input bg-background px-2 text-sm"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={invoice.hostel_fee}
                        onChange={(event) =>
                          update(index, "hostel_fee", event.target.value)
                        }
                        dir="ltr"
                        className="h-9 w-28 rounded-md border border-input bg-background px-2 text-sm"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={invoice.discount}
                        onChange={(event) =>
                          update(index, "discount", event.target.value)
                        }
                        dir="ltr"
                        className="h-9 w-28 rounded-md border border-input bg-background px-2 text-sm"
                      />
                    </td>
                    <td className="px-3 py-3 text-warning" dir="ltr">
                      {money(invoice.previous_balance)}
                    </td>
                    <td className="px-3 py-3 font-semibold" dir="ltr">
                      {money(total)}
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="date"
                        value={invoice.due_date}
                        onChange={(event) =>
                          update(index, "due_date", event.target.value)
                        }
                        dir="ltr"
                        className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            <X />
            {text.cancel}
          </Button>
          <Button type="button" onClick={onConfirm} disabled={isPending}>
            <Save />
            {isPending ? "..." : text.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function MonthlyFeeManagement() {
  const [month, setMonth] = useState(currentMonth());
  const [dueDate, setDueDate] = useState(today());
  const [academicClass, setAcademicClass] = useState("");
  const [filterMonth, setFilterMonth] = useState(currentMonth());
  const [filterClass, setFilterClass] = useState("");
  const [studentSearch, setStudentSearch] = useState("");
  const [setupOpen, setSetupOpen] = useState(false);
  const [paymentFee, setPaymentFee] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [draftOpen, setDraftOpen] = useState(false);
  const deferredStudentSearch = useDeferredValue(studentSearch.trim());
  const { data: fees = [], isLoading } = useMonthlyFees({
    month: filterMonth ? `${filterMonth}-01` : "",
    academicClass: filterClass,
    search: deferredStudentSearch,
  });
  const { data: academicClasses = [], isLoading: isLoadingClasses } =
    useAcademicClasses();
  const generate = useGenerateMonthlyFees();
  const createPayment = useCreateMonthlyFeePayment();
  async function prepare({
    academicClass: selectedClass = academicClass,
    month: selectedMonth = month,
    dueDate: selectedDueDate = dueDate,
  } = {}) {
    setAcademicClass(selectedClass);
    setMonth(selectedMonth);
    setDueDate(selectedDueDate);
    try {
      const result = await generate.mutateAsync({
        month: selectedMonth,
        due_date: selectedDueDate,
        academic_class: Number(selectedClass),
      });
      setDrafts(result.invoices);
      setSetupOpen(false);
      setDraftOpen(true);
      toast.success(text.prepared);
    } catch (error) {
      toast.error(text.error, getApiErrorMessage(error, text.error));
    }
  }
  async function confirm() {
    try {
      const result = await generate.mutateAsync({
        month,
        due_date: dueDate,
        academic_class: Number(academicClass),
        invoices: drafts.map(
          ({
            student,
            tuition_fee,
            hostel_fee,
            discount,
            previous_balance,
            due_date,
          }) => ({
            student,
            tuition_fee,
            hostel_fee,
            discount,
            previous_balance,
            due_date,
          }),
        ),
      });
      toast.success(
        text.generated,
        `${result.created} طلبہ کے بل محفوظ کیے گئے۔`,
      );
      setDraftOpen(false);
    } catch (error) {
      toast.error(text.error, getApiErrorMessage(error, text.error));
    }
  }
  async function savePayment(data) {
    try {
      await createPayment.mutateAsync({ id: paymentFee.id, data });
      toast.success(text.paymentSuccess);
    } catch (error) {
      toast.error(text.error, getApiErrorMessage(error, text.error));
      throw error;
    }
  }
  async function printVoucher(fee) {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error(text.error, "براہ کرم browser میں popups کی اجازت دیں۔");
      return;
    }
    printWindow.document.write(
      "<p style='font-family:sans-serif;padding:24px'>واؤچر تیار ہو رہا ہے...</p>",
    );
    try {
      const [student, profile] = await Promise.all([
        getStudent(fee.student),
        getMadrasaProfile(),
      ]);
      printWindow.document.open();
      printWindow.document.write(
        getStudentFeeVoucherHtml(student, fee, profile),
      );
      printWindow.document.close();
      printWindow.focus();
      window.setTimeout(() => printWindow.print(), 350);
    } catch (error) {
      printWindow.close();
      toast.error(text.error, getApiErrorMessage(error, text.error));
    }
  }
  return (
    <div className="space-y-6 lg:space-y-8">
      <header>
        <p className="text-sm font-medium text-primary">مالیاتی انتظام</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{text.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{text.description}</p>
      </header>
      <section className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-5">
        <div>
          <h2 className="font-bold">
            {text.month}: <span dir="ltr">{month}</span>
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {academicClass
              ? academicClasses.find(
                  (item) => String(item.id) === academicClass,
                )?.name
              : "ابھی جماعت منتخب نہیں کی گئی"}
          </p>
        </div>
        <Button onClick={() => setSetupOpen(true)}>
          <Plus />
          {text.prepare}
        </Button>
      </section>
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:flex-wrap sm:items-center">
          <label className="relative min-w-0 sm:w-64">
            <Search
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={studentSearch}
              onChange={(event) => setStudentSearch(event.target.value)}
              placeholder="طالب علم یا رجسٹریشن نمبر تلاش کریں"
              className="h-10 w-full rounded-lg border border-input bg-background pr-9 pl-3 text-sm outline-none focus:ring-3 focus:ring-ring/50"
            />
          </label>
          <label className="grid gap-1 text-xs text-muted-foreground">
            جماعت
            <select
              value={filterClass}
              onChange={(event) => setFilterClass(event.target.value)}
              className="h-10 min-w-44 rounded-lg border border-input bg-background px-3 text-right text-sm text-foreground outline-none focus:ring-3 focus:ring-ring/50"
            >
              <option value="">تمام جماعتیں</option>
              {academicClasses.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} — {item.department_name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-xs text-muted-foreground">
            {text.month}
            <input
              type="month"
              value={filterMonth}
              onChange={(event) => setFilterMonth(event.target.value)}
              dir="ltr"
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-3 focus:ring-ring/50"
            />
          </label>
        </div>
        {isLoading ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            {text.loading}
          </p>
        ) : !fees.length ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            {text.empty}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[62rem] text-right text-sm">
              <thead className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
                <tr>
                  {[
                    text.student,
                    text.tuition,
                    text.hostel,
                    text.discount,
                    text.arrears,
                    text.total,
                    text.paid,
                    text.balance,
                    text.actions,
                  ].map((label) => (
                    <th key={label} className="px-4 py-4 font-medium">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {fees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-muted/40">
                    <td className="px-4 py-4">
                      <p className="font-semibold">{fee.student_name}</p>
                      <p className="text-xs text-muted-foreground" dir="ltr">
                        {fee.registration_number}
                      </p>
                    </td>
                    <td className="px-4 py-4" dir="ltr">
                      {money(fee.tuition_fee)}
                    </td>
                    <td className="px-4 py-4" dir="ltr">
                      {money(fee.hostel_fee)}
                    </td>
                    <td className="px-4 py-4 text-success" dir="ltr">
                      {money(fee.discount)}
                    </td>
                    <td className="px-4 py-4 text-warning" dir="ltr">
                      {money(fee.previous_balance)}
                    </td>
                    <td className="px-4 py-4 font-semibold" dir="ltr">
                      {money(fee.total_due)}
                    </td>
                    <td className="px-4 py-4 text-success" dir="ltr">
                      {money(fee.amount_paid)}
                    </td>
                    <td
                      className="px-4 py-4 font-semibold text-destructive"
                      dir="ltr"
                    >
                      {money(fee.outstanding_balance)}
                    </td>
                    <td className="px-4 py-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label={text.print}
                        onClick={() => printVoucher(fee)}
                      >
                        <Printer />
                      </Button>
                      {Number(fee.outstanding_balance) > 0 ? (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-success hover:text-success"
                          aria-label={text.pay}
                          onClick={() => setPaymentFee(fee)}
                        >
                          <CreditCard />
                        </Button>
                      ) : (
                        <CheckCircle2 className="mr-2 inline size-4 text-success" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <DraftDialog
        open={draftOpen}
        onOpenChange={setDraftOpen}
        invoices={drafts}
        onChange={setDrafts}
        isPending={generate.isPending}
        onConfirm={confirm}
      />
      <FeeSetupDialog
        open={setupOpen}
        onOpenChange={setSetupOpen}
        academicClasses={academicClasses}
        isLoadingClasses={isLoadingClasses}
        onPrepare={prepare}
        isPending={generate.isPending}
      />
      <PaymentDialog
        fee={paymentFee}
        open={Boolean(paymentFee)}
        onOpenChange={(open) => !open && setPaymentFee(null)}
        isPending={createPayment.isPending}
        error={createPayment.error}
        onSubmit={savePayment}
      />
    </div>
  );
}
