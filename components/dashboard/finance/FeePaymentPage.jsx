"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { CheckCircle2, CreditCard, Search, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreateMonthlyFeePayment, useMonthlyFees } from "@/hooks/useFinance";
import { useAllStudents } from "@/hooks/useStudents";
import { getApiErrorMessage, toast } from "@/lib/toast";

const text = {
  title: "فیس وصولی",
  description:
    "طالب علم تلاش کریں، ماہانہ فیس کی تفصیل دیکھیں اور ادائیگی وصول کریں۔",
  student: "طالب علم",
  searchStudent: "طالب علم یا رجسٹریشن نمبر تلاش کریں",
  month: "بلنگ مہینہ",
  chooseStudent: "فیس کی تفصیل کے لیے طالب علم منتخب کریں",
  details: "فیس کی تفصیل",
  tuition: "ٹیوشن",
  hostel: "ہاسٹل",
  discount: "ڈسکاؤنٹ",
  arrears: "پچھلا بقایا",
  total: "کل قابلِ ادا",
  paid: "وصول شدہ",
  balance: "بقایا",
  pay: "ادائیگی وصول کریں",
  payment: "ادائیگی",
  amount: "وصول شدہ رقم",
  paymentDate: "ادائیگی کی تاریخ",
  receipt: "رسید نمبر",
  notes: "نوٹس",
  save: "محفوظ کریں",
  cancel: "منسوخ",
  loading: "فیس ریکارڈ لوڈ ہو رہا ہے...",
  empty: "اس طالب علم کے لیے اس مہینے کا فیس بل موجود نہیں۔",
  success: "ادائیگی محفوظ ہو گئی",
  error: "عمل مکمل نہیں ہو سکا۔",
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

export default function FeePaymentPage() {
  const [search, setSearch] = useState("");
  const [studentId, setStudentId] = useState("");
  const [month, setMonth] = useState(currentMonth());
  const [isListOpen, setIsListOpen] = useState(false);
  const [paymentFee, setPaymentFee] = useState(null);
  const deferredSearch = useDeferredValue(search.trim().toLowerCase());
  const { data: students = [] } = useAllStudents();
  const { data: fees = [], isLoading } = useMonthlyFees({
    month: `${month}-01`,
  });
  const createPayment = useCreateMonthlyFeePayment();
  const matches = useMemo(
    () =>
      students
        .filter(
          (student) =>
            !deferredSearch ||
            [
              student.full_name,
              student.registration_number,
              student.guardian_name,
            ].some((value) => value?.toLowerCase().includes(deferredSearch)),
        )
        .slice(0, 30),
    [students, deferredSearch],
  );
  const fee = fees.find((item) => String(item.student) === studentId);
  async function savePayment(data) {
    try {
      await createPayment.mutateAsync({ id: paymentFee.id, data });
      toast.success(text.success);
    } catch (error) {
      toast.error(text.error, getApiErrorMessage(error, text.error));
      throw error;
    }
  }
  const detailRows = fee
    ? [
        [text.tuition, fee.tuition_fee],
        [text.hostel, fee.hostel_fee],
        [text.discount, `− ${money(fee.discount)}`],
        [text.arrears, fee.previous_balance],
        [text.total, fee.total_due],
        [text.paid, fee.amount_paid],
        [text.balance, fee.outstanding_balance],
      ]
    : [];
  return (
    <div className="space-y-6 lg:space-y-8">
      <header>
        <p className="text-sm font-medium text-primary">مالیاتی انتظام</p>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{text.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{text.description}</p>
      </header>
      <section className="relative rounded-xl border border-border bg-card p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-right text-sm font-medium">
            {text.student}
            <div className="relative">
              <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                role="combobox"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setStudentId("");
                  setIsListOpen(true);
                }}
                onFocus={() => setIsListOpen(true)}
                placeholder={text.searchStudent}
                className={`${inputClass} pr-9 pl-9`}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setStudentId("");
                    setIsListOpen(false);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  <XCircle className="size-4" />
                </button>
              )}
            </div>
            {isListOpen && (
              <div className="max-h-48 overflow-y-auto rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-lg">
                {matches.map((student) => (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => {
                      setStudentId(String(student.id));
                      setSearch(student.full_name);
                      setIsListOpen(false);
                    }}
                    className="flex w-full flex-col rounded-md px-3 py-2 text-right hover:bg-accent"
                  >
                    <span className="font-medium">{student.full_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {student.registration_number} · {student.class_name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </label>
          <label className="grid gap-2 text-right text-sm font-medium">
            {text.month}
            <input
              type="month"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
              dir="ltr"
              className={inputClass}
            />
          </label>
        </div>
      </section>
      {!studentId ? (
        <p className="grid min-h-48 place-items-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
          {text.chooseStudent}
        </p>
      ) : isLoading ? (
        <p className="grid min-h-48 place-items-center rounded-xl border border-border text-sm text-muted-foreground">
          {text.loading}
        </p>
      ) : !fee ? (
        <p className="grid min-h-48 place-items-center rounded-xl border border-border text-sm text-muted-foreground">
          {text.empty}
        </p>
      ) : (
        <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold">{text.details}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {fee.student_name} ·{" "}
                <span dir="ltr">{fee.registration_number}</span>
              </p>
            </div>
            {Number(fee.outstanding_balance) > 0 ? (
              <Button onClick={() => setPaymentFee(fee)}>
                <CreditCard />
                {text.pay}
              </Button>
            ) : (
              <span className="inline-flex items-center gap-2 text-sm font-medium text-success">
                <CheckCircle2 className="size-4" />
                {text.paid}
              </span>
            )}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {detailRows.map(([label, value]) => (
              <article key={label} className="rounded-lg bg-muted p-3">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 text-sm font-semibold" dir="ltr">
                  {typeof value === "string" && value.startsWith("−")
                    ? value
                    : money(value)}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}
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
