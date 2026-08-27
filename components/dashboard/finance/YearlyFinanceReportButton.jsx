"use client";

import { useState } from "react";
import { Printer } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useFinanceYearlyReport } from "@/hooks/useFinance";
import { useMadrasaProfile } from "@/hooks/useSettings";
import {
  getMadrasaPrintHeaderHtml,
  madrasaPrintHeaderCss,
} from "@/lib/madrasaPrintHeader";

const monthNames = [
  "جنوری",
  "فروری",
  "مارچ",
  "اپریل",
  "مئی",
  "جون",
  "جولائی",
  "اگست",
  "ستمبر",
  "اکتوبر",
  "نومبر",
  "دسمبر",
];
const money = (value) =>
  Number(value || 0).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function YearlyFinanceReportButton() {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const { data: report, isLoading } = useFinanceYearlyReport(year, open);
  const { data: profile } = useMadrasaProfile();

  function printReport() {
    if (!report) return;
    const rows = report.months
      .map(
        (item) =>
          `<tr><td>${monthNames[item.month - 1]}</td><td dir="ltr">${money(item.income)}</td><td dir="ltr">${money(item.expenses)}</td><td dir="ltr">${money(item.remaining)}</td></tr>`,
      )
      .join("");
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(
      `<!doctype html><html lang="ur" dir="rtl"><head><meta charset="utf-8"><title>سالانہ مالی رپورٹ ${year}</title><style>@page{size:A4;margin:10mm}body{font-family:Arial,"Noto Nastaliq Urdu",serif;color:#111}${madrasaPrintHeaderCss}table{width:100%;border-collapse:collapse;margin-top:20px}th,td{border:1px solid #777;padding:9px;text-align:right}th{background:#eee}.total{font-weight:bold;background:#f2f2f2}</style></head><body>${getMadrasaPrintHeaderHtml(profile, { title: `سالانہ آمدن و اخراجات رپورٹ — ${year}` })}<table><thead><tr><th>مہینہ</th><th>آمدن</th><th>اخراجات</th><th>باقی رقم</th></tr></thead><tbody>${rows}<tr class="total"><td>کل</td><td dir="ltr">${money(report.income)}</td><td dir="ltr">${money(report.expenses)}</td><td dir="ltr">${money(report.remaining)}</td></tr></tbody></table></body></html>`,
    );
    printWindow.document.close();
    printWindow.focus();
    window.setTimeout(() => printWindow.print(), 350);
  }

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Printer />
        سالانہ رپورٹ
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent dir="rtl" className="text-right">
          <DialogHeader>
            <DialogTitle>سالانہ مالی رپورٹ</DialogTitle>
            <DialogDescription>
              سال منتخب کریں، پھر ماہانہ آمدن، اخراجات اور باقی رقم کی رپورٹ
              پرنٹ کریں۔
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 px-5 py-5">
            <label className="grid gap-2 text-right text-sm font-medium">
              سال
              <input
                type="number"
                min="2000"
                max="2100"
                value={year}
                onChange={(event) => setYear(Number(event.target.value))}
                dir="ltr"
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-3 focus:ring-ring/50"
              />
            </label>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">
                رپورٹ لوڈ ہو رہی ہے...
              </p>
            ) : (
              report && (
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-success/10 p-3">
                    <p className="text-xs">آمدن</p>
                    <p dir="ltr">{money(report.income)}</p>
                  </div>
                  <div className="rounded-lg bg-destructive/10 p-3">
                    <p className="text-xs">اخراجات</p>
                    <p dir="ltr">{money(report.expenses)}</p>
                  </div>
                  <div className="rounded-lg bg-primary/10 p-3">
                    <p className="text-xs">باقی</p>
                    <p dir="ltr">{money(report.remaining)}</p>
                  </div>
                </div>
              )
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              منسوخ
            </Button>
            <Button disabled={!report || isLoading} onClick={printReport}>
              <Printer />
              رپورٹ پرنٹ کریں
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
