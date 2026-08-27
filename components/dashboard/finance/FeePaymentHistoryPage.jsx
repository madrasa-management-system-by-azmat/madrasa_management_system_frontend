"use client";

import { useDeferredValue, useState } from "react";
import { History, Search } from "lucide-react";

import { useAcademicClasses } from "@/hooks/useAcademics";
import { useFeePaymentHistory } from "@/hooks/useFinance";

const text = {
  title: "فیس وصولی کی تاریخ",
  description:
    "تمام موصول شدہ فیس ادائیگیوں کا ریکارڈ دیکھیں اور طالب علم، جماعت یا مہینے کے مطابق تلاش کریں۔",
  search: "طالب علم، رجسٹریشن نمبر یا رسید تلاش کریں",
  academicClass: "جماعت",
  allClasses: "تمام جماعتیں",
  month: "بلنگ مہینہ",
  student: "طالب علم",
  class: "جماعت",
  billingMonth: "بلنگ مہینہ",
  paymentDate: "ادائیگی کی تاریخ",
  amount: "وصول شدہ رقم",
  receipt: "رسید نمبر",
  notes: "نوٹس",
  loading: "ادائیگیوں کا ریکارڈ لوڈ ہو رہا ہے...",
  empty: "اس فلٹر کے مطابق کوئی ادائیگی موجود نہیں۔",
};
const currentMonth = () => new Date().toISOString().slice(0, 7);
const money = (value) =>
  Number(value || 0).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function FeePaymentHistoryPage() {
  const [search, setSearch] = useState("");
  const [academicClass, setAcademicClass] = useState("");
  const [month, setMonth] = useState(currentMonth());
  const deferredSearch = useDeferredValue(search.trim());
  const { data: academicClasses = [] } = useAcademicClasses();
  const { data: payments = [], isLoading } = useFeePaymentHistory({
    month: month ? `${month}-01` : "",
    academicClass,
    search: deferredSearch,
  });
  return (
    <div className="space-y-6 lg:space-y-8">
      <header>
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <History className="size-4" />
          مالیاتی انتظام
        </div>
        <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{text.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{text.description}</p>
      </header>
      <section className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:flex-wrap sm:items-end">
          <label className="relative min-w-0 sm:w-72">
            <Search className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={text.search}
              className="h-10 w-full rounded-lg border border-input bg-background pr-9 pl-3 text-sm outline-none focus:ring-3 focus:ring-ring/50"
            />
          </label>
          <label className="grid gap-1 text-xs text-muted-foreground">
            {text.academicClass}
            <select
              value={academicClass}
              onChange={(event) => setAcademicClass(event.target.value)}
              className="h-10 min-w-44 rounded-lg border border-input bg-background px-3 text-right text-sm text-foreground outline-none focus:ring-3 focus:ring-ring/50"
            >
              <option value="">{text.allClasses}</option>
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
              value={month}
              onChange={(event) => setMonth(event.target.value)}
              dir="ltr"
              className="h-10 rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-3 focus:ring-ring/50"
            />
          </label>
        </div>
        {isLoading ? (
          <p className="p-8 text-center text-sm text-muted-foreground">
            {text.loading}
          </p>
        ) : !payments.length ? (
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
                    text.class,
                    text.billingMonth,
                    text.paymentDate,
                    text.amount,
                    text.receipt,
                    text.notes,
                  ].map((label) => (
                    <th key={label} className="px-4 py-4 font-medium">
                      {label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-muted/40">
                    <td className="px-4 py-4">
                      <p className="font-semibold">{payment.student_name}</p>
                      <p className="text-xs text-muted-foreground" dir="ltr">
                        {payment.registration_number}
                      </p>
                    </td>
                    <td className="px-4 py-4">{payment.academic_class_name}</td>
                    <td className="px-4 py-4" dir="ltr">
                      {payment.billing_month}
                    </td>
                    <td className="px-4 py-4" dir="ltr">
                      {payment.payment_date}
                    </td>
                    <td
                      className="px-4 py-4 font-semibold text-success"
                      dir="ltr"
                    >
                      {money(payment.amount)}
                    </td>
                    <td className="px-4 py-4" dir="ltr">
                      {payment.receipt_number || "—"}
                    </td>
                    <td className="max-w-64 px-4 py-4">
                      {payment.notes || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
